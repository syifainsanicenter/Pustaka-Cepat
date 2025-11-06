'use client';

import type { Project, ProjectLanguage } from '@/lib/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface StyleStepProps {
  project: Project;
  onComplete: (style: { writingStyle: string; tone: string, language: ProjectLanguage }) => void;
  onBack: () => void;
}

const formSchema = z.object({
  language: z.enum(['id', 'en', 'ar', 'su', 'jv', 'zh']),
  writingStyle: z.string().min(3, 'Gaya penulisan harus diisi.'),
  tone: z.string().min(3, 'Gaya bahasa harus diisi.'),
});

export function StyleStep({ project, onComplete, onBack }: StyleStepProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: project.language || 'id',
      writingStyle: project.writingStyle || 'akademik ketat',
      tone: project.tone || 'formal',
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onComplete(values);
  };

  return (
    <div className="flex-1 flex flex-col container mx-auto px-4 md:px-6 py-12">
        <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight">Atur Gaya Penulisan</h2>
            <p className="mt-3 text-lg text-muted-foreground">
                Sesuaikan bahasa, gaya penulisan, dan nada agar sesuai dengan audiens Anda.
            </p>
        </div>
        <Card className="max-w-2xl mx-auto w-full my-12">
            <CardHeader>
                <CardTitle>Preferensi Gaya</CardTitle>
                <CardDescription>AI akan mengikuti preferensi ini saat menulis konten Anda.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Bahasa</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Pilih bahasa naskah" />
                                </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                <SelectItem value="id">Indonesia</SelectItem>
                                <SelectItem value="en">Inggris</SelectItem>
                                <SelectItem value="ar">Arab</SelectItem>
                                <SelectItem value="su">Sunda</SelectItem>
                                <SelectItem value="jv">Jawa</SelectItem>
                                <SelectItem value="zh">Mandarin</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
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
                                    <SelectItem value="naratif">Naratif</SelectItem>
                                    <SelectItem value="deskriptif">Deskriptif</SelectItem>
                                    <SelectItem value="persuasif">Persuasif</SelectItem>
                                    <SelectItem value="argumentatif">Argumentatif</SelectItem>
                                    <SelectItem value="inspiratif">Inspiratif</SelectItem>
                                    <SelectItem value="jurnalistik investigatif">Jurnalistik Investigatif</SelectItem>
                                    <SelectItem value="populer ilmiah">Populer Ilmiah</SelectItem>
                                    <SelectItem value="akademik ketat">Akademik Ketat</SelectItem>
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
                                    <SelectItem value="hangat">Hangat</SelectItem>
                                    <SelectItem value="kocak">Kocak</SelectItem>
                                    <SelectItem value="gaul">Gaul</SelectItem>
                                    <SelectItem value="objektif">Objektif</SelectItem>
                                    <SelectItem value="inspiratif">Inspiratif</SelectItem>
                                </SelectContent>
                            </Select>
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
