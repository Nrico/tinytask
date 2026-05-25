"use client"

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase';
import { Users, Crown, ShieldAlert, ArrowLeft, Search, Loader2, RefreshCw } from 'lucide-react';

interface AdminUser {
    id: string;
    name: string;
    email: string;
    plan: 'free' | 'pro';
    role: 'user' | 'admin';
    createdAt: string;
    stripeCustomerId: string | null;
    stripeSubscriptionId: string | null;
}

export default function AdminDashboardPage() {
    const { user, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    const [users, setUsers] = useState<AdminUser[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [error, setError] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    // Redirect users who are not administrators
    useEffect(() => {
        if (!isAuthLoading) {
            if (!user) {
                router.push('/login');
            } else if (user.role !== 'admin') {
                router.push('/dashboard');
            } else {
                fetchUsers();
            }
        }
    }, [user, isAuthLoading, router]);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError('');
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) {
                setError('Failed to retrieve authentication token.');
                setIsLoading(false);
                return;
            }

            const res = await fetch('/api/admin/users', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const data = await res.json();
            if (res.ok) {
                setUsers(data.users || []);
            } else {
                setError(data.error || 'Failed to fetch users.');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateUser = async (targetUid: string, updates: { plan?: 'free' | 'pro'; role?: 'user' | 'admin' }) => {
        setActionLoading(`${targetUid}-${updates.plan !== undefined ? 'plan' : 'role'}`);
        try {
            const token = await auth.currentUser?.getIdToken();
            if (!token) {
                alert('Session expired. Please log in again.');
                return;
            }

            const res = await fetch('/api/admin/users', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    targetUid,
                    ...updates
                })
            });

            const data = await res.json();
            if (res.ok) {
                // Update local state
                setUsers(prevUsers => prevUsers.map(u => {
                    if (u.id === targetUid) {
                        return {
                            ...u,
                            ...(updates.plan !== undefined ? { plan: updates.plan } : {}),
                            ...(updates.role !== undefined ? { role: updates.role } : {})
                        };
                    }
                    return u;
                }));
            } else {
                alert(data.error || 'Failed to update user.');
            }
        } catch (err) {
            console.error('Error updating user:', err);
            alert('Something went wrong updating user settings.');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDate = (isoString: string) => {
        if (!isoString) return 'N/A';
        try {
            const date = new Date(isoString);
            return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
        } catch {
            return 'N/A';
        }
    };

    if (isAuthLoading || (user && user.role !== 'admin')) {
        return (
            <div className="flex h-[calc(100vh-200px)] w-full items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null;
    }

    // Filtered users search
    const filteredUsers = users.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Compute stats
    const totalUsers = users.length;
    const proUsers = users.filter(u => u.plan === 'pro').length;
    const adminUsers = users.filter(u => u.role === 'admin').length;

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl sm:px-6 lg:px-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
                <div>
                    <div className="mb-2">
                        <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')} className="gap-2 -ml-2 text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                        </Button>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">Admin Support Panel</h1>
                    <p className="text-muted-foreground">
                        Manage user roles, subscriptions, and support issues.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={fetchUsers} disabled={isLoading} variant="outline" size="sm" className="gap-2 font-semibold">
                        <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        Refresh List
                    </Button>
                </div>
            </div>

            {/* Metrics cards */}
            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
                        <Users className="h-4 w-4 text-slate-400" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{totalUsers}</div>
                        <p className="text-xs text-muted-foreground">Registered on TinyTask platform</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Pro Subscribers</CardTitle>
                        <Crown className="h-4 w-4 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{proUsers}</div>
                        <p className="text-xs text-muted-foreground">{totalUsers > 0 ? Math.round((proUsers / totalUsers) * 100) : 0}% active conversion rate</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Administrators</CardTitle>
                        <ShieldAlert className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{adminUsers}</div>
                        <p className="text-xs text-muted-foreground">Accounts with support access</p>
                    </CardContent>
                </Card>
            </div>

            {/* User administration list */}
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>User Directory</CardTitle>
                    <CardDescription>Search and manage customer plans and administrative roles.</CardDescription>
                    <div className="mt-4 relative max-w-sm">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search by name, email, or user UID..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 border rounded-md text-sm outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    {error && (
                        <div className="p-4 mb-4 text-sm bg-red-50 border border-red-200 rounded text-red-600 font-medium">
                            {error}
                        </div>
                    )}

                    {isLoading ? (
                        <div className="flex flex-col py-16 w-full items-center justify-center gap-2">
                            <Loader2 className="w-8 h-8 text-primary animate-spin" />
                            <span className="text-xs text-muted-foreground">Loading users...</span>
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="py-16 text-center text-sm text-muted-foreground">
                            {searchQuery ? 'No users match your search query.' : 'No users registered yet.'}
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left">
                                <thead className="text-xs uppercase bg-card text-muted-foreground border-b border-border/50">
                                    <tr>
                                        <th scope="col" className="px-4 py-3">User Details</th>
                                        <th scope="col" className="px-4 py-3">Plan</th>
                                        <th scope="col" className="px-4 py-3">Role</th>
                                        <th scope="col" className="px-4 py-3">Joined Date</th>
                                        <th scope="col" className="px-4 py-3 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((u) => {
                                        const isTargetPlanLoading = actionLoading === `${u.id}-plan`;
                                        const isTargetRoleLoading = actionLoading === `${u.id}-role`;

                                        return (
                                            <tr key={u.id} className="border-b hover:bg-card/100">
                                                <td className="px-4 py-4">
                                                    <div className="font-semibold text-slate-900">{u.name}</div>
                                                    <div className="text-xs text-slate-500">{u.email}</div>
                                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">UID: {u.id}</div>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge variant={u.plan === 'pro' ? 'default' : 'secondary'}>
                                                        {u.plan.toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4">
                                                    <Badge variant={u.role === 'admin' ? 'destructive' : 'outline'}>
                                                        {u.role.toUpperCase()}
                                                    </Badge>
                                                </td>
                                                <td className="px-4 py-4 text-slate-500 text-xs">
                                                    {formatDate(u.createdAt)}
                                                </td>
                                                <td className="px-4 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {/* Plan Toggle Button */}
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={actionLoading !== null}
                                                            onClick={() => handleUpdateUser(u.id, { plan: u.plan === 'pro' ? 'free' : 'pro' })}
                                                            className="text-xs font-medium h-8"
                                                        >
                                                            {isTargetPlanLoading && <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />}
                                                            {u.plan === 'pro' ? 'Demote to Free' : 'Grant Pro'}
                                                        </Button>

                                                        {/* Role Toggle Button */}
                                                        {u.id !== user.id && (
                                                            <Button
                                                                size="sm"
                                                                variant="outline"
                                                                disabled={actionLoading !== null}
                                                                onClick={() => handleUpdateUser(u.id, { role: u.role === 'admin' ? 'user' : 'admin' })}
                                                                className="text-xs font-medium h-8"
                                                            >
                                                                {isTargetRoleLoading && <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />}
                                                                {u.role === 'admin' ? 'Remove Admin' : 'Make Admin'}
                                                            </Button>
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
