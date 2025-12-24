import dotenv from 'dotenv';
import {GoogleGenerativeAI} from '@google/generative-ai';
import fs from 'fs';

dotenv.config();

const generativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(path, mimeType) {
    return {
        inlineData: {
            data: Buffer.from(fs.readFileSync(path)).toString('base64'), mimeType
        }
    };
}

async function run() {
    const modelAI = generativeAI.getGenerativeModel({model: 'gemini-2.5-flash'});

    const prompt = `
  Instrucción: Actúa como un experto en análisis visual y control de calidad. Tu tarea es encontrar todas las diferencias entre las dos ilustraciones similares proporcionadas (izquierda vs. derecha).

  Metodología:
  1. Divide mentalmente las imágenes en una cuadrícula (superior izquierda, superior derecha, centro, inferior, etc.).
  2. Compara sistemáticamente cada sección de la imagen izquierda con su equivalente en la derecha.
  3. Presta especial atención a: colores, formas, elementos faltantes, tamaños, orientaciones y fondos.

  Formato de respuesta:
  Enumera las diferencias encontradas de forma clara y estructurada siguiendo este esquema:

  - Diferencia [Número]:
    * Ubicación: [Ej: Esquina superior derecha / Fondo / Personaje principal].
    * En la imagen izquierda: [Descripción detallada].
    * En la imagen derecha: [Descripción detallada del cambio].

  Conclusión: Indica el número total de diferencias encontradas.
  `;

    const imageParts = [fileToGenerativePart('find-differences.jpg', 'image/jpeg'),];

    const result = await modelAI.generateContent([prompt, ...imageParts]);
    const response = result.response;
    const text = response.text();
    console.log(text);
}

run().catch(console.error);
