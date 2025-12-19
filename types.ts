
export interface BusinessAnalysis {
  name: string;
  category: string;
  targetAudience: string;
  valueProposition: string;
  brandVoice: string;
  keyServices: string[];
  suggestedMessages: {
    casual: string;
    professional: string;
    concise: string;
  };
}

export interface GroundingSource {
  web?: {
    uri: string;
    title: string;
  };
}
