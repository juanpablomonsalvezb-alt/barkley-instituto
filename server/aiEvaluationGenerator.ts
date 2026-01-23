import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.AI_INTEGRATIONS_GEMINI_API_KEY,
  httpOptions: {
    apiVersion: "",
    baseUrl: process.env.AI_INTEGRATIONS_GEMINI_BASE_URL,
  },
});

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface GeneratedEvaluation {
  questions: Question[];
  totalQuestions: number;
  passingScore: number;
}

export async function generateEvaluationQuestions(
  moduleNumber: number,
  evaluationNumber: number,
  moduleOAs: string,
  moduleContents: string,
  textbookContent: string | null,
  questionCount: number = 15
): Promise<GeneratedEvaluation> {
  const context = `
MÓDULO ${moduleNumber} - EVALUACIÓN FORMATIVA ${evaluationNumber}

OBJETIVOS DE APRENDIZAJE:
${moduleOAs || "No especificados"}

CONTENIDOS DEL MÓDULO:
${moduleContents || "No especificados"}

${textbookContent ? `CONTENIDO DEL LIBRO DE TEXTO:\n${textbookContent.substring(0, 8000)}` : ""}
`;

  const prompt = `Eres un experto en educación chilena y creación de evaluaciones formativas. 
Genera exactamente ${questionCount} preguntas de opción múltiple en español para una evaluación formativa.

${context}

INSTRUCCIONES:
1. Cada pregunta debe tener exactamente 4 opciones (A, B, C, D)
2. Solo una opción es correcta
3. Las preguntas deben evaluar comprensión, aplicación y análisis
4. Usa lenguaje claro y apropiado para estudiantes chilenos
5. Incluye una breve explicación de por qué la respuesta correcta es la correcta

Responde SOLO con un JSON válido con esta estructura exacta:
{
  "questions": [
    {
      "id": 1,
      "question": "Texto de la pregunta",
      "options": ["Opción A", "Opción B", "Opción C", "Opción D"],
      "correctAnswer": 0,
      "explanation": "Explicación breve de la respuesta correcta"
    }
  ]
}

Donde "correctAnswer" es el índice de la opción correcta (0 para A, 1 para B, 2 para C, 3 para D).
No incluyas ningún texto adicional, solo el JSON.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        temperature: 0.7,
        maxOutputTokens: 8000,
      },
    });

    const candidate = response.candidates?.[0];
    const textPart = candidate?.content?.parts?.find(
      (part: { text?: string }) => part.text
    );

    if (!textPart?.text) {
      throw new Error("No text response from AI");
    }

    let jsonText = textPart.text.trim();
    if (jsonText.startsWith("```json")) {
      jsonText = jsonText.slice(7);
    }
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.slice(3);
    }
    if (jsonText.endsWith("```")) {
      jsonText = jsonText.slice(0, -3);
    }
    jsonText = jsonText.trim();

    const parsed = JSON.parse(jsonText);
    
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error("Invalid response format: missing questions array");
    }

    for (let i = 0; i < parsed.questions.length; i++) {
      const q = parsed.questions[i];
      if (!q.question || !q.options || q.options.length !== 4 || 
          typeof q.correctAnswer !== 'number' || q.correctAnswer < 0 || q.correctAnswer > 3) {
        throw new Error(`Invalid question format at index ${i}`);
      }
      q.id = i + 1;
    }

    return {
      questions: parsed.questions,
      totalQuestions: parsed.questions.length,
      passingScore: 60,
    };
  } catch (error) {
    console.error("Error generating evaluation:", error);
    throw error;
  }
}

export async function generateAllEvaluationsForModule(
  moduleNumber: number,
  moduleOAs: string,
  moduleContents: string,
  textbookContent: string | null
): Promise<GeneratedEvaluation[]> {
  const evaluations: GeneratedEvaluation[] = [];
  
  const questionCounts = [15, 18, 15, 20];
  
  for (let evalNum = 1; evalNum <= 4; evalNum++) {
    const evaluation = await generateEvaluationQuestions(
      moduleNumber,
      evalNum,
      moduleOAs,
      moduleContents,
      textbookContent,
      questionCounts[evalNum - 1]
    );
    evaluations.push(evaluation);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  return evaluations;
}
