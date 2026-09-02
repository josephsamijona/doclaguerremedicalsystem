export interface MonthlyRevenue {
  month: string;
  revenueHTG: number;
  revenueUSD: number;
  consultationsCount: number;
}

export interface PractitionerStats {
  name: string;
  consultationsCount: number;
  opticalConversionRate: number;
  revenueHTG: number;
}

export interface TopSellingItem {
  sku: string;
  name: string;
  category: string;
  unitsSold: number;
  revenueHTG: number;
}

export const mockMonthlyRevenue: MonthlyRevenue[] = [
  { month: "Jan 2026", revenueHTG: 3850000, revenueUSD: 29056, consultationsCount: 210 },
  { month: "Feb 2026", revenueHTG: 4120000, revenueUSD: 31094, consultationsCount: 228 },
  { month: "Mar 2026", revenueHTG: 4680000, revenueUSD: 35320, consultationsCount: 254 },
  { month: "Apr 2026", revenueHTG: 4410000, revenueUSD: 33283, consultationsCount: 240 },
  { month: "May 2026", revenueHTG: 4950000, revenueUSD: 37358, consultationsCount: 270 },
  { month: "Jun 2026", revenueHTG: 5240000, revenueUSD: 39547, consultationsCount: 285 },
  { month: "Jul 2026", revenueHTG: 4980000, revenueUSD: 37584, consultationsCount: 260 },
  { month: "Aug 2026", revenueHTG: 5560000, revenueUSD: 41962, consultationsCount: 305 },
];

export const mockPractitionerStats: PractitionerStats[] = [
  {
    name: "Dr. Jean-Claude Pierre-Louis (Optometrist)",
    consultationsCount: 142,
    opticalConversionRate: 84.5,
    revenueHTG: 2840000,
  },
  {
    name: "Dr. Mireille Augustin (Ophthalmologist)",
    consultationsCount: 118,
    opticalConversionRate: 78.0,
    revenueHTG: 2360000,
  },
  {
    name: "Opt. Fabienne Desir (Optician)",
    consultationsCount: 95,
    opticalConversionRate: 91.2,
    revenueHTG: 1980000,
  },
];

export const mockTopSellingItems: TopSellingItem[] = [
  {
    sku: "FRM-RB-5154-01",
    name: "Ray-Ban Clubmaster RX5154",
    category: "Frame",
    unitsSold: 48,
    revenueHTG: 888000,
  },
  {
    sku: "LNS-VAR-167-CRZ",
    name: "Varilux Comfort Max 1.67 Crizal",
    category: "Lenses",
    unitsSold: 36,
    revenueHTG: 666000,
  },
  {
    sku: "FRM-TF-5405-02",
    name: "Tom Ford FT5405 Classic Havana",
    category: "Frame",
    unitsSold: 24,
    revenueHTG: 684000,
  },
  {
    sku: "CL-ACU-OAS-1D",
    name: "Acuvue Oasys 1-Day with HydraLuxe",
    category: "Contact Lenses",
    unitsSold: 62,
    revenueHTG: 341000,
  },
  {
    sku: "ACC-CLN-SPY-100",
    name: "Anti-Fog Lens Cleaning Solution Kit",
    category: "Accessories",
    unitsSold: 120,
    revenueHTG: 102000,
  },
];
