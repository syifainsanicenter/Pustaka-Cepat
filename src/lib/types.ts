import type { GenerateBookIdeasOutput, GenerateBookIdeasInput } from '@/ai/flows/generate-book-ideas';
import type { CreateStructuredOutlineOutput } from '@/ai/flows/create-structured-outline';

export type ProjectCategory = 'akademik' | 'buku_ajar' | 'monograf' | 'populer' | 'islamic';
export type ProjectLanguage = 'id' | 'en' | 'ar' | 'su' | 'jv' | 'zh';

export interface Project extends Partial<Omit<GenerateBookIdeasInput, 'language'>> {
  id?: string;
  ideas?: GenerateBookIdeasOutput['ideas'];
  chosenIdea?: GenerateBookIdeasOutput['ideas'][0];
  outline?: CreateStructuredOutlineOutput;
  category?: ProjectCategory;
  language?: ProjectLanguage;
  chaptersCount?: number;
}
