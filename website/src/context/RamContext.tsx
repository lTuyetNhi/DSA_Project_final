'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface RamContextType {
  ramBookCount: number;
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  injectRam: (amount: number) => void;
  resetRam: () => void;
}

const RamContext = createContext<RamContextType | undefined>(undefined);

export function RamProvider({ children }: { children: React.ReactNode }) {
  const [ramBookCount, setRamBookCount] = useState<number>(500000);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Read initial from localStorage if present
  useEffect(() => {
    const saved = localStorage.getItem('dsa_ram_book_count');
    if (saved) {
      const num = parseInt(saved, 10);
      if (!isNaN(num) && num > 0) setRamBookCount(num);
    }
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const injectRam = (amount: number) => {
    setRamBookCount((prev) => {
      const next = prev + amount;
      localStorage.setItem('dsa_ram_book_count', next.toString());
      return next;
    });
  };

  const resetRam = () => {
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
