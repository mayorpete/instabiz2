
import React, { useState } from 'react';
import { BusinessAnalysis } from '../types';
import { Briefcase, Target, Zap, MessageSquare, Copy, Check, Info } from 'lucide-react';

interface Props {
  analysis: BusinessAnalysis;
}

const AnalysisDisplay: React.FC<Props> = ({ analysis }) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header Info */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h2 className="text-3xl font-bold text-gray-900">{analysis.name}</h2>
              <span className="px-3 py-1 bg-pink-50 text-pink-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {analysis.category}
              </span>
            </div>
            <p className="text-gray-500">Business Strategy Overview</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <section className="flex items-start space-x-4">
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Target Audience</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{analysis.targetAudience}</p>
              </div>
            </section>

            <section className="flex items-start space-x-4">
              <div className="p-3 bg-purple-50 rounded-xl text-purple-600">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Value Proposition</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{analysis.valueProposition}</p>
              </div>
            </section>
          </div>

          <div className="space-y-6">
            <section className="flex items-start space-x-4">
              <div className="p-3 bg-orange-50 rounded-xl text-orange-600">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Brand Voice</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{analysis.brandVoice}</p>
              </div>
            </section>

            <section className="flex items-start space-x-4">
              <div className="p-3 bg-green-50 rounded-xl text-green-600">
                <Briefcase className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900 mb-1">Core Services</h3>
                <div className="flex flex-wrap gap-2 mt-2">
                  {analysis.keyServices.map((service, i) => (
                    <span key={i} className="px-2.5 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg">
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Intro Messages Section */}
      <div className="space-y-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Outreach Message Drafts</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {(Object.keys(analysis.suggestedMessages) as Array<keyof typeof analysis.suggestedMessages>).map((type) => (
            <div key={type} className="group relative bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:border-pink-200 transition-all">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">{type}</h3>
                <button
                  // Fix: Casting 'type' to string to fix TS error: Argument of type 'string | number | symbol' is not assignable to parameter of type 'string'
                  onClick={() => copyToClipboard(analysis.suggestedMessages[type], String(type))}
                  className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                >
                  {copiedKey === type ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <p className="text-gray-800 italic leading-relaxed">
                "{analysis.suggestedMessages[type]}"
              </p>
              <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-gray-400 font-medium uppercase">Ready to send</span>
                <span 
                  className="text-[10px] text-pink-500 font-bold uppercase cursor-pointer hover:underline" 
                  // Fix: Casting 'type' to string to fix TS error: Argument of type 'string | number | symbol' is not assignable to parameter of type 'string'
                  onClick={() => copyToClipboard(analysis.suggestedMessages[type], String(type))}
                >
                  Copy Text
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
