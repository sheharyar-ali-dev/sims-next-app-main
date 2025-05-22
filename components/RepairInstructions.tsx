'use client';

import { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Tag } from 'primereact/tag';
import { Timeline } from 'primereact/timeline';
import { getRepairInstructions } from '@/lib/api';

interface RepairInstructionsProps {
  assetId: string;
}

interface RepairInstruction {
  id: string;
  assetId: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: string;
  partsNeeded: string[];
  steps: {
    step: number;
    title: string;
    description: string;
  }[];
}

const getDifficultySeverity = (difficulty: string) => {
  switch (difficulty) {
    case 'easy':
      return 'success';
    case 'medium':
      return 'warning';
    case 'hard':
      return 'danger';
    default:
      return 'info';
  }
};

export default function RepairInstructions({ assetId }: RepairInstructionsProps) {
  const [instructions, setInstructions] = useState<RepairInstruction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchInstructions() {
      try {
        const data = await getRepairInstructions(assetId);
        setInstructions(data);
      } catch (err) {
        setError('Failed to load repair instructions');
      } finally {
        setLoading(false);
      }
    }

    fetchInstructions();
  }, [assetId]);

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

  if (instructions.length === 0) {
    return (
      <Card className="bg-gray-50">
        <div className="text-gray-700">No repair instructions available</div>
      </Card>
    );
  }

  return (
    <div className="space-y-8">
      {instructions.map((instruction) => (
        <Card key={instruction.id} className="shadow-1">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">{instruction.title}</h2>
              <div className="flex gap-2 items-center">
                <Tag
                  value={instruction.difficulty}
                  severity={getDifficultySeverity(instruction.difficulty)}
                  className="capitalize"
                />
                <span className="text-gray-600">
                  Estimated time: {instruction.estimatedTime}
                </span>
              </div>
            </div>
          </div>

          {/* Parts Needed */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Parts Needed</h3>
            <ul className="list-disc list-inside space-y-1">
              {instruction.partsNeeded.map((part, index) => (
                <li key={index} className="text-gray-700">{part}</li>
              ))}
            </ul>
          </div>

          {/* Repair Steps */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Steps</h3>
              <Timeline className='mr-[100%] mt-5'
                value={instruction.steps}
                content={(item) => (
                  <div className="space-y-2">
                    <h4 className="text-lg font-bold sm:w-max">{item.title}</h4>
                    <p className="text-gray-700">{item.description}</p>
                  </div>
                )}
              />
          </div>
        </Card>
      ))}
    </div>
  );
}