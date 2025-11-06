'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth, useFirestore } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";

interface RegisterProps {
    onBack: () => void;
    onSwitchToLogin: () => void;
    onRegisterSuccess: () => void;
}

export function Register({ onBack, onSwitchToLogin, onRegisterSuccess }: RegisterProps) {
    const auth = useAuth();
    const firestore = useFirestore();
    const { toast } = useToast();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [plan, setPlan] = useState('free');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!auth || !firestore) {
            toast({ variant: 'destructive', title: 'Error', description: 'Firebase not initialized.' });
            return;
        }
        if (!email || !password || !name) {
            toast({ variant: 'destructive', title: 'Input tidak lengkap', description: 'Harap isi nama, email, dan password.' });
            return;
        }
        setIsLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await updateProfile(userCredential.user, { displayName: name });
            
            // Store user info in Firestore
            await setDoc(doc(firestore, "users", userCredential.user.uid), {
                uid: userCredential.user.uid,
                displayName: name,
                email: email,
                plan: plan,
                createdAt: new Date(),
            });

            toast({ title: 'Pendaftaran Berhasil', description: 'Akun Anda telah dibuat. Selamat datang!' });
            onRegisterSuccess();
        } catch (error: any) {
             toast({
                variant: 'destructive',
                title: 'Pendaftaran Gagal',
                description: error.message || 'Terjadi kesalahan. Silakan coba lagi.',
            });
        } finally {
            setIsLoading(false);
        }
    };


    return (
        <div className="flex-1 flex items-center justify-center bg-muted py-12">
            <div className="w-full max-w-lg p-4">
                <Button variant="ghost" onClick={onBack} className="absolute top-4 left-4 md:top-8 md:left-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Daftar Akun Baru</CardTitle>
                        <CardDescription>Pilih paket dan mulai menulis buku pertama Anda dalam hitungan menit.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Nama Lengkap</Label>
                            <Input id="name" placeholder="Nama Anda" required value={name} onChange={e => setName(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="space-y-4">
                            <Label>Pilih Paket</Label>
                            <RadioGroup value={plan} onValueChange={setPlan} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div>
                                    <RadioGroupItem value="free" id="free" className="peer sr-only" />
                                    <Label htmlFor="free" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        Coba Gratis
                                        <span className="font-normal text-xs mt-1">Rp 0</span>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="pro" id="pro" className="peer sr-only" />
                                    <Label htmlFor="pro" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        Penulis Pro
                                        <span className="font-normal text-xs mt-1">Rp 258.000/bln</span>
                                    </Label>
                                </div>
                                <div>
                                    <RadioGroupItem value="publisher" id="publisher" className="peer sr-only" />
                                    <Label htmlFor="publisher" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                                        Penerbit Pro
                                        <span className="font-normal text-xs mt-1">Rp 500.000/bln</span>
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" onClick={handleRegister} disabled={isLoading}>
                             {isLoading ? <Loader2 className="animate-spin" /> : 'Buat Akun'}
                        </Button>
                         <p className="text-xs text-center text-muted-foreground">
                            Sudah punya akun? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToLogin(); }} className="underline text-primary">Login di sini</a>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
