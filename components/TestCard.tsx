import React from 'react';
import { LabTest } from '../types';
import { Clock, Info, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TestCardProps {
  test: LabTest;
  recommended?: boolean;
}

const TestCard: React.FC<TestCardProps> = ({ test, recommended }) => {
  const navigate = useNavigate();

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${recommended ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200'} p-5 flex flex-col h-full hover:shadow-md transition-shadow`}>
      {recommended && (
        <div className="mb-3 -mt-2 -ml-2">
          <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full flex items-center w-fit gap-1">
            <CheckCircle2 className="w-3 h-3" /> Recommended
          </span>
        </div>
      )}
      
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{test.name}</h3>
        <span className="text-lg font-bold text-blue-600 whitespace-nowrap">₹{test.price}</span>
      </div>
      
      <p className="text-gray-500 text-sm mb-4 flex-grow line-clamp-3">{test.description}</p>
      
      <div className="space-y-2 mb-5">
        <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <Clock className="w-3 h-3 mr-2 text-gray-400" />
          <span>Report in {test.turnaroundTime}</span>
        </div>
        <div className="flex items-center text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <Info className="w-3 h-3 mr-2 text-gray-400" />
          <span className="line-clamp-1">{test.preparation}</span>
        </div>
      </div>
      
      <button 
        onClick={() => navigate(`/book/${test.id}`)}
        className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-2.5 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        Book Appointment
      </button>
    </div>
  );
};

export default TestCard;