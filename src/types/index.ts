export interface Locations {
  city: string;
  districts: { district: string }[];
};

export type CargoType = "yurtici" | "mng"