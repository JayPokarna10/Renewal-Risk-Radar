import React from 'react';
import { Search, HelpCircle, ChevronDown } from 'lucide-react';
import { SirionLogo } from './SirionLogo';

export const Header: React.FC = () => {
  return (
    <header className="bg-sirion-midnight text-white h-16 flex items-center justify-between px-6 shadow-md sticky top-0 z-50">
      <div className="flex items-center gap-6">
        {/* Sirion Logo */}
        <div className="flex items-center text-white">
          <SirionLogo className="h-8 w-auto" variant="white" />
        </div>
        
        <div className="h-6 w-px bg-gray-700 mx-2"></div>
        
        <nav className="flex items-center gap-6 text-sm font-medium text-gray-300">
          <span className="hover:text-white cursor-pointer transition-colors">Manage</span>
          <span className="text-gray-500">/</span>
          <span className="text-white">Renewal Risk Copilot</span>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <div className="bg-gray-800/50 p-2 rounded-full hover:bg-gray-700 cursor-pointer transition-colors">
          <Search size={18} className="text-gray-300" />
        </div>
        <div className="bg-gray-800/50 p-2 rounded-full hover:bg-gray-700 cursor-pointer transition-colors">
          <HelpCircle size={18} className="text-gray-300" />
        </div>
        <div className="flex items-center gap-2 ml-2 cursor-pointer hover:opacity-80">
          <div className="w-8 h-8 bg-sirion-lilac rounded-full flex items-center justify-center text-sirion-midnight font-bold text-xs">
            JP
          </div>
          <span className="text-sm hidden md:block">Jay Pokarna</span>
          <ChevronDown size={14} />
        </div>
      </div>
    </header>
  );
};