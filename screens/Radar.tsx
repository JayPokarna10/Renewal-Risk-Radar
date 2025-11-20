import React, { useState, useMemo, useRef } from 'react';
import { contracts } from '../mockData';
import { RiskBadge } from '../components/RiskBadge';
import { Contract, RiskLevel } from '../types';
import { Filter, ChevronRight, AlertTriangle, DollarSign, FileCheck, XCircle } from 'lucide-react';
import { PieChart as RePie, Pie, Cell, ResponsiveContainer } from 'recharts';

interface RadarProps {
  onSelectContract: (contract: Contract) => void;
}

type FilterType = 'ALL' | 'HIGH_RISK' | 'DPA' | 'SPEND';

export const Radar: React.FC<RadarProps> = ({ onSelectContract }) => {
  // Filter States
  const [daysFilter, setDaysFilter] = useState<number>(90);
  const [regionFilter, setRegionFilter] = useState<string>('All Regions');
  const [activeTileFilter, setActiveTileFilter] = useState<FilterType>('ALL');
  
  const tableRef = useRef<HTMLDivElement>(null);

  // Helper to handle tile clicks
  const handleTileClick = (type: FilterType) => {
    if (activeTileFilter === type) {
      setActiveTileFilter('ALL');
    } else {
      setActiveTileFilter(type);
      // Smooth scroll to table to show effect
      setTimeout(() => {
        tableRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  // Derived Data
  const filteredContracts = useMemo(() => {
    return contracts.filter(contract => {
      // 1. Time Filter
      if (contract.daysRemaining > daysFilter) return false;

      // 2. Region Filter
      if (regionFilter !== 'All Regions' && contract.region !== regionFilter) return false;

      // 3. Tile/Category Filter
      if (activeTileFilter === 'HIGH_RISK') {
        return contract.commercialRisk === RiskLevel.High || contract.complianceRisk === RiskLevel.High;
      }
      if (activeTileFilter === 'DPA') {
        // Check compliance risk OR if "DPA" is mentioned in the risk reason
        return contract.complianceRisk === RiskLevel.High || contract.riskReason.toLowerCase().includes('dpa');
      }
      // 'SPEND' acts as a "Show All within Time/Region" but highlights financial context in user's mind
      return true;
    });
  }, [daysFilter, regionFilter, activeTileFilter]);

  // Chart Data based on filtered results
  const riskCounts = useMemo(() => {
    const counts = { High: 0, Medium: 0, Low: 0 };
    filteredContracts.forEach(c => {
      // Prioritize High risk if either is high
      if (c.commercialRisk === RiskLevel.High || c.complianceRisk === RiskLevel.High) {
        counts.High++;
      } else if (c.commercialRisk === RiskLevel.Medium || c.complianceRisk === RiskLevel.Medium) {
        counts.Medium++;
      } else {
        counts.Low++;
      }
    });
    return [
      { name: 'High', value: counts.High, color: '#EF4444' },
      { name: 'Medium', value: counts.Medium, color: '#F59E0B' },
      { name: 'Low', value: counts.Low, color: '#10B981' },
    ];
  }, [filteredContracts]);

  // Summary Metrics - These should remain stable based on the *Global* filter (Time/Region)
  // so users see what makes up the "Quarter at a Glance" regardless of which tile they clicked.
  const contextContracts = useMemo(() => {
    return contracts.filter(c => 
      c.daysRemaining <= daysFilter && 
      (regionFilter === 'All Regions' || c.region === regionFilter)
    );
  }, [daysFilter, regionFilter]);

  const metrics = useMemo(() => {
    let highRisk = 0;
    let dpaIssues = 0;
    let totalSpend = 0;

    contextContracts.forEach(c => {
      if (c.commercialRisk === RiskLevel.High || c.complianceRisk === RiskLevel.High) highRisk++;
      if (c.complianceRisk === RiskLevel.High || c.riskReason.toLowerCase().includes('dpa')) dpaIssues++;
      
      const valMatch = c.value.match(/[\d\.]+/);
      if (valMatch) {
        let val = parseFloat(valMatch[0]);
        if (c.value.includes('K')) val = val / 1000;
        totalSpend += val;
      }
    });

    return { highRisk, dpaIssues, totalSpend: totalSpend.toFixed(1) };
  }, [contextContracts]);


  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 min-h-[calc(100vh-64px)] animate-fadeIn">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Header & Filters */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-sirion-midnight">Renewal Risk Radar</h1>
            <p className="text-gray-500 mt-1">Upcoming auto-renewals ranked by commercial and compliance risk.</p>
          </div>
          
          <div className="flex gap-2">
             <div className="relative">
                <select 
                  value={daysFilter}
                  onChange={(e) => setDaysFilter(Number(e.target.value))}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sirion-lilac text-sm font-medium cursor-pointer"
                >
                  <option value={30}>Next 30 Days</option>
                  <option value={60}>Next 60 Days</option>
                  <option value={90}>Next 90 Days</option>
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <Filter size={14} className="text-gray-400" />
                </div>
             </div>
             <div className="relative">
                <select 
                  value={regionFilter}
                  onChange={(e) => setRegionFilter(e.target.value)}
                  className="appearance-none bg-white border border-gray-200 text-gray-700 py-2 pl-4 pr-10 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-sirion-lilac text-sm font-medium cursor-pointer"
                >
                  <option>All Regions</option>
                  <option>EMEA</option>
                  <option>NA</option>
                  <option>APAC</option>
                </select>
                <div className="absolute right-3 top-2.5 pointer-events-none">
                  <Filter size={14} className="text-gray-400" />
                </div>
             </div>
          </div>
        </div>

        {/* Active Filters Badge Display */}
        <div className="min-h-[32px] flex items-center">
          {activeTileFilter !== 'ALL' ? (
            <div className="flex items-center gap-2 animate-fadeIn">
              <span className="text-sm text-gray-500">Showing:</span>
              <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full font-medium text-sm shadow-sm transition-colors
                ${activeTileFilter === 'HIGH_RISK' ? 'bg-red-100 text-red-800 border border-red-200' : ''}
                ${activeTileFilter === 'DPA' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' : ''}
                ${activeTileFilter === 'SPEND' ? 'bg-teal-100 text-teal-800 border border-teal-200' : ''}
              `}>
                {activeTileFilter === 'HIGH_RISK' && <><AlertTriangle size={14}/> High Risk Renewals</>}
                {activeTileFilter === 'DPA' && <><FileCheck size={14}/> Non-compliant DPAs</>}
                {activeTileFilter === 'SPEND' && <><DollarSign size={14}/> All Spend Context</>}
                <button onClick={() => setActiveTileFilter('ALL')} className="ml-2 hover:text-black/50 rounded-full p-0.5 hover:bg-black/5 transition-colors">
                  <XCircle size={16} />
                </button>
              </div>
            </div>
          ) : (
             <div className="text-sm text-gray-400 italic">Select a tile on the right to filter issues.</div>
          )}
        </div>

        {/* Data Table */}
        <div ref={tableRef} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col transition-all duration-300">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                  <th className="p-4">Vendor / Contract</th>
                  <th className="p-4">Renewal Date</th>
                  <th className="p-4">Value (ACV)</th>
                  <th className="p-4">Comm. Risk</th>
                  <th className="p-4">Comp. Risk</th>
                  <th className="p-4 w-1/3">Risk Drivers</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {filteredContracts.length > 0 ? (
                  filteredContracts.map((contract) => (
                    <tr 
                      key={contract.id} 
                      onClick={() => onSelectContract(contract)}
                      className="border-b border-gray-50 hover:bg-sirion-cloud/50 transition-colors cursor-pointer group animate-fadeIn"
                    >
                      <td className="p-4">
                        <div className="font-bold text-sirion-midnight">{contract.vendorName}</div>
                        <div className="text-gray-500 text-xs mt-0.5 flex gap-1 items-center">
                          <span className="px-1.5 py-0.5 bg-gray-100 rounded text-[10px]">{contract.region}</span>
                          {contract.contractName}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="text-gray-900 font-medium">{contract.renewalDate}</div>
                        <div className={`text-xs font-medium mt-0.5 ${contract.daysRemaining < 30 ? 'text-red-600 font-bold' : contract.daysRemaining < 60 ? 'text-amber-600' : 'text-emerald-600'}`}>
                          in {contract.daysRemaining} days
                        </div>
                      </td>
                      <td className="p-4 font-medium text-gray-700">
                        {contract.value}
                      </td>
                      <td className="p-4">
                        <RiskBadge level={contract.commercialRisk} />
                      </td>
                      <td className="p-4">
                        <RiskBadge level={contract.complianceRisk} />
                      </td>
                      <td className="p-4 text-gray-600 text-xs leading-relaxed">
                        {contract.riskReason}
                      </td>
                      <td className="p-4 text-right">
                        <button className="text-sirion-teal opacity-0 group-hover:opacity-100 transition-opacity font-medium text-sm flex items-center gap-1 ml-auto">
                          View Details <ChevronRight size={14} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-12 text-center">
                      <div className="flex flex-col items-center text-gray-400 gap-2">
                        <FileCheck size={32} className="text-gray-300"/>
                        <p className="font-medium">No contracts found.</p>
                        <p className="text-xs">Try adjusting your time window, region, or clear the dashboard tiles.</p>
                        <button 
                           onClick={() => setActiveTileFilter('ALL')}
                           className="text-sirion-teal text-sm font-medium mt-2 hover:underline"
                        >
                          Clear Filters
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-gray-100 bg-gray-50 text-center mt-auto">
            <button 
              onClick={() => {
                setDaysFilter(90);
                setRegionFilter('All Regions');
                setActiveTileFilter('ALL');
              }}
              className="text-xs font-semibold text-gray-500 hover:text-sirion-teal uppercase tracking-wide"
            >
              Viewing {filteredContracts.length} of {contextContracts.length} Renewals
            </button>
          </div>
        </div>
      </div>

      {/* Right Summary Panel */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
             <h3 className="text-sm font-bold text-sirion-midnight uppercase tracking-wide">
               This Quarter at a Glance
             </h3>
             {activeTileFilter !== 'ALL' && <span className="text-[10px] text-gray-400 font-medium">Click to clear</span>}
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {/* Metric Tile 1: High Risk */}
            <button 
              onClick={() => handleTileClick('HIGH_RISK')}
              className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 relative overflow-hidden group ${
                activeTileFilter === 'HIGH_RISK' 
                  ? 'bg-red-50 border-red-400 ring-2 ring-red-200 shadow-md transform scale-[1.02]' 
                  : 'bg-white border-gray-200 hover:border-red-200 hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              {activeTileFilter === 'HIGH_RISK' && <div className="absolute inset-0 border-l-4 border-red-500 pointer-events-none"></div>}
              <div className={`p-2 rounded-md shadow-sm transition-colors ${activeTileFilter === 'HIGH_RISK' ? 'bg-white text-red-600' : 'bg-red-50 text-red-500 group-hover:bg-red-100'}`}>
                <AlertTriangle size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-red-700">{metrics.highRisk}</div>
                <div className="text-xs text-red-600 font-medium">High Risk Renewals</div>
              </div>
            </button>

            {/* Metric Tile 2: Total Spend */}
            <button 
              onClick={() => handleTileClick('SPEND')}
              className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 relative overflow-hidden group ${
                activeTileFilter === 'SPEND' 
                  ? 'bg-teal-50 border-sirion-teal ring-2 ring-teal-100 shadow-md transform scale-[1.02]' 
                  : 'bg-white border-gray-200 hover:border-sirion-tealLight hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              {activeTileFilter === 'SPEND' && <div className="absolute inset-0 border-l-4 border-sirion-teal pointer-events-none"></div>}
              <div className={`p-2 rounded-md shadow-sm transition-colors ${activeTileFilter === 'SPEND' ? 'bg-white text-sirion-teal' : 'bg-teal-50 text-sirion-teal group-hover:bg-teal-100'}`}>
                <DollarSign size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-sirion-midnight">${metrics.totalSpend}M</div>
                <div className="text-xs text-gray-600 font-medium">Total Spend at Risk</div>
              </div>
            </button>

             {/* Metric Tile 3: DPA Issues */}
             <button 
              onClick={() => handleTileClick('DPA')}
               className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border transition-all duration-200 relative overflow-hidden group ${
                activeTileFilter === 'DPA' 
                  ? 'bg-indigo-50 border-sirion-lilac ring-2 ring-indigo-100 shadow-md transform scale-[1.02]' 
                  : 'bg-white border-gray-200 hover:border-sirion-lilac hover:shadow-md hover:scale-[1.01]'
              }`}
             >
              {activeTileFilter === 'DPA' && <div className="absolute inset-0 border-l-4 border-sirion-lilac pointer-events-none"></div>}
              <div className={`p-2 rounded-md shadow-sm transition-colors ${activeTileFilter === 'DPA' ? 'bg-white text-sirion-lilac' : 'bg-indigo-50 text-sirion-lilac group-hover:bg-indigo-100'}`}>
                <FileCheck size={18} />
              </div>
              <div>
                <div className="text-2xl font-bold text-sirion-midnight">{metrics.dpaIssues}</div>
                <div className="text-xs text-gray-600 font-medium">Non-compliant DPAs</div>
              </div>
            </button>
          </div>
        </div>

        {/* Mini Charts */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex-1">
          <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-4">Renewal Risk Distribution</h4>
          <div className="h-40 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePie data={riskCounts} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={5} dataKey="value">
                {riskCounts.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                ))}
              </RePie>
            </ResponsiveContainer>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
              <span className="text-xl font-bold text-sirion-midnight">{filteredContracts.length}</span>
              <span className="block text-[10px] text-gray-400">Visible</span>
            </div>
          </div>
          <div className="flex justify-center gap-4 text-[10px] text-gray-500 mt-2">
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-red-500"></div>High</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500"></div>Med</div>
             <div className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500"></div>Low</div>
          </div>
        </div>
      </div>
    </div>
  );
};