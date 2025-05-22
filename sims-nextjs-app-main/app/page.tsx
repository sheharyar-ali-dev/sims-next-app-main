'use client';

import { useEffect, useState } from 'react';
import { DataView } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { Paginator } from 'primereact/paginator';
import { getAllRoboticAssets } from '@/lib/api';
import type { RoboticAsset } from '@/lib/api';
import AssetCard from '@/components/AssetCard';

export default function Home() {
  const [assets, setAssets] = useState<RoboticAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [first, setFirst] = useState(0);
  const [rows] = useState(5);

  useEffect(() => {
    const fetchAssets = async () => {
      setLoading(true);
      try {
        const data = await getAllRoboticAssets(searchQuery);
        setAssets(data);
        setFirst(0); // Reset to first page when search results change
      } catch (error) {
        console.error('Error fetching assets:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchAssets, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const itemTemplate = (asset: RoboticAsset) => {
    return (
      <div className="p-2">
        <AssetCard asset={asset} />
      </div>
    );
  };

  const onPageChange = (event: { first: number; rows: number }) => {
    setFirst(event.first);
  };

  const paginatedAssets = assets.slice(first, first + rows);
  const totalRecords = assets.length;

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">Robotic Assets</h1>
        
        <div className="p-input-icon-left w-full md:w-96">
          <InputText
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search assets..."
            className="w-full"
          />
        </div>

        <DataView
          value={paginatedAssets}
          itemTemplate={itemTemplate}
          layout="grid"
          loading={loading}
          className="mb-4"
        />

        {totalRecords > 0 && (
          <Paginator
            first={first}
            rows={rows}
            totalRecords={totalRecords}
            onPageChange={onPageChange}
            className="border rounded-lg bg-white"
          />
        )}
      </div>
    </main>
  );
}
