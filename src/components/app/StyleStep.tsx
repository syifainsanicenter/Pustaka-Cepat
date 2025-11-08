'use client';

import type { Project } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Slider } from '../ui/slider';

interface StyleStepProps {
  project: Project;
  onComplete: (style: { writingStyle: string; tone: string; chaptersCount: number; }) => void;
  onBack: () => void;
}

const formSchema = z.object({
  writingStyle: z.string().min(3, 'Gaya penulisan harus diisi.'),
  tone: z.string().min(3, 'Gaya bahasa harus diisi.'),
  chaptersCount: z.number().min(3).max(20),
});

export function StyleStep({ project, onComplete, onBack }: StyleStepProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      writingStyle: project.writingStyle || 'akademik ketat',
      tone: project.tone || 'formal',
      chaptersCount: project.chaptersCount || 10,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onComplete(values);
  };
  
  const chaptersCount = form.watch('chaptersCount');

  return (
    <div className="flex-1 flex flex-col container mx-auto px-4 md:px-6 py-12">
        <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Atur Gaya & Struktur</h2>
            <p className="mt-3 text-lg text-muted-foreground">
                Sesuaikan gaya penulisan, nada, dan jumlah bab agar sesuai dengan proyek Anda.
            </p>
        </div>
        <Card className="max-w-2xl mx-auto w-full my-12">
            <CardHeader>
                <CardTitle>Preferensi Gaya & Struktur</CardTitle>
                <CardDescription>AI akan mengikuti preferensi ini saat menulis konten Anda.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="writingStyle"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gaya Penulisan</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih gaya penulisan" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="akademik ketat">Akademik Ketat</SelectItem>
                                    <SelectItem value="populer ilmiah">Populer Ilmiah</SelectItem>
                                    <SelectItem value="naratif">Naratif / Cerita</SelectItem>
                                    <SelectItem value="deskriptif">Deskriptif</SelectItem>
                                    <SelectItem value="persuasif">Persuasif</SelectItem>
                                    <SelectItem value="argumentatif">Argumentatif</SelectItem>
                                    <SelectItem value="inspiratif">Inspiratif</SelectItem>
                                    <SelectItem value="jurnalistik investigatif">Jurnalistik Investigatif</SelectItem>
                                    <SelectItem value="tutorial langkah-demi-langkah">Tutorial Langkah-demi-Langkah</SelectItem>
                                    <SelectItem value="kumpulan contoh ceramah">Kumpulan Contoh Ceramah</SelectItem>
                                    <SelectItem value="kumpulan tips praktis">Kumpulan Tips Praktis</SelectItem>
                                    <SelectItem value="kumpulan cerita bergambar">Kumpulan Cerita Bergambar</SelectItem>
                                    <SelectItem value="biografi">Biografi</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tone"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Gaya Bahasa (Nada)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih gaya bahasa" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="formal">Formal</SelectItem>
                                    <SelectItem value="semi-formal">Semi-Formal</SelectItem>
                                    <SelectItem value="informal">Informal</SelectItem>
                                    <SelectItem value="untuk anak-anak">Untuk Anak-anak</SelectItem>
                                    <SelectItem value="untuk remaja">Untuk Remaja</SelectItem>
                                    <SelectItem value="untuk dewasa">Untuk Dewasa</SelectItem>
                                    <SelectItem value="hangat dan ramah">Hangat & Ramah</SelectItem>
                                    <SelectItem value="humoris">Humoris</SelectItem>
                                    <SelectItem value="puitis">Puitis</SelectItem>
                                    <SelectItem value="objektif dan teknis">Objektif & Teknis</SelectItem>
                                    <SelectItem value="inspiratif dan memotivasi">Inspiratif & Memotivasi</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="chaptersCount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Jumlah Bab: {chaptersCount}</FormLabel>
                                <FormControl>
                                    <Slider
                                        min={3}
                                        max={20}
                                        step={1}
                                        defaultValue={[field.value]}
                                        onValueChange={(value) => field.onChange(value[0])}
                                    />
                                </FormControl>
                                <FormDescription>
                                    Pilih jumlah bab yang akan dibuat oleh AI.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                        />
                    </form>
                </Form>
            </CardContent>
        </Card>
      
      <div className="mt-auto flex justify-between items-center pt-8 border-t">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Ide
        </Button>
        <Button size="lg" onClick={form.handleSubmit(onSubmit)}>
          Lanjut ke Outline
        </Button>
      </div>
    </div>
  );
}
