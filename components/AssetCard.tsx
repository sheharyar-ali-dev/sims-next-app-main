import { Card } from 'primereact/card';
import { Tag } from 'primereact/tag';
import { RoboticAsset } from '@/lib/api';
import Link from 'next/link';

interface AssetCardProps {
  asset: RoboticAsset;
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

export default function AssetCard({ asset }: AssetCardProps) {
  const header = (
    <div className="bg-gray-100 p-4 rounded-t-xl">
      <h3 className="text-2xl font-bold mb-2">{asset.name}</h3>
      <p className="text-gray-600">{asset.model}</p>
    </div>
  );

  const footer = (
    <div className="flex justify-between items-center">
      <Tag
        value={asset.category}
        severity="info"
        className="capitalize"
      />
      <Tag
        value={asset.status}
        severity={getStatusSeverity(asset.status)}
        className="capitalize"
      />
    </div>
  );

  return (
    <Link href={`/asset/${asset.id}`} className="block">
      <Card
        header={header}
        footer={footer}
        className="h-full border-round-xl shadow-2 hover:shadow-8 transition-all duration-200 cursor-pointer"
      >
        <div className="space-y-3 p-3">
          <p className="text-lg text-primary">{asset.manufacturer}</p>
          <p className="text-gray-700 line-clamp-2">{asset.description}</p>
        </div>
      </Card>
    </Link>
  );
}