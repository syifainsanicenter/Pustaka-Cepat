'use server';

/**
 * @fileOverview A flow to generate a structured book outline with 8-12 chapters.
 *
 * - createStructuredOutline - A function that handles the book outline generation.
 * - CreateStructuredOutlineInput - The input type for the createStructuredOutline function.
 * - CreateStructuredOutlineOutput - The return type for the createStructuredOutline function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateStructuredOutlineInputSchema = z.object({
  chosenIdeaTitle: z.string().describe('The chosen title for the book.'),
  category: z
    .string()
    .describe(
      'The category of the book (e.g., academic, textbook, monograph, popular, islamic).'
    ),
  language: z.string().describe('The language of the book (id/en/ar/su/jv/zh).'),
  writingStyle: z.string().describe('The writing style of the book.'),
  tone: z.string().describe('The tone of the book.'),
  audience: z.string().describe('The target audience for the book.'),
  goal: z.string().describe('The goal of the book.'),
  chaptersCount: z.number().describe('The target number of chapters (8-12).'),
  extraInstructions: z.string().describe('Any additional instructions.'),
});
export type CreateStructuredOutlineInput = z.infer<
  typeof CreateStructuredOutlineInputSchema
>;

const CreateStructuredOutlineOutputSchema = z.object({
  chapters:
    z.array(z.object({
      index: z.number().describe('The index of the chapter.'),
      title: z.string().describe('The title of the chapter.'),
      subheadings: z.array(z.string()).describe('The subheadings of the chapter.'),
      objectives: z.array(z.string()).describe('The objectives of the chapter.'),
      glossaryTerms: z.array(z.string()).describe('Key terms for the chapter.'),
      suggestedDalilTopics: z.array(z.string()).optional().describe('Suggested topics for Quran/Hadith verses (if category is islamic).'),
    })),
  notes: z.string().optional().describe('Any additional notes or comments.'),
});
export type CreateStructuredOutlineOutput = z.infer<
  typeof CreateStructuredOutlineOutputSchema
>;

export async function createStructuredOutline(
  input: CreateStructuredOutlineInput
): Promise<CreateStructuredOutlineOutput> {
  const isIslamic = input.category === 'islamic';
  const customInput = {...input, isIslamic};
  return createStructuredOutlineFlow(customInput);
}

const prompt = ai.definePrompt({
  name: 'createStructuredOutlinePrompt',
  input: {schema: CreateStructuredOutlineInputSchema.extend({ isIslamic: z.boolean() })},
  output: {schema: CreateStructuredOutlineOutputSchema},
  prompt: `TUGAS: Susun outline buku terstruktur 8-12 bab untuk proyek di bawah ini.
PROJECT:

Judul: {{{chosenIdeaTitle}}}
Kategori: {{{category}}}
Bahasa: {{{language}}}
Gaya penulisan: {{{writingStyle}}}
Gaya bahasa: {{{tone}}}
Audiens: {{{audience}}}; Tujuan: {{{goal}}}
Jumlah bab target: {{{chaptersCount}}}
Instruksi tambahan: {{{extraInstructions}}}
KELUARAN WAJIB: JSON sesuai skema. Untuk tiap bab: title, 3-6 subheadings, 2-4 objectives, glossaryTerms (istilah kunci).
{{#if isIslamic}}Jika category="islamic", tambahkan suggestedDalilTopics (array tema ayat/hadis per bab).{{/if}}
CATATAN: Outline harus progresif, tidak tumpang tindih, dan siap dipakai untuk generate bab.`,
});

const createStructuredOutlineFlow = ai.defineFlow(
  {
    name: 'createStructuredOutlineFlow',
    inputSchema: CreateStructuredOutlineInputSchema.extend({ isIslamic: z.boolean() }),
    outputSchema: CreateStructuredOutlineOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
