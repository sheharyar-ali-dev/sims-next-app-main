'use client';

import { useEffect, useState } from 'react';
import { Tree } from 'primereact/tree';
import { TreeNode } from 'primereact/treenode';
import { Card } from 'primereact/card';
import { ProgressSpinner } from 'primereact/progressspinner';
import { getParts } from '@/lib/api';

interface PartsHierarchyProps {
  assetId: string;
}

interface Part {
  id: string;
  assetId: string;
  parentId: string | null;
  name: string;
  partNumber: string;
  category: string;
  description: string;
  cadModelId: string;
}

export default function PartsHierarchy({ assetId }: PartsHierarchyProps) {
  const [parts, setParts] = useState<TreeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchParts() {
      try {
        const allParts = await getParts(assetId);
        const treeNodes = buildPartsTree(allParts);
        setParts(treeNodes);
      } catch (err) {
        setError('Failed to load parts information');
      } finally {
        setLoading(false);
      }
    }

    fetchParts();
  }, [assetId]);

  const buildPartsTree = (parts: Part[]): TreeNode[] => {
    const partMap = new Map<string, TreeNode>();
    const rootNodes: TreeNode[] = [];

    // First pass: Create all nodes
    parts.forEach(part => {
      partMap.set(part.id, {
        key: part.id,
        label: part.name,
        data: part,
        children: [],
        className: `part-category-${part.category.toLowerCase()}`
      });
    });

    // Second pass: Build the tree structure
    parts.forEach(part => {
      const node = partMap.get(part.id);
      if (node) {
        if (part.parentId === null) {
          rootNodes.push(node);
        } else {
          const parentNode = partMap.get(part.parentId);
          if (parentNode && parentNode.children) {
            parentNode.children.push(node);
          }
        }
      }
    });

    return rootNodes;
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

  return (
    <div className="space-y-6">
      <Card className="shadow-1">
        <h2 className="text-2xl font-bold mb-4">Parts Hierarchy</h2>
        <div className="p-4 border rounded-lg bg-gray-50">
          <Tree
            value={parts}
            className="border-none bg-transparent"
            expandedKeys={{ }}
            nodeTemplate={(node) => (
              <div className="flex flex-col">
                <span className="font-medium">{node.label}</span>
                <span className="text-sm text-gray-600">
                  Part Number: {node.data.partNumber}
                </span>
                <span className="text-sm text-gray-500">
                  {node.data.description}
                </span>
              </div>
            )}
          />
        </div>
      </Card>
    </div>
  );
}