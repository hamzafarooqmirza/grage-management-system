import type {
  Booking,
  Customer,
  Invoice,
  JobCard,
  Part,
  Vehicle,
} from "./types";

export const customers: Customer[] = [
  {
    id: "cus_1",
    name: "James Whitfield",
    email: "james.whitfield@example.com",
    phone: "07700 900123",
    address: "14 Elm Grove, Manchester, M14 5TR",
    createdAt: "2023-02-10",
  },
  {
    id: "cus_2",
    name: "Priya Kaur",
    email: "priya.kaur@example.com",
    phone: "07700 900456",
    address: "8 Oakfield Road, Leeds, LS6 2AB",
    createdAt: "2023-05-22",
  },
  {
    id: "cus_3",
    name: "Tom Bracewell",
    email: "tom.bracewell@example.com",
    phone: "07700 900789",
    address: "21 Highfield Lane, Sheffield, S10 3JN",
    createdAt: "2024-01-08",
  },
  {
    id: "cus_4",
    name: "Aisha Rahman",
    email: "aisha.rahman@example.com",
    phone: "07700 900321",
    address: "3 Birch Close, Bradford, BD2 1QW",
    createdAt: "2024-06-17",
    notes: "Prefers early morning drop-off before 8am.",
  },
  {
    id: "cus_5",
    name: "Callum Reid",
    email: "callum.reid@example.com",
    phone: "07700 900654",
    address: "56 Station Road, Wakefield, WF1 2LP",
    createdAt: "2025-03-01",
  },
];

export const vehicles: Vehicle[] = [
  {
    id: "veh_1",
    customerId: "cus_1",
    registration: "LM19 XYZ",
    make: "Ford",
    model: "Focus",
    year: 2019,
    colour: "Blue",
    mileage: 42350,
    motDue: "2026-09-02",
    lastServiceDate: "2025-09-10",
  },
  {
    id: "veh_2",
    customerId: "cus_2",
    registration: "PK68 ABC",
    make: "Volkswagen",
    model: "Golf",
    year: 2018,
    colour: "Grey",
    mileage: 58120,
    motDue: "2026-08-20",
    lastServiceDate: "2025-08-01",
  },
  {
    id: "veh_3",
    customerId: "cus_3",
    registration: "TB21 DEF",
    make: "Toyota",
    model: "Yaris",
    year: 2021,
    colour: "Red",
    mileage: 18420,
    motDue: "2027-01-15",
    lastServiceDate: "2025-06-20",
  },
  {
    id: "veh_4",
    customerId: "cus_4",
    registration: "AR15 GHI",
    make: "BMW",
    model: "3 Series",
    year: 2015,
    colour: "Black",
    mileage: 89430,
    motDue: "2026-08-18",
    lastServiceDate: "2025-02-14",
  },
  {
    id: "veh_5",
    customerId: "cus_5",
    registration: "CR22 JKL",
    make: "Vauxhall",
    model: "Corsa",
    year: 2022,
    colour: "White",
    mileage: 9210,
    motDue: "2027-03-10",
    lastServiceDate: null,
  },
  {
    id: "veh_6",
    customerId: "cus_1",
    registration: "LM17 MNO",
    make: "Kia",
    model: "Sportage",
    year: 2017,
    colour: "Silver",
    mileage: 61200,
    motDue: "2026-08-16",
    lastServiceDate: "2025-04-05",
  },
];

export const parts: Part[] = [
  {
    id: "prt_1",
    sku: "BRK-PAD-001",
    name: "Front Brake Pads (Set)",
    supplier: "Euro Car Parts",
    category: "Brakes",
    stockLevel: 14,
    reorderLevel: 6,
    costPrice: 18.5,
    sellPrice: 42.0,
  },
  {
    id: "prt_2",
    sku: "OIL-5W30-005",
    name: "5W-30 Fully Synthetic Oil (5L)",
    supplier: "GSF Car Parts",
    category: "Fluids",
    stockLevel: 3,
    reorderLevel: 8,
    costPrice: 22.0,
    sellPrice: 44.99,
  },
  {
    id: "prt_3",
    sku: "FLT-OIL-014",
    name: "Oil Filter",
    supplier: "GSF Car Parts",
    category: "Filters",
    stockLevel: 22,
    reorderLevel: 10,
    costPrice: 3.2,
    sellPrice: 8.5,
  },
  {
    id: "prt_4",
    sku: "WPR-B600-2",
    name: "Wiper Blade Pair 600mm",
    supplier: "Euro Car Parts",
    category: "Wipers",
    stockLevel: 5,
    reorderLevel: 6,
    costPrice: 9.0,
    sellPrice: 19.99,
  },
  {
    id: "prt_5",
    sku: "BAT-075-1",
    name: "12V Car Battery 075",
    supplier: "CTA Distribution",
    category: "Electrical",
    stockLevel: 4,
    reorderLevel: 3,
    costPrice: 48.0,
    sellPrice: 89.0,
  },
  {
    id: "prt_6",
    sku: "TYR-205-55",
    name: "Tyre 205/55 R16",
    supplier: "Micheldever Tyres",
    category: "Tyres",
    stockLevel: 8,
    reorderLevel: 4,
    costPrice: 41.0,
    sellPrice: 79.0,
  },
];

