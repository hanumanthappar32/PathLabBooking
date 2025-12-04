export enum AppointmentStatus {
  PENDING = 'Pending',
  CONFIRMED = 'Confirmed',
  SAMPLE_COLLECTED = 'Sample Collected',
  REPORT_READY = 'Report Ready',
  COMPLETED = 'Completed'
}

export interface LabTest {
  id: string;
  name: string;
  description: string;
  price: number;
  preparation: string;
  turnaroundTime: string; // e.g., "24 hours"
  category: 'Blood' | 'Urine' | 'Imaging' | 'Checkup';
  popular?: boolean;
}

export interface User {
  id: string;
  name: string;
  age: string; // Added age
  phone: string;
  email: string;
  address: string;
}

export interface Appointment {
  id: string;
  testId: string;
  testName: string; // Denormalized for easier display
  price: number;
  date: string; // ISO string
  timeSlot: string;
  user: User;
  status: AppointmentStatus;
  reportUrl?: string; // Mock URL for the report
  createdAt: string;
}

export interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}