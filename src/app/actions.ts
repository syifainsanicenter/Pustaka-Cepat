'use server';

import { generateBookIdeas, type GenerateBookIdeasInput } from '@/ai/flows/generate-book-ideas';
import { createStructuredOutline, type CreateStructuredOutlineInput } from '@/ai/flows/create-structured-outline';
import { generateChapterContent, type GenerateChapterContentInput } from '@/ai/flows/generate-chapter-content';
import { z } from 'zod';

const ActionError = z.object({
  error: z.string(),
});

export async function generateIdeasAction(input: GenerateBookIdeasInput) {
  try {
    const output = await generateBookIdeas(input);
    if (!output || !output.ideas) {
      return { error: 'Gagal menghasilkan ide. Silakan coba lagi.' };
    }
    return output;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Terjadi kesalahan pada server.' };
  }
}

export async function createOutlineAction(input: CreateStructuredOutlineInput) {
  try {
    const output = await createStructuredOutline(input);
    if (!output || !output.chapters) {
      return { error: 'Gagal membuat outline. Silakan coba lagi.' };
    }
    return output;
  } catch (e: any) {
    console.error(e);
    return { error: e.message || 'Terjadi kesalahan pada server.' };
  }
}

export async function generateChapterAction(input: GenerateChapterContentInput) {
    try {
      const output = await generateChapterContent(input);
      if (!output || !output.content) {
        return { error: 'Gagal menulis bab. Silakan coba lagi.' };
      }
      return output;
    } catch (e: any) {
      console.error(e);
      return { error: e.message || 'Terjadi kesalahan pada server.' };
    }
  }
