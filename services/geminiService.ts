
import { GoogleGenAI, Type } from "@google/genai";
import { Exercise, NutritionItem, DailyLog, BodyMetricLog, UserProfile, AthleteStatus } from "../types";

// Initialize Gemini Client safely
const apiKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) 
  ? process.env.API_KEY 
  : '';

// Avoid crashing if key is missing during initial load, though calls will fail
const ai = new GoogleGenAI({ apiKey });

export const generatePlan = async (
  goal: string,
  type: 'workout' | 'nutrition',
  duration: string = '1 month'
): Promise<string> => {
  try {
    const prompt = `
      Create a detailed ${duration} ${type} plan for an athlete whose goal is: "${goal}".
      Provide specific routines or meals. 
      Format the output as a clear, structured list using Markdown.
      The output MUST be in Persian (Farsi).
      Be professional and encouraging.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert elite sports coach and nutritionist. You speak Persian.",
      }
    });

    return response.text || "خطا در تولید برنامه.";
  } catch (error) {
    console.error("Plan generation error:", error);
    return "خطا در برقراری ارتباط با هوش مصنوعی.";
  }
};

export const generateWorkoutJSON = async (goal: string, level: AthleteStatus): Promise<Exercise[]> => {
  try {
    const prompt = `
      Create a single workout session (list of exercises) for a "${level}" athlete with goal: "${goal}".
      Adjust complexity, volume, and exercise selection based on their level (Amateur, Semi-Pro, Professional).
      Return a JSON array where each object has:
      - name (string in Persian)
      - sets (number, e.g. 3 or 4)
      - reps (string, e.g. "8-12")
      - rest (number, in seconds, e.g. 60)
      - notes (string in Persian, brief tip)
      - muscleGroup (string in Persian, e.g. "سینه")
      
      Do not include markdown code blocks. Just the raw JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a strength and conditioning coach. Prioritize compound movements. Output in Persian.",
      }
    });

    const text = response.text || "[]";
    const data = JSON.parse(text);
    // Add IDs
    return data.map((ex: any) => ({ ...ex, id: Date.now().toString() + Math.random().toString() }));
  } catch (error) {
    console.error("JSON Plan generation error:", error);
    return [];
  }
};

export const generateNutritionJSON = async (goal: string, level: AthleteStatus): Promise<NutritionItem[]> => {
  try {
    const prompt = `
      Create a daily meal plan (list of meals) for a "${level}" athlete with goal: "${goal}".
      Adjust macronutrient targets and food choices based on their level (Amateur, Semi-Pro, Professional).
      Return a JSON array where each object has:
      - title (string in Persian, e.g. "صبحانه")
      - details (string in Persian, e.g. "جو دوسر با پروتئین وی")
      - macros (object with numbers for: protein, carbs, fats, calories)
      
      Do not include markdown code blocks. Just the raw JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are a sports nutritionist. Focus on performance and recovery. Output in Persian.",
      }
    });

    const text = response.text || "[]";
    const data = JSON.parse(text);
    // Add IDs and defaults
    return data.map((item: any) => ({ 
      ...item, 
      id: Date.now().toString() + Math.random().toString(),
      completed: false,
      notes: ''
    }));
  } catch (error) {
    console.error("JSON Nutrition generation error:", error);
    return [];
  }
};

export const chatWithCoach = async (message: string, history: {role: string, parts: {text: string}[]}[]): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: message, 
      config: {
         systemInstruction: "You are an empathetic and highly knowledgeable sports scientist and coach. You help athletes with motivation, technique, and science-based advice. You MUST reply in Persian (Farsi).",
         thinkingConfig: { thinkingBudget: 1024 }
      }
    });
    
    return response.text || "متاسفانه نمی‌توانم پاسخ دهم.";
  } catch (error) {
    console.error("Chat error:", error);
    return "مربی در حال حاضر در دسترس نیست.";
  }
};

export const analyzeFoodImage = async (base64Image: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', 
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image
            }
          },
          {
            text: "Analyze this meal. Estimate the calories, protein, carbs, and fats. Rate it from 1-10 for a professional athlete and give a brief improvement tip. Output in Persian (Farsi)."
          }
        ]
      }
    });
    return response.text || "تصویر قابل تحلیل نیست.";
  } catch (error) {
    console.error("Image analysis error:", error);
    return "خطا در تحلیل تصویر.";
  }
};

export const analyzeStrengthsAndWeaknesses = async (logs: DailyLog[], metrics: BodyMetricLog[]): Promise<string> => {
  try {
    const logsSummary = logs.slice(-7).map(l => 
      `Date: ${l.date}, Workout: ${l.workoutScore}%, Nutrition: ${l.nutritionScore}%, Sleep: ${l.sleepHours || 0}h`
    ).join('\n');
    
    const metricsSummary = metrics.slice(-3).map(m => 
      `Date: ${m.date}, Weight: ${m.weight}kg, BodyFat: ${m.bodyFat || 0}%`
    ).join('\n');

    const prompt = `
      Analyze the following athlete data for the last week/month.
      
      Daily Logs:
      ${logsSummary}
      
      Body Metrics History:
      ${metricsSummary}
      
      Identify:
      1. Strengths (e.g. high consistency, good nutrition).
      2. Weaknesses (e.g. poor sleep, missing workouts).
      3. Give 3 specific actionable recommendations for next week.
      
      Output in Persian (Farsi). Use Markdown for formatting.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
            thinkingConfig: { thinkingBudget: 2048 }
        }
    });

    return response.text || "داده کافی برای تحلیل وجود ندارد.";
  } catch (error) {
    console.error("Analysis error:", error);
    return "خطا در تحلیل داده‌ها.";
  }
}

