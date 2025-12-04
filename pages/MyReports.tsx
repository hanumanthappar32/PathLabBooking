import React from 'react';
import { useLab } from '../context/LabContext';
import { FileText, Clock } from 'lucide-react';
import { AppointmentStatus } from '../types';
import { useNavigate } from 'react-router-dom';

const MyReports: React.FC = () => {
  const { appointments } = useLab();
  const navigate = useNavigate();
  
  const sortedAppointments = [...appointments].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Bookings & Reports</h1>
      
      <div className="space-y-4">
        {sortedAppointments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No bookings found. Book a test to see it here.</p>
          </div>
        ) : (
          sortedAppointments.map((apt) => (
            <div key={apt.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 transition-all hover:shadow-md">
              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-gray-900">{apt.testName}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      apt.status === AppointmentStatus.REPORT_READY ? 'bg-green-100 text-green-800' :
                      apt.status === AppointmentStatus.CONFIRMED ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p className="flex items-center gap-2">
                       <Clock className="w-4 h-4" /> {apt.date} at {apt.timeSlot}
                    </p>
                    <p>Patient: {apt.user.name}</p>
                    <p className="text-xs text-gray-400">ID: {apt.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                   {apt.status === AppointmentStatus.REPORT_READY || apt.status === AppointmentStatus.COMPLETED ? (
                     <button 
                       onClick={() => navigate(`/report/${apt.id}`)}
                       className="flex-1 md:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                     >
                       <FileText className="w-4 h-4" /> View Report
                     </button>
                   ) : (
                     <div className="flex-1 md:flex-none bg-gray-50 text-gray-500 px-4 py-2 rounded-lg text-sm font-medium text-center border border-gray-200">
                       Processing
                     </div>
                   )}
                </div>
              </div>
              
              {/* Timeline Visualization */}
              <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between relative">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2"></div>
                
                {[AppointmentStatus.CONFIRMED, AppointmentStatus.SAMPLE_COLLECTED, AppointmentStatus.REPORT_READY].map((step, idx) => {
                  const isCompleted = 
                    (apt.status === step) || 
                    (apt.status === AppointmentStatus.REPORT_READY && idx < 2) ||
                    (apt.status === AppointmentStatus.COMPLETED);
                  
                  return (
                    <div key={step} className="flex flex-col items-center bg-white px-2">
                      <div className={`w-3 h-3 rounded-full mb-2 ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                      <span className={`text-[10px] font-medium uppercase ${isCompleted ? 'text-green-600' : 'text-gray-400'}`}>
                        {step === AppointmentStatus.CONFIRMED ? 'Booked' : step === AppointmentStatus.SAMPLE_COLLECTED ? 'Collected' : 'Report'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MyReports;