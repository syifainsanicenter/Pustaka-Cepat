'use client';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useFirestore, useUser } from '@/firebase';
import { collection, query } from 'firebase/firestore';
import { ArrowLeft, Loader2, Users } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useMemo } from 'react';

interface AdminPageProps {
  onBack: () => void;
}

const ADMIN_EMAIL = 'syifainsanicenter@gmail.com';

export function AdminPage({ onBack }: AdminPageProps) {
  const firestore = useFirestore();
  const { user: adminUser } = useUser();

  const usersQuery = useMemo(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'users'));
  }, [firestore]);

  const { data: users, loading, error } = useCollection(usersQuery);

  if (adminUser?.email !== ADMIN_EMAIL) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center container mx-auto px-4 md:px-6 py-12">
        <Card className="max-w-md text-center">
            <CardHeader>
                <CardTitle>Akses Ditolak</CardTitle>
            </CardHeader>
            <CardContent>
                <p>Hanya admin yang dapat mengakses halaman ini.</p>
                <Button onClick={onBack} className="mt-4">Kembali ke Aplikasi</Button>
            </CardContent>
        </Card>
      </div>
    );
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case 'free':
        return <Badge variant="secondary">Coba Gratis</Badge>;
      case 'pro':
        return <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">Penulis Pro</Badge>;
      case 'publisher':
        return <Badge variant="destructive">Penerbit Pro</Badge>;
      default:
        return <Badge variant="outline">{plan}</Badge>;
    }
  };

  return (
    <div className="flex-1 flex flex-col container mx-auto px-4 md:px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
            <h2 className="text-3xl font-bold tracking-tight">Panel Admin</h2>
            <p className="text-muted-foreground">Kelola pengguna terdaftar.</p>
        </div>
        <Button variant="ghost" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Kembali ke Aplikasi
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Users /> Daftar Pengguna</CardTitle>
          <CardDescription>Total {users?.length || 0} pengguna terdaftar.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="ml-4">Memuat data pengguna...</p>
            </div>
          )}
          {error && <p className="text-destructive">Error: {error.message}</p>}
          {!loading && users && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Paket</TableHead>
                  <TableHead>Tanggal Daftar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u: any) => (
                  <TableRow key={u.uid}>
                    <TableCell className="font-medium">{u.displayName}</TableCell>
                    <TableCell>{u.email}</TableCell>
                    <TableCell>{getPlanBadge(u.plan)}</TableCell>
                    <TableCell>
                      {u.createdAt?.toDate ? u.createdAt.toDate().toLocaleDateString('id-ID') : 'N/A'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
