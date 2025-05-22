'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { DataView } from 'primereact/dataview';
import { Tag } from 'primereact/tag';
import { getCadModels } from '@/lib/api';
import Image from 'next/image';

interface CadViewerProps {
  assetId: string;
}

interface CadModel {
  id: string;
  assetId: string;
  name: string;
  fileUrl: string;
  fileFormat: string;
  thumbnailUrl: string;
}

export default function CadViewer({ assetId }: CadViewerProps) {
  const [models, setModels] = useState<CadModel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCadModels() {
      try {
        const data = await getCadModels(assetId);
        setModels(data);
      } catch (err) {
        setError('Failed to load CAD models');
      } finally {
        setLoading(false);
      }
    }

    fetchCadModels();
  }, [assetId]);

  const itemTemplate = (model: CadModel) => {
    return (
      <div className="col-12 sm:col-1 p-2">
        <Card className="shadow-1 h-full sm:w-96">
          <div className="flex flex-col h-full">
            <div className="relative pb-[75%] mb-4 bg-gray-100 rounded-lg overflow-hidden">
              <Image
                width={200}
                height={200}
                src={model.thumbnailUrl}
                alt={model.name}
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
            <div className="flex-grow">
              <h3 className="text-xl font-semibold mb-2">{model.name}</h3>
              <div className="flex justify-between items-center mb-4">
                <Tag value={model.fileFormat.toUpperCase()} severity="info" />
              </div>
            </div>
            <div className="mt-auto">
              <a
                href={model.fileUrl}
                className="block w-full p-2 text-center bg-primary text-white rounded-lg hover:bg-primary-600 transition-colors"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Model
              </a>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <ProgressSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-500">
        <div className="text-red-700">{error}</div>
      </Card>
    );
  }

  if (models.length === 0) {
    return (
      <Card className="bg-gray-50">
        <div className="text-gray-700">No CAD models available</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="shadow-1 flex justify-start">
        <h2 className="text-2xl font-bold mb-4">CAD Models</h2>
        <DataView
          value={models}
          itemTemplate={itemTemplate}
          layout="grid"
          className="border-none"
        />
      </Card>
    </div>
  );
}