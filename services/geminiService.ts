
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Helper to ensure the model produces high-quality localized content.
 */
const getLanguageInstruction = (language: string) => `
CRITICAL LINGUISTIC RULES:
1. The user might type in English, but you MUST respond 100% in ${language}.
2. Act as a native speaker of ${language} who is also a world-class Avian Veterinarian.
3. Do not provide a "machine translation" feel. Use natural, culturally appropriate, and technically accurate terminology in ${language}.
4. If the language uses a specific script (like Gujarati or Hindi), use that script exclusively.
5. If you must use a specific medical term that has no direct translation, you may put the English term in parentheses after the ${language} term, but the primary explanation must be in ${language}.
6. IMPORTANT: Provide a FULL and COMPLETE response. Do not stop halfway. Ensure all sections are detailed and the explanation is exhaustive.
`;

export const getBirdAdvice = async (birdSpecies: string, query: string, birdDetails?: any, language: string = 'English') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `You are an expert Avian Veterinarian and Behavioralist. 
      
      ${getLanguageInstruction(language)}

      Context: User is asking about their ${birdSpecies}. 
      Bird Details: ${JSON.stringify(birdDetails || {})}.
      User's Input (Understand this regardless of language): "${query}"
      
      Structure of your response in ${language}:
      1. Direct Answer: Address the user's specific query immediately and in great detail.
      2. Species Context: Why this matters specifically for a ${birdSpecies}.
      3. Health/Safety: Any critical warnings (toxic foods, illness signs).
      4. Actionable Steps: 3-5 clear, numbered instructions.
      5. Expert Fact: A "Did you know?" fact about ${birdSpecies}.
      
      Tone: Supportive, professional, and authoritative in ${language}.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 4000, // Increased significantly for Indic scripts
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error fetching advice. Please try again.";
  }
};

export const getSpeciesFactsheet = async (species: string, language: string = 'English') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Create a comprehensive, professional encyclopedia entry for a pet ${species}. 
      
      ${getLanguageInstruction(language)}
      
      Include these sections in ${language}:
      - Origin: Where they come from.
      - Longevity: Lifespan in a home.
      - Socialization: Mental health and play.
      - Nutrition: Detailed breakdown of Pellets vs Seeds vs Fresh Food.
      - Health Watch: Common species-specific illnesses.
      - Hormones: Management of breeding behavior.
      - Living: Space and noise considerations.
      
      Use bold headers and professional formatting. Ensure the response is long and detailed.`,
      config: { 
        temperature: 0.4,
        maxOutputTokens: 4000
      }
    });
    return response.text;
  } catch (error) {
    return "Failed to fetch species information.";
  }
};

export const analyzeDietBalance = async (logs: any[], species: string, language: string = 'English') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this bird's diet logs for a ${species}: ${JSON.stringify(logs)}. 
      
      ${getLanguageInstruction(language)}
      
      Required Output in ${language}:
      1. Summary: Is the current diet safe and balanced?
      2. Nutrient Breakdown: Analysis of Seeds, Pellets, Veggies, and Fruits.
      3. Nutrition Score: A score out of 10.
      4. Recommendations: 3 specific changes to improve health.
      
      Be strictly professional and helpful. Ensure the analysis is complete.`,
      config: {
        temperature: 0.5,
        maxOutputTokens: 4000
      }
    });
    return response.text;
  } catch (error) {
    return "Unable to analyze diet balance at the moment.";
  }
};
