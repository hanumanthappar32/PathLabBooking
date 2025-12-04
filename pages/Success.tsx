import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Calendar, MapPin } from 'lucide-react';
import { Appointment } from '../types';

const Success: React.FC = () => {
  const location = useLocation();
  const appointment = location.state?.appointment as Appointment;

  if (!appointment) return <div className="p-10 text-center">No booking details found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-8 text-center animate-fade-in-up">
        <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-500 mb-8">Your appointment has been successfully booked. A technician will arrive at your location shortly.</p>
        
        <div className="bg-gray-50 rounded-xl p-6 text-left space-y-4 mb-8">
          <div>
            <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Test</span>
            <p className="font-bold text-gray-900">{appointment.testName}</p>
          </div>
          <div className="flex justify-between">
            <div>
              <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Date</span>
              <p className="font-medium text-gray-900 flex items-center gap-1">
                 <Calendar className="w-4 h-4" /> {appointment.date}
              </p>
            </div>
             <div className="text-right">
              <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Time</span>
              <p className="font-medium text-gray-900">{appointment.timeSlot}</p>
            </div>
          </div>
          <div>
            <span className="text-xs uppercase text-gray-400 font-semibold tracking-wider">Location</span>
            <p className="font-medium text-gray-900 flex items-start gap-1">
               <MapPin className="w-4 h-4 mt-1 flex-shrink-0" /> {appointment.user.address}
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Link 
            to="/reports" 
            className="block w-full bg-slate-900 text-white font-medium py-3 rounded-lg hover:bg-slate-800 transition-colors"
          >
            View My Booking
          </Link>
          <Link 
            to="/" 
            className="block w-full bg-white text-gray-600 font-medium py-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;