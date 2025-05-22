'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getProductInfo } from '@/lib/api';

interface ProductInfoProps {
  assetId: string;
}

export default function ProductInfo({ assetId }: ProductInfoProps) {
  const [productInfo, setProductInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProductInfo() {
      try {
        const info = await getProductInfo(assetId);
        setProductInfo(info);
      } catch (err) {
        setError('Failed to load product information');
      } finally {
        setLoading(false);
      }
    }

    fetchProductInfo();
  }, [assetId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-4">
        <ProgressSpinner />
      </div>
    );
  }

  if (error || !productInfo) {
    return (
      <Card className="bg-red-50 border-red-500">
        <div className="text-red-700">{error || 'Product information not found'}</div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Specifications */}
      <Card className="shadow-1">
        <h2 className="text-2xl font-bold mb-4">Specifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="font-semibold">Dimensions</p>
            <p className="text-gray-700">{productInfo.specs.dimensions}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Weight</p>
            <p className="text-gray-700">{productInfo.specs.weight}</p>
          </div>
          <div className="space-y-2">
            <p className="font-semibold">Power</p>
            <p className="text-gray-700">{productInfo.specs.power}</p>
          </div>
        </div>
      </Card>

      {/* Features */}
      <Card className="shadow-1">
        <h2 className="text-2xl font-bold mb-4">Features</h2>
        <ul className="list-disc list-inside space-y-2">
          {productInfo.features.map((feature: string, index: number) => (
            <li key={index} className="text-gray-700">{feature}</li>
          ))}
        </ul>
      </Card>

      {/* Manual Link */}
      <Card className="shadow-1">
        <h2 className="text-2xl font-bold mb-4">Documentation</h2>
        <a
          href={productInfo.manualUrl}
          className="text-primary hover:text-primary-600 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          View Product Manual
        </a>
      </Card>
    </div>
  );
}