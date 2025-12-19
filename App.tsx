
import React, { useState } from 'react';
import { analyzeInstagramProfile } from './services/geminiService';
import { BusinessAnalysis, GroundingSource } from './types';
import AnalysisDisplay from './components/AnalysisDisplay';
import { Search, Instagram, Loader2, AlertCircle, ExternalLink } from 'lucide-react';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{ analysis: BusinessAnalysis; sources: GroundingSource[] } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.includes('instagram.com/')) {
      setError('Please enter a valid Instagram profile URL (e.g., instagram.com/username)');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeInstagramProfile(url);
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError('Failed to analyze profile. Please ensure the profile is public or try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <nav className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg insta-gradient flex items-center justify-center">
              <Instagram className="text-white w-5 h-5" />
            </div>
            <span className="font-bold text-xl tracking-tight">InstaBiz Analyst</span>
          </div>
          <div className="hidden md:block text-sm text-gray-500 font-medium">
            AI-Powered Business Intelligence
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">
            Unlock Insights from Any Profile
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Paste an Instagram business profile URL to understand their strategy and generate the perfect introduction message.
          </p>
        </div>

        {/* Input Form */}
        <div className="max-w-3xl mx-auto mb-12">
          <form onSubmit={handleSubmit} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400 group-focus-within:text-pink-500 transition-colors" />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/nike/"
              className="block w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-2xl shadow-sm focus:ring-2 focus:ring-pink-500 focus:border-pink-500 transition-all text-gray-900"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="absolute right-2 top-2 bottom-2 px-6 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Analyzing...</span>
                </>
              ) : (
                <span>Analyze</span>
              )}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start space-x-3 text-red-700">
              <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}
        </div>

        {/* Loading Skeleton or Result */}
        {loading && (
          <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
            <div className="h-64 bg-gray-200 rounded-3xl" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-48 bg-gray-200 rounded-3xl" />
              <div className="h-48 bg-gray-200 rounded-3xl" />
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-12">
            <AnalysisDisplay analysis={result.analysis} />
            
            {/* Grounding Sources */}
            {result.sources.length > 0 && (
              <div className="mt-12">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Analysis Sources
                </h3>
                <div className="flex flex-wrap gap-3">
                  {result.sources.map((source, idx) => (
                    source.web && (
                      <a
                        key={idx}
                        href={source.web.uri}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-white border border-gray-200 rounded-full text-sm text-gray-700 hover:border-pink-300 hover:text-pink-600 transition-all shadow-sm flex items-center space-x-2"
                      >
                        <span className="truncate max-w-[200px]">{source.web.title}</span>
                      </a>
                    )
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial Empty State */}
        {!loading && !result && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            {[
              { title: 'Audience Insights', desc: 'Understand who they serve and how to speak their language.', icon: '👥' },
              { title: 'Brand Analysis', desc: 'Identify their value prop and tone of voice in seconds.', icon: '✨' },
              { title: 'Drafting Pro', desc: 'Get ready-to-send messages for high engagement.', icon: '💬' },
            ].map((feature, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="text-3xl mb-4">{feature.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="mt-24 border-t py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Powered by Gemini 3 Pro & Google Search Grounding.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
