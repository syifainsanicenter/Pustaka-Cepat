
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BookOpen, Download, FileText, Languages, Lightbulb, ListTree, MoonStar, CheckCircle2 } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Script from 'next/script';

interface LandingPageProps {
  onStart: () => void;
  onLogin: () => void;
  onRegister: () => void;
  onAdminLogin: () => void;
}

const workflowSteps = [
  { icon: BookOpen, title: 'Pilih Kategori', description: 'Tentukan jenis buku Anda, dari akademik hingga populer.' },
  { icon: Lightbulb, title: 'Generate Ide', description: 'Dapatkan puluhan ide judul dan angle unik dari AI.' },
  { icon: Languages, title: 'Atur Gaya', description: 'Sesuaikan bahasa, gaya penulisan, dan nada suara.' },
  { icon: ListTree, title: 'Susun Outline', description: 'Buat kerangka buku 8-12 bab yang terstruktur dan logis.' },
  { icon: FileText, title: 'Tulis Bab', description: 'Generate konten bab lengkap dengan sitasi APA dan dalil.' },
  { icon: Download, title: 'Ekspor Hasil', description: 'Unduh naskah Anda dalam format DOCX, PDF, atau LaTeX.' },
];

export function LandingPage({ onStart, onLogin, onRegister, onAdminLogin }: LandingPageProps) {
  const heroImage = PlaceHolderImages.find(img => img.id === 'landing-hero');

  return (
    <div className="flex-1 bg-background">
      <header className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center sticky top-0 bg-background/80 backdrop-blur-sm z-50">
        <div className="flex items-center gap-3">
          <BookHeart className="h-8 w-8 text-primary" />
          <span className="text-2xl font-semibold text-foreground">Pustaka Kilat</span>
        </div>
        <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
          <a href="#fitur" className="text-muted-foreground hover:text-primary transition-colors">Fitur</a>
          <a href="#harga" className="text-muted-foreground hover:text-primary transition-colors">Dukung Kami</a>
          <a href="#demo" className="text-muted-foreground hover:text-primary transition-colors">Demo</a>
        </nav>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={onLogin}>Login</Button>
          <Button variant="secondary" className="rounded-full" onClick={onRegister}>Daftar</Button>
        </div>
      </header>
      
      <main>
        <section className="container mx-auto px-4 md:px-6 py-16 md:py-24">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground !leading-tight">
                Tulis buku ≤ 1 jam, dengan sitasi APA & dalil Islami.
              </h1>
              <p className="text-lg text-muted-foreground">
                Pustaka Kilat AI mengubah ide Anda menjadi outline terstruktur dan bab-bab berkualitas, konsisten dengan gaya penulisan dan sitasi yang Anda butuhkan.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="rounded-full shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1" onClick={onStart}>
                  Mulai Gratis
                </Button>
                <Button size="lg" variant="outline" className="rounded-full">
                  Lihat Demo 2 menit
                </Button>
              </div>
            </div>
            <div className="relative">
              {heroImage && (
                <Image
                  src={heroImage.imageUrl}
                  alt={heroImage.description}
                  width={600}
                  height={500}
                  data-ai-hint={heroImage.imageHint}
                  className="rounded-xl shadow-2xl"
                />
              )}
              <div className="absolute -top-4 -right-4 bg-accent text-accent-foreground font-bold px-4 py-2 rounded-full shadow-lg transform rotate-6">
                Turbo 60&apos;
              </div>
            </div>
          </div>
        </section>

        <section id="fitur" className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6">
            <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Fitur Unggulan & Alur Kerja</h2>
            <p className="text-lg text-center text-muted-foreground mb-12 max-w-3xl mx-auto">Dari ide mentah hingga naskah siap terbit, semua alat yang Anda butuhkan ada di sini. Terintegrasi, cerdas, dan super cepat.</p>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6">
              {workflowSteps.map((step, index) => (
                <Card key={index} className="text-center bg-card/80 backdrop-blur-sm border-0 shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <CardHeader className="items-center">
                    <div className="bg-secondary p-3 rounded-lg">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <h3 className="font-semibold text-foreground">{step.title}</h3>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="demo" className="container mx-auto px-4 md:px-6 py-16 md:py-24">
            <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Lihat Cara Kerjanya</h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-4">Contoh Hasil Bab</h3>
              <p className="text-sm text-muted-foreground mb-2">Bab 3: Etika Kecerdasan Buatan</p>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Perkembangan pesat kecerdasan buatan (AI) memunculkan tantangan etis yang signifikan. Diperlukan kerangka kerja yang kuat untuk memastikan teknologi ini dikembangkan dan diterapkan secara bertanggung jawab <span className="text-primary font-medium">(Russel & Norvig, 2021)</span>. Salah satu perhatian utama adalah potensi bias dalam algoritma AI, yang dapat melanggengkan ketidaksetaraan sosial yang ada.
                </p>
                <p>
                  Selain itu, isu otonomi mesin dan dampaknya pada pengambilan keputusan manusia menjadi perdebatan hangat di kalangan filsuf dan teknolog <span className="text-primary font-medium">(Bostrom, 2014)</span>. Transparansi dan akuntabilitas sistem AI juga menjadi kunci untuk membangun kepercayaan publik.
                </p>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-2xl font-bold mb-4 flex items-center gap-2">Dukungan Konten Islami <MoonStar className="w-6 h-6 text-accent"/></h3>
              <p className="text-sm text-muted-foreground mb-2">Contoh penyisipan dalil.</p>
              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
                <p>
                  Dalam Islam, menuntut ilmu adalah kewajiban. Pengembangan teknologi seperti AI dapat dilihat sebagai bagian dari upaya memaksimalkan potensi akal yang dianugerahkan Tuhan, sebagaimana firman-Nya:
                </p>
                <div className="bg-muted p-4 rounded-lg border text-right">
                  <p className="font-arabic text-xl text-foreground leading-loose" dir="rtl">
                    قُلْ هَلْ يَسْتَوِي الَّذِينَ يَعْلَمُونَ وَالَّذِينَ لَا يَعْلَمُونَ
                  </p>
                  <p className="text-left mt-2">
                    (Katakanlah: "Adakah sama orang-orang yang mengetahui dengan orang-orang yang tidak mengetahui?") <span className="font-medium text-primary">(Qur'an 39:9)</span>.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </section>

        <section id="harga" className="bg-muted py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 text-center">
            <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Dukung Pustaka Kilat Sekarang</h2>
            <p className="text-lg text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
              Jika Anda merasa alat ini membantu, pertimbangkan untuk memberikan dukungan agar kami bisa terus berkembang dan memberikan lebih banyak fitur bermanfaat.
            </p>
            <div className="text-center">
              <a href="https://trakteer.id/suhaya_riyana2" target="_blank" rel="noopener noreferrer">
                <img 
                  id="wse-buttons-preview" 
                  src="https://edge-cdn.trakteer.id/images/embed/trbtn-blue-1.png?v=14-05-2025" 
                  height="40" 
                  style={{ border: '0px', height: '40px', display: 'inline-block' }} 
                  alt="Dukung Pustaka Kilat" 
                />
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-foreground text-background mt-auto">
        <div className="container mx-auto px-4 md:px-6 py-8 text-center text-sm text-muted-foreground">
          <a href="#" onClick={(e) => { e.preventDefault(); onAdminLogin(); }} className="hover:text-primary">Admin Login</a>
          <p className='mt-2'>&copy; {new Date().getFullYear()} Pustaka Kilat AI. Semua hak dilindungi.</p>
        </div>
      </footer>
    </div>
  );
}

const BookHeart = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/><path d="M12 13.5c-3 0-5-2-5-5 0-3 2-5 5-5s5 2 5 5c0 3-2 5-5 5z"/></svg>
)

    