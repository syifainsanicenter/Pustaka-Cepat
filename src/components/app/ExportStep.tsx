'use client';

import { ArrowLeft, FileText, FileType } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import type { Project } from '@/lib/types';
import type { ChapterContent } from './ChapterStep';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, PageBreak, PageNumber, NumberFormat } from 'docx';
import { saveAs } from 'file-saver';

interface ExportStepProps {
  project: Project;
  chapterContent: ChapterContent;
  onBack: () => void;
}

export function ExportStep({ project, chapterContent, onBack }: ExportStepProps) {
  const generateDocx = () => {
    if (!project.outline) return;
    
    const authorName = "Nama Penulis"; // Placeholder
    const bookTitle = project.chosenIdea?.title || 'Judul Buku';
    const synopsis = "Ini adalah placeholder untuk sinopsis buku Anda. Jelaskan secara singkat isi dan keunggulan buku ini untuk menarik minat pembaca di cover belakang.";

    const doc = new Document({
      creator: "Pustaka Kilat AI",
      title: bookTitle,
      styles: {
        paragraphStyles: [
            {
                id: "Normal",
                name: "Normal",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: { font: "Source Serif 4", size: 24 }, // 12pt
                paragraph: { alignment: AlignmentType.JUSTIFIED, spacing: { line: 360 } } // 1.5 lines
            },
            {
                id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { font: "Source Serif 4", size: 32, bold: true }, // 16pt
                paragraph: { spacing: { before: 480, after: 240 }, alignment: AlignmentType.LEFT }
            },
            {
                id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { font: "Source Serif 4", size: 28, bold: true }, // 14pt
                paragraph: { spacing: { before: 240, after: 120 }, alignment: AlignmentType.LEFT }
            },
             {
                id: "Title", name: "Title", basedOn: "Normal", next: "Normal", quickFormat: true,
                run: { font: "Source Serif 4", size: 48, bold: true }, // 24pt
                paragraph: { spacing: { after: 480 }, alignment: AlignmentType.CENTER },
            },
            {
                id: "Subtitle", name: "Subtitle", basedOn: "Normal", next: "Normal",
                run: { font: "Source Serif 4", size: 28 }, // 14pt
                paragraph: { alignment: AlignmentType.CENTER },
            },
            {
                id: "Copyright", name: "Copyright", basedOn: "Normal", next: "Normal",
                run: { size: 20 }, // 10pt
                paragraph: { alignment: AlignmentType.LEFT },
            }
        ],
      },
      sections: [
        {
          // Cover Depan
          children: [
            new Paragraph({ text: "", spacing: { before: 2000 } }),
            new Paragraph({ text: bookTitle, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
            new Paragraph({ text: "", spacing: { after: 1000 } }),
            new Paragraph({ text: authorName, heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
            new Paragraph({ text: "", pageBreakBefore: true }),
          ],
        },
        { // Halaman Judul Dalam & Hak Cipta
          properties: { page: { pageNumbers: { start: 1, formatType: NumberFormat.DECIMAL }}},
          children: [
            // Cover Dalam
            new Paragraph({ text: "", spacing: { before: 2000 } }),
            new Paragraph({ text: bookTitle, heading: HeadingLevel.TITLE, alignment: AlignmentType.CENTER }),
            new Paragraph({ text: "", spacing: { after: 1000 } }),
            new Paragraph({ text: authorName, heading: HeadingLevel.HEADING_2, alignment: AlignmentType.CENTER }),
            new Paragraph({ text: "", pageBreakBefore: true }),
            // Hak Cipta
            new Paragraph({
              style: "Copyright",
              children: [ new TextRun(`© ${new Date().getFullYear()} ${authorName}`)],
            }),
            new Paragraph({
                style: "Copyright",
                children: [ new TextRun("Hak Cipta Dilindungi Undang-Undang")],
            }),
            new Paragraph({
                style: "Copyright",
                children: [ new TextRun("Dilarang mengutip atau memperbanyak sebagian atau seluruh isi buku ini tanpa izin tertulis dari penulis.")],
            }),
            new Paragraph({ text: "", pageBreakBefore: true }),
            // Kata Pengantar
            new Paragraph({ text: "Kata Pengantar", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "[Tuliskan kata pengantar Anda di sini. Ucapkan terima kasih kepada pihak-pihak yang telah membantu dan jelaskan secara singkat latar belakang penulisan buku ini.]", style: "Normal" }),
            new Paragraph({ text: "", pageBreakBefore: true }),
            // Daftar Isi
            new Paragraph({ text: "Daftar Isi", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "[Daftar isi dapat dibuat secara otomatis di Microsoft Word. Klik kanan di sini dan pilih 'Update Field' setelah Anda selesai mengedit.]", style: "Normal" }),
            new Paragraph({ text: "", pageBreakBefore: true }),
            
            // Bab-bab
            ...project.outline.chapters.flatMap((chapter) => {
              const chapterChildren = [
                new Paragraph({
                  text: `Bab ${chapter.index}: ${chapter.title}`,
                  heading: HeadingLevel.HEADING_1,
                })
              ];

              const subheadings = chapterContent[chapter.index - 1] || {};

              chapter.subheadings.forEach((subheading, subIndex) => {
                chapterChildren.push(
                  new Paragraph({
                    text: subheading,
                    heading: HeadingLevel.HEADING_2,
                  })
                );
                const content = subheadings[subIndex]?.content;
                if (content) {
                  const paragraphs = content.split('\n').filter(p => p.trim() !== '').map(p => new Paragraph({
                    children: [new TextRun(p)],
                    style: "Normal",
                  }));
                  chapterChildren.push(...paragraphs);
                } else {
                  chapterChildren.push(new Paragraph({ text: '[Konten belum digenerate]', style: "Normal" }));
                }
              });

              return chapterChildren;
            }),
            new Paragraph({ text: "", pageBreakBefore: true }),
            
            // Penutup
            new Paragraph({ text: "Penutup", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "[Tuliskan kesimpulan, rangkuman, atau refleksi akhir dari keseluruhan isi buku Anda di sini.]", style: "Normal" }),
            new Paragraph({ text: "", pageBreakBefore: true }),

            // Daftar Pustaka
            new Paragraph({ text: "Daftar Pustaka", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "[Kumpulkan semua referensi yang Anda gunakan dalam format APA atau gaya sitasi lain yang sesuai di sini.]", style: "Normal" }),
             new Paragraph({ text: "", pageBreakBefore: true }),

            // Lampiran
            new Paragraph({ text: "Lampiran", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "[Jika ada, masukkan data tambahan, tabel, atau materi pendukung lainnya di sini.]", style: "Normal" }),
            new Paragraph({ text: "", pageBreakBefore: true }),

            // Biodata Penulis
            new Paragraph({ text: "Biodata Penulis", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "[Tuliskan biografi singkat Anda, termasuk latar belakang pendidikan, karya, dan kontak profesional Anda.]", style: "Normal" }),
             new Paragraph({ text: "", pageBreakBefore: true }),
             
            // Cover Belakang
            new Paragraph({ text: "Sinopsis Cover Belakang", heading: HeadingLevel.HEADING_1, alignment: AlignmentType.CENTER }),
            new Paragraph({ text: synopsis, style: "Normal" }),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      saveAs(blob, `${project.chosenIdea?.title || 'buku'}.docx`);
    });
  };

  const getFullManuscript = () => {
    let manuscript = `# ${project.chosenIdea?.title || 'Judul Buku'}\n\n`;
    if (!project.outline) return manuscript;

    project.outline.chapters.forEach((chapter) => {
      manuscript += `## Bab ${chapter.index}: ${chapter.title}\n\n`;
      const subheadings = chapterContent[chapter.index - 1] || {};
      chapter.subheadings.forEach((subheading, subIndex) => {
        manuscript += `### ${subheading}\n\n`;
        const content = subheadings[subIndex]?.content;
        if (content) {
          manuscript += `${content}\n\n`;
        } else {
          manuscript += `[Konten belum digenerate]\n\n`;
        }
      });
    });
    return manuscript;
  };

  return (
    <div className="flex-1 flex flex-col container mx-auto px-4 md:px-6 py-12">
      <div className="text-center max-w-2xl mx-auto">
        <h2 className="text-3xl font-bold tracking-tight">Ekspor Naskah Anda</h2>
        <p className="mt-3 text-lg text-muted-foreground">
          Unduh draf naskah Anda dalam format yang Anda butuhkan. Anda bisa mengekspornya kapan saja, bahkan jika belum selesai.
        </p>
      </div>

      <div className="my-12 grid md:grid-cols-2 gap-8">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Opsi Ekspor</CardTitle>
            <CardDescription>Pilih format file untuk mengunduh naskah Anda.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center items-center gap-6">
            <Button size="lg" className="w-full h-20 text-lg" onClick={generateDocx}>
              <FileType className="mr-4 h-8 w-8" />
              Unduh sebagai DOCX
            </Button>
            <Button size="lg" variant="outline" className="w-full h-20 text-lg" disabled>
              <FileText className="mr-4 h-8 w-8" />
              Unduh sebagai PDF (Segera)
            </Button>
          </CardContent>
        </Card>
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>Pratinjau Naskah</CardTitle>
            <CardDescription>Tampilan draf naskah Anda saat ini.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1">
            <ScrollArea className="h-80 border rounded-md p-4 bg-muted/50">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap font-body">
                {getFullManuscript()}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <div className="mt-auto flex justify-between items-center pt-8 border-t">
        <Button variant="ghost" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Kembali ke Penulisan Bab
        </Button>
      </div>
    </div>
  );
}
