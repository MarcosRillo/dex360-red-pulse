export interface PeriodStats {
  leads: number;
  firstResponseMinutes: number;
  testDrives: number;
  sales: number;
}

export interface DealerRecord {
  id: string;
  name: string;
  city: string;
  region: string;
  current: PeriodStats;
  previous: PeriodStats;
}

export interface DealerRepository {
  list(): Promise<DealerRecord[]>;
}

// Sample data for the fictional Austral Motors network: last 30 days vs the 30 days before.
const SEED_DEALERS: DealerRecord[] = [
  { id: "d-01", name: "Austral Palermo", city: "CABA", region: "AMBA", current: { leads: 412, firstResponseMinutes: 34, testDrives: 128, sales: 52 }, previous: { leads: 380, firstResponseMinutes: 41, testDrives: 117, sales: 46 } },
  { id: "d-02", name: "Austral Belgrano", city: "CABA", region: "AMBA", current: { leads: 356, firstResponseMinutes: 58, testDrives: 101, sales: 38 }, previous: { leads: 362, firstResponseMinutes: 52, testDrives: 109, sales: 40 } },
  { id: "d-03", name: "Austral Quilmes", city: "Quilmes", region: "AMBA", current: { leads: 298, firstResponseMinutes: 212, testDrives: 61, sales: 17 }, previous: { leads: 310, firstResponseMinutes: 150, testDrives: 74, sales: 24 } },
  { id: "d-04", name: "Del Plata Motors", city: "Mar del Plata", region: "Buenos Aires", current: { leads: 184, firstResponseMinutes: 47, testDrives: 58, sales: 21 }, previous: { leads: 166, firstResponseMinutes: 55, testDrives: 49, sales: 18 } },
  { id: "d-05", name: "Mediterránea Autos", city: "Córdoba", region: "Centro", current: { leads: 327, firstResponseMinutes: 72, testDrives: 96, sales: 35 }, previous: { leads: 301, firstResponseMinutes: 80, testDrives: 88, sales: 31 } },
  { id: "d-06", name: "Litoral Motors", city: "Rosario", region: "Centro", current: { leads: 276, firstResponseMinutes: 39, testDrives: 88, sales: 33 }, previous: { leads: 259, firstResponseMinutes: 44, testDrives: 80, sales: 29 } },
  { id: "d-07", name: "Cuyo Automotores", city: "Mendoza", region: "Cuyo", current: { leads: 203, firstResponseMinutes: 126, testDrives: 49, sales: 15 }, previous: { leads: 214, firstResponseMinutes: 118, testDrives: 55, sales: 18 } },
  { id: "d-08", name: "Norte Grande Autos", city: "Salta", region: "NOA", current: { leads: 142, firstResponseMinutes: 64, testDrives: 41, sales: 13 }, previous: { leads: 128, firstResponseMinutes: 70, testDrives: 37, sales: 11 } },
  { id: "d-09", name: "Tucumán Motors", city: "San Miguel de Tucumán", region: "NOA", current: { leads: 158, firstResponseMinutes: 251, testDrives: 29, sales: 7 }, previous: { leads: 171, firstResponseMinutes: 196, testDrives: 38, sales: 11 } },
  { id: "d-10", name: "Mesopotamia Motors", city: "Paraná", region: "NEA", current: { leads: 117, firstResponseMinutes: 29, testDrives: 39, sales: 14 }, previous: { leads: 104, firstResponseMinutes: 33, testDrives: 34, sales: 12 } },
  { id: "d-11", name: "Patagonia Austral", city: "Neuquén", region: "Patagonia", current: { leads: 168, firstResponseMinutes: 88, testDrives: 47, sales: 16 }, previous: { leads: 172, firstResponseMinutes: 76, testDrives: 51, sales: 17 } },
  { id: "d-12", name: "Fin del Mundo Autos", city: "Ushuaia", region: "Patagonia", current: { leads: 64, firstResponseMinutes: 45, testDrives: 22, sales: 9 }, previous: { leads: 58, firstResponseMinutes: 51, testDrives: 19, sales: 7 } },
];

export class InMemoryDealerRepository implements DealerRepository {
  constructor(private readonly dealers: DealerRecord[] = SEED_DEALERS) {}

  async list() {
    return this.dealers;
  }
}
