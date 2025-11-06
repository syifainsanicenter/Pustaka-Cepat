'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { Project } from '@/lib/types';
import { ArrowLeft, ListTree, Wand2 } from 'lucide-react';

interface OutlineStepProps {
  project: Project;
  onBack: () => void;
}

export function OutlineStep({ project, onBack }: OutlineStepProps) {
  return (
    <div className="flex-1 flex flex-col container mx-auto px-4 md:px-6 py-12">
      <div className="text-center max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Buat Outline Buku</h2>
        <p className="mt-3 text-lg text-muted-foreground">
          AI akan membuat kerangka bab yang terstruktur berdasarkan ide buku yang Anda pilih. Anda dapat menyempurnakannya sebelum menulis.
        </p>
      </div>

      <Card className="my-12 max-w-3xl mx-auto w-full">
        <CardHeader>
          <CardTitle>Buku yang Akan Dibuat:</CardTitle>
          <CardDescription>{project.chosenIdea?.title}</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-12 border-t border-dashed">
            <ListTree className="mx-auto h-16 w-16 text-muted-foreground" />
            <h3 className="mt-4 text-xl font-medium text-foreground">Siap Membuat Outline?</h3>
            <p className="mt-2 text-sm text-muted-foreground">AI akan menghasilkan 8-12 bab lengkap dengan subjudul, tujuan, dan istilah kunci.</p>
            <Button size="lg" className="mt-6">
                <Wand2 className="mr-2 h-5 w-5" />
                Generate Outline
            </Button>
        </CardContent>
      </Card>
      
      <div className="mt-auto flex justify-between items-center pt-8 border-t">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Ide
        </Button>
        <Button size="lg" disabled>
          Lanjut Tulis Bab
        </Button>
      </div>
    </div>
  );
}
