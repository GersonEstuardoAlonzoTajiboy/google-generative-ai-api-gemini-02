import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';

dotenv.config();

const generativeAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function fileToGenerativePart(path, mimeType) {
  return {
    inlineData: {
      data: Buffer.from(fs.readFileSync(path)).toString('base64'),
      mimeType
    }
  };
}

async function run() {
  const modelAI = generativeAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

  const prompt = `
  Instrucción: Analiza la imagen proporcionada, que muestra dos ilustraciones similares colocadas una al lado de la otra.

  Tarea:

  1. Compara cuidadosamente ambas imágenes.

  2. Enumera todas las diferencias entre la imagen del lado izquierdo y la del lado derecho.

  3. Describe cada diferencia indicando claramente en qué parte de la imagen se encuentra y cuál es la variación observada.

  4. Usa un formato estructurado, como:
  Diferencia 1: En la imagen izquierda, hay [descripción], mientras que en la imagen derecha hay [descripción].
  Diferencia 2: [Descripción similar].
  `;

  const imageParts = [
    fileToGenerativePart('find-differences.jpg', 'image/jpeg'),
  ];

  const result = await modelAI.generateContent([prompt, ...imageParts]);
  const response = result.response;
  const text = response.text();
  console.log(text);
}

run().catch(console.error);
