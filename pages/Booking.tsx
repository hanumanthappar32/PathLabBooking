import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLab } from '../context/LabContext';
import { TIME_SLOTS } from '../constants';
import { AppointmentStatus } from '../types';
import { Calendar, Clock, MapPin, User, ChevronLeft, CreditCard, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../services/supabase';

const Booking: React.FC = () => {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const { tests, addAppointment } = useLab();
  
  const selectedTest = tests.find(t => t.id === testId);
  
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Schedule, 2: Details, 3: Confirm
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedSlot, setSelectedSlot] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    phone: '',
    address: '',
    email: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);

  if (!selectedTest) {
    return <div className="p-8 text-center">Test not found. Please return to home.</div>;
  }

  // Generate next 7 days for calendar
  const getDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push(d);
    }
    return dates;
  };

  const dates = getDates();

  const handleBooking = async () => {
    setIsProcessing(true);
    // Simulate API call and Payment Gateway
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newAppointment = {
      id: Math.random().toString(36).substr(2, 9),
      testId: selectedTest.id,
      testName: selectedTest.name,
      price: selectedTest.price,
      date: selectedDate,
      timeSlot: selectedSlot,
      user: {
        id: 'u_' + Math.random().toString(36).substr(2, 5),
        name: formData.name,
        age: formData.age, // Added age
        phone: formData.phone,
        email: formData.email,
        address: formData.address
      },
      status: AppointmentStatus.CONFIRMED,
      createdAt: new Date().toISOString()
    };

    await addAppointment(newAppointment);
    setIsProcessing(false);
    navigate('/success', { state: { appointment: newAppointment } });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white border-b sticky top-16 z-40 px-4 py-3 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center">
          <button onClick={() => navigate(-1)} className="mr-4 text-gray-500 hover:text-gray-800">
            <ChevronLeft />
          </button>
          <div>
            <h1 className="font-bold text-gray-900 line-clamp-1">{selectedTest.name}</h1>
            <p className="text-sm text-gray-500">Step {step} of 3</p>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-6">
        
        {!isSupabaseConfigured() && (
           <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 p-4 rounded-lg mb-6 flex items-start gap-3">
             <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
             <div>
               <p className="font-bold">Database not connected</p>
               <p className="text-sm">You are running in demo mode. Data will be saved to your browser only.</p>
             </div>
           </div>
        )}

        {/* Step 1: Schedule */}
        {step === 1 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-fade-in">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" /> Select Date
            </h2>
            <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
              {dates.map((date) => {
                const isSelected = selectedDate === date.toISOString().split('T')[0];
                return (
                  <button
                    key={date.toISOString()}
                    onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                    className={`flex flex-col items-center justify-center min-w-[80px] p-3 rounded-lg border transition-all ${
                      isSelected ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <span className="text-xs font-medium uppercase text-gray-500">{date.toLocaleDateString('en-US', { weekday: 'short' })}</span>
                    <span className="text-xl font-bold">{date.getDate()}</span>
                  </button>
                );
              })}
            </div>

            {selectedDate && (
              <>
                <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-blue-600" /> Select Time Slot
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {TIME_SLOTS.map((slot) => (
                    <button
                      key={slot.id}
                      onClick={() => setSelectedSlot(slot.time)}
                      disabled={!slot.available}
                      className={`p-3 rounded-lg text-sm border font-medium transition-all ${
                        selectedSlot === slot.time
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-200 text-gray-700 hover:border-blue-300'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </>
            )}

            <div className="mt-8 flex justify-end">
              <button
                disabled={!selectedDate || !selectedSlot}
                onClick={() => setStep(2)}
                className="bg-slate-900 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors w-full md:w-auto"
              >
                Next: Patient Details
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Details */}
        {step === 2 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-fade-in">
             <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <User className="w-5 h-5 text-blue-600" /> Patient Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    required
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.age}
                    onChange={e => setFormData({...formData, age: e.target.value})}
                  />
                </div>
                 <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    value={formData.phone}
                    onChange={e => setFormData({...formData, phone: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email (for reports)</label>
                <input
                  type="email"
                  required
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Collection Address</label>
                <textarea
                  required
                  rows={3}
                  className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={formData.address}
                  onChange={e => setFormData({...formData, address: e.target.value})}
                />
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button onClick={() => setStep(1)} className="text-gray-600 font-medium px-4">Back</button>
              <button
                disabled={!formData.name || !formData.phone || !formData.address}
                onClick={() => setStep(3)}
                className="bg-slate-900 disabled:opacity-50 text-white px-8 py-3 rounded-lg font-medium hover:bg-slate-800 transition-colors"
              >
                Next: Payment
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 animate-fade-in">
             <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-blue-600" /> Order Summary
            </h2>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Test Name</span>
                <span className="font-medium text-gray-900">{selectedTest.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date & Time</span>
                <span className="font-medium text-gray-900">{selectedDate} <br/> <span className="text-xs">{selectedSlot}</span></span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Patient</span>
                <span className="font-medium text-gray-900">{formData.name}</span>
              </div>
              <div className="border-t pt-3 flex justify-between items-center mt-3">
                <span className="font-bold text-lg text-gray-900">Total Amount</span>
                <span className="font-bold text-2xl text-blue-600">₹{selectedTest.price}</span>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2 font-medium">Select Payment Method</p>
              <div className="grid grid-cols-1 gap-3">
                <div className="border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-blue-50 border-blue-500 bg-blue-50">
                  <div className="w-4 h-4 rounded-full border-4 border-blue-600"></div>
                  <span className="font-medium">Razorpay / UPI / Card</span>
                  <span className="ml-auto text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Fast</span>
                </div>
                 <div className="border rounded-lg p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 opacity-60">
                  <div className="w-4 h-4 rounded-full border border-gray-400"></div>
                  <span className="font-medium">Cash on Collection</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-200"
            >
              {isProcessing ? 'Processing Payment...' : `Pay ₹${selectedTest.price} & Book`}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4 flex items-center justify-center gap-1">
               <span className="w-3 h-3 bg-green-400 rounded-full inline-block"></span> Secure 256-bit SSL encrypted payment
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;