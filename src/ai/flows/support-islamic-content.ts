'use server';
/**
 * @fileOverview Implements the support for inserting relevant Quranic verses or Hadith in Arabic with short translations.
 *
 * - insertIslamicReference - A function that handles the insertion of Islamic references.
 * - InsertIslamicReferenceInput - The input type for the insertIslamicReference function.
 * - InsertIslamicReferenceOutput - The return type for the insertIslamicReference function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InsertIslamicReferenceInputSchema = z.object({
  topic: z.string().describe('The topic for which to find a relevant Islamic reference (Quran or Hadith).'),
  referencesJson: z.string().describe('JSON array of available religious references (Quran/Hadith) with arabText and rujukan.'),
});
export type InsertIslamicReferenceInput = z.infer<typeof InsertIslamicReferenceInputSchema>;

const InsertIslamicReferenceOutputSchema = z.object({
  arabText: z.string().describe('The Arabic text of the Quranic verse or Hadith.'),
  translation: z.string().describe('A short translation of the Arabic text.'),
  reference: z.string().describe('The reference for the Quranic verse or Hadith (e.g., Quran 2:255 or Al-Bukhari, no. 52).'),
  refId: z.string().optional().describe('The refId of the reference used, if available.'),
  notes: z.string().optional().describe('Any notes about the reference selection process.'),
  todoRef: z.string().optional().describe('If a suitable reference could not be found, an explanation of what needs to be done to find one.'),
});
export type InsertIslamicReferenceOutput = z.infer<typeof InsertIslamicReferenceOutputSchema>;

export async function insertIslamicReference(input: InsertIslamicReferenceInput): Promise<InsertIslamicReferenceOutput> {
  return insertIslamicReferenceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'insertIslamicReferencePrompt',
  input: {schema: InsertIslamicReferenceInputSchema},
  output: {schema: InsertIslamicReferenceOutputSchema},
  prompt: `You are an expert in Islamic texts. Given a topic and a list of available Quranic verses and Hadith, you will select the most relevant reference and provide its Arabic text, a short translation, and its reference.

Topic: {{{topic}}}

Available References:
{{#each (JSONparse referencesJson)}}
  {{#if arabText}}
    - refId: {{refId}}, type: {{type}}, arabText: {{{arabText}}}, translation: {{{meta.translation}}}, reference: {{{rujukan}}}
  {{else}}
    - refId: {{refId}}, type: {{type}}, translation: {{{meta.translation}}}, reference: {{{rujukan}}}
  {{/if}}
{{/each}}

Instructions:
1.  Select the reference that is most relevant to the topic.
2.  Provide the arabText (if available), translation, and reference.
3.  If no suitable reference is found, explain why in the todoRef field.
4. If a refId was used, include it in the output.

Output JSON: {
  "arabText": "The Arabic text of the Quranic verse or Hadith.",
  "translation": "A short translation of the Arabic text.",
  "reference": "The reference for the Quranic verse or Hadith (e.g., Quran 2:255 or Al-Bukhari, no. 52).",
  "refId": "The refId of the reference used, if available.",
  "notes": "Any notes about the reference selection process.",
  "todoRef": "If a suitable reference could not be found, an explanation of what needs to be done to find one."
}`,
  config: {
    temperature: 0.2,
  },
});

const insertIslamicReferenceFlow = ai.defineFlow(
  {
    name: 'insertIslamicReferenceFlow',
    inputSchema: InsertIslamicReferenceInputSchema,
    outputSchema: InsertIslamicReferenceOutputSchema,
  },
  async input => {
    try {
      // Parse the references JSON string into a JavaScript object
      const references = JSON.parse(input.referencesJson);

      // Find the first Quran or Hadith that matches the topic
      const foundReference = references.find(ref => {
        // Simple topic matching (case-insensitive)
        const topicLower = input.topic.toLowerCase();
        const translationLower = ref.meta?.translation?.toLowerCase() || '';

        return (ref.type === 'quran' || ref.type === 'hadith') && (translationLower.includes(topicLower));
      });

      if (foundReference) {
        return {
          arabText: foundReference.arabText || '',
          translation: foundReference.meta?.translation || '',
          reference: foundReference.rujukan || '',
          refId: foundReference.refId || '',
          notes: 'Reference found and included based on topic matching.',
        };
      } else {
        return {
          arabText: '',
          translation: '',
          reference: '',
          notes: 'No suitable reference found.',
          todoRef: 'Could not find a relevant Quranic verse or Hadith for the given topic in the provided references. Please provide more references or refine the topic.',
        };
      }
    } catch (error) {
      console.error('Error processing references:', error);
      return {
        arabText: '',
        translation: '',
        reference: '',
        notes: 'Error processing references.',
        todoRef: 'An error occurred while processing the provided references. Please check the format and try again.',
      };
    }
  }
);
