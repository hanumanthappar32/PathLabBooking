import React, { useState, useEffect } from 'react';
import { useLab } from '../context/LabContext';
import { AppointmentStatus, LabTest } from '../types';
import { Plus, Trash2, Check, Pencil, X, LogOut, FileText, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { 
    appointments, 
    tests, 
    updateAppointmentStatus, 
    addTest, 
    updateTest, 
    deleteTest,
    isAdminLoggedIn,
    logout,
    changePassword
  } = useLab();
  
  const navigate = useNavigate();

  // Protect the route
  useEffect(() => {
    if (!isAdminLoggedIn) {
      navigate('/login');
    }
  }, [isAdminLoggedIn, navigate]);

  const [activeTab, setActiveTab] = useState<'appointments' | 'tests'>('appointments');
  
  // New Test Form State
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestId, setCurrentTestId] = useState<string | null>(null);
  const [testForm, setTestForm] = useState<Partial<LabTest>>({
    name: '',
    price: 0,
    description: '',
    category: 'Blood',
    preparation: '',
    turnaroundTime: '24 Hours'
  });

  // Change Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!isAdminLoggedIn) return null;

  const handleSubmitTest = (e: React.FormEvent) => {
    e.preventDefault();
    if(testForm.name && testForm.price) {
      if (isEditing && currentTestId) {
        updateTest({
          ...testForm,
          id: currentTestId
        } as LabTest);
      } else {
        addTest({
          ...testForm,
          id: Math.random().toString(36).substr(2, 9),
        } as LabTest);
      }
      resetForm();
    }
  };

  const handleEditClick = (test: LabTest) => {
    setTestForm({
      name: test.name,
      price: test.price,
      description: test.description,
      category: test.category,
      preparation: test.preparation,
      turnaroundTime: test.turnaroundTime
    });
    setCurrentTestId(test.id);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetForm = () => {
    setTestForm({ name: '', price: 0, description: '', category: 'Blood', preparation: '', turnaroundTime: '24 Hours' });
    setIsEditing(false);
    setCurrentTestId(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword === confirmPassword) {
      changePassword(newPassword);
      setIsPasswordModalOpen(false);
      setNewPassword('');
      setConfirmPassword('');
      alert("Password updated successfully!");
    } else {
      alert("Passwords do not match!");
    }
  };

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.CONFIRMED: return 'bg-blue-100 text-blue-800';
      case AppointmentStatus.SAMPLE_COLLECTED: return 'bg-yellow-100 text-yellow-800';
      case AppointmentStatus.REPORT_READY: return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 animate-fade-in-up">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" /> Change Password
            </h2>
            <form onSubmit={handlePasswordChange}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">New Password</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white text-gray-900 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  Save Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Lab Admin Dashboard</h1>
           <p className="text-sm text-gray-500">Manage tests, bookings, and reports.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 md:gap-4 justify-center">
          <div className="flex bg-gray-100 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('appointments')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'appointments' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              Appointments
            </button>
            <button 
              onClick={() => setActiveTab('tests')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === 'tests' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}
            >
              Manage Tests
            </button>
          </div>
          
          <button 
            onClick={() => setIsPasswordModalOpen(true)}
            className="flex items-center gap-2 text-gray-600 hover:bg-gray-100 px-3 py-2 rounded-lg transition-colors text-sm font-medium border border-gray-200 bg-white"
          >
            <Lock className="w-4 h-4" /> Change Password
          </button>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-sm font-medium border border-red-100 bg-white"
          >
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </div>

      {activeTab === 'appointments' && (
        <div className="bg-white shadow rounded-lg overflow-hidden border border-gray-200">
           <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Test</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date/Time</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">No appointments yet.</td>
                  </tr>
                ) : (
                  appointments.map((apt) => (
                    <tr key={apt.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{apt.user.name}</div>
                        <div className="text-sm text-gray-500">{apt.user.phone}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{apt.testName}</div>
                        <div className="text-sm text-gray-500">₹{apt.price}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{apt.date}</div>
                        <div className="text-xs text-gray-500">{apt.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-y-2">
                         <select 
                            value={apt.status}
                            onChange={(e) => updateAppointmentStatus(apt.id, e.target.value as AppointmentStatus)}
                            className="block w-full bg-white text-gray-900 pl-3 pr-8 py-1 text-xs border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded border mb-2"
                         >
                           <option value={AppointmentStatus.CONFIRMED}>Confirmed</option>
                           <option value={AppointmentStatus.SAMPLE_COLLECTED}>Sample Collected</option>
                           <option value={AppointmentStatus.REPORT_READY}>Report Ready</option>
                           <option value={AppointmentStatus.COMPLETED}>Completed</option>
                         </select>
                         
                         <button 
                           onClick={() => {
                             updateAppointmentStatus(apt.id, AppointmentStatus.REPORT_READY);
                             navigate(`/report/${apt.id}`);
                           }}
                           className="text-blue-600 hover:text-blue-900 text-xs flex items-center gap-1 font-medium"
                         >
                           <FileText className="w-3 h-3" /> Generate Report
                         </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'tests' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 sticky top-24">
              <h3 className="text-lg font-bold mb-4">{isEditing ? 'Edit Test' : 'Add New Test'}</h3>
              <form onSubmit={handleSubmitTest} className="space-y-4">
                <div>
                   <label className="block text-sm font-medium text-gray-700">Test Name</label>
                   <input type="text" className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                     value={testForm.name} onChange={e => setTestForm({...testForm, name: e.target.value})} required
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                   <input type="number" className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 border p-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                     value={testForm.price} onChange={e => setTestForm({...testForm, price: parseInt(e.target.value)})} required
                   />
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Category</label>
                   <select className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 border p-2 shadow-sm"
                     value={testForm.category} onChange={e => setTestForm({...testForm, category: e.target.value as any})}
                   >
                     <option value="Blood">Blood</option>
                     <option value="Urine">Urine</option>
                     <option value="Imaging">Imaging</option>
                     <option value="Checkup">Checkup</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-medium text-gray-700">Description</label>
                   <textarea className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 border p-2 shadow-sm"
                     value={testForm.description} onChange={e => setTestForm({...testForm, description: e.target.value})} required
                   />
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700">Preparation Info</label>
                   <input type="text" className="mt-1 block w-full bg-white text-gray-900 rounded-md border-gray-300 border p-2 shadow-sm"
                     value={testForm.preparation} onChange={e => setTestForm({...testForm, preparation: e.target.value})}
                   />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="flex-1 flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    {isEditing ? <><Check className="w-4 h-4 mr-2" /> Update</> : <><Plus className="w-4 h-4 mr-2" /> Add</>}
                  </button>
                  {isEditing && (
                    <button type="button" onClick={resetForm} className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500">
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
             {tests.map(test => (
               <div key={test.id} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex justify-between items-center group hover:shadow-md transition-all">
                 <div className="flex-grow">
                    <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{test.name}</h4>
                    <p className="text-sm text-gray-500">{test.category} • ₹{test.price}</p>
                 </div>
                 <div className="flex items-center gap-2">
                   <button 
                     onClick={() => handleEditClick(test)}
                     className="text-blue-600 hover:bg-blue-50 p-2 rounded-full transition-colors"
                     title="Edit Test"
                   >
                     <Pencil className="w-4 h-4" />
                   </button>
                   <button 
                     onClick={() => deleteTest(test.id)} 
                     className="text-red-600 hover:bg-red-50 p-2 rounded-full transition-colors"
                     title="Delete Test"
                   >
                     <Trash2 className="w-4 h-4" />
                   </button>
                 </div>
               </div>
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;