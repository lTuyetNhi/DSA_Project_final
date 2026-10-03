'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

export type RamSyncState = 'hydrating' | 'loading' | 'ready' | 'error';

interface RamStats {
  totalBooks: number;
  totalRecords: number;
  maxBorrow: number;
}

interface RamContextType {
  ramBookCount: number;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  injectRam: (amount: number) => void;
  resetRam: () => void;
  ramSyncState: RamSyncState;
  ramStats: RamStats;
}

const RamContext = createContext<RamContextType | undefined>(undefined);

export function RamProvider({ children }: { children: React.ReactNode }) {
  const [ramBookCount, setRamBookCount] = useState<number>(500000);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [storageHydrated, setStorageHydrated] = useState(false);
  const [ramSyncState, setRamSyncState] = useState<RamSyncState>('hydrating');
  const [ramStats, setRamStats] = useState<RamStats>({
    totalBooks: 0,
    totalRecords: 0,
    maxBorrow: 70,
  });
  const syncRevision = useRef(0);

  // Read initial from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem('dsa_ram_book_count');
    if (saved) {
      const num = parseInt(saved, 10);
      if (!isNaN(num) && num > 0) setRamBookCount(num);
    }
    setStorageHydrated(true);
  }, []);

  // Warm the persistent C++ engine only after localStorage hydration. This
  // prevents the old default 500k request racing against a saved 1.5m request
  // and repeatedly rebuilding every in-memory index.
  useEffect(() => {
    if (!storageHydrated) return;

    const revision = ++syncRevision.current;
    const controller = new AbortController();
    setRamSyncState('loading');

    // A short debounce coalesces quick consecutive RAM additions.
    const timer = window.setTimeout(() => {
      fetch(`/api/bridge?mode=data&size=${ramBookCount}`, { signal: controller.signal })
        .then(async (res) => {
          const payload = await res.json();
          if (!res.ok || payload.status !== 'success') {
            throw new Error(payload.message || `RAM warm-up failed (${res.status})`);
          }
          return payload;
        })
        .then((payload) => {
          if (syncRevision.current !== revision) return;
          const totalBooks = Number(payload.total_books) || 0;
          if (totalBooks !== ramBookCount) {
            throw new Error(`C++ RAM size mismatch: expected ${ramBookCount}, received ${totalBooks}`);
          }
          setRamStats({
            totalBooks,
            totalRecords: Number(payload.total_records) || 0,
            maxBorrow: Number(payload.max_borrow) || 0,
          });
          setRamSyncState('ready');
        })
        .catch((error) => {
          if (controller.signal.aborted || syncRevision.current !== revision) return;
          console.error(error);
          setRamSyncState('error');
        });
    }, 120);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [storageHydrated, ramBookCount]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const injectRam = (amount: number) => {
    setRamSyncState('loading');
    setRamBookCount((prev) => {
      const next = prev + amount;
      localStorage.setItem('dsa_ram_book_count', next.toString());
      return next;
    });
  };

  const resetRam = () => {
    if (ramBookCount === 500000) {
      localStorage.setItem('dsa_ram_book_count', '500000');
      setRamSyncState('ready');
      return;
    }
    setRamSyncState('loading');
    setRamBookCount(500000);
    localStorage.setItem('dsa_ram_book_count', '500000');
  };

  return (
    <RamContext.Provider
      value={{
        ramBookCount,
        isModalOpen,
        openModal,
        closeModal,
        injectRam,
        resetRam,
        ramSyncState,
        ramStats,
      }}
    >
      {children}
    </RamContext.Provider>
  );
}

export function useRam() {
  const context = useContext(RamContext);
  if (!context) {
    throw new Error('useRam must be used within a RamProvider');
  }
  return context;
}
