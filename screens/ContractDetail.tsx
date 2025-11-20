import React, { useState, useEffect, useRef } from 'react';
import { Contract, RiskLevel } from '../types';
import { Button } from '../components/Button';
import { RiskBadge } from '../components/RiskBadge';
import { ArrowLeft, Sparkles, FileText, TrendingUp, AlertOctagon, Clock, CheckCircle, Send } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ContractDetailProps {
  contract: Contract;
  onBack: () => void;
  onGenerateBrief: () => void;
}

export const ContractDetail: React.FC<ContractDetailProps> = ({ contract, onBack, onGenerateBrief }) => {
  const [messages, setMessages] = useState<any[]>([
    { type: 'ai', text: `Reviewing contract details for **${contract.vendorName}**...` },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Mock Performance Data
  const performanceData = [
    { month: 'Jan', uptime: 99.9, incidents: 0 },
    { month: 'Feb', uptime: 99.5, incidents: 1 },
    { month: 'Mar', uptime: 99.8, incidents: 0 },
    { month: 'Apr', uptime: 99.2, incidents: 2 }, // Dip
    { month: 'May', uptime: 99.1, incidents: 1 },
    { month: 'Jun', uptime: 99.9, incidents: 0 },
  ];

  useEffect(() => {
    // Simulate AI analysis on load
    const timeout = setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { 
          type: 'ai', 
          text: `If you do nothing, this contract **auto-renews on ${contract.renewalDate}** for another ${contract.term} with a **${contract.uplift} annual price uplift**. 
          
Vendor has missed the uptime SLA ${contract.slaBreaches} times in the last 9 months. Data-processing terms don’t match your 2025 policy.`
        }
      ]);
    }, 1500);
    return () => clearTimeout(timeout);
  }, [contract]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      {/* Breadcrumb / Back */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white flex items-center gap-2">
        <button onClick={onBack} className="text-gray-500 hover:text-sirion-midnight flex items-center gap-1 text-sm font-medium transition-colors">
          <ArrowLeft size={16} /> Back to Radar
        </button>
        <span className="text-gray-300">|</span>
        <span className="text-gray-700 font-medium">{contract.vendorName}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* LEFT COLUMN: Context & Performance (Scrollable) */}
        <div className="flex-[2] overflow-y-auto bg-sirion-cloud p-6 border-r border-gray-200">
          
          {/* Header Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
             <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-sirion-midnight">{contract.contractName}</h1>
                  <div className="text-gray-500 mt-1 flex items-center gap-2 text-sm">
                    <span>ID: {contract.id.toUpperCase()}</span>
                    <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                    <span>Vendor: <span className="text-sirion-teal font-medium">{contract.vendorName}</span></span>
                  </div>
                </div>
                <div className="text-right">
                   <div className="text-2xl font-bold text-sirion-midnight">{contract.value}</div>
                   <div className="text-xs text-gray-500">Annual Contract Value</div>
                </div>
             </div>

             <div className="flex flex-wrap gap-2 mb-6">
                {contract.type === 'Auto-renew' && <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-md font-medium border border-purple-200">Auto-renew</span>}
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md font-medium border border-gray-200">Notice by: {contract.noticePeriod}</span>
                <RiskBadge level={contract.commercialRisk} />
                {contract.slaBreaches > 2 && <span className="px-2 py-1 bg-red-50 text-red-700 text-xs rounded-md font-medium border border-red-100">Underperforming Vendor</span>}
             </div>
          </div>

          {/* Contract Snapshot Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
             {/* Contract Terms */}
             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                   <Clock size={16} className="text-sirion-lilac" />
                   <h3 className="font-bold text-sirion-midnight text-sm uppercase tracking-wide">Contract Snapshot</h3>
                </div>
                <div className="space-y-3 text-sm">
                   <div className="flex justify-between">
                      <span className="text-gray-500">Current Term</span>
                      <span className="font-medium text-gray-800">{contract.term}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-gray-500">Renewal Date</span>
                      <span className="font-medium text-gray-800">{contract.renewalDate}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-gray-500">Notice Deadline</span>
                      <span className="font-medium text-amber-600 font-bold">{new Date(new Date(contract.renewalDate).getTime() - 90*24*60*60*1000).toISOString().split('T')[0]}</span>
                   </div>
                   <div className="flex justify-between">
                      <span className="text-gray-500">Price Uplift</span>
                      <span className="font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded">{contract.uplift}</span>
                   </div>
                </div>
             </div>

             {/* Performance Chart */}
             <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                   <TrendingUp size={16} className="text-sirion-lilac" />
                   <h3 className="font-bold text-sirion-midnight text-sm uppercase tracking-wide">SLA Performance (Uptime)</h3>
                </div>
                <div className="h-32 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={performanceData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                      <YAxis domain={[98, 100]} axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#9ca3af'}} />
                      <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} itemStyle={{fontSize: '12px'}} />
                      <Line type="monotone" dataKey="uptime" stroke="#0D5E68" strokeWidth={2} dot={{fill: '#0D5E68', r: 3}} activeDot={{r: 5}} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-xs text-center mt-2 text-red-500 font-medium">
                   {contract.slaBreaches} Critical Incidents recorded in current term
                </div>
             </div>
          </div>
          
          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-200">
             <h3 className="font-bold text-sirion-midnight text-sm mb-3">Risk Details</h3>
             <p className="text-sm text-gray-600 leading-relaxed">{contract.riskReason}. Additionally, market benchmark indicates current pricing is 12% above median for this volume tier.</p>
          </div>

        </div>

        {/* RIGHT COLUMN: Copilot (Fixed Height) */}
        <div className="flex-1 bg-white border-l border-gray-200 flex flex-col min-w-[350px] max-w-[450px]">
          {/* Copilot Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-white">
             <div className="flex items-center gap-2 text-sirion-teal font-bold">
                <Sparkles size={18} />
                <h2>Renewal Copilot</h2>
             </div>
          </div>

          {/* Chat/Content Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/30">
             
             {/* Initial AI Message */}
             {messages.map((msg, i) => (
               <div key={i} className={`flex gap-3 animate-fadeIn`}>
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-sirion-lilac to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-md">
                    <Sparkles size={14} />
                  </div>
                  <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-sm text-gray-700 leading-relaxed">
                     {msg.text.split('\n').map((line: string, idx: number) => (
                       <p key={idx} className="mb-2 last:mb-0" dangerouslySetInnerHTML={{ 
                         __html: line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') 
                       }} />
                     ))}
                  </div>
               </div>
             ))}

             {/* Recommended Strategy Section */}
             {!isTyping && messages.length > 1 && (
               <div className="pl-11 animate-fadeIn">
                 <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3">Recommended Strategy</h3>
                 
                 <div className="space-y-3">
                    <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-sirion-lilac hover:shadow-md transition-all cursor-pointer group" onClick={onGenerateBrief}>
                       <div className="flex items-center gap-2 font-semibold text-sirion-midnight text-sm mb-1 group-hover:text-sirion-teal">
                          <TrendingUp size={16} className="text-sirion-teal" />
                          Renegotiate Pricing
                       </div>
                       <p className="text-xs text-gray-500">Leverage uptime failures to waive the {contract.uplift} uplift and lock in current rates.</p>
                    </div>

                    <div className="bg-white p-3 rounded-lg border border-gray-200 hover:border-sirion-lilac hover:shadow-md transition-all cursor-pointer group">
                       <div className="flex items-center gap-2 font-semibold text-sirion-midnight text-sm mb-1 group-hover:text-sirion-teal">
                          <FileText size={16} className="text-sirion-teal" />
                          Update DPA Terms
                       </div>
                       <p className="text-xs text-gray-500">Bring data processing addendum in line with new 2025 security policies.</p>
                    </div>
                 </div>
               </div>
             )}
             <div ref={chatEndRef} />
          </div>

          {/* Action Footer */}
          <div className="p-4 border-t border-gray-200 bg-white">
             <div className="flex flex-col gap-3">
                <Button onClick={onGenerateBrief} className="w-full justify-between">
                   Generate Negotiation Brief <Sparkles size={16} />
                </Button>
                <Button variant="outline" className="w-full justify-between">
                   Draft Non-Renewal Notice <FileText size={16} />
                </Button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};