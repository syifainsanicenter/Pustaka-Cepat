'use client';

import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { ProjectCategory } from '@/lib/types';
import { ArrowLeft, BookCopy, BookMarked, Code, Cpu, GraduationCap, Leaf, MessageSquare, MoonStar, Paintbrush, Presentation, Users } from 'lucide-react';
import { useState } from 'react';

interface CategoryStepProps {
  onSelect: (category: ProjectCategory) => void;
  onBack: () => void;
}

const categories = [
  { id: 'akademik', title: 'Akademik', description: 'Untuk publikasi jurnal, skripsi, atau tesis.', icon: GraduationCap },
  { id: 'buku_ajar', title: 'Buku Ajar', description: 'Materi pengajaran untuk siswa atau mahasiswa.', icon: BookCopy },
  { id: 'monograf', title: 'Monograf', description: 'Kajian mendalam tentang satu topik spesifik.', icon: BookMarked },
  { id: 'populer', title: 'Populer', description: 'Tulisan yang mudah diakses untuk audiens umum.', icon: Users },
  { id: 'islamic', title: 'Islam', description: 'Buku dengan referensi Al-Qur\'an dan Hadis.', icon: MoonStar, featured: true },
  { id: 'ceramah', title: 'Ceramah/Khutbah', description: 'Kumpulan naskah untuk penceramah dan da\'i.', icon: Presentation },
  { id: 'anak', title: 'Buku Anak', description: 'Cerita, komik, atau buku aktivitas mewarnai.', icon: Paintbrush },
  { id: 'panduan_coding', title: 'Panduan Coding', description: 'Buku panduan praktis untuk pemrograman.', icon: Code },
  { id: 'panduan_ai', title: 'Panduan AI', description: 'Panduan tentang kecerdasan buatan.', icon: Cpu },
  { id: 'panduan_pertanian', title: 'Panduan Pertanian', description: 'Teknik dan tips untuk bertani modern.', icon: Leaf },
  { id: 'panduan_thibbun', title: 'Thibbun Nabawi', description: 'Panduan pengobatan cara Nabi.', icon: MessageSquare },
] as const;

export function CategoryStep({ onSelect, onBack }: CategoryStepProps) {
  const [selected, setSelected] = useState<ProjectCategory | null>(null);

  return (
    <div className="flex-1 flex flex-col container mx-auto px-4 md:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Pilih Kategori Buku Anda</h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Setiap kategori memiliki template dan dukungan AI yang disesuaikan untuk hasil terbaik.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 my-12">
        {categories.map((cat) => (
          <Card
            key={cat.id}
            onClick={() => setSelected(cat.id)}
            className={cn(
              'cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              selected === cat.id ? 'ring-2 ring-primary shadow-xl' : 'shadow-md',
              cat.featured && 'border-primary/50 relative overflow-hidden'
            )}
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelected(cat.id); }}
          >
            {cat.featured && (
              <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-bl-lg">
                Fitur Dalil
              </div>
            )}
            <CardHeader className="flex-row items-center gap-4">
              <div className={cn("p-3 rounded-lg", selected === cat.id ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground')}>
                <cat.icon className="w-7 h-7" />
              </div>
              <div>
                <CardTitle className="text-lg">{cat.title}</CardTitle>
                <CardDescription className="text-sm mt-1">{cat.description}</CardDescription>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
      
      <div className="mt-auto flex justify-between items-center pt-8 border-t">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali
        </Button>
        <Button size="lg" disabled={!selected} onClick={() => selected && onSelect(selected)}>
          Lanjut ke Ideasi
        </Button>
      </div>
    </div>
  );
}