export const analyzeBodyProgress = async (oldImage: string, newImage: string): Promise<string> => {
  try {
    // Remove data URL headers if present
    const oldData = oldImage.includes(',') ? oldImage.split(',')[1] : oldImage;
    const newData = newImage.includes(',') ? newImage.split(',')[1] : newImage;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: oldData } },
          { inlineData: { mimeType: 'image/jpeg', data: newData } },
          { text: "Compare these two progress photos (Old vs New). Identify visible changes in muscle definition, body fat percentage, and posture. Provide encouraging feedback and 2 specific training tips based on the visual progress. Output in Persian (Farsi)." }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 2048 }
      }
    });

    return response.text || "خطا در تحلیل تصاویر.";
  } catch (error) {
    console.error("Progress analysis error:", error);
    return "امکان مقایسه تصاویر وجود ندارد.";
  }
};

export const analyzeWeightTrend = async (
  metrics: BodyMetricLog[], 
  profile: UserProfile
): Promise<string> => {
  if (!profile.weightGoal || metrics.length < 2) {
    return "برای دریافت تحلیل هوشمند، ابتدا یک هدف وزنی تعیین کرده و حداقل دو بار وزن خود را ثبت کنید.";
  }

  const metricsSummary = metrics.slice(-14).map(m => 
    `Date: ${m.date}, Weight: ${m.weight}kg`
  ).join('\n');
  
  const prompt = `
    Analyze the recent weight trend for an athlete.
    Current Weight: ${profile.currentWeight} kg
    Weight Goal: Target ${profile.weightGoal.target} kg by ${profile.weightGoal.deadline}.
    Start Weight for this goal was ${profile.weightGoal.startWeight} kg.
    
    Recent Weight Data (last 14 entries):
    ${metricsSummary}
    
    Based on this data:
    1.  Assess the current trend. Is the athlete on track to meet their goal? Are they losing/gaining weight too fast or too slow?
    2.  Provide a short, encouraging summary of their progress so far.
    3.  Give 2-3 specific, actionable tips to help them stay on track or get back on track. For example, suggest a small nutrition adjustment or a change in cardio frequency.
    
    Keep the tone of an expert coach: motivating but direct.
    Output MUST be in Persian (Farsi) and use Markdown for formatting.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a sports science expert specializing in body composition and weight management for athletes.",
      }
    });
    return response.text || "خطا در تحلیل روند وزنی.";
  } catch (error) {
    console.error("Weight trend analysis error:", error);
    return "مربی هوشمند در حال حاضر قادر به تحلیل روند شما نیست.";
  }
};
