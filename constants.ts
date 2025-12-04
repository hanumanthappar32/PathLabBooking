import { LabTest, TimeSlot } from './types';

export const INITIAL_TESTS: LabTest[] = [
  {
    id: 't1',
    name: 'Complete Blood Count (CBC)',
    description: 'Evaluates overall health and detects a wide range of disorders, including anemia, infection and leukemia.',
    price: 499,
    preparation: 'No fasting required.',
    turnaroundTime: '12 Hours',
    category: 'Blood',
    popular: true
  },
  {
    id: 't2',
    name: 'Thyroid Profile (Total)',
    description: 'Measures T3, T4, and TSH levels to check thyroid gland function.',
    price: 899,
    preparation: 'Fasting not strictly required, but recommended.',
    turnaroundTime: '24 Hours',
    category: 'Blood',
    popular: true
  },
  {
    id: 't3',
    name: 'Lipid Profile',
    description: 'Measures cholesterol and triglycerides to assess heart health risk.',
    price: 750,
    preparation: '10-12 hours of fasting required.',
    turnaroundTime: '24 Hours',
    category: 'Blood'
  },
  {
    id: 't4',
    name: 'HbA1c (Glycosylated Hemoglobin)',
    description: 'Average blood sugar level over the past 2-3 months. Critical for diabetes management.',
    price: 600,
    preparation: 'No fasting required.',
    turnaroundTime: '6 Hours',
    category: 'Blood',
    popular: true
  },
  {
    id: 't5',
    name: 'Vitamin D (25-OH)',
    description: 'Checks for Vitamin D deficiency which relates to bone health and immunity.',
    price: 1200,
    preparation: 'No fasting required.',
    turnaroundTime: '24 Hours',
    category: 'Blood'
  },
  {
    id: 't6',
    name: 'Complete Urine Analysis',
    description: 'Detects urinary tract infections, kidney disease and diabetes.',
    price: 350,
    preparation: 'Morning mid-stream sample preferred.',
    turnaroundTime: '12 Hours',
    category: 'Urine'
  },
  {
    id: 't7',
    name: 'Full Body Checkup (Advanced)',
    description: 'Comprehensive package including CBC, Liver Function, Kidney Function, Lipid, Glucose, and Urine.',
    price: 2499,
    preparation: '12 hours fasting required.',
    turnaroundTime: '24-36 Hours',
    category: 'Checkup',
    popular: true
  }
];

export const TIME_SLOTS: TimeSlot[] = [
  { id: 'ts1', time: '07:00 AM - 08:00 AM', available: true },
  { id: 'ts2', time: '08:00 AM - 09:00 AM', available: true },
  { id: 'ts3', time: '09:00 AM - 10:00 AM', available: true },
  { id: 'ts4', time: '10:00 AM - 11:00 AM', available: true },
  { id: 'ts5', time: '11:00 AM - 12:00 PM', available: true },
  { id: 'ts6', time: '04:00 PM - 05:00 PM', available: true },
  { id: 'ts7', time: '05:00 PM - 06:00 PM', available: true },
];