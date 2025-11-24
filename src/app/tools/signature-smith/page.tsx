"use client"

import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Copy, Check, Mail, Phone, Globe, MapPin } from 'lucide-react';
import Link from 'next/link';

export default function SignatureSmithPage() {
    const [name, setName] = useState('Alex Johnson');
    const [title, setTitle] = useState('Product Manager');
    const [company, setCompany] = useState('Acme Corp');
    const [phone, setPhone] = useState('555-0123');
    const [email, setEmail] = useState('alex@example.com');
    const [website, setWebsite] = useState('www.example.com');
    const [address, setAddress] = useState('123 Business Rd, Tech City');
    const [color, setColor] = useState('#ec4899'); // Pink-500
    const [template, setTemplate] = useState('sidebar'); // simple, sidebar, card
    const [copied, setCopied] = useState(false);

    const previewRef = useRef<HTMLDivElement>(null);

    const handleCopy = () => {
        if (!previewRef.current) return;

        // Select the content
        const range = document.createRange();
        range.selectNode(previewRef.current);
        const selection = window.getSelection();
        if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);

            try {
                // Execute copy command
                document.execCommand('copy');
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error('Failed to copy', err);
            }

            // Clear selection
            selection.removeAllRanges();
        }
    };

    // Render Template Logic
    const renderSignature = () => {
        const styles = {
            name: { fontSize: '18px', fontWeight: 'bold', color: '#1f2937', fontFamily: 'Arial, sans-serif', margin: 0 },
            title: { fontSize: '14px', color: color, fontWeight: 'bold', fontFamily: 'Arial, sans-serif', margin: 0 },
            company: { fontSize: '14px', color: '#6b7280', fontFamily: 'Arial, sans-serif', margin: 0 },
            link: { color: '#1f2937', textDecoration: 'none', fontSize: '13px', fontFamily: 'Arial, sans-serif' },
            icon: { width: '14px', height: '14px', verticalAlign: 'middle', marginRight: '5px' },
            td: { paddingBottom: '4px', color: '#1f2937', fontSize: '13px', fontFamily: 'Arial, sans-serif' }
        };

        if (template === 'simple') {
            return (
                <table style={{ fontFamily: 'Arial, sans-serif', color: '#1f2937' }} cellPadding="0" cellSpacing="0">
                    <tbody>
                        <tr>
                            <td style={{ paddingBottom: '8px' }}>
                                <h3 style={styles.name}>{name}</h3>
                                <p style={styles.title}>{title} | {company}</p>
                            </td>
                        </tr>
                        <tr>
                            <td style={{ borderTop: `2px solid ${color}`, paddingTop: '8px' }}>
                                <table cellPadding="0" cellSpacing="0">
                                    <tbody>
                                        <tr>
                                            <td style={{ ...styles.td, paddingRight: '15px' }}>
                                                <span style={{ fontWeight: 'bold', color: color }}>P:</span> {phone}
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{ fontWeight: 'bold', color: color }}>E:</span> <a href={`mailto:${email}`} style={styles.link}>{email}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ ...styles.td, paddingRight: '15px' }}>
                                                <span style={{ fontWeight: 'bold', color: color }}>W:</span> <a href={`https://${website}`} style={styles.link}>{website}</a>
                                            </td>
                                            <td style={styles.td}>
                                                <span style={{ fontWeight: 'bold', color: color }}>A:</span> {address}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }

        if (template === 'sidebar') {
            return (
                <table style={{ fontFamily: 'Arial, sans-serif', color: '#1f2937' }} cellPadding="0" cellSpacing="0">
                    <tbody>
                        <tr>
                            <td style={{ borderLeft: `4px solid ${color}`, paddingLeft: '15px' }}>
                                <h3 style={styles.name}>{name}</h3>
                                <p style={{ ...styles.title, marginBottom: '8px' }}>{title}</p>
                                <p style={{ ...styles.company, marginBottom: '12px' }}>{company}</p>

                                <table cellPadding="0" cellSpacing="0">
                                    <tbody>
                                        <tr>
                                            <td style={styles.td}>
                                                <a href={`tel:${phone}`} style={styles.link}>{phone}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.td}>
                                                <a href={`mailto:${email}`} style={styles.link}>{email}</a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={styles.td}>
                                                <a href={`https://${website}`} style={styles.link}>{website}</a>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }

        if (template === 'card') {
            return (
                <table style={{ fontFamily: 'Arial, sans-serif', color: '#1f2937', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }} cellPadding="0" cellSpacing="0" width="400">
                    <tbody>
                        <tr>
                            <td style={{ backgroundColor: color, height: '10px' }} colSpan={2}></td>
                        </tr>
                        <tr>
                            <td style={{ padding: '20px' }}>
                                <h3 style={{ ...styles.name, fontSize: '20px' }}>{name}</h3>
                                <p style={{ ...styles.title, color: '#6b7280', fontWeight: 'normal' }}>{title}</p>
                                <p style={{ ...styles.company, fontWeight: 'bold', marginTop: '4px' }}>{company}</p>
                            </td>
                            <td style={{ padding: '20px', textAlign: 'right', verticalAlign: 'top' }}>
                                <table cellPadding="0" cellSpacing="0" align="right">
                                    <tbody>
                                        <tr><td style={{ ...styles.td, textAlign: 'right' }}>{phone}</td></tr>
                                        <tr><td style={{ ...styles.td, textAlign: 'right' }}><a href={`mailto:${email}`} style={styles.link}>{email}</a></td></tr>
                                        <tr><td style={{ ...styles.td, textAlign: 'right' }}><a href={`https://${website}`} style={styles.link}>{website}</a></td></tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-6xl sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Signature Smith</h1>
                        <p className="text-muted-foreground">Create professional email signatures in seconds.</p>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Controls */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="p-6 space-y-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold">Personal Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input value={name} onChange={e => setName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Job Title</Label>
                                        <Input value={title} onChange={e => setTitle(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input value={company} onChange={e => setCompany(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold">Contact Info</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input value={phone} onChange={e => setPhone(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input value={email} onChange={e => setEmail(e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Website</Label>
                                    <Input value={website} onChange={e => setWebsite(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Address</Label>
                                    <Input value={address} onChange={e => setAddress(e.target.value)} />
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold">Style</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Brand Color</Label>
                                        <div className="flex items-center gap-2">
                                            <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 p-1" />
                                            <span className="text-sm font-mono text-muted-foreground">{color}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Template</Label>
                                        <div className="flex gap-2">
                                            {['simple', 'sidebar', 'card'].map(t => (
                                                <Button
                                                    key={t}
                                                    variant={template === t ? 'default' : 'outline'}
                                                    size="sm"
                                                    onClick={() => setTemplate(t)}
                                                    className="capitalize"
                                                >
                                                    {t}
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview */}
                <div className="space-y-6">
                    <Card className="bg-slate-50 border-2 border-dashed">
                        <CardContent className="p-8 flex items-center justify-center min-h-[300px]">
                            <div className="bg-white p-8 shadow-sm rounded-lg w-full max-w-lg">
                                <div ref={previewRef}>
                                    {renderSignature()}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Button size="lg" className="w-full" onClick={handleCopy}>
                        {copied ? (
                            <>
                                <Check className="w-4 h-4 mr-2" /> Copied to Clipboard!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4 mr-2" /> Copy Signature
                            </>
                        )}
                    </Button>
                    <p className="text-center text-sm text-muted-foreground">
                        Paste this directly into your Outlook, Gmail, or Apple Mail signature settings.
                    </p>
                </div>
            </div>
        </div>
    );
}
