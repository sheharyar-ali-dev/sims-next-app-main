'use client';

import { useEffect, useState } from 'react';
import { TabView, TabPanel } from 'primereact/tabview';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { RoboticAsset, getRoboticAsset } from '@/lib/api';
import ProductInfo from '@/components/ProductInfo';
import PartsHierarchy from '@/components/PartsHierarchy';
import RepairInstructions from '@/components/RepairInstructions';
import CadViewer from '@/components/CadViewer';

interface PageProps {
  params: {
    id: string;
  };
}

const getStatusSeverity = (status: string) => {
  switch (status) {
    case 'operational':
      return 'success';
    case 'maintenance':
      return 'warning';
    case 'decommissioned':
      return 'danger';
    default:
      return 'info';
  }
};

export default function AssetDetailPage({ params }: PageProps) {
  const [asset, setAsset] = useState<RoboticAsset | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    async function fetchAssetData() {
      try {
        const assetData = await getRoboticAsset(params.id);
        setAsset(assetData);
      } catch (err) {
        setError('Failed to load asset details');
      } finally {
        setLoading(false);
      }
    }

    fetchAssetData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ProgressSpinner />
      </div>
    );
  }

  if (error || !asset) {
    return (
      <div className="p-4">
        <Card className="bg-red-50 border-red-500">
          <div className="text-red-700">{error || 'Asset not found'}</div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-7xl mx-auto">
      {/* Asset Header */}
      <div className="mb-6">
        <Card>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{asset.name}</h1>
              <p className="text-xl text-gray-600 mb-2">{asset.model}</p>
              <p className="text-lg text-primary">{asset.manufacturer}</p>
            </div>
            <div className="flex gap-2">
              <Tag
                value={asset.category}
                severity="info"
                className="capitalize text-lg"
              />
              <Tag
                value={asset.status}
                severity={getStatusSeverity(asset.status)}
                className="capitalize text-lg"
              />
            </div>
          </div>
          <p className="mt-4 text-gray-700">{asset.description}</p>
        </Card>
      </div>

      {/* Tabs */}
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
        className="shadow-2"
      >
        <TabPanel header="Product Info">
          <ProductInfo assetId={asset.id} />
        </TabPanel>
        <TabPanel header="Parts">
          <PartsHierarchy assetId={asset.id} />
        </TabPanel>
        <TabPanel header="Repair Instructions">
          <RepairInstructions assetId={asset.id} />
        </TabPanel>
        <TabPanel header="CAD Models">
          <CadViewer assetId={asset.id} />
        </TabPanel>
      </TabView>
    </div>
  );
}