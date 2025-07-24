
"use client";

import { useState, useMemo } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { updateUserRole } from '@/lib/firebase';
import { UserProfile } from '@/types';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const RoleSelector = ({ user, onRoleChange }: { user: UserProfile; onRoleChange: (uid: string, role: "admin" | "editor" | "usuario") => Promise<void> }) => {
    const [currentRole, setCurrentRole] = useState(user.role);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleValueChange = async (newRole: "admin" | "editor" | "usuario") => {
        setIsUpdating(true);
        await onRoleChange(user.uid, newRole);
        setCurrentRole(newRole);
        setIsUpdating(false);
    };

    return (
        <div className="flex items-center gap-2">
            <Select value={currentRole} onValueChange={handleValueChange} disabled={isUpdating}>
                <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="usuario">Usuario</SelectItem>
                    <SelectItem value="editor">Editor</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
            </Select>
            {isUpdating && <Loader2 className="h-4 w-4 animate-spin" />}
        </div>
    );
};

export function UserManagementTab() {
    const { users, loading } = useUsers();
    const [searchTerm, setSearchTerm] = useState('');
    const { toast } = useToast();

    const filteredUsers = useMemo(() => {
        if (!searchTerm) return users;
        return users.filter(user =>
            user.nickname.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [users, searchTerm]);

    const handleRoleChange = async (uid: string, role: "admin" | "editor" | "usuario") => {
        try {
            await updateUserRole(uid, role);
            toast({
                title: 'Rol actualizado',
                description: `El rol del usuario ha sido cambiado a ${role}.`,
            });
        } catch (error) {
            console.error(error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo actualizar el rol.',
            });
        }
    };

    if (loading) {
        return <div className="flex justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
    }

    return (
        <div className="space-y-4">
            <h2 className="text-2xl font-bold">Gestión de Usuarios ({users.length})</h2>
            <Input
                placeholder="Buscar por nickname o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
            />
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Usuario</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Rango</TableHead>
                            <TableHead>Registrado</TableHead>
                            <TableHead className="text-right">Puntos</TableHead>
                            <TableHead>Rol</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map(user => (
                            <TableRow key={user.uid}>
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10">
                                            <AvatarFallback>{user.nickname.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span className="font-medium">{user.nickname}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>{user.rank}</TableCell>
                                <TableCell>
                                    {user.createdAt ? format(user.createdAt.toDate(), 'dd MMM yyyy', { locale: es }) : 'N/A'}
                                </TableCell>
                                <TableCell className="text-right font-mono">{user.points}</TableCell>
                                <TableCell>
                                    <RoleSelector user={user} onRoleChange={handleRoleChange} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {filteredUsers.length === 0 && (
                <p className="text-center py-8 text-muted-foreground">No se encontraron usuarios.</p>
            )}
        </div>
    );
}
