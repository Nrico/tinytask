"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@tinytask/ui/buttons/button';
import { Input } from '@tinytask/ui/forms/input';
import { Label } from '@tinytask/ui/forms/label';
import { Card, CardContent } from '@tinytask/ui/cards/card';
import { ArrowLeft, Printer, Plus, Trash2, FileText } from 'lucide-react';
import Link from 'next/link';

interface LineItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
}

export default function InvoiceSwiftPage() {
    // State
    const [companyName, setCompanyName] = useState('My Company');
    const [companyDetails, setCompanyDetails] = useState('123 Business Rd\nCity, State, Zip');
    const [clientName, setClientName] = useState('Client Name');
    const [clientDetails, setClientDetails] = useState('456 Client Ave\nCity, State, Zip');
    const [invoiceNumber, setInvoiceNumber] = useState('INV-001');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [taxRate, setTaxRate] = useState(0);
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
        <div className="container mx-auto px-4 py-8 max-w-7xl sm:px-6 lg:px-8">
            <div className="mb-8 print:hidden">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Invoice Swift</h1>
                        <p className="text-muted-foreground">Create professional invoices instantly.</p>
                    </div>
                    <Button onClick={handlePrint}>
                        <Printer className="w-4 h-4 mr-2" /> Print Invoice
                    </Button>
                </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">
                {/* Editor Column */}
                <div className="space-y-6 print:hidden h-fit overflow-y-auto max-h-[calc(100vh-200px)] pr-2">
                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold flex items-center gap-2">
                                <FileText className="w-4 h-4" /> Invoice Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Invoice #</Label>
                                    <Input value={invoiceNumber} onChange={e => setInvoiceNumber(e.target.value)} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Date</Label>
                                    <Input type="date" value={date} onChange={e => setDate(e.target.value)} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <h3 className="font-semibold">Parties</h3>
                            <div className="grid gap-4">
                                <div className="space-y-2">
                                    <Label>My Company</Label>
                                    <Input value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Company Name" />
                                    <textarea
                                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={companyDetails}
                                        onChange={e => setCompanyDetails(e.target.value)}
                                        placeholder="Address, Phone, Email..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Client</Label>
                                    <Input value={clientName} onChange={e => setClientName(e.target.value)} placeholder="Client Name" />
                                    <textarea
                                        className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                        value={clientDetails}
                                        onChange={e => setClientDetails(e.target.value)}
                                        placeholder="Client Address..."
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="font-semibold">Line Items</h3>
                                <Button size="sm" variant="outline" onClick={addLineItem}>
                                    <Plus className="w-4 h-4 mr-2" /> Add Item
                                </Button>
                            </div>
                            <div className="space-y-4">
                                {lineItems.map((item, index) => (
                                    <div key={item.id} className="grid grid-cols-12 gap-2 items-start p-2 border rounded-md bg-muted/20">
                                        <div className="col-span-6 space-y-1">
                                            <Label className="text-xs">Description</Label>
                                            <Input
                                                value={item.description}
                                                onChange={e => updateLineItem(item.id, 'description', e.target.value)}
                                                placeholder="Item description"
                                            />
                                        </div>
                                        <div className="col-span-2 space-y-1">
                                            <Label className="text-xs">Qty</Label>
                                            <Input
                                                type="number"
                                                value={item.quantity}
                                                onChange={e => updateLineItem(item.id, 'quantity', Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-3 space-y-1">
                                            <Label className="text-xs">Rate</Label>
                                            <Input
                                                type="number"
                                                value={item.rate}
                                                onChange={e => updateLineItem(item.id, 'rate', Number(e.target.value))}
                                            />
                                        </div>
                                        <div className="col-span-1 pt-6 flex justify-center">
                                            <Button variant="ghost" size="icon" onClick={() => removeLineItem(item.id)} className="text-destructive h-8 w-8">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="pt-4 border-t">
                                <div className="flex items-center justify-end gap-2">
                                    <Label>Tax Rate (%)</Label>
                                    <Input
                                        type="number"
                                        className="w-24 text-right"
                                        value={taxRate}
                                        onChange={e => setTaxRate(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Preview / Print Column */}
                <div className="print:w-full print:absolute print:top-0 print:left-0 print:m-0">
                    <div className="bg-white text-black p-8 shadow-lg border rounded-lg min-h-[800px] print:shadow-none print:border-none print:rounded-none">
                        {/* Invoice Header */}
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <h2 className="text-4xl font-bold text-slate-800 mb-2">INVOICE</h2>
                                <p className="text-slate-500">#{invoiceNumber}</p>
                            </div>
                            <div className="text-right">
                                <h3 className="font-bold text-lg">{companyName}</h3>
                                <div className="text-sm text-slate-600 whitespace-pre-line">{companyDetails}</div>
                            </div>
                        </div>

                        {/* Client & Date */}
                        <div className="flex justify-between mb-12">
                            <div>
                                <p className="text-sm font-bold text-slate-400 uppercase mb-1">Bill To</p>
                                <h3 className="font-bold text-lg">{clientName}</h3>
                                <div className="text-sm text-slate-600 whitespace-pre-line">{clientDetails}</div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-400 uppercase mb-1">Date</p>
                                <p className="font-medium">{new Date(date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Line Items Table */}
                        <table className="w-full mb-8">
                            <thead>
                                <tr className="border-b-2 border-slate-200">
                                    <th className="text-left py-3 font-bold text-slate-600">Description</th>
                                    <th className="text-right py-3 font-bold text-slate-600 w-24">Qty</th>
                                    <th className="text-right py-3 font-bold text-slate-600 w-32">Rate</th>
                                    <th className="text-right py-3 font-bold text-slate-600 w-32">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lineItems.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-100">
                                        <td className="py-4 text-slate-700">{item.description || 'Item'}</td>
                                        <td className="py-4 text-right text-slate-700">{item.quantity}</td>
                                        <td className="py-4 text-right text-slate-700">${item.rate.toFixed(2)}</td>
                                        <td className="py-4 text-right font-medium text-slate-800">
                                            ${(item.quantity * item.rate).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Totals */}
                        <div className="flex justify-end">
                            <div className="w-64 space-y-2">
                                <div className="flex justify-between text-slate-600">
                                    <span>Subtotal</span>
                                    <span>${subtotal.toFixed(2)}</span>
                                </div>
                                {taxRate > 0 && (
                                    <div className="flex justify-between text-slate-600">
                                        <span>Tax ({taxRate}%)</span>
                                        <span>${taxAmount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between font-bold text-xl text-slate-800 pt-4 border-t border-slate-200">
                                    <span>Total</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="mt-20 pt-8 border-t border-slate-100 text-center text-slate-400 text-sm">
                            <p>Thank you for your business!</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
