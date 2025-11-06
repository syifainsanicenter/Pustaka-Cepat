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

interface ChapterStepProps {
  project: Project;
  onBack: () => void;
  onComplete: () => void;
}

type ChapterResult = GenerateChapterContentOutput & {
  references: Reference[];
};

export function ChapterStep({ project, onBack, onComplete }: ChapterStepProps) {
  const [isGenerating, startGeneration] = useTransition();
  const [selectedChapterIndex, setSelectedChapterIndex] = useState<number | null>(0);
  const [generatedContent, setGeneratedContent] = useState<Record<number, ChapterResult>>({});
  const { toast } = useToast();
  
  const selectedChapter = project.outline?.chapters[selectedChapterIndex ?? -1];

  const handleGenerateChapter = () => {
    if (selectedChapterIndex === null || !selectedChapter) return;

    startGeneration(async () => {
      // Mock references
      const references: Reference[] = [
        { refId: 'russell-2021', type: 'academic', apa: 'Russell, S. J., & Norvig, P. (2021). Artificial Intelligence: A Modern Approach (4th ed.). Pearson.', meta: { title: 'Artificial Intelligence: A Modern Approach' } },
        { refId: 'bostrom-2014', type: 'academic', apa: 'Bostrom, N. (2014). Superintelligence: Paths, Dangers, Strategies. Oxford University Press.', meta: { title: 'Superintelligence: Paths, Dangers, Strategies' } },
        { refId: 'goodfellow-2016', type: 'academic', apa: 'Goodfellow, I., Bengio, Y., & Courville, A. (2016). Deep Learning. MIT Press.', meta: { title: 'Deep Learning' } },
      ];
      
      const input = {
        language: project.language!,
        writingStyle: project.writingStyle!,
        tone: project.tone!,
        length: 1500, // Target word count
        enforceCitations: true,
        category: project.category!,
        depthLevel: 'menengah',
        chapterPlan: {
            title: selectedChapter.title,
            objectives: selectedChapter.objectives,
            subheadings: selectedChapter.subheadings,
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
          title: 'Gagal Menulis Bab',
          description: result.error,
        });
      } else if (result.content) {
        setGeneratedContent(prev => ({
          ...prev,
          [selectedChapterIndex]: { ...result, references: references } as ChapterResult
        }));
        toast({
          title: `Bab ${selectedChapter.index} Berhasil Ditulis`,
          description: 'Konten untuk bab ini telah siap.',
        });
      }
    });
  };
  
  const currentChapterContent = generatedContent[selectedChapterIndex ?? -1];

  const formatContentWithCitations = (content: string, inlineCitations: ChapterResult['inlineCitations'], references: Reference[]): React.ReactNode => {
    if (!inlineCitations || inlineCitations.length === 0) {
      return content.split('\n').map((p, i) => <p key={i} className="mb-4 leading-relaxed">{p}</p>);
    }

    let lastIndex = 0;
    const parts: React.ReactNode[] = [];
    const sortedCitations = [...inlineCitations].sort((a, b) => a.spanStart - b.spanStart);

    sortedCitations.forEach((citation, i) => {
      const ref = references.find(r => r.refId === citation.refId);
      const apaText = ref ? ref.apa.match(/\(([^)]+)\)/)?.[0] || `(${ref.apa.split(',')[0]}, YEAR)` : '(Unknown, YEAR)';

      parts.push(content.substring(lastIndex, citation.spanStart));
      parts.push(
        <span key={i} className="text-primary font-medium" title={ref?.apa}>
          {` ${apaText}`}
        </span>
      );
      lastIndex = citation.spanEnd;
    });
    parts.push(content.substring(lastIndex));
    
    return parts.join('').split('\n').filter(p => p.trim() !== '').map((p, i) => <p key={i} className="mb-4 leading-relaxed">{p}</p>);
  };

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
                {generatedContent[index] && <Badge variant="secondary" className="mt-2">Sudah Ditulis</Badge>}
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
                <CardTitle className="text-2xl">Bab {selectedChapter.index}: {selectedChapter.title}</CardTitle>
                <CardDescription>
                  {isGenerating ? 'AI sedang menulis, mohon tunggu...' : 
                  (currentChapterContent ? `Hasil tulisan AI untuk bab ini. (${currentChapterContent.wordCount} kata)` : 'Bab ini siap untuk ditulis oleh AI.')}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col overflow-y-auto">
                <div className="border-t border-dashed pt-6">
                {isGenerating ? (
                    <div className="flex flex-col items-center justify-center text-center py-12">
                        <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        <h3 className="mt-6 text-lg font-medium text-foreground">AI sedang merangkai kata...</h3>
                        <p className="mt-2 text-sm text-muted-foreground">Ini bisa memakan waktu hingga satu menit. Konten mendalam butuh waktu.</p>
                    </div>
                ) : currentChapterContent ? (
                  <Tabs defaultValue="content">
                    <TabsList>
                      <TabsTrigger value="content"><BookText className="mr-2"/>Isi Bab</TabsTrigger>
                      <TabsTrigger value="references"><FileText className="mr-2"/>Daftar Pustaka</TabsTrigger>
                    </TabsList>
                    <TabsContent value="content" className="prose prose-sm max-w-none text-muted-foreground mt-4">
                      <ScrollArea className="h-[50vh] pr-4">
                          {formatContentWithCitations(currentChapterContent.content, currentChapterContent.inlineCitations, currentChapterContent.references)}
                      </ScrollArea>
                    </TabsContent>
                    <TabsContent value="references">
                        <ScrollArea className="h-[50vh] pr-4">
                          <div className="space-y-3 text-sm text-muted-foreground">
                            <h4 className="font-bold text-foreground">Daftar Pustaka</h4>
                            {currentChapterContent.references.map(ref => (
                              <p key={ref.refId}>{ref.apa}</p>
                            ))}
                          </div>
                        </ScrollArea>
                    </TabsContent>
                  </Tabs>
                ) : (
                    <div className="text-center py-20 border-2 border-dashed rounded-lg">
                        <Sparkles className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-medium text-foreground">Konten Belum Dibuat</h3>
                        <p className="mt-1 text-sm text-muted-foreground mb-4">Klik tombol di bawah untuk mulai menulis bab ini.</p>
                        <Button onClick={handleGenerateChapter} disabled={isGenerating}>
                            <Wand2 className="mr-2 h-4 w-4" />
                            {isGenerating ? 'Sedang Menulis...' : `Tulis Bab ${selectedChapter.index}`}
                        </Button>
                    </div>
                )}
                </div>
              </CardContent>
            </Card>

            <div className="mt-auto flex justify-between items-center pt-8 border-t">
              <Button variant="ghost" onClick={onBack}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Kembali ke Outline
              </Button>
              <Button size="lg" onClick={onComplete}>
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
