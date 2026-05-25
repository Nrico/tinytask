"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@tinytask/ui/buttons/button';
import { Input } from '@tinytask/ui/forms/input';
import { Label } from '@tinytask/ui/forms/label';
import { FileUploader } from '@tinytask/ui/forms/file-uploader';
import { ToolLayout } from '@tinytask/ui/layouts/tool-layout';
import { useBrandKit } from '@tinytask/ui/brand/brand-context';
import { Printer, Plus, Trash2, Image as ImageIcon } from 'lucide-react';

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
}

export default function InvoiceSwiftPage() {
    const { activeBrandKit, isBrandedSession } = useBrandKit();

    // State
    const [logo, setLogo] = useState<string | null>(null);
    const [companyName, setCompanyName] = useState('My Company');

    // Load Brand default if in branded session
    useEffect(() => {
        if (isBrandedSession && activeBrandKit) {
            if (activeBrandKit.logos?.primary) {
                setLogo(activeBrandKit.logos.primary);
            }
            if (activeBrandKit.name) {
                setCompanyName(activeBrandKit.name);
            }
        }
    }, [isBrandedSession, activeBrandKit]);

    const [companyDetails, setCompanyDetails] = useState('123 Business Rd\nCity, State, Zip');
    const [clientName, setClientName] = useState('Client Name');
    const [clientDetails, setClientDetails] = useState('456 Client Ave\nCity, State, Zip');
    const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [taxRate, setTaxRate] = useState(0);
    const [currency, setCurrency] = useState('$');
    const [paymentTerms, setPaymentTerms] = useState('Payment is due within 30 days of invoice date.');
    const [lineItems, setLineItems] = useState<LineItem[]>([
        { id: '1', description: 'Service Rendered', quantity: 1, rate: 100 }
    ]);

    // Calculations
    const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity * item.rate), 0);
    const taxAmount = subtotal * (taxRate / 100);
    const total = subtotal + taxAmount;

    // Handlers
    const addLineItem = () => {
        setLineItems([...lineItems, { id: crypto.randomUUID(), description: '', quantity: 1, rate: 0 }]);
    };

    const removeLineItem = (id: string) => {
        setLineItems(lineItems.filter(item => item.id !== id));
    };

    const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
        setLineItems(lineItems.map(item => {
            if (item.id === id) {
                return { ...item, [field]: value };
            }
            return item;
        }));
    };

    const handlePrint = () => {
        window.print();
    };

    return (
        <>
            {/* Print Styles */}
            <style dangerouslySetInnerHTML={{ __html: `
                @media print {
                    body * { visibility: hidden !important; }
                    #invoice-print-area, #invoice-print-area * { visibility: visible !important; }
                    #invoice-print-area { position: absolute !important; left: 0 !important; top: 0 !important; width: 100% !important; }
                    header, footer, nav, aside { display: none !important; }
                }
            `}} />

            <ToolLayout
                title="Invoice Swift"
                description="Create and print professional invoices instantly."
                sidebarContent={
                    <div className="space-y-6">
                        {/* Invoice Details */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-slate-800 text-sm">Invoice Details</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="invoice-num">Invoice #</Label>
                                    <Input id="invoice-num" value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="invoice-date">Date</Label>
                                    <Input id="invoice-date" type="date" value={date} onChange={e => setDate(e.target.value)} />
                                </div>
                            </div>
                        </div>

                        {/* Company Logo Section */}
                        <div className="space-y-4 border-t pt-4">
                            <Label className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4 text-primary" /> Company Logo</Label>
                            {isBrandedSession ? (
                                logo ? (
                                    <div className="flex items-center gap-4 mt-1.5 bg-slate-50 p-3 rounded-lg border">
                                        <img src={logo} alt="Logo preview" className="max-h-12 max-w-[150px] object-contain border rounded p-1 bg-white" />
                                        <span className="text-xs text-slate-500 font-semibold italic">Locked by brand kit</span>
                                    </div>
                                ) : (
                                    <div className="text-xs text-slate-500 italic p-3 bg-slate-50 border rounded-lg">No logo provided in brand kit</div>
                                )
                            ) : logo ? (
                                <div className="flex items-center gap-4 mt-1.5">
                                    <img src={logo} alt="Logo preview" className="max-h-12 max-w-[150px] object-contain border rounded p-1 bg-white" />
                                    <Button size="sm" variant="outline" className="text-destructive border-destructive hover:bg-destructive/10" onClick={() => setLogo(null)}>
                                        Remove Logo
                                    </Button>
                                </div>
                            ) : (
                                <FileUploader
                                    onFileSelect={(file) => {
                                        const reader = new FileReader();
                                        reader.onloadend = () => {
                                            setLogo(reader.result as string);
                                        };
                                        reader.readAsDataURL(file);
                                    }}
                                    accept="image/*"
                                    allowedExtensions={['.png', '.jpg', '.jpeg', '.gif', '.webp']}
                                    description="Supports PNG, JPG, or WEBP"
                                    icon={<ImageIcon className="w-8 h-8 text-slate-400" />}
                                />
                            )}
                        </div>

                        {/* Parties */}
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-semibold text-slate-800 text-sm">Parties</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="company-name">My Company Details</Label>
                                    <Input id="company-name" value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Company Name" className="mb-2" disabled={isBrandedSession} />
                                    <textarea
                                        id="company-details"
                                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={companyDetails}
                                        onChange={e => setCompanyDetails(e.target.value)}
                                        placeholder="Address, Phone, Email..."
                                    />
                                </div>

                                <div className="space-y-2 border-t pt-4">
                                    <Label htmlFor="client-name">Client Details</Label>
                                    <Input id="client-name" value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client Name" className="mb-2" />
                                    <textarea
                                        id="client-details"
                                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={clientDetails}
                                        onChange={e => setClientDetails(e.target.value)}
                                        placeholder="Client Address..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Style / Currency */}
                        <div className="space-y-4 border-t pt-4">
                            <h3 className="font-semibold text-slate-800 text-sm">Settings</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="currency-select">Currency</Label>
                                    <select
                                        id="currency-select"
                                        value={currency}
                                        onChange={e => setCurrency(e.target.value)}
                                        className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="$">USD ($)</option>
                                        <option value="€">EUR (€)</option>
                                        <option value="£">GBP (£)</option>
                                        <option value="¥">JPY/CNY (¥)</option>
                                        <option value="₹">INR (₹)</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="tax-rate">Tax Rate (%)</Label>
                                    <Input
                                        id="tax-rate"
                                        type="number"
                                        className="text-right"
                                        value={taxRate}
                                        onChange={e => setTaxRate(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Line Items */}
                        <div className="space-y-4 border-t pt-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold text-slate-800 text-sm">Line Items</h3>
                                <Button size="sm" variant="outline" onClick={addLineItem} className="h-8 text-xs gap-1">
                                    <Plus className="w-3.5 h-3.5" /> Add Item
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {lineItems.map((item) => (
                                    <div key={item.id} className="p-3 border rounded-lg bg-card/100 space-y-3 relative group">
                                        <button 
                                            onClick={() => removeLineItem(item.id)} 
                                            className="absolute top-2 right-2 p-1 text-slate-400 hover:text-red-500 rounded-md hover:bg-slate-100 transition-colors"
                                            title="Delete item"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                        <div className="space-y-1.5 pr-6">
                                            <Label className="text-xs font-semibold text-slate-600">Item Description</Label>
                                            <Input
                                                value={item.description}
                                                onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                                                placeholder="e.g. Service Rendered"
                                                className="bg-white text-xs h-9"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-slate-600">Qty</Label>
                                                <Input
                                                    type="number"
                                                    value={item.quantity}
                                                    onChange={e => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                                                    className="bg-white text-xs h-9"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <Label className="text-xs font-semibold text-slate-600">Rate</Label>
                                                <Input
                                                    type="number"
                                                    value={item.rate}
                                                    onChange={e => updateLineItem(item.id, 'rate', Number(e.target.value))}
                                                    className="bg-white text-xs h-9"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Terms */}
                        <div className="space-y-2 border-t pt-4">
                            <Label htmlFor="payment-terms">Payment Terms / Notes</Label>
                            <textarea
                                id="payment-terms"
                                className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                value={paymentTerms}
                                onChange={e => setPaymentTerms(e.target.value)}
                                placeholder="Payment terms or notes..."
                            />
                        </div>
                    </div>
                }
                previewContent={
                    <div className="w-full max-w-3xl my-auto p-4 md:p-0">
                        <div id="invoice-print-area" className="bg-white text-black p-8 md:p-12 shadow-lg border rounded-xl min-h-[840px] print:shadow-none print:border-none print:rounded-none">
                            {/* Invoice Header */}
                            <div className="flex justify-between items-start mb-12">
                                <div>
                                    <h2 className="text-4xl font-extrabold tracking-tight mb-2" style={{ color: isBrandedSession ? 'var(--primary)' : undefined }}>INVOICE</h2>
                                    <p className="text-sm font-medium text-slate-500">#{invoiceNumber}</p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1.5">
                                    {logo && (
                                        <img src={logo} alt="Company Logo" className="max-h-16 max-w-[200px] object-contain mb-3" />
                                    )}
                                    <h3 className="font-bold text-lg leading-tight" style={{ color: isBrandedSession ? 'var(--primary)' : undefined }}>{companyName}</h3>
                                    <div className="text-xs text-slate-500 whitespace-pre-line leading-relaxed">{companyDetails}</div>
                                </div>
                            </div>

                            {/* Client & Date */}
                            <div className="flex justify-between mb-12 border-t border-slate-100 pt-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Bill To</p>
                                    <h3 className="font-bold text-base text-slate-800">{clientName}</h3>
                                    <div className="text-xs text-slate-500 whitespace-pre-line leading-relaxed mt-1">{clientDetails}</div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Date</p>
                                    <p className="font-semibold text-sm text-slate-800">{new Date(date).toLocaleDateString()}</p>
                                </div>
                            </div>

                            {/* Line Items Table */}
                            <table className="w-full mb-8">
                                <thead>
                                    <tr className="border-b-2" style={{ borderColor: isBrandedSession ? 'var(--primary)' : undefined }}>
                                        <th className="text-left py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Description</th>
                                        <th className="text-right py-3 text-xs font-bold text-slate-600 uppercase tracking-wider w-24">Qty</th>
                                        <th className="text-right py-3 text-xs font-bold text-slate-600 uppercase tracking-wider w-32">Rate</th>
                                        <th className="text-right py-3 text-xs font-bold text-slate-600 uppercase tracking-wider w-32">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {lineItems.map((item) => (
                                        <tr key={item.id} className="border-b border-slate-100">
                                            <td className="py-4 text-sm text-slate-700">{item.description || 'Item'}</td>
                                            <td className="py-4 text-sm text-right text-slate-700">{item.quantity}</td>
                                            <td className="py-4 text-sm text-right text-slate-700">{currency}{item.rate.toFixed(2)}</td>
                                            <td className="py-4 text-sm text-right font-medium text-slate-800">
                                                {currency}{(item.quantity * item.rate).toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Totals */}
                            <div className="flex justify-end pt-4 border-t border-slate-100">
                                <div className="w-64 space-y-2.5">
                                    <div className="flex justify-between text-sm text-slate-500">
                                        <span>Subtotal</span>
                                        <span className="font-medium text-slate-800">{currency}{subtotal.toFixed(2)}</span>
                                    </div>
                                    {taxRate > 0 && (
                                        <div className="flex justify-between text-sm text-slate-500">
                                            <span>Tax ({taxRate}%)</span>
                                            <span className="font-medium text-slate-800">{currency}{taxAmount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between font-bold text-lg pt-4 border-t" style={{ color: isBrandedSession ? 'var(--primary)' : undefined, borderColor: isBrandedSession ? 'var(--primary)' : undefined }}>
                                        <span>Total</span>
                                        <span>{currency}{total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Payment Terms & Notes */}
                            {paymentTerms && (
                                <div className="mt-12 pt-6 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Terms & Instructions</h4>
                                    <p className="text-xs text-slate-500 whitespace-pre-line leading-relaxed">{paymentTerms}</p>
                                </div>
                            )}

                            {/* Footer */}
                            <div className="mt-20 pt-6 border-t border-slate-100 text-center text-slate-400 text-xs tracking-wide uppercase">
                                <p>Thank you for your business!</p>
                            </div>
                        </div>
                    </div>
                }
                actions={
                    <Button 
                        onClick={handlePrint} 
                        className="w-full gap-2 text-white" 
                        style={{ backgroundColor: isBrandedSession ? 'var(--primary)' : undefined }}
                        size="lg"
                    >
                        <Printer className="w-5 h-5" /> Print Invoice
                    </Button>
                }
            />
        </>
    );
}
