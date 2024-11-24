import axios from "axios";
import Constants from "expo-constants"; // Or use `@env` for react-native-dotenv

const API_KEY = process.env.OPENAI_API_KEY; // Fetch from app.json
const API_BASE_URL = "https://api.openai.com/v1"; // OpenAI API base URL

/**
 * Generate a clinical response from OpenAI
 */
export const generateClinicalResponse = async (
    query: string,
    patientDetails: object
) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/chat/completions`,
            {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `You are a clinical assistant with access to comprehensive medical references, including ICD codes, drug databases, nursing protocols, and clinical best practices. Analyze the following patient-specific details and query, then provide relevant insights, including potential drug interactions, contraindications, and critical warnings based on patient conditions (e.g., renal impairment, pediatric or geriatric care). Ensure your response is concise, accurate, and actionable.
                        Patient Details: ${JSON.stringify(patientDetails)}
                        Query: ${query}`,
                    },
                    {
                        role: "user",
                        content: `Patient details: ${JSON.stringify(
                            patientDetails
                        )}\nQuery: ${query}`,
                    },
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error: any) {
        console.error(
            "Error generating clinical response:",
            error.response?.data || error.message
        );
        throw new Error("Failed to generate clinical response");
    }
};

/**
 * Calculate accurate medication dosages
 */
export const calculateDosage = async (
    medication: string,
    patientDetails: object,
    parameters: object = {}
) => {
    const defaultParameters = {
        formula: "mg/kg/day",
        frequency: 2,
    };

    const calculationParameters = { ...defaultParameters, ...parameters };

    try {
        const response = await axios.post(
            `${API_BASE_URL}/chat/completions`,
            {
                model: "gpt-4",
                messages: [
                    {
                        role: "system",
                        content: `You are a clinical assistant specializing in accurate medication dosing. Use established formulas (e.g., mg/kg/day) and account for patient-specific factors such as weight, age, and health conditions. Prioritize patient safety and efficiency, and ensure your calculations are clear, including dosage per administration and total daily dosage. If applicable, highlight any critical considerations for the medication.
                        Medication: ${medication}
                        Patient Details: ${JSON.stringify(patientDetails)}
                        Calculation Parameters: ${JSON.stringify(calculationParameters)}
                        `,
                    },
                    {
                        role: "user",
                        content: `Calculate the dosage for the following:\nMedication: ${medication}\nPatient Details: ${JSON.stringify(
                            patientDetails
                        )}\nCalculation Parameters: ${JSON.stringify(
                            calculationParameters
                        )}`,
                    },
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${API_KEY}`,
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error: any) {
        console.error(
            "Error calculating dosage:",
            error.response?.data || error.message
        );
        throw new Error("Failed to calculate dosage");
    }
};

export const reformatTranscription = async (
    transcription: string
): Promise<string> => {
    const prompt = `Reformat the following transcription into a structured and professional markdown note. Include clear sections, headings, and bullet points for readability, ensuring proper medical terminology and formatting suitable for patient records.

Transcription: "${transcription}"`;

    try {
        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                temperature: 0.7,
            },
            {
                headers: {
                    Authorization: `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.choices[0].message.content;
    } catch (error: any) {
        console.error("Error formatting transcription:", error);
        throw new Error("Failed to format transcription.");
    }
};
