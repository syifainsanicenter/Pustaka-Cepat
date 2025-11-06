'use server';

import { generateBookIdeas, type GenerateBookIdeasInput } from '@/ai/flows/generate-book-ideas';
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
