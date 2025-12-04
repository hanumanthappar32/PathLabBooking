import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LabTest, Appointment, AppointmentStatus } from '../types';
import { INITIAL_TESTS } from '../constants';
import { supabase, isSupabaseConfigured } from '../services/supabase';

interface LabContextType {
  tests: LabTest[];
  appointments: Appointment[];
  isLoading: boolean;
  isAdminLoggedIn: boolean;
  login: (password: string) => boolean;
  logout: () => void;
  changePassword: (newPassword: string) => void;
  addAppointment: (appointment: Appointment) => Promise<void>;
  updateAppointmentStatus: (id: string, status: AppointmentStatus) => Promise<void>;
  getAppointmentById: (id: string) => Appointment | undefined;
  // Admin functions
  addTest: (test: LabTest) => Promise<void>;
  updateTest: (test: LabTest) => Promise<void>;
  deleteTest: (id: string) => Promise<void>;
}

const LabContext = createContext<LabContextType | undefined>(undefined);

export const LabProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tests, setTests] = useState<LabTest[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Check for existing session
  useEffect(() => {
    const sessionAuth = sessionStorage.getItem('lab_admin_auth');
    if (sessionAuth === 'true') {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const login = (password: string) => {
    // Check localStorage for a custom password, otherwise use default
    const storedPassword = localStorage.getItem('lab_admin_password') || 'admin123';
    
    if (password === storedPassword) {
      setIsAdminLoggedIn(true);
      sessionStorage.setItem('lab_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdminLoggedIn(false);
    sessionStorage.removeItem('lab_admin_auth');
  };

  const changePassword = (newPassword: string) => {
    localStorage.setItem('lab_admin_password', newPassword);
  };

  // Fetch Data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      
      if (!isSupabaseConfigured()) {
        console.warn("Supabase not configured. Using local fallback.");
        setTests(INITIAL_TESTS);
        const localApts = localStorage.getItem('patho_appointments');
        if (localApts) setAppointments(JSON.parse(localApts));
        setIsLoading(false);
        return;
      }

      try {
        // Fetch Tests
        const { data: testsData, error: testsError } = await supabase.from('tests').select('*');
        
        if (testsError) throw testsError;

        if (testsData && testsData.length > 0) {
          const mappedTests: LabTest[] = testsData.map((t: any) => ({
            id: t.id,
            name: t.name,
            description: t.description,
            price: t.price,
            preparation: t.preparation,
            turnaroundTime: t.turnaround_time,
            category: t.category,
            popular: t.popular
          }));
          setTests(mappedTests);
        } else {
          // Seed initial tests if DB is empty
          await seedInitialTests();
        }

        // Fetch Appointments
        const { data: aptsData, error: aptsError } = await supabase
          .from('appointments')
          .select('*')
          .order('created_at', { ascending: false });

        if (aptsError) throw aptsError;

        if (aptsData) {
          const mappedApts: Appointment[] = aptsData.map((a: any) => ({
            id: a.id,
            testId: a.test_id,
            testName: a.test_name,
            price: a.price,
            date: a.date,
            timeSlot: a.time_slot,
            status: a.status as AppointmentStatus,
            createdAt: a.created_at,
            reportUrl: a.report_url,
            user: {
              id: a.id, // Using appointment ID as user ID for flat structure
              name: a.patient_name,
              age: a.patient_age,
              phone: a.patient_phone,
              email: a.patient_email,
              address: a.patient_address
            }
          }));
          setAppointments(mappedApts);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to constants if connection fails
        setTests(INITIAL_TESTS);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const seedInitialTests = async () => {
    const dbTests = INITIAL_TESTS.map(t => ({
      id: t.id,
      name: t.name,
      description: t.description,
      price: t.price,
      preparation: t.preparation,
      turnaround_time: t.turnaroundTime,
      category: t.category,
      popular: t.popular
    }));
    
    const { error } = await supabase.from('tests').insert(dbTests);
    if (!error) setTests(INITIAL_TESTS);
  };

  const addAppointment = async (appointment: Appointment) => {
    // Optimistic Update
    setAppointments(prev => [appointment, ...prev]);

    if (!isSupabaseConfigured()) {
       localStorage.setItem('patho_appointments', JSON.stringify([appointment, ...appointments]));
       return;
    }

    const dbPayload = {
      id: appointment.id,
      test_id: appointment.testId,
      test_name: appointment.testName,
      price: appointment.price,
      date: appointment.date,
      time_slot: appointment.timeSlot,
      status: appointment.status,
      created_at: appointment.createdAt,
      patient_name: appointment.user.name,
      patient_age: appointment.user.age,
      patient_phone: appointment.user.phone,
      patient_email: appointment.user.email,
      patient_address: appointment.user.address,
    };

    const { error } = await supabase.from('appointments').insert([dbPayload]);
    if (error) {
      console.error("Error adding appointment:", error);
      // Revert optimistic update on error
      setAppointments(prev => prev.filter(a => a.id !== appointment.id));
      alert("Failed to save appointment. Please try again.");
    }
  };

  const updateAppointmentStatus = async (id: string, status: AppointmentStatus) => {
    // Optimistic
    setAppointments(prev => prev.map(apt => 
      apt.id === id ? { ...apt, status } : apt
    ));

    if (!isSupabaseConfigured()) {
        const updated = appointments.map(apt => apt.id === id ? { ...apt, status } : apt);
        localStorage.setItem('patho_appointments', JSON.stringify(updated));
        return;
    }

    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      console.error("Error updating status:", error);
    }
  };

  const getAppointmentById = (id: string) => appointments.find(a => a.id === id);

  const addTest = async (test: LabTest) => {
    // Optimistic
    setTests(prev => [...prev, test]);

    if (!isSupabaseConfigured()) return;

    const dbTest = {
      id: test.id,
      name: test.name,
      description: test.description,
      price: test.price,
      preparation: test.preparation,
      turnaround_time: test.turnaroundTime,
      category: test.category,
      popular: test.popular
    };

    const { error } = await supabase.from('tests').insert([dbTest]);
    if (error) {
      console.error("Error adding test:", error);
      setTests(prev => prev.filter(t => t.id !== test.id));
    }
  };

  const updateTest = async (test: LabTest) => {
    // Optimistic
    setTests(prev => prev.map(t => t.id === test.id ? test : t));

    if (!isSupabaseConfigured()) return;

    const dbTest = {
      name: test.name,
      description: test.description,
      price: test.price,
      preparation: test.preparation,
      turnaround_time: test.turnaroundTime,
      category: test.category,
      popular: test.popular
    };

    const { error } = await supabase
      .from('tests')
      .update(dbTest)
      .eq('id', test.id);

    if (error) {
      console.error("Error updating test:", error);
    }
  };

  const deleteTest = async (id: string) => {
    // Optimistic
    setTests(prev => prev.filter(t => t.id !== id));

    if (!isSupabaseConfigured()) return;

    const { error } = await supabase.from('tests').delete().eq('id', id);
    if (error) {
       console.error("Error deleting test:", error);
    }
  };

  return (
    <LabContext.Provider value={{ 
      tests, 
      appointments, 
      isLoading,
      isAdminLoggedIn,
      login,
      logout,
      changePassword,
      addAppointment, 
      updateAppointmentStatus, 
      getAppointmentById,
      addTest,
      updateTest,
      deleteTest
    }}>
      {children}
    </LabContext.Provider>
  );
};

export const useLab = () => {
  const context = useContext(LabContext);
  if (!context) throw new Error("useLab must be used within a LabProvider");
  return context;
};