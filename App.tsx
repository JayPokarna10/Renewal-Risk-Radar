import React, { useState } from 'react';
import { Header } from './components/Header';
import { IntroSequence } from './components/IntroSequence';
import { Radar } from './screens/Radar';
import { ContractDetail } from './screens/ContractDetail';
import { DraftModal } from './screens/DraftModal';
import { Contract } from './types';

enum View {
  INTRO,
  RADAR,
  DETAIL,
}

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.INTRO);
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [showModal, setShowModal] = useState(false);

  const handleIntroComplete = () => {
    setCurrentView(View.RADAR);
  };

  const handleContractSelect = (contract: Contract) => {
    setSelectedContract(contract);
    setCurrentView(View.DETAIL);
  };

  const handleBack = () => {
    setSelectedContract(null);
    setCurrentView(View.RADAR);
  };

  const handleGenerate = () => {
    setShowModal(true);
  };

  if (currentView === View.INTRO) {
    return <IntroSequence onComplete={handleIntroComplete} />;
  }

  return (
    <div className="min-h-screen bg-sirion-cloud text-gray-800 font-sans">
      <Header />
      
      <main className="max-w-[1920px] mx-auto">
        {currentView === View.RADAR && (
          <Radar onSelectContract={handleContractSelect} />
        )}

        {currentView === View.DETAIL && selectedContract && (
          <ContractDetail 
            contract={selectedContract} 
            onBack={handleBack} 
            onGenerateBrief={handleGenerate}
          />
        )}
      </main>

      {showModal && selectedContract && (
        <DraftModal 
          contract={selectedContract} 
          onClose={() => setShowModal(false)} 
        />
      )}
    </div>
  );
};

export default App;