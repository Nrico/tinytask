"use client"

import React, { useState, useRef } from 'react';
import { Button } from '@tinytask/ui/buttons/button';
import { Input } from '@tinytask/ui/forms/input';
import { Label } from '@tinytask/ui/forms/label';
import { Card, CardContent } from '@tinytask/ui/cards/card';
import { ArrowLeft, Copy, Check, Mail, Phone, Globe, MapPin, Image as ImageIcon, AlertCircle } from 'lucide-react';
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

    // Image/Avatar State
    const [avatarType, setAvatarType] = useState<'url' | 'upload'>('url');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);

    const activeImage = avatarType === 'url' ? avatarUrl : avatarBase64;

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

    const handleLocalImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarBase64(reader.result as string);
            };
            reader.readAsDataURL(file);
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
                            {activeImage && (
                                <td style={{ paddingRight: '16px', verticalAlign: 'top' }}>
                                    <img 
                                        src={activeImage} 
                                        alt={name} 
                                        style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} 
                                    />
                                </td>
                            )}
                            <td style={{ paddingBottom: '8px', verticalAlign: 'top' }}>
                                <h3 style={styles.name}>{name}</h3>
                                <p style={styles.title}>{title} | {company}</p>
                            </td>
                        </tr>
                        <tr>
                            <td colSpan={activeImage ? 2 : 1} style={{ borderTop: `2px solid ${color}`, paddingTop: '8px' }}>
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
                            {activeImage && (
                                <td style={{ paddingRight: '16px', verticalAlign: 'middle' }}>
                                    <img 
                                        src={activeImage} 
                                        alt={name} 
                                        style={{ width: '70px', height: '70px', borderRadius: '50%', objectFit: 'cover', display: 'block' }} 
                                    />
                                </td>
                            )}
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
                <table style={{ fontFamily: 'Arial, sans-serif', color: '#1f2937', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }} cellPadding="0" cellSpacing="0" width="450">
                    <tbody>
                        <tr>
                            <td style={{ backgroundColor: color, height: '10px' }} colSpan={activeImage ? 3 : 2}></td>
                        </tr>
                        <tr>
                            {activeImage && (
                                <td style={{ padding: '20px', paddingRight: '0px', verticalAlign: 'top', width: '84px' }}>
                                    <img 
                                        src={activeImage} 
                                        alt={name} 
                                        style={{ width: '64px', height: '64px', borderRadius: '8px', objectFit: 'cover', display: 'block' }} 
                                    />
                                </td>
                            )}
                            <td style={{ padding: '20px', verticalAlign: 'top' }}>
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

                            {/* Avatar Section */}
                            <div className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-primary" /> Profile Image / Avatar</h3>
                                
                                <div className="flex bg-slate-100 p-1 rounded-lg text-xs font-semibold">
                                    <button
                                        className={`flex-1 py-1.5 rounded-md transition-all ${avatarType === 'url' ? 'bg-white shadow text-primary' : 'text-slate-500'}`}
                                        onClick={() => setAvatarType('url')}
                                    >
                                        Hosted Image URL
                                    </button>
                                    <button
                                        className={`flex-1 py-1.5 rounded-md transition-all ${avatarType === 'upload' ? 'bg-white shadow text-primary' : 'text-slate-500'}`}
                                        onClick={() => setAvatarType('upload')}
                                    >
                                        Upload Image File
                                    </button>
                                </div>

                                {avatarType === 'url' ? (
                                    <div className="space-y-2">
                                        <Label htmlFor="avatar-url">Public Image URL</Label>
                                        <Input 
                                            id="avatar-url"
                                            value={avatarUrl} 
                                            onChange={e => setAvatarUrl(e.target.value)} 
                                            placeholder="e.g. https://mywebsite.com/photo.png"
                                            className="text-xs"
                                        />
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Label htmlFor="avatar-upload">Upload Local Photo</Label>
                                        {avatarBase64 ? (
                                            <div className="flex items-center gap-4">
                                                <img src={avatarBase64} alt="Avatar preview" className="w-12 h-12 object-cover rounded-full border p-0.5 bg-white" />
                                                <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => setAvatarBase64(null)}>
                                                    Remove Photo
                                                </Button>
                                            </div>
                                        ) : (
                                            <input
                                                id="avatar-upload"
                                                type="file"
                                                accept="image/*"
                                                className="block w-full text-xs text-slate-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-md file:border-0
                                                    file:text-xs file:font-semibold
                                                    file:bg-secondary file:text-secondary-foreground
                                                    hover:file:bg-secondary/85 cursor-pointer"
                                                onChange={handleLocalImage}
                                            />
                                        )}
                                    </div>
                                )}

                                <div className="bg-amber-50 border border-amber-200/60 rounded-lg p-4 flex gap-2.5 items-start text-xs text-amber-800 leading-relaxed">
                                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                                    <div className="space-y-2">
                                        <p className="font-semibold text-amber-900">Email Client Compatibility Notice</p>
                                        <p>
                                            A hosted public URL is highly recommended. Many mail apps (such as Gmail) block base64 image strings, which can cause uploaded local images to appear broken in your signature.
                                        </p>
                                        <div className="pt-2 border-t border-amber-200/50 space-y-1.5">
                                            <p className="font-semibold text-amber-900 flex items-center gap-1">
                                                ☁️ Want us to host it for you?
                                            </p>
                                            <p>
                                                Unlock secure, reliable cloud hosting for your signature images and logos by becoming a <strong>TinyTask Pro</strong> subscriber, or support our work by buying us a coffee!
                                            </p>
                                            <div className="flex gap-2 pt-0.5">
                                                <Link href="/pricing">
                                                    <Button size="sm" className="h-7 text-[10px] px-3 bg-amber-700 hover:bg-amber-800 text-white border-none">
                                                        Go Pro
                                                    </Button>
                                                </Link>
                                                <a href="https://buymeacoffee.com" target="_blank" rel="noopener noreferrer">
                                                    <Button size="sm" variant="outline" className="h-7 text-[10px] px-3 border-amber-300 text-amber-900 bg-white hover:bg-amber-100">
                                                        Buy us a coffee
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 border-t pt-4">
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

                            <div className="space-y-4 border-t pt-4">
                                <h3 className="font-semibold">Style</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label>Brand Color</Label>
                                        <div className="flex items-center gap-2">
                                            <Input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-12 h-10 p-1 cursor-pointer" />
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
                            <div className="bg-white p-8 shadow-sm rounded-lg w-full max-w-lg overflow-auto">
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
