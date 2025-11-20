import React, { useState, useEffect } from 'react';
import { Contract } from '../types';
import { generateNegotiationBrief } from '../services/geminiService';
import { X, Download, Copy, Edit3, Loader2 } from 'lucide-react';
import { Button } from '../components/Button';
import ReactMarkdown from 'react-markdown';

interface DraftModalProps {
  contract: Contract;
  onClose: () => void;
}

export const DraftModal: React.FC<DraftModalProps> = ({ contract, onClose }) => {
  const [content, setContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDraft = async () => {
      setLoading(true);
      const text = await generateNegotiationBrief(contract);
      setContent(text);
      setLoading(false);
    };
    fetchDraft();
  }, [contract]);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col animate-fadeIn overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div>
            <h2 className="text-lg font-bold text-sirion-midnight flex items-center gap-2">
              <div className="w-6 h-6 bg-gradient-to-br from-sirion-teal to-teal-600 rounded-md flex items-center justify-center text-white text-xs">AI</div>
              Negotiation Strategy Brief
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">Generated for {contract.contractName}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-200">
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Document Preview Area */}
          <div className="flex-1 bg-gray-100 p-8 overflow-y-auto">
            <div className="bg-white shadow-lg min-h-full max-w-3xl mx-auto p-12 rounded-sm border border-gray-200">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-64 space-y-4">
                  <Loader2 size={40} className="animate-spin text-sirion-teal" />
                  <p className="text-gray-500 font-medium">Generating strategy based on contract analysis...</p>
                </div>
              ) : (
                <div className="prose prose-sm max-w-none font-serif text-gray-800">
                   <ReactMarkdown 
                    components={{
                      h1: ({node, ...props}) => <h1 className="text-2xl font-bold text-sirion-midnight mb-6 pb-2 border-b border-gray-200" {...props} />,
                      h2: ({node, ...props}) => <h2 className="text-xl font-semibold text-sirion-midnight mt-6 mb-3" {...props} />,
                      h3: ({node, ...props}) => <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2" {...props} />,
                      p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                      ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-4 space-y-2" {...props} />,
                      li: ({node, ...props}) => <li className="text-gray-700" {...props} />,
                    }}
                   >
                     {content}
                   </ReactMarkdown>
                </div>
              )}
            </div>
          </div>

          {/* Right Context Sidebar */}
          <div className="w-80 bg-white border-l border-gray-200 p-6 overflow-y-auto hidden lg:block">
             <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Source Context</h3>
             
             <div className="space-y-4">
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="text-xs text-gray-500 mb-1">Contract Value</div>
                   <div className="font-bold text-sirion-midnight">{contract.value}</div>
                </div>
                
                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="text-xs text-gray-500 mb-1">Renewal Date</div>
                   <div className="font-bold text-sirion-midnight">{contract.renewalDate}</div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="text-xs text-gray-500 mb-1">Key Clause Cited</div>
                   <div className="font-semibold text-sirion-midnight text-sm">Auto-Renewal & Pricing</div>
                   <p className="text-xs text-gray-600 mt-1 italic">"Section 4.2: ...price shall increase by {contract.uplift} upon each renewal term..."</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                   <div className="text-xs text-gray-500 mb-1">Performance Data</div>
                   <div className="font-semibold text-sirion-midnight text-sm">SLA Breaches</div>
                   <p className="text-xs text-gray-600 mt-1">{contract.slaBreaches} incidents in current term (Source: Jira Integration)</p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-gray-200 bg-white flex justify-end gap-3">
          <Button variant="outline" icon={<Edit3 size={16}/>}>Edit Draft</Button>
          <Button variant="outline" icon={<Download size={16}/>}>Download DOCX</Button>
          <Button variant="primary" icon={<Copy size={16}/>}>Copy to Clipboard</Button>
        </div>
      </div>
    </div>
  );
};