export const bookings: Booking[] = [
  {
    id: "bkg_1",
    customerId: "cus_1",
    vehicleId: "veh_1",
    date: "2026-08-14",
    time: "09:00",
    durationMinutes: 60,
    type: "service",
    bay: "Bay 1",
    technician: "Dave Holt",
    jobId: "job_1",
  },
  {
    id: "bkg_2",
    customerId: "cus_2",
    vehicleId: "veh_2",
    date: "2026-08-14",
    time: "10:30",
    durationMinutes: 45,
    type: "mot",
    bay: "Bay 2",
    technician: "Sarah Cole",
    jobId: "job_2",
  },
  {
    id: "bkg_3",
    customerId: "cus_3",
    vehicleId: "veh_3",
    date: "2026-08-14",
    time: "13:00",
    durationMinutes: 90,
    type: "repair",
    bay: "Bay 1",
    technician: "Dave Holt",
    jobId: "job_3",
  },
  {
    id: "bkg_4",
    customerId: "cus_4",
    vehicleId: "veh_4",
    date: "2026-08-15",
    time: "08:30",
    durationMinutes: 30,
    type: "diagnostic",
    bay: "Bay 3",
    technician: "Mo Ahmed",
    jobId: "job_4",
  },
  {
    id: "bkg_5",
    customerId: "cus_5",
    vehicleId: "veh_5",
    date: "2026-08-15",
    time: "11:00",
    durationMinutes: 60,
    type: "service",
    bay: "Bay 2",
    technician: "Sarah Cole",
  },
  {
    id: "bkg_6",
    customerId: "cus_1",
    vehicleId: "veh_6",
    date: "2026-08-17",
    time: "09:30",
    durationMinutes: 45,
    type: "mot",
    bay: "Bay 1",
    technician: "Dave Holt",
  },
];

export const jobCards: JobCard[] = [
  {
    id: "job_1",
    bookingId: "bkg_1",
    customerId: "cus_1",
    vehicleId: "veh_1",
    status: "in_progress",
    technician: "Dave Holt",
    createdAt: "2026-08-14",
    dueDate: "2026-08-14",
    description: "Full service, oil & filter change, brake inspection.",
    labourLines: [
      { id: "lab_1", description: "Full service labour", hours: 1.5, rate: 65 },
    ],
    partLines: [
      { id: "pl_1", partId: "prt_2", description: "5W-30 Fully Synthetic Oil (5L)", quantity: 1, unitPrice: 44.99 },
      { id: "pl_2", partId: "prt_3", description: "Oil Filter", quantity: 1, unitPrice: 8.5 },
    ],
  },
  {
    id: "job_2",
    bookingId: "bkg_2",
    customerId: "cus_2",
    vehicleId: "veh_2",
    status: "booked",
    technician: "Sarah Cole",
    createdAt: "2026-08-14",
    dueDate: "2026-08-14",
    description: "Annual MOT test.",
    labourLines: [{ id: "lab_2", description: "MOT test fee", hours: 0.5, rate: 54.85 }],
    partLines: [],
  },
  {
    id: "job_3",
    bookingId: "bkg_3",
    customerId: "cus_3",
    vehicleId: "veh_3",
    status: "awaiting_parts",
    technician: "Dave Holt",
    createdAt: "2026-08-13",
    dueDate: "2026-08-14",
    description: "Front brake pads and discs replacement.",
    labourLines: [
      { id: "lab_3", description: "Front brake replacement labour", hours: 1.2, rate: 65 },
    ],
    partLines: [
      { id: "pl_3", partId: "prt_1", description: "Front Brake Pads (Set)", quantity: 1, unitPrice: 42.0 },
    ],
    notes: "Waiting on brake discs from supplier, ETA tomorrow.",
  },
  {
    id: "job_4",
    bookingId: "bkg_4",
    customerId: "cus_4",
    vehicleId: "veh_4",
    status: "completed",
    technician: "Mo Ahmed",
    createdAt: "2026-08-10",
    dueDate: "2026-08-15",
    description: "Engine warning light diagnostic.",
    labourLines: [
      { id: "lab_4", description: "Diagnostic labour", hours: 1, rate: 70 },
    ],
    partLines: [],
    invoiceId: "inv_3",
  },
  {
    id: "job_5",
    customerId: "cus_5",
    vehicleId: "veh_5",
    status: "invoiced",
    technician: "Sarah Cole",
    createdAt: "2026-08-05",
    dueDate: "2026-08-06",
    description: "Wiper blade replacement and battery check.",
    labourLines: [
      { id: "lab_5", description: "Wiper & battery check labour", hours: 0.4, rate: 65 },
    ],
    partLines: [
      { id: "pl_4", partId: "prt_4", description: "Wiper Blade Pair 600mm", quantity: 1, unitPrice: 19.99 },
    ],
    invoiceId: "inv_2",
  },
];

