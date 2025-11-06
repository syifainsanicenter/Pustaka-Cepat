'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/firebase";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";

interface AdminLoginProps {
    onBack: () => void;
    onLoginSuccess: () => void;
}

const ADMIN_EMAIL = 'syifainsanicenter@gmail.com';

export function AdminLogin({ onBack, onLoginSuccess }: AdminLoginProps) {
    const auth = useAuth();
    const { toast } = useToast();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!auth) {
            toast({ variant: 'destructive', title: 'Error', description: 'Firebase not initialized.' });
            return;
        }
        if (!email || !password) {
            toast({ variant: 'destructive', title: 'Input tidak lengkap', description: 'Harap isi email dan password.' });
            return;
        }
        if (email !== ADMIN_EMAIL) {
            toast({ variant: 'destructive', title: 'Akses Ditolak', description: 'Email yang Anda masukkan bukan email admin.' });
            return;
        }
        setIsLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast({ title: 'Login Admin Berhasil', description: 'Selamat datang, Pengelola!' });
            onLoginSuccess();
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'Login Gagal',
                description: error.message || 'Terjadi kesalahan. Periksa kembali password Anda.',
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex-1 flex items-center justify-center bg-muted">
            <div className="w-full max-w-md p-4">
                <Button variant="ghost" onClick={onBack} className="absolute top-4 left-4 md:top-8 md:left-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Admin Panel Login</CardTitle>
                        <CardDescription>Khusus untuk pengelola website.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Admin</Label>
                            <Input id="email" type="email" placeholder="admin@example.com" required value={email} onChange={e => setEmail(e.target.value)} disabled={isLoading} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} disabled={isLoading} />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={handleLogin} disabled={isLoading}>
                            {isLoading ? <Loader2 className="animate-spin" /> : 'Login sebagai Admin'}
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}