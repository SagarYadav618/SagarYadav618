export interface District {
  district_id: number;
  district_name: string;
}

export interface RootObjectDistrict {
  districts: District[];
  ttl: number;
}