export const invoices: Invoice[] = [
  {
    id: "inv_1",
    number: "INV-1001",
    jobId: "job_1",
    customerId: "cus_1",
    vehicleId: "veh_1",
    date: "2026-08-14",
    dueDate: "2026-08-28",
    status: "draft",
    vatRate: 0.2,
    lineItems: [
      { id: "li_1", description: "Full service labour (1.5 hrs)", quantity: 1, unitPrice: 97.5 },
      { id: "li_2", description: "5W-30 Fully Synthetic Oil (5L)", quantity: 1, unitPrice: 44.99 },
      { id: "li_3", description: "Oil Filter", quantity: 1, unitPrice: 8.5 },
    ],
  },
  {
    id: "inv_2",
    number: "INV-1000",
    jobId: "job_5",
    customerId: "cus_5",
    vehicleId: "veh_5",
    date: "2026-08-06",
    dueDate: "2026-08-20",
    status: "sent",
    vatRate: 0.2,
    lineItems: [
      { id: "li_4", description: "Wiper & battery check labour (0.4 hrs)", quantity: 1, unitPrice: 26.0 },
      { id: "li_5", description: "Wiper Blade Pair 600mm", quantity: 1, unitPrice: 19.99 },
    ],
  },
  {
    id: "inv_3",
    number: "INV-0999",
    jobId: "job_4",
    customerId: "cus_4",
    vehicleId: "veh_4",
    date: "2026-08-11",
    dueDate: "2026-08-25",
    status: "paid",
    vatRate: 0.2,
    lineItems: [
      { id: "li_6", description: "Diagnostic labour (1 hr)", quantity: 1, unitPrice: 70.0 },
    ],
  },
  {
    id: "inv_4",
    number: "INV-0987",
    customerId: "cus_3",
    vehicleId: "veh_3",
    date: "2026-07-02",
    dueDate: "2026-07-16",
    status: "overdue",
    vatRate: 0.2,
    lineItems: [
      { id: "li_7", description: "Tyre replacement x2", quantity: 2, unitPrice: 79.0 },
      { id: "li_8", description: "Wheel alignment", quantity: 1, unitPrice: 35.0 },
    ],
  },
];

export function getCustomer(id: string): Customer | undefined {
  return customers.find((c) => c.id === id);
}

export function getVehicle(id: string): Vehicle | undefined {
  return vehicles.find((v) => v.id === id);
}

export function getVehiclesForCustomer(customerId: string): Vehicle[] {
  return vehicles.filter((v) => v.customerId === customerId);
}

export function getBookingsForCustomer(customerId: string): Booking[] {
  return bookings.filter((b) => b.customerId === customerId);
}

export function getJobsForCustomer(customerId: string): JobCard[] {
  return jobCards.filter((j) => j.customerId === customerId);
}

export function getInvoicesForCustomer(customerId: string): Invoice[] {
  return invoices.filter((i) => i.customerId === customerId);
}

export function getJob(id: string): JobCard | undefined {
  return jobCards.find((j) => j.id === id);
}

export function getInvoice(id: string): Invoice | undefined {
  return invoices.find((i) => i.id === id);
}

export function getPart(id: string): Part | undefined {
  return parts.find((p) => p.id === id);
}

export function invoiceTotals(invoice: Invoice) {
  const subtotal = invoice.lineItems.reduce(
    (sum, li) => sum + li.quantity * li.unitPrice,
    0
  );
  const vat = subtotal * invoice.vatRate;
  return { subtotal, vat, total: subtotal + vat };
}

export function jobLineTotal(job: JobCard) {
  const labour = job.labourLines.reduce((sum, l) => sum + l.hours * l.rate, 0);
  const partsTotal = job.partLines.reduce(
    (sum, p) => sum + p.quantity * p.unitPrice,
    0
  );
  return { labour, partsTotal, total: labour + partsTotal };
}
