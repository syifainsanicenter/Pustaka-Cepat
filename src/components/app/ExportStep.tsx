'use client';

import { ArrowLeft, FileText, FileType } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import type { Project } from '@/lib/types';
import type { ChapterContent } from './ChapterStep';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

interface ExportStepProps {
  project: Project;
  chapterContent: ChapterContent;
  onBack: () => void;
}

export function ExportStep({ project, chapterContent, onBack }: ExportStepProps) {
  const generateDocx = () => {
    if (!project.outline) return;

    const doc = new Document({
      sections: [
        {
          children: [
            new Paragraph({
              text: project.chosenIdea?.title || 'Judul Buku',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              text: `oleh ${'Nama Penulis'}`, // Placeholder
              alignment: AlignmentType.CENTER,
            }),
            ...project.outline.chapters.flatMap((chapter) => {
              const chapterChildren = [];
              chapterChildren.push(
                new Paragraph({
                  text: `Bab ${chapter.index}: ${chapter.title}`,
                  heading: HeadingLevel.HEADING_1,
                  pageBreakBefore: true,
                })
              );

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
                  const paragraphs = content.split('\n').map(p => new Paragraph({
                    children: [new TextRun(p)],
                    alignment: AlignmentType.JUSTIFIED,
                  }));
                  chapterChildren.push(...paragraphs);
                } else {
                  chapterChildren.push(new Paragraph({ text: '[Konten belum digenerate]' }));
                }
              });

              return chapterChildren;
            }),
          ],
        },
      ],
      styles: {
        paragraphStyles: [
            {
                id: "Normal",
                name: "Normal",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
                    font: "Source Serif 4",
                    size: 24, // 12pt
                },
            },
            {
                id: "Heading1",
                name: "Heading 1",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
                    font: "Source Serif 4",
                    size: 32, // 16pt
                    bold: true,
                },
                paragraph: {
                    spacing: { after: 240 },
                },
            },
            {
                id: "Heading2",
                name: "Heading 2",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
                    font: "Source Serif 4",
                    size: 28, // 14pt
                    bold: true,
                },
                paragraph: {
                    spacing: { after: 120 },
                },
            },
             {
                id: "Title",
                name: "Title",
                basedOn: "Normal",
                next: "Normal",
                quickFormat: true,
                run: {
                    font: "Source Serif 4",
                    size: 48, // 24pt
                    bold: true,
                },
                 paragraph: {
                    spacing: { after: 480 },
                },
            },
        ],
    },
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
