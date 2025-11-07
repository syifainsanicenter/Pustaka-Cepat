'use client';

import type { GenerateChapterContentOutput, Reference } from '@/ai/flows/generate-chapter-content';
import type { Project } from '@/lib/types';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, BookText, ChevronRight, FileText, Loader2, Sparkles, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { generateChapterAction } from '@/app/actions';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';

export type ChapterContent = Record<number, Record<number, SubheadingContent>>;

interface ChapterStepProps {
  project: Project;
  onBack: () => void;
  onComplete: (content: ChapterContent) => void;
  initialContent: ChapterContent;
}

type ChapterResult = GenerateChapterContentOutput & {
  references: Reference[];
};

type SubheadingContent = {
  content: string;
  wordCount: number;
  inlineCitations: ChapterResult['inlineCitations'];
};

export function ChapterStep({ project, onBack, onComplete, initialContent }: ChapterStepProps) {
  const [isGenerating, startGeneration] = useTransition();
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number>(0);
  const [generatedContent, setGeneratedContent] = useState<ChapterContent>(initialContent);
  const [wordCount, setWordCount] = useState(1000);
  const { toast } = useToast();

  const selectedChapter = project.outline?.chapters[selectedChapterIndex];

  const handleGenerateSubheading = (subheadingIndex: number, subheading: string) => {
    if (selectedChapterIndex === null || !selectedChapter) return;

    startGeneration(async () => {
      // Mock references - in a real app, this would be more dynamic
      const references: Reference[] = [
        { refId: 'russell-2021', type: 'academic', apa: 'Russell, S. J., & Norvig, P. (2021). Artificial Intelligence: A Modern Approach (4th ed.). Pearson.', meta: { title: 'Artificial Intelligence: A Modern Approach' } },
        { refId: 'bostrom-2014', type: 'academic', apa: 'Bostrom, N. (2014). Superintelligence: Paths, Dangers, Strategies. Oxford University Press.', meta: { title: 'Superintelligence: Paths, Dangers, Strategies' } },
        { refId: 'goodfellow-2016', type: 'academic', apa: 'Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning. MIT Press.', meta: { title: 'Deep Learning' } },
      ];
      
      const input = {
        language: project.language!,
        writingStyle: project.writingStyle!,
        tone: project.tone!,
        length: Math.round(wordCount / selectedChapter.subheadings.length), // Divide word count by subheadings
        enforceCitations: true,
        category: project.category!,
        depthLevel: 'menengah',
        chapterPlan: {
            title: selectedChapter.title,
            objectives: selectedChapter.objectives,
            subheadings: [subheading], // Generate for a single subheading
        },
        referencesJson: JSON.stringify(references),
        religiousRefsJson: project.category === 'islamic' ? JSON.stringify([
            { refId: 'quran-39-9', type: 'quran', arabText: 'قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ', rujukan: 'Qur\'an 39:9', meta: { translation: 'Katakanlah: "Adakah sama orang-orang yang mengetahui dengan orang-orang yang tidak mengetahui?"'} }
        ]) : '',
      };

      const result = await generateChapterAction(input);

      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Gagal Menulis Sub-bab',
          description: result.error,
        });
      } else if (result.content) {
        setGeneratedContent(prev => ({
          ...prev,
          [selectedChapterIndex]: {
            ...prev[selectedChapterIndex],
            [subheadingIndex]: {
                content: result.content,
                wordCount: result.wordCount,
                inlineCitations: result.inlineCitations
            }
          }
        }));
        toast({
          title: `Sub-bab Berhasil Ditulis`,
          description: `Konten untuk "${subheading}" telah siap.`,
        });
      }
    });
  };

  const getFullChapterContent = (): ChapterResult | null => {
    if (!selectedChapter || !generatedContent[selectedChapterIndex]) return null;

    const chapterSubheadings = generatedContent[selectedChapterIndex];
    let fullContent = '';
    let totalWordCount = 0;
    let allCitations: ChapterResult['inlineCitations'] = [];
    const allReferences: Reference[] = [ // MOCK DATA
        { refId: 'russell-2021', type: 'academic', apa: 'Russell, S. J., & Norvig, P. (2021). Artificial Intelligence: A Modern Approach (4th ed.). Pearson.', meta: { title: 'Artificial Intelligence: A Modern Approach' } },
        { refId: 'bostrom-2014', type: 'academic', apa: 'Bostrom, N. (2014). Superintelligence: Paths, Dangers, Strategies. Oxford University Press.', meta: { title: 'Superintelligence: Paths, Dangers, Strategies' } },
        { refId: 'goodfellow-2016', type: 'academic', apa: 'Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning. MIT Press.', meta: { title: 'Deep Learning' } },
    ];

    selectedChapter.subheadings.forEach((subheading, index) => {
        const subheadingContent = chapterSubheadings[index];
        if (subheadingContent) {
            const contentOffset = fullContent.length;
            fullContent += `### ${subheading}\n\n${subheadingContent.content}\n\n`;
            totalWordCount += subheadingContent.wordCount;
            if (subheadingContent.inlineCitations) {
                const adjustedCitations = subheadingContent.inlineCitations.map(c => ({
                    ...c,
                    spanStart: c.spanStart + contentOffset + subheading.length + 6, // Adjust for subheading title
                    spanEnd: c.spanEnd + contentOffset + subheading.length + 6,
                }));
                allCitations.push(...adjustedCitations);
            }
        }
    });

    return {
        title: selectedChapter.title,
        subheadings: selectedChapter.subheadings,
        content: fullContent,
        wordCount: totalWordCount,
        inlineCitations: allCitations,
        references: allReferences,
        newRefSuggestions: [],
    };
  }
  
  const currentFullChapterContent = getFullChapterContent();

  const formatContentWithCitations = (content: string, inlineCitations: ChapterResult['inlineCitations'], references: Reference[]): React.ReactNode => {
    if (!inlineCitations || inlineCitations.length === 0) {
      return content.split('\n').map((p, i) => {
        if (p.startsWith('### ')) {
            return <h3 key={`h-${i}`} className="text-xl font-semibold mt-6 mb-3 text-foreground">{p.replace('### ', '')}</h3>
        }
        return <p key={`p-${i}`} className="mb-4 leading-relaxed">{p}</p>
      });
    }

    let lastIndex = 0;
    const parts: (string | React.ReactNode)[] = [];
    const sortedCitations = [...inlineCitations].sort((a, b) => a.spanStart - b.spanStart);

    sortedCitations.forEach((citation, i) => {
      const ref = references.find(r => r.refId === citation.refId);
      const apaText = ref ? ref.apa.match(/\(([^)]+)\)/)?.[0] || `(${ref.apa.split(',')[0]}, YEAR)` : '(Unknown, YEAR)';

      parts.push(content.substring(lastIndex, citation.spanStart));
      parts.push(
        <span key={`citation-${i}`} className="text-primary font-medium" title={ref?.apa}>
          {` ${apaText}`}
        </span>
      );
      lastIndex = citation.spanEnd;
    });
    parts.push(content.substring(lastIndex));
    
    const combined = parts.reduce<React.ReactNode[]>((acc, part, partIndex) => {
      if (typeof part === 'string') {
        const lines = part.split('\n').filter(p => p.trim() !== '').map((p, i) => {
          if (p.startsWith('### ')) {
            return <h3 key={`h-${partIndex}-${i}`} className="text-xl font-semibold mt-6 mb-3 text-foreground">{p.replace('### ', '')}</h3>
          }
          return <p key={`p-${partIndex}-${i}`} className="mb-4 leading-relaxed font-body">{p}</p>;
        });
        return [...acc, ...lines];
      }
      return [...acc, part];
    }, []);

    return combined;
  };

  const isAnySubheadingGenerated = selectedChapter && generatedContent[selectedChapterIndex] && Object.keys(generatedContent[selectedChapterIndex]).length > 0;

  return (
    <div className="flex-1 grid md:grid-cols-12 gap-0 min-h-full">
      <aside className="md:col-span-4 lg:col-span-3 border-r bg-muted/20 p-4 flex flex-col">
        <h2 className="text-xl font-bold tracking-tight px-2">Daftar Bab</h2>
        <ScrollArea className="flex-1 mt-4">
          <div className="space-y-2 pr-4">
            {project.outline?.chapters.map((chapter, index) => (
              <button
                key={index}
                onClick={() => setSelectedChapterIndex(index)}
                className={cn(
                  'w-full text-left p-3 rounded-lg transition-colors',
                  selectedChapterIndex === index ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                )}
              >
                <p className="font-semibold text-sm">Bab {chapter.index}: {chapter.title}</p>
                {generatedContent[index] && <Badge variant="secondary" className="mt-2">{Object.keys(generatedContent[index]).length}/{chapter.subheadings.length} sub-bab</Badge>}
              </button>
            ))}
          </div>
        </ScrollArea>
      </aside>
      <main className="md:col-span-8 lg:col-span-9 p-6 md:p-8 flex flex-col">
        {selectedChapter ? (
          <>
            <Card className="flex-1 flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-headline">Bab {selectedChapter.index}: {selectedChapter.title}</CardTitle>
                <CardDescription>
                  Tulis konten per sub-bab. AI akan menggabungkannya menjadi satu bab utuh.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-y-auto">
                <Tabs defaultValue="generator" className="flex-1 flex flex-col">
                    <TabsList>
                      <TabsTrigger value="generator"><Wand2 className="mr-2"/>Generator</TabsTrigger>
                      <TabsTrigger value="result" disabled={!currentFullChapterContent}><BookText className="mr-2"/>Hasil Bab</TabsTrigger>
                      <TabsTrigger value="references" disabled={!currentFullChapterContent}><FileText className="mr-2"/>Daftar Pustaka</TabsTrigger>
                    </TabsList>
                    <TabsContent value="generator" className="flex-1 mt-4">
                        <div className="mb-6 space-y-3 p-4 border rounded-lg">
                            <Label htmlFor="word-count" className='font-bold'>Panjang Kata per Sub-bab: {Math.round(wordCount / (selectedChapter.subheadings.length || 1))} kata</Label>
                            <Slider
                                id="word-count"
                                min={500}
                                max={1500}
                                step={100}
                                value={[wordCount]}
                                onValueChange={(value) => setWordCount(value[0])}
                                disabled={isGenerating}
                            />
                             <p className="text-xs text-muted-foreground">Total target untuk bab ini sekitar {wordCount} kata.</p>
                        </div>
                        <ScrollArea className='h-[calc(50vh-120px)] pr-4'>
                            <Accordion type="multiple" className="w-full">
                                {selectedChapter.subheadings.map((subheading, index) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger className='text-left'>
                                            <div className='flex items-center gap-4'>
                                                {generatedContent[selectedChapterIndex]?.[index] ? 
                                                    <Badge variant="default">Selesai</Badge> : 
                                                    <Badge variant="outline">Belum</Badge>
                                                }
                                                <span className="font-semibold">{subheading}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className='pt-4'>
                                            {generatedContent[selectedChapterIndex]?.[index] ? (
                                                <div className='prose prose-sm max-w-none text-muted-foreground font-body text-justify'>
                                                    {generatedContent[selectedChapterIndex][index].content.split('\n').map((p,i) => <p key={i}>{p}</p>)}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 border-2 border-dashed rounded-lg">
                                                    <Sparkles className="mx-auto h-10 w-10 text-muted-foreground" />
                                                    <h3 className="mt-3 text-md font-medium text-foreground">Sub-bab ini belum ditulis</h3>
                                                    <p className="mt-1 text-xs text-muted-foreground mb-4">Siap untuk merangkai kata?</p>
                                                    <Button onClick={() => handleGenerateSubheading(index, subheading)} disabled={isGenerating}>
                                                        {isGenerating ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sedang Menulis...</> : `Tulis Sub-bab Ini`}
                                                    </Button>
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </ScrollArea>
                    </TabsContent>
                    <TabsContent value="result" className="font-headline text-muted-foreground mt-4 text-justify">
                      {currentFullChapterContent ? (
                        <ScrollArea className="h-[calc(60vh)] pr-4">
                            {formatContentWithCitations(currentFullChapterContent.content, currentFullChapterContent.inlineCitations, currentFullChapterContent.references)}
                        </ScrollArea>
                      ) : (
                        <p>Generate semua sub-bab untuk melihat hasil bab secara lengkap.</p>
                      )}
                    </TabsContent>
                    <TabsContent value="references">
                        {currentFullChapterContent ? (
                        <ScrollArea className="h-[60vh] pr-4">
                          <div className="space-y-3 text-sm text-muted-foreground font-body">
                            <h4 className="font-bold text-foreground">Daftar Pustaka</h4>
                            {currentFullChapterContent.references.map(ref => (
                              <p key={ref.refId}>{ref.apa}</p>
                            ))}
                          </div>
                        </ScrollArea>
                        ) : (
                            <p>Generate semua sub-bab untuk melihat daftar pustaka.</p>
                        )}
                    </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            <div className="mt-auto flex justify-between items-center pt-8 border-t">
              <Button variant="ghost" onClick={onBack} disabled={isGenerating}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Outline
              </Button>
              <Button size="lg" onClick={() => onComplete(generatedContent)} disabled={!isAnySubheadingGenerated || isGenerating}>
                Lanjut ke Ekspor
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center py-20">
            <h3 className="text-lg font-medium">Pilih bab dari panel kiri untuk memulai.</h3>
          </div>
        )}
      </main>
    </div>
  );
}

    