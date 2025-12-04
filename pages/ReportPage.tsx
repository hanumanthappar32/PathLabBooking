import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useLab } from '../context/LabContext';
import ReportView from '../components/ReportView';
import { ChevronLeft } from 'lucide-react';

const ReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAppointmentById } = useLab();
  
  const appointment = id ? getAppointmentById(id) : undefined;

  if (!appointment) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Report Not Found</h2>
        <p className="text-gray-500 mb-6">We couldn't find the appointment details you requested.</p>
        <Link to="/reports" className="text-blue-600 hover:underline flex items-center gap-1">
          <ChevronLeft className="w-4 h-4" /> Back to My Reports
        </Link>
      </div>
    );
  }

  return (
    <div>
       <div className="bg-gray-900 text-white px-4 py-2 print:hidden flex items-center justify-between">
         <Link to="/reports" className="flex items-center gap-2 text-sm hover:text-gray-300">
           <ChevronLeft className="w-4 h-4" /> Back to List
         </Link>
         <span className="text-sm font-medium">Viewing Report: {id}</span>
         <div className="w-10"></div> 
       </div>
       <ReportView appointment={appointment} />
    </div>
  );
};

export default ReportPage;