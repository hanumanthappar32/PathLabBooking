import React from 'react';
import { Appointment } from '../types';
import { TestTube2, Printer } from 'lucide-react';

interface ReportViewProps {
  appointment: Appointment;
}

const ReportView: React.FC<ReportViewProps> = ({ appointment }) => {
  const handlePrint = () => {
    window.print();
  };

  const currentDate = new Date().toLocaleDateString('en-GB');

  // Mock Result Generator based on test name
  const getMockResults = (testName: string) => {
    if (testName.includes('Blood Count') || testName.includes('CBC')) {
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-2">Test Description</th>
              <th className="text-center py-2">Result</th>
              <th className="text-center py-2">Units</th>
              <th className="text-right py-2">Reference Range</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 font-medium">Hemoglobin</td>
              <td className="text-center py-2 font-bold">13.5</td>
              <td className="text-center py-2">g/dL</td>
              <td className="text-right py-2">13.0 - 17.0</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Total WBC Count</td>
              <td className="text-center py-2 font-bold">7,500</td>
              <td className="text-center py-2">cells/cumm</td>
              <td className="text-right py-2">4,000 - 11,000</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Platelet Count</td>
              <td className="text-center py-2 font-bold">2.5</td>
              <td className="text-center py-2">lakhs/cumm</td>
              <td className="text-right py-2">1.5 - 4.5</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">RBC Count</td>
              <td className="text-center py-2 font-bold">4.8</td>
              <td className="text-center py-2">mill/cumm</td>
              <td className="text-right py-2">4.5 - 5.5</td>
            </tr>
          </tbody>
        </table>
      );
    } else if (testName.includes('Sugar') || testName.includes('Glucose') || testName.includes('HbA1c')) {
      return (
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b-2 border-gray-800">
              <th className="text-left py-2">Investigation</th>
              <th className="text-center py-2">Observed Value</th>
              <th className="text-center py-2">Units</th>
              <th className="text-right py-2">Biological Ref. Interval</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            <tr>
              <td className="py-2 font-medium">HbA1c (Glycosylated Hb)</td>
              <td className="text-center py-2 font-bold text-red-600">6.8</td>
              <td className="text-center py-2">%</td>
              <td className="text-right py-2">Non-Diabetic: &lt; 5.7</td>
            </tr>
            <tr>
              <td className="py-2 font-medium">Estimated Avg Glucose</td>
              <td className="text-center py-2 font-bold">148</td>
              <td className="text-center py-2">mg/dL</td>
              <td className="text-right py-2">-</td>
            </tr>
          </tbody>
        </table>
      );
    } else {
      return (
        <div className="p-8 text-center text-gray-500 italic border border-dashed rounded-lg">
          Detailed results for <strong>{testName}</strong> are attached in the supplemental pages. 
          <br/>(This is a generic template for demonstration).
        </div>
      );
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-4 md:p-8 print:p-0 print:bg-white">
      {/* Print Button - Hidden when printing */}
      <div className="max-w-[210mm] mx-auto mb-6 flex justify-end print:hidden">
        <button 
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm font-medium transition-colors"
        >
          <Printer className="w-4 h-4" /> Print Report
        </button>
      </div>

      {/* A4 Paper Simulation */}
      <div className="max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-xl print:shadow-none p-[15mm] flex flex-col relative text-gray-900">
        
        {/* Header */}
        <div className="border-b-2 border-blue-600 pb-6 mb-8 flex justify-between items-start">
          <div className="flex items-center gap-3">
             <div className="bg-blue-600 p-2 rounded-lg print:hidden">
               <TestTube2 className="h-8 w-8 text-white" />
             </div>
             <div>
               <h1 className="text-3xl font-bold text-gray-900 tracking-tight leading-none text-blue-900">Ravi Diagnostic Lab</h1>
               <p className="text-sm text-gray-500 mt-1">Advanced Pathology & Diagnostics</p>
             </div>
          </div>
          <div className="text-right text-xs text-gray-500">
            <p>123 Health Avenue, Medical District</p>
            <p>Bangalore, Karnataka - 560001</p>
            <p>Ph: +91 98765 43210 | ravi-lab.com</p>
          </div>
        </div>

        {/* Patient Details Grid */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8 text-sm">
          <div className="grid grid-cols-2 gap-y-3 gap-x-8">
            <div className="flex">
              <span className="text-gray-500 w-24">Patient Name:</span>
              <span className="font-bold uppercase">{appointment.user.name}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">Sample ID:</span>
              <span className="font-mono">{appointment.id}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">Age / Sex:</span>
              <span>{appointment.user.age} Y / M</span>
            </div>
             <div className="flex">
              <span className="text-gray-500 w-24">Date:</span>
              <span>{currentDate}</span>
            </div>
            <div className="flex">
              <span className="text-gray-500 w-24">Ref. By:</span>
              <span>Self</span>
            </div>
             <div className="flex">
              <span className="text-gray-500 w-24">Status:</span>
              <span className="uppercase font-bold text-green-700">Final Report</span>
            </div>
          </div>
        </div>

        {/* Report Content */}
        <div className="mb-12 flex-grow">
          <h2 className="text-center font-bold text-xl uppercase border-b border-gray-300 pb-2 mb-6">
            {appointment.testName}
          </h2>
          
          {getMockResults(appointment.testName)}
        </div>

        {/* Footer / Signature */}
        <div className="mt-auto pt-8 border-t border-gray-200">
           <div className="flex justify-between items-end mb-4">
             <div className="text-center">
               <div className="h-12 mb-1 flex items-end justify-center">
                 <span className="font-script text-2xl text-blue-800">Dr. Sharma</span>
               </div>
               <p className="text-xs font-bold border-t border-gray-400 pt-1 w-32 mx-auto">Dr. A. Sharma</p>
               <p className="text-[10px] text-gray-500">MD, Pathology</p>
             </div>
             <div className="text-center">
               <div className="h-12 mb-1 flex items-end justify-center">
                  <img src="https://api.dicebear.com/7.x/initials/svg?seed=Ravi" className="h-10 opacity-50 grayscale" alt="sig" />
               </div>
               <p className="text-xs font-bold border-t border-gray-400 pt-1 w-32 mx-auto">Lab Technician</p>
               <p className="text-[10px] text-gray-500">Verified By</p>
             </div>
           </div>
           
           <p className="text-[10px] text-gray-400 text-center">
             This is a computer generated report and does not require a physical signature. 
             Test results relate only to the items tested.
           </p>
        </div>

      </div>
    </div>
  );
};

export default ReportView;