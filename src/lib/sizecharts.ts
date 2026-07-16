import raw from "@/data/size-charts.json";

export type DimKey = "chest" | "shoulder" | "length" | "sleeve";

export type SizeRow = {
  label: string;
  length: number | null;
  shoulder: number | null;
  chest: number | null;
  sleeve: number | null;
};

export type Brand = {
  id: string;
  name: string;
  product: string;
  url: string;
  sizes: SizeRow[];
  notes?: string;
  logo?: string;
};

export type SizeChartData = {
  category: string;
  unit: string;
  chestBasis: string;
  collectedAt: string;
  source: string;
  brands: Brand[];
};

export const sizeCharts = raw as SizeChartData;

export const brands: Brand[] = sizeCharts.brands;

export function getBrand(id: string): Brand | undefined {
  return brands.find((b) => b.id === id);
}

export const DIM_LABELS: Record<DimKey, string> = {
  chest: "가슴단면",
  shoulder: "어깨너비",
  length: "총장",
  sleeve: "소매길이",
};
