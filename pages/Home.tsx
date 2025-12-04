import React, { useState } from 'react';
import { useLab } from '../context/LabContext';
import TestCard from '../components/TestCard';
import { Search, Sparkles, X } from 'lucide-react';
import { getAIRecommendations } from '../services/geminiService';

const Home: React.FC = () => {
  const { tests } = useLab();
  const [searchTerm, setSearchTerm] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [recommendedIds, setRecommendedIds] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const handleAIAnalysis = async () => {
    if (!symptoms.trim()) return;
    setIsAnalyzing(true);
    try {
      const ids = await getAIRecommendations(symptoms, tests);
      setRecommendedIds(ids);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const categories = ['All', ...Array.from(new Set(tests.map(t => t.category)))];

  const filteredTests = tests.filter(test => {
    const matchesSearch = test.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          test.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || test.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Sort tests: Recommended first, then by popularity
  const sortedTests = [...filteredTests].sort((a, b) => {
    const isARec = recommendedIds.includes(a.id);
    const isBRec = recommendedIds.includes(b.id);
    if (isARec && !isBRec) return -1;
    if (!isARec && isBRec) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen pb-12">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16 px-4 mb-8">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">World-Class Pathology at Home</h1>
          <p className="text-blue-100 text-lg mb-8">Book trusted lab tests with sample collection from your doorstep.</p>
          
          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto">
            <input
              type="text"
              placeholder="Search for tests (e.g. Thyroid, CBC)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-4 pl-12 pr-4 rounded-full text-gray-900 shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-400/50"
            />
            <Search className="absolute left-4 top-4 text-gray-400 h-6 w-6" />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* AI Symptom Checker Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8 mb-10">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="text-purple-600 w-5 h-5" />
            <h2 className="text-lg font-bold text-gray-800">Not sure what to book?</h2>
          </div>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Describe your symptoms (e.g., feeling tired, sudden weight gain...)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleAIAnalysis}
              disabled={isAnalyzing || !symptoms}
              className="bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2 min-w-[160px]"
            >
              {isAnalyzing ? (
                <span className="animate-pulse">Analyzing...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> Suggest Tests
                </>
              )}
            </button>
          </div>
          {recommendedIds.length > 0 && (
            <div className="mt-4 flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-lg border border-green-200">
               <span>We found tests matching your symptoms! Look for the "Recommended" tag below.</span>
               <button onClick={() => setRecommendedIds([])} className="ml-auto text-green-800 hover:underline text-xs">Clear</button>
            </div>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex overflow-x-auto pb-4 gap-2 mb-6 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                categoryFilter === cat 
                  ? 'bg-slate-900 text-white' 
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Tests Grid */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">Available Health Packages</h2>
        {sortedTests.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTests.map(test => (
              <TestCard 
                key={test.id} 
                test={test} 
                recommended={recommendedIds.includes(test.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No tests found matching your criteria.</p>
            <button 
              onClick={() => {setSearchTerm(''); setCategoryFilter('All');}}
              className="mt-2 text-blue-600 font-medium hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;