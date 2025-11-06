'use client';

import type { GenerateBookIdeasOutput, GenerateBookIdeasInput } from '@/ai/flows/generate-book-ideas';
import type { Project } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateIdeasAction } from '@/app/actions';
import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, BookUp, Lightbulb, Loader2, Star, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';

interface IdeationStepProps {
  project: Project;
  onComplete: (ideas: GenerateBookIdeasOutput['ideas'], chosenIdea: GenerateBookIdeasOutput['ideas'][0]) => void;
  onBack: () => void;
}

const formSchema = z.object({
  projectTitle: z.string().min(5, 'Judul proyek minimal 5 karakter.'),
  audience: z.string().min(5, 'Audiens minimal 5 karakter.'),
  goal: z.string().min(5, 'Tujuan minimal 5 karakter.'),
});

export function IdeationStep({ project, onComplete, onBack }: IdeationStepProps) {
  const [isPending, startTransition] = useTransition();
  const [ideas, setIdeas] = useState<GenerateBookIdeasOutput['ideas'] | undefined>(project.ideas);
  const [chosenIdea, setChosenIdea] = useState<GenerateBookIdeasOutput['ideas'][0] | undefined>(project.chosenIdea);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      projectTitle: project.projectTitle || '',
      audience: project.audience || '',
      goal: project.goal || '',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      setIdeas(undefined);
      setChosenIdea(undefined);
      const result = await generateIdeasAction({ 
        ...values, 
        category: project.category!,
        language: project.language!,
        writingStyle: project.writingStyle!,
        tone: project.tone!
      });
      if (result.error) {
        toast({
          variant: 'destructive',
          title: 'Gagal Membuat Ide',
          description: result.error,
        });
      } else if (result.ideas){
        setIdeas(result.ideas);
      }
    });
  };

  const handleSelectIdea = (idea: GenerateBookIdeasOutput['ideas'][0]) => {
    setChosenIdea(idea);
  }

  return (
    <div className="flex-1 grid md:grid-cols-12 gap-0 min-h-full">
      <div className="md:col-span-4 lg:col-span-3 border-r bg-muted/20 p-6 flex flex-col">
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">Detail Proyek</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Isi detail ini untuk membantu AI memberikan ide yang paling relevan.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
              <FormField
                control={form.control}
                name="projectTitle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Judul Proyek</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Sejarah Islam di Asia Tenggara" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="audience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Target Audiens</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Contoh: Mahasiswa Sejarah, peminat studi Islam" {...field} rows={2} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="goal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tujuan Buku</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Contoh: Menjadi buku ajar semester 1" {...field} rows={2}/>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="w-full">
                {isPending ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                Generate Ide
              </Button>
            </form>
          </Form>
        </div>
      </div>
      <main className="md:col-span-8 lg:col-span-9 p-6 md:p-8 flex flex-col">
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight">Hasil Ideasi</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Pilih satu ide yang paling sesuai untuk dijadikan outline buku Anda.
          </p>
          <div className="mt-6">
            {!ideas && !isPending && (
              <div className="text-center py-20 border-2 border-dashed rounded-lg">
                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">Belum ada ide</h3>
                <p className="mt-1 text-sm text-muted-foreground">Klik 'Generate Ide' untuk memulai.</p>
              </div>
            )}
            {isPending && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-6 bg-muted rounded w-3/4"></div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-5/6"></div>
                    </CardContent>
                    <CardFooter>
                       <div className="h-10 bg-muted rounded w-full"></div>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
            {ideas && (
               <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {ideas.map((idea, i) => (
                  <Card key={i} className={cn(
                    "flex flex-col transition-all duration-300",
                    chosenIdea?.title === idea.title ? 'ring-2 ring-primary shadow-xl' : 'shadow-md hover:shadow-lg'
                  )}>
                    <CardHeader>
                      <CardTitle className="text-lg leading-snug">{idea.title}</CardTitle>
                      <CardDescription className="text-sm !mt-2 text-primary">{idea.angle}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-sm text-muted-foreground">{idea.rationale}</p>
                    </CardContent>
                    <CardFooter className="flex flex-col items-stretch gap-4">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-muted-foreground">Kecocokan Audiens:</span>
                        <Badge variant={idea.audienceFitScore > 80 ? 'default' : 'secondary'}>{idea.audienceFitScore}%</Badge>
                      </div>
                      <Button className="w-full" variant={chosenIdea?.title === idea.title ? 'default' : 'outline'} onClick={() => handleSelectIdea(idea)}>
                        {chosenIdea?.title === idea.title ? <Star className="mr-2 h-4 w-4 fill-current" /> : <BookUp className="mr-2 h-4 w-4" />}
                        {chosenIdea?.title === idea.title ? 'Terpilih' : 'Pilih Ide Ini'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
               </div>
            )}
          </div>
        </div>
        <div className="mt-8 flex justify-between items-center pt-8 border-t">
          <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Kategori
          </Button>
          <Button size="lg" disabled={!chosenIdea} onClick={() => ideas && chosenIdea && onComplete(ideas, chosenIdea)}>
            Lanjut ke Gaya
          </Button>
        </div>
      </main>
    </div>
  );
}
