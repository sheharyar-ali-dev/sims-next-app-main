// API client functions for interacting with JSON Server endpoints

// Types
export interface RoboticAsset {
  id: string;
  name: string;
  model: string;
  manufacturer: string;
  status: 'operational' | 'maintenance' | 'decommissioned';
  category: string;
  description: string;
}

interface ProductInfo {
  id: string;
  assetId: string;
  specs: {
    dimensions: string;
    weight: string;
    power: string;
  };
  features: string[];
  manualUrl: string;
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

interface CadModel {
  id: string;
  assetId: string;
  name: string;
  fileUrl: string;
  fileFormat: string;
  thumbnailUrl: string;
}

const API_BASE_URL = 'http://localhost:3001';

// Helper function for API calls
async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API call failed: ${response.statusText}`);
  }
  return response.json();
}

// API Functions
export async function getAllRoboticAssets(search?: string): Promise<RoboticAsset[]> {
  const trimmedSearch = search?.trim();
  const searchQuery = trimmedSearch && trimmedSearch.length >= 2 ? `?q=${encodeURIComponent(trimmedSearch)}` : '';
  return fetchApi<RoboticAsset[]>(`/roboticAssets${searchQuery}`);
}

export async function getRoboticAsset(id: string): Promise<RoboticAsset> {
  return fetchApi<RoboticAsset>(`/roboticAssets/${id}`);
}

export async function getProductInfo(assetId: string): Promise<ProductInfo> {
  const results = await fetchApi<ProductInfo[]>(`/productInfo?assetId=${assetId}`);
  return results[0];
}

export async function getParts(assetId: string, parentId?: string | null): Promise<Part[]> {
  const parentQuery = parentId !== undefined ? `&parentId=${parentId}` : '';
  return fetchApi<Part[]>(`/parts?assetId=${assetId}${parentQuery}`);
}

export async function getRepairInstructions(assetId: string): Promise<RepairInstruction[]> {
  return fetchApi<RepairInstruction[]>(`/repairs?assetId=${assetId}`);
}

export async function getCadModels(assetId: string): Promise<CadModel[]> {
  return fetchApi<CadModel[]>(`/cadModels?assetId=${assetId}`);
}