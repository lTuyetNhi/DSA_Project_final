'use client';

import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLayerGroup, faArrowRight } from '@fortawesome/free-solid-svg-icons';

interface BucketVisualizerProps {
  bucketIndex: number;
  matchedId: string;
  found: boolean;
}

export default function BucketVisualizer({
  bucketIndex,
  matchedId,
  found,
}: BucketVisualizerProps) {
  // Generate visual neighbor buckets around the target bucket
  const prevBucket = bucketIndex > 0 ? bucketIndex - 1 : 0;
  const nextBucket = bucketIndex + 1;

  return (
    <div className="p-5 rounded-xl bg-white border border-gray-200 space-y-3">
      <div className="flex items-center justify-between pb-2 border-b border-gray-100">
        <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider flex items-center gap-1.5">
          <FontAwesomeIcon icon={faLayerGroup} className="text-blue-600 text-xs" />
          Mô Hình Hóa Bảng Băm Xích Rời (Separate Chaining Visualizer)
        </h4>
        <span className="text-[11px] font-mono text-gray-500">Linked List Collision Chain</span>
      </div>

      <div className="space-y-2 text-xs">
        {/* Previous Bucket */}
        <div className="flex items-center gap-3 p-2 rounded bg-gray-50 border border-gray-100 font-mono">
          <div className="w-28 text-gray-500 font-semibold">Bucket #{prevBucket.toLocaleString()}</div>
          <div className="text-gray-400 italic">[ empty slot ] &rarr; NULL</div>
        </div>

        {/* Target Bucket with Linked List Chain */}
        <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-50/70 border border-blue-200 font-mono">
          <div className="w-28 text-blue-900 font-bold">Bucket #{bucketIndex.toLocaleString()}</div>
          {found ? (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-1 rounded bg-blue-600 text-white font-bold border border-blue-700 shadow-sm flex items-center gap-1">
                <span>[ {matchedId} ]</span>
                <span className="text-[10px] bg-blue-500 px-1 rounded">MATCH</span>
              </span>
              <FontAwesomeIcon icon={faArrowRight} className="text-blue-400 text-[10px]" />
              <span className="px-2 py-0.5 rounded bg-white text-gray-700 border border-gray-200 text-xs">
                [ NextNode ]
              </span>
              <FontAwesomeIcon icon={faArrowRight} className="text-gray-400 text-[10px]" />
              <span className="text-gray-500 font-bold">NULL</span>
            </div>
          ) : (
            <div className="text-rose-600 italic font-medium">[ empty slot ] &rarr; NULL (Không tìm thấy)</div>
          )}
        </div>

        {/* Next Bucket */}
        <div className="flex items-center gap-3 p-2 rounded bg-gray-50 border border-gray-100 font-mono">
          <div className="w-28 text-gray-500 font-semibold">Bucket #{nextBucket.toLocaleString()}</div>
          <div className="text-gray-400 italic">[ empty slot ] &rarr; NULL</div>
        </div>
      </div>
    </div>
  );
}
