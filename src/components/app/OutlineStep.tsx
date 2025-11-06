'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project } from '@/lib/types';
import { ArrowLeft, Check, ChevronRight, ListChecks, ListTree, Loader2, Book, Wand2, FileText, Key, BrainCircuit } from 'lucide-react';
import { createOutlineAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { CreateStructuredOutlineOutput } from '@/ai/flows/create-structured-outline';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';

interface OutlineStepProps {
  project: Project;
  onBack: () => void;
  onComplete: (outline: CreateStructuredOutlineOutput) => void;
}

export function OutlineStep({ project, onBack, onComplete }: OutlineStepProps) {
  const [isPending, startTransition] = useTransition();
  const [outline, setOutline] = useState<CreateStructuredOutlineOutput | undefined>(project.outline);
  const { toast } = useToast();

  const handleGenerateOutline = () => {
    startTransition(async () => {
      if (!project.chosenIdea?.title || !project.category || !project.language || !project.writingStyle || !project.tone || !project.audience || !project.goal) {
        toast({
          variant: 'destructive',
          title: 'Informasi Tidak Lengkap',
          description: 'Pastikan semua detail proyek telah diisi pada langkah sebelumnya.',
        });
        return;
      }
      
      const input = {
        chosenIdeaTitle: project.chosenIdea.title,
        category: project.category === 'islam' ? 'islamic' : project.category,
        language: project.language,
        writingStyle: project.writingStyle,
        tone: project.tone,
        audience: project.audience,
        goal: project.goal,
        chaptersCount: 10,
        extraInstructions: '',
      };
      
      const result = await createOutlineAction(input);
      
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Gagal Membuat Outline',
          description: result.error,
        });
      } else if (result.chapters) {
        setOutline(result);
        toast({
          title: 'Outline Berhasil Dibuat',
          description: 'Kerangka buku Anda telah siap. Anda bisa memeriksanya di bawah.',
        });
      }
    });
  }

  return (
    <div className="flex-1 flex flex-col container mx-auto px-4 md:px-6 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Buat Outline Buku</h2>
        <p className="mt-3 text-lg text-muted-foreground">
          AI akan membuat kerangka bab yang terstruktur berdasarkan ide buku yang Anda pilih. Anda dapat menyempurnakannya sebelum menulis.
        </p>
      </div>

      <div className="my-12 max-w-4xl mx-auto w-full">
        {!outline && !isPending && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Buku yang Akan Dibuat:</CardTitle>
              <CardDescription>{project.chosenIdea?.title}</CardDescription>
            </CardHeader>
            <CardContent className="text-center py-12 border-t border-dashed">
                <ListTree className="mx-auto h-16 w-16 text-muted-foreground" />
                <h3 className="mt-4 text-xl font-medium text-foreground">Siap Membuat Outline?</h3>
                <p className="mt-2 text-sm text-muted-foreground">AI akan menghasilkan 8-12 bab lengkap dengan subjudul, tujuan, dan istilah kunci.</p>
                <Button size="lg" className="mt-6" onClick={handleGenerateOutline} disabled={isPending}>
                    {isPending ? (
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    ) : (
                        <Wand2 className="mr-2 h-5 w-5" />
                    )}
                    Generate Outline
                </Button>
            </CardContent>
          </Card>
        )}
        
        {isPending && (
            <div className="space-y-4">
                 {[...Array(8)].map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="flex flex-row items-center justify-between">
                             <div className="h-6 bg-muted rounded w-3/4"></div>
                             <div className="h-6 bg-muted rounded w-8"></div>
                        </CardHeader>
                    </Card>
                ))}
            </div>
        )}

        {outline && (
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">{project.chosenIdea?.title}</CardTitle>
                    <CardDescription>Berikut adalah outline yang dihasilkan AI. Anda dapat mengembangkannya di tahap penulisan.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[50vh]">
                        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                        {outline.chapters.map((chapter, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="text-left hover:no-underline">
                                    <span className="font-bold text-primary mr-2">Bab {chapter.index}:</span> {chapter.title}
                                </AccordionTrigger>
                                <AccordionContent className="pl-6 pr-2">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><ListChecks /> Sub-Judul</h4>
                                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                                {chapter.subheadings.map((sub, i) => <li key={i}>{sub}</li>)}
                                            </ul>
                                        </div>
                                         <div>
                                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><BrainCircuit /> Tujuan Pembelajaran</h4>
                                            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                                                {chapter.objectives.map((obj, i) => <li key={i}>{obj}</li>)}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><Key /> Istilah Kunci</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {chapter.glossaryTerms.map((term, i) => <Badge key={i} variant="secondary">{term}</Badge>)}
                                        </div>
                                    </div>
                                    {chapter.suggestedDalilTopics && chapter.suggestedDalilTopics.length > 0 && (
                                        <div className="mt-4">
                                            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2"><FileText />Saran Topik Dalil</h4>
                                            <div className="flex flex-wrap gap-2">
                                                {chapter.suggestedDalilTopics.map((topic, i) => <Badge key={i} variant="outline">{topic}</Badge>)}
                                            </div>
                                        </div>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                        </Accordion>
                    </ScrollArea>
                </CardContent>
                <CardFooter className="bg-muted/50 p-4 border-t text-center justify-center">
                    <p className="text-sm text-muted-foreground">Outline ini adalah draf. Anda bisa mengedit dan menyempurnakannya di tahap berikutnya.</p>
                </CardFooter>
            </Card>
        )}
      </div>
      
      <div className="mt-auto flex justify-between items-center pt-8 border-t">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Gaya
        </Button>
        <Button size="lg" disabled={!outline || isPending} onClick={() => outline && onComplete(outline)}>
          Lanjut Tulis Bab
          <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
