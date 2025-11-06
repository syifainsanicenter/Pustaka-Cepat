'use server';

/**
 * @fileOverview Generates book ideas based on user-defined criteria.
 *
 * - generateBookIdeas - A function that generates book ideas.
 * - GenerateBookIdeasInput - The input type for the generateBookIdeas function.
 * - GenerateBookIdeasOutput - The return type for the generateBookIdeas function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateBookIdeasInputSchema = z.object({
  projectTitle: z.string().describe('The tentative title of the project.'),
  category: z
    .string()
    .describe(
      'The category of the book (e.g., academic, textbook, monograph, popular, islamic).' + 
      'Options: academic|buku_ajar|monograf|populer|islam'
    ),
  audience: z.string().describe('The target audience (e.g., undergraduate students, high school teachers).'),
  goal: z.string().describe('The goal of the book (e.g., a semester 1 textbook).'),
  language: z.string().describe('The language of the book (id/en/ar/su/jv/zh).'),
  writingStyle: z.string().describe('The writing style (e.g., strict academic, popular science, persuasive preaching).'),
  tone: z.string().describe('The tone of the book (e.g., formal, semi-formal).'),
});

export type GenerateBookIdeasInput = z.infer<typeof GenerateBookIdeasInputSchema>;

const GenerateBookIdeasOutputSchema = z.object({
  ideas: z.array(
    z.object({
      title: z.string().describe('The title of the idea.'),
      angle: z.string().describe('A short unique angle for the book.'),
      rationale: z.string().describe('The rationale behind the idea (2-3 sentences).'),
      audienceFitScore: z
        .number()
        .describe('A score (0-100) indicating how well the idea fits the target audience.'),
    })
  ).describe('An array of book ideas.'),
});

export type GenerateBookIdeasOutput = z.infer<typeof GenerateBookIdeasOutputSchema>;

export async function generateBookIdeas(input: GenerateBookIdeasInput): Promise<GenerateBookIdeasOutput> {
  return generateBookIdeasFlow(input);
}

const generateIdeasPrompt = ai.definePrompt({
  name: 'generateIdeasPrompt',
  input: {schema: GenerateBookIdeasInputSchema},
  output: {schema: GenerateBookIdeasOutputSchema},
  prompt: `TUGAS: Buat 5–10 ide buku yang kuat dan relevan untuk proyek berikut.
PROJECT:

Judul sementara: {{{projectTitle}}}
Kategori: {{{category}}} (opsi: akademik|buku_ajar|monograf|populer|islam)
Audiens: {{{audience}}} (mis: mahasiswa S1, guru SMA, jamaah remaja)
Tujuan: {{{goal}}} (mis: buku ajar semester 1)
Bahasa: {{{language}}}
Gaya penulisan: {{{writingStyle}}} (mis: akademik ketat, populer ilmiah, dakwah persuasif)
Gaya bahasa: {{{tone}}} (mis: formal, semi-formal)
KELUARAN WAJIB: JSON dengan ideas[]. Sertakan angle singkat, rationale (2–3 kalimat), dan audienceFitScore (0-100).
PENTING: Hindari konsep terlalu umum; tekankan diferensiasi dan kelayakan eksekusi ≤ 60 menit.`,
});

const generateBookIdeasFlow = ai.defineFlow(
  {
    name: 'generateBookIdeasFlow',
    inputSchema: GenerateBookIdeasInputSchema,
    outputSchema: GenerateBookIdeasOutputSchema,
  },
  async input => {
    const {output} = await generateIdeasPrompt(input);
    return output!;
  }
);

    