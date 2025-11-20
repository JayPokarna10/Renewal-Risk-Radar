import { GoogleGenAI } from "@google/genai";
import { Contract } from "../types";

export const generateNegotiationBrief = async (contract: Contract): Promise<string> => {
  // 1. Check if environment is secure and Key exists
  const apiKey = typeof process !== 'undefined' && process.env && process.env.API_KEY 
    ? process.env.API_KEY 
    : '';

  // 2. If no key, return the high-fidelity mock data immediately.
  // This ensures the UI works perfectly as a static demo.
  if (!apiKey) {
    console.log("No API Key found. Using mock data generation.");
    return `
## **Negotiation Strategy Brief**

**Subject:** Renewal Negotiation - ${contract.contractName}
**Vendor:** ${contract.vendorName}
**Current Annual Value:** ${contract.value}
**Renewal Date:** ${contract.renewalDate}

### **Executive Summary**
The current agreement with ${contract.vendorName} is set to auto-renew in ${contract.daysRemaining} days. Based on performance data and market benchmarks, the current terms expose the organization to unnecessary commercial and compliance risks. Specifically, the automatic ${contract.uplift} price uplift and ${contract.slaBreaches} recorded SLA breaches warrant a renegotiation.

### **Key Issues & Leverage Points**
1.  **Commercial Risk:** The contract includes a mandatory ${contract.uplift} uplift. Market analysis suggests a flat renewal or max 2% CPI cap is achievable given our increased volume.
2.  **Performance Issues:** Vendor has breached critical uptime SLAs ${contract.slaBreaches} times in the last term. This should be used as leverage to waive the price uplift.
3.  **Compliance Gaps:** Current DPA terms are outdated and do not reflect our 2025 data policy standards.

### **Proposed Ask**
*   **Pricing:** Waive the ${contract.uplift} uplift; lock in current rates for 24 months.
*   **Terms:** Remove auto-renewal clause in favor of mutual option to renew.
*   **SLA Credits:** Retroactive service credits for past breaches (approx. value $15k).
*   **Compliance:** Sign updated DPA addendum.

### **BATNA (Best Alternative to Negotiated Agreement)**
If the vendor refuses to engage, we are prepared to issue a Notice of Non-Renewal (required ${contract.noticePeriod} prior) and issue an RFP to alternate vendors identified in the category strategy.
    `.trim();
  }

  // 3. If Key exists, try to use Gemini
  try {
    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";
    
    const prompt = `
      You are an expert legal and procurement copilot for Sirion.
      Draft a professional "Negotiation Strategy Brief" for the following contract renewal.
      Use Markdown formatting.
      
      Context:
      - Vendor: ${contract.vendorName}
      - Contract: ${contract.contractName}
      - Value: ${contract.value}
      - Renewal Date: ${contract.renewalDate} (${contract.daysRemaining} days remaining)
      - Term: ${contract.term}
      - Uplift Clause: ${contract.uplift}
      - SLA Breaches: ${contract.slaBreaches}
      - Risk Reason: ${contract.riskReason}
      
      Structure:
      1. Executive Summary
      2. Key Issues & Leverage Points (Highlight the risk reason and SLA breaches)
      3. Proposed Ask (Suggest specific remedies for the uplift and risks)
      4. BATNA
    `;

    const response = await ai.models.generateContent({
      model,
      contents: prompt,
    });

    return response.text || "Error generating content.";
  } catch (error) {
    console.error("Gemini API Error (Falling back to mock):", error);
    // Fallback to mock if the API call fails (e.g. quota or network)
    return `
## **Negotiation Strategy Brief (Offline Mode)**

**Subject:** Renewal Negotiation - ${contract.contractName}
**Vendor:** ${contract.vendorName}

### **Executive Summary**
The current agreement is set to auto-renew in ${contract.daysRemaining} days. Note: Live AI generation failed, showing cached strategy.

### **Key Issues**
1.  **Commercial Risk:** ${contract.uplift} uplift is above market.
2.  **Performance:** ${contract.slaBreaches} SLA breaches recorded.

### **Proposed Ask**
*   Waive uplift.
*   Remove auto-renewal.
    `.trim();
  }
};