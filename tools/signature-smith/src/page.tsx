"use client"

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@tinytask/ui/buttons/button';
import { Input } from '@tinytask/ui/forms/input';
import { Label } from '@tinytask/ui/forms/label';
import { Card, CardContent } from '@tinytask/ui/cards/card';
import { ColorPicker } from '@tinytask/ui/forms/color-picker';
import { ToolLayout } from '@tinytask/ui/layouts/tool-layout';
import { useBrandKit } from '@tinytask/ui/brand/brand-context';
import { Copy, Check, Image as ImageIcon, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function SignatureSmithPage() {
    const { activeBrandKit, isBrandedSession } = useBrandKit();

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

    // Social Profiles & Preview Tab State
    const [linkedin, setLinkedin] = useState('');
    const [twitter, setTwitter] = useState('');
    const [github, setGithub] = useState('');
    const [facebook, setFacebook] = useState('');
    const [previewMode, setPreviewMode] = useState<'preview' | 'html'>('preview');
    const [htmlCode, setHtmlCode] = useState('');
    const [copiedHtml, setCopiedHtml] = useState(false);

    // Override with Brand defaults if branded session
    useEffect(() => {
        if (isBrandedSession && activeBrandKit) {
            setColor(activeBrandKit.colors.primary);
            setCompany(activeBrandKit.name);
            if (activeBrandKit.logos?.primary) {
                setAvatarType('url');
                setAvatarUrl(activeBrandKit.logos.primary);
            }
        }
    }, [isBrandedSession, activeBrandKit]);

    // Image/Avatar State
    const [avatarType, setAvatarType] = useState<'url' | 'upload'>('url');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [avatarBase64, setAvatarBase64] = useState<string | null>(null);

    const previewRef = useRef<HTMLDivElement>(null);

    // Update HTML source code representation whenever rendering parameters change
    useEffect(() => {
        const timer = setTimeout(() => {
            if (previewRef.current) {
                setHtmlCode(previewRef.current.innerHTML);
            }
        }, 50);
        return () => clearTimeout(timer);
    }, [
        name, title, company, phone, email, website, address, color, template,
        avatarType, avatarUrl, avatarBase64, linkedin, twitter, github, facebook, isBrandedSession
    ]);

    const activeImage = avatarType === 'url' ? avatarUrl : avatarBase64;

    const handleCopyHtml = () => {
        navigator.clipboard.writeText(htmlCode);
        setCopiedHtml(true);
        setTimeout(() => setCopiedHtml(false), 2000);
    };

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
        const fontFam = isBrandedSession && activeBrandKit?.font ? `${activeBrandKit.font}, Arial, sans-serif` : 'Arial, sans-serif';
        const styles = {
            name: { fontSize: '18px', fontWeight: 'bold', color: '#1f2937', fontFamily: fontFam, margin: 0 },
            title: { fontSize: '14px', color: color, fontWeight: 'bold', fontFamily: fontFam, margin: 0 },
            company: { fontSize: '14px', color: '#6b7280', fontFamily: fontFam, margin: 0 },
            link: { color: '#1f2937', textDecoration: 'none', fontSize: '13px', fontFamily: fontFam },
            icon: { width: '14px', height: '14px', verticalAlign: 'middle', marginRight: '5px' },
            td: { paddingBottom: '4px', color: '#1f2937', fontSize: '13px', fontFamily: fontFam }
        };

        const socialIcons = [
            { name: 'LinkedIn', value: linkedin, icon: 'linkedin.png' },
            { name: 'X', value: twitter, icon: 'twitter.png' },
            { name: 'GitHub', value: github, icon: 'github.png' },
            { name: 'Facebook', value: facebook, icon: 'facebook.png' }
        ].filter(item => item.value);

        if (template === 'simple') {
            return (
                <table style={{ fontFamily: fontFam, color: '#1f2937' }} cellPadding="0" cellSpacing="0">
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
                        {socialIcons.length > 0 && (
                            <tr>
                                <td colSpan={activeImage ? 2 : 1} style={{ paddingTop: '8px' }}>
                                    <table cellPadding="0" cellSpacing="0">
                                        <tbody>
                                            <tr>
                                                {socialIcons.map((soc, sIdx) => (
                                                    <td key={sIdx} style={{ paddingRight: '8px' }}>
                                                        <a href={soc.value.startsWith('http') ? soc.value : `https://${soc.value}`} target="_blank" rel="noopener noreferrer">
                                                            <img src={`https://img.icons8.com/material-outlined/24/666666/${soc.icon}`} alt={soc.name} style={{ width: '18px', height: '18px', display: 'block', border: '0' }} />
                                                        </a>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            );
        }

        if (template === 'sidebar') {
            return (
                <table style={{ fontFamily: fontFam, color: '#1f2937' }} cellPadding="0" cellSpacing="0">
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

                                {socialIcons.length > 0 && (
                                    <table cellPadding="0" cellSpacing="0" style={{ marginTop: '8px' }}>
                                        <tbody>
                                            <tr>
                                                {socialIcons.map((soc, sIdx) => (
                                                    <td key={sIdx} style={{ paddingRight: '8px' }}>
                                                        <a href={soc.value.startsWith('http') ? soc.value : `https://${soc.value}`} target="_blank" rel="noopener noreferrer">
                                                            <img src={`https://img.icons8.com/material-outlined/24/666666/${soc.icon}`} alt={soc.name} style={{ width: '18px', height: '18px', display: 'block', border: '0' }} />
                                                        </a>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                )}
                            </td>
                        </tr>
                    </tbody>
                </table>
            );
        }

        if (template === 'card') {
            return (
                <table style={{ fontFamily: fontFam, color: '#1f2937', border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }} cellPadding="0" cellSpacing="0" width="450">
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
                        {socialIcons.length > 0 && (
                            <tr>
                                <td colSpan={activeImage ? 3 : 2} style={{ padding: '0 20px 15px 20px', borderTop: '1px solid #f3f4f6', paddingTop: '12px' }}>
                                    <table cellPadding="0" cellSpacing="0">
                                        <tbody>
                                            <tr>
                                                {socialIcons.map((soc, sIdx) => (
                                                    <td key={sIdx} style={{ paddingRight: '8px' }}>
                                                        <a href={soc.value.startsWith('http') ? soc.value : `https://${soc.value}`} target="_blank" rel="noopener noreferrer">
                                                            <img src={`https://img.icons8.com/material-outlined/24/666666/${soc.icon}`} alt={soc.name} style={{ width: '18px', height: '18px', display: 'block', border: '0' }} />
                                                        </a>
                                                    </td>
                                                ))}
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            );
        }
    };

    return (
        <ToolLayout
            title="Signature Smith"
            description="Create professional email signatures in seconds."
            sidebarContent={
                <div className="space-y-6">
                    {/* Personal Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-slate-800 text-sm">Personal Details</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="full-name">Full Name</Label>
                                <Input id="full-name" value={name} onChange={e => setName(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="job-title">Job Title</Label>
                                <Input id="job-title" value={title} onChange={e => setTitle(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Company</Label>
                            <Input id="company" value={company} onChange={e => setCompany(e.target.value)} disabled={isBrandedSession} />
                        </div>
                    </div>

                    {/* Avatar Section */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold text-slate-800 text-sm flex items-center gap-1.5">
                            <ImageIcon className="w-4 h-4 text-primary" /> Profile Image / Avatar
                        </h3>
                        
                        {isBrandedSession ? (
                            <div className="text-xs text-slate-500 italic p-3 bg-slate-50 border rounded-lg flex items-center gap-4">
                                {activeBrandKit?.logos?.primary ? (
                                    <>
                                        <img src={activeBrandKit.logos.primary} alt="Logo" className="max-h-12 max-w-[120px] object-contain border p-1 rounded bg-white" />
                                        <span>Locked to brand logo</span>
                                    </>
                                ) : (
                                    <span>Locked to brand identity (No logo provided)</span>
                                )}
                            </div>
                        ) : (
                            <>
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
                            </>
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

                    {/* Contact Info */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold text-slate-800 text-sm">Contact Info</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" value={phone} onChange={e => setPhone(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" value={email} onChange={e => setEmail(e.target.value)} />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="website">Website</Label>
                            <Input id="website" value={website} onChange={e => setWebsite(e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="address">Address</Label>
                            <Input id="address" value={address} onChange={e => setAddress(e.target.value)} />
                        </div>
                    </div>

                    {/* Social Profiles */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold text-slate-800 text-sm">Social Profiles</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="linkedin-url">LinkedIn URL</Label>
                                <Input id="linkedin-url" placeholder="e.g. linkedin.com/in/username" value={linkedin} onChange={e => setLinkedin(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="twitter-url">X (Twitter) URL</Label>
                                <Input id="twitter-url" placeholder="e.g. x.com/username" value={twitter} onChange={e => setTwitter(e.target.value)} />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="github-url">GitHub URL</Label>
                                <Input id="github-url" placeholder="e.g. github.com/username" value={github} onChange={e => setGithub(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="facebook-url">Facebook URL</Label>
                                <Input id="facebook-url" placeholder="e.g. facebook.com/username" value={facebook} onChange={e => setFacebook(e.target.value)} />
                            </div>
                        </div>
                    </div>

                    {/* Style */}
                    <div className="space-y-4 border-t pt-4">
                        <h3 className="font-semibold text-slate-800 text-sm">Style</h3>
                        {isBrandedSession ? (
                            <div className="space-y-2 text-xs text-slate-500 italic bg-slate-50 p-3 rounded-lg border">
                                Color locked by Brand Identity:
                                <div className="flex items-center gap-1.5 mt-2">
                                    <div className="w-4 h-4 rounded border shadow-2xs" style={{ backgroundColor: color }} />
                                    <span>Brand Primary Color</span>
                                </div>
                            </div>
                        ) : (
                            <ColorPicker
                                label="Brand Color"
                                value={color}
                                onChange={setColor}
                            />
                        )}
                        <div className="space-y-2">
                            <Label>Template Layout</Label>
                            <div className="flex gap-2">
                                {['simple', 'sidebar', 'card'].map(t => (
                                    <Button
                                        key={t}
                                        variant={template === t ? 'default' : 'outline'}
                                        size="sm"
                                        onClick={() => setTemplate(t)}
                                        className="capitalize flex-1"
                                    >
                                        {t}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            }
            previewContent={
                <div className="space-y-6 w-full max-w-xl flex flex-col items-center">
                    <div className="flex border-b border-slate-200 w-full mb-2 text-xs font-semibold">
                        <button
                            onClick={() => setPreviewMode('preview')}
                            className={`pb-2 px-4 border-b-2 transition-all ${
                                previewMode === 'preview'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            Visual Preview
                        </button>
                        <button
                            onClick={() => setPreviewMode('html')}
                            className={`pb-2 px-4 border-b-2 transition-all ${
                                previewMode === 'html'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            HTML Source Code
                        </button>
                    </div>

                    {/* Visual Preview */}
                    <div className="w-full space-y-4" style={{ display: previewMode === 'preview' ? 'block' : 'none' }}>
                        <Card className="bg-slate-50 border-2 border-dashed w-full">
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
                    </div>

                    {/* HTML Code View */}
                    <div className="w-full space-y-4" style={{ display: previewMode === 'html' ? 'block' : 'none' }}>
                        <Card className="bg-slate-50 border-2 border-dashed w-full">
                            <CardContent className="p-4">
                                <textarea
                                    readOnly
                                    value={htmlCode}
                                    className="w-full h-[280px] p-3 text-xs font-mono bg-slate-900 text-slate-100 rounded-md border border-slate-800 focus:outline-none"
                                    onClick={e => (e.target as HTMLTextAreaElement).select()}
                                />
                            </CardContent>
                        </Card>

                        <Button size="lg" className="w-full" onClick={handleCopyHtml}>
                            {copiedHtml ? (
                                <>
                                    <Check className="w-4 h-4 mr-2" /> Copied HTML!
                                </>
                            ) : (
                                <>
                                    <Copy className="w-4 h-4 mr-2" /> Copy HTML Code
                                </>
                            )}
                        </Button>
                    </div>

                    <p className="text-center text-xs text-muted-foreground leading-relaxed max-w-md">
                        {previewMode === 'preview'
                            ? "Paste this directly into your Outlook, Gmail, or Apple Mail signature settings."
                            : "Copy the raw HTML source code and paste it into mail client HTML templates."
                        }
                    </p>
                </div>
            }
        />
    );
}
