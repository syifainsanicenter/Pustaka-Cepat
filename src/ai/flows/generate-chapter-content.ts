'use server';

/**
 * @fileOverview A flow for generating chapter content based on a given outline.
 *
 * - generateChapterContent - A function that generates chapter content.
 * - GenerateChapterContentInput - The input type for the generateChapterContent function.
 * - GenerateChapterContentOutput - The return type for the generateChapterContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ChapterPlanSchema = z.object({
  title: z.string(),
  objectives: z.array(z.string()),
  subheadings: z.array(z.string()),
});

export type ChapterPlan = z.infer<typeof ChapterPlanSchema>;

const ReferenceSchema = z.object({
  refId: z.string(),
  type: z.enum(['quran', 'hadith', 'academic']),
  apa: z.string(),
  meta: z.record(z.any()),
});

export type Reference = z.infer<typeof ReferenceSchema>;

const GenerateChapterContentInputSchema = z.object({
  language: z.string(),
  writingStyle: z.string(),
  tone: z.string(),
  length: z.number(),
  enforceCitations: z.boolean(),
  category: z.string(),
  depthLevel: z.string(),
  chapterPlan: ChapterPlanSchema,
  referencesJson: z.string(),
  religiousRefsJson: z.string().optional(),
});

export type GenerateChapterContentInput = z.infer<typeof GenerateChapterContentInputSchema>;

const InlineCitationSchema = z.object({
  spanStart: z.number(),
  spanEnd: z.number(),
  refId: z.string(),
});

export type InlineCitation = z.infer<typeof InlineCitationSchema>;

const GenerateChapterContentOutputSchema = z.object({
  title: z.string(),
  subheadings: z.array(z.string()),
  content: z.string(),
  wordCount: z.number(),
  inlineCitations: z.array(InlineCitationSchema),
  newRefSuggestions: z.array(z.string()).optional(),
  todoRef: z.string().optional(),
  warnings: z.array(z.string()).optional(),
});

export type GenerateChapterContentOutput = z.infer<typeof GenerateChapterContentOutputSchema>;

export async function generateChapterContent(input: GenerateChapterContentInput): Promise<GenerateChapterContentOutput> {
  return generateChapterContentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateChapterContentPrompt',
  input: {
    schema: GenerateChapterContentInputSchema,
  },
  output: {
    schema: GenerateChapterContentOutputSchema,
  },
  prompt: `TUGAS: Tulis 1 bab lengkap berdasarkan outline bab berikut.
KONFIG:
Bahasa: {{{language}}}
Gaya penulisan: {{{writingStyle}}}; Gaya bahasa: {{{tone}}}
Panjang target: {{{length}}} kata (boleh ±10%)
Wajib sitasi: {{{enforceCitations}}} (true/false)
Kategori: {{{category}}}
Tingkat kedalaman: {{{depthLevel}}} (dasar|menengah|mendalam)
OUTLINE BAB:
Judul: {{{chapterPlan.title}}}
Tujuan: {{{chapterPlan.objectives}}}
Poin/Subjudul: {{{chapterPlan.subheadings}}}
REFERENSI TERSEDIA (use first):
{{{referencesJson}}} // array of {refId, type, apa, meta{...}}
DALIL (hanya untuk islam, jika ada):
{{{religiousRefsJson}}} // array quran/hadith dengan arabText dan rujukan
PENTING:
Gunakan hanya referensi di atas untuk sitasi; jika kurang, isi newRefSuggestions dan todoRef (jangan karang DOI/URL).
Sisipkan sitasi inline (Author, Tahun) di bagian yang relevan.
Jika ada dalil: tampilkan teks Arab, kemudian translasi pendek (dalam kurung), dan rujukan (Qur’an S:X) atau (Koleksi, no).
Keluarkan hanya JSON sesuai skema. Isi inlineCitations dengan rentang karakter berdasarkan content.`,
});

const generateChapterContentFlow = ai.defineFlow(
  {
    name: 'generateChapterContentFlow',
    inputSchema: GenerateChapterContentInputSchema,
    outputSchema: GenerateChapterContentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
