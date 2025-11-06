'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft } from "lucide-react";

interface LoginProps {
    onBack: () => void;
    onSwitchToRegister: () => void;
}

export function Login({ onBack, onSwitchToRegister }: LoginProps) {
    return (
        <div className="flex-1 flex items-center justify-center bg-muted">
            <div className="w-full max-w-md p-4">
                <Button variant="ghost" onClick={onBack} className="absolute top-4 left-4 md:top-8 md:left-8">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Kembali
                </Button>
                <Card>
                    <CardHeader className="text-center">
                        <CardTitle className="text-2xl">Member Area Login</CardTitle>
                        <CardDescription>Masukkan email dan password Anda.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" required />
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full">Login</Button>
                        <p className="text-xs text-center text-muted-foreground">
                            Belum punya akun? <a href="#" onClick={(e) => { e.preventDefault(); onSwitchToRegister(); }} className="underline text-primary">Daftar di sini</a>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
