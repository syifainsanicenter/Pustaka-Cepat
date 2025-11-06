import type { GenerateBookIdeasOutput, GenerateBookIdeasInput } from '@/ai/flows/generate-book-ideas';
import type { CreateStructuredOutlineOutput } from '@/ai/flows/create-structured-outline';

export type ProjectCategory = 'akademik' | 'buku_ajar' | 'monograf' | 'populer' | 'islam';
export type ProjectLanguage = 'id' | 'en' | 'ar' | 'su' | 'jv' | 'zh';

export interface Project extends Partial<GenerateBookIdeasInput> {
  id?: string;
  ideas?: GenerateBookIdeasOutput['ideas'];
  chosenIdea?: GenerateBookIdeasOutput['ideas'][0];
  outline?: CreateStructuredOutlineOutput;
  category?: ProjectCategory;
  language?: ProjectLanguage;
}

    