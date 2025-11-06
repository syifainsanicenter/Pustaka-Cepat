'use server';

/**
 * @fileOverview Automatically inserts in-line citations in APA format into a given text.
 *
 * - insertApaCitations - A function that handles the insertion of APA citations.
 * - InsertApaCitationsInput - The input type for the insertApaCitations function.
 * - InsertApaCitationsOutput - The return type for the insertApaCitations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InsertApaCitationsInputSchema = z.object({
  text: z.string().describe('The text to insert citations into.'),
  referencesJson: z.string().describe('A JSON string of references to use for citation.  Should be an array of {refId, type, apa, meta{...}} objects.'),
});
export type InsertApaCitationsInput = z.infer<typeof InsertApaCitationsInputSchema>;

const InsertApaCitationsOutputSchema = z.object({
  content: z.string().describe('The text with inline citations inserted.'),
  inlineCitations: z.array(
    z.object({
      spanStart: z.number().describe('The starting index of the citation in the content.'),
      spanEnd: z.number().describe('The ending index of the citation in the content.'),
      refId: z.string().describe('The reference ID of the cited source.'),
    })
  ).describe('An array of inline citation objects.'),
  newRefSuggestions: z.array(z.string()).optional().describe('Suggestions for new references that may be needed.'),
  todoRef: z.string().optional().describe('A note indicating that a reference is missing or needs to be added.'),
  warnings: z.array(z.string()).optional().describe('Any warnings or issues encountered during citation insertion.'),
  wordCount: z.number().describe('The word count of the content.'),
});
export type InsertApaCitationsOutput = z.infer<typeof InsertApaCitationsOutputSchema>;

export async function insertApaCitations(input: InsertApaCitationsInput): Promise<InsertApaCitationsOutput> {
  return insertApaCitationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'insertApaCitationsPrompt',
  input: {schema: InsertApaCitationsInputSchema},
  output: {schema: InsertApaCitationsOutputSchema},
  prompt: `You are an expert academic writing assistant. Your task is to insert APA-style in-line citations into the given text, using the provided references.

Here's the text:
{{{text}}}

Here are the references (in JSON format):
{{{referencesJson}}}

Instructions:
1.  Analyze the text and identify where citations are needed to support the claims and ideas presented.
2.  For each citation, find the most relevant reference from the provided referencesJson.
3.  Insert the citation in APA format (Author, Year) at the end of the sentence or clause where it is relevant.
4.  If a suitable reference is not found, add a suggestion to newRefSuggestions.
5.  Ensure that the spanStart and spanEnd values in the inlineCitations array correctly indicate the position of the citation in the output text.
6.  If there's anything else to note add to the todoRef.
7.  Estimate word count of content.

Output:
Return a JSON object with the following fields:
- content: The updated text with inline citations.
- inlineCitations: An array of objects, each with spanStart, spanEnd, and refId.
- newRefSuggestions: (Optional) An array of strings with suggestions for new references.
- todoRef: (Optional) A string indicating that a reference is missing or needs to be added.
- warnings: (Optional) An array of strings with any warnings or issues encountered.
- wordCount: estimated word count of content.

Example:
Input:
text: "This is a sentence that needs a citation. Another sentence here."
referencesJson: '[{\