export enum RiskLevel {
  Low = 'Low',
  Medium = 'Medium',
  High = 'High',
}

export interface Contract {
  id: string;
  vendorName: string;
  contractName: string;
  renewalDate: string;
  daysRemaining: number;
  value: string; // Formatted string like "$1.2M"
  commercialRisk: RiskLevel;
  complianceRisk: RiskLevel;
  riskReason: string;
  term: string;
  uplift: string;
  slaBreaches: number;
  noticePeriod: string;
  type: 'Auto-renew' | 'Fixed Term';
  description: string;
  region: 'EMEA' | 'NA' | 'APAC';
}

export interface NavItem {
  label: string;
  active?: boolean;
}