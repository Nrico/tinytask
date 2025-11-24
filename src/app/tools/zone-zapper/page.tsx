"use client"

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Globe, Clock, Plus, Trash2, Sun, Moon } from 'lucide-react';
import Link from 'next/link';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// Common timezones
const CITIES = [
    { name: 'Los Angeles', zone: 'America/Los_Angeles' },
    { name: 'New York', zone: 'America/New_York' },
    { name: 'London', zone: 'Europe/London' },
    { name: 'Paris', zone: 'Europe/Paris' },
    { name: 'Dubai', zone: 'Asia/Dubai' },
    { name: 'Mumbai', zone: 'Asia/Kolkata' },
    { name: 'Singapore', zone: 'Asia/Singapore' },
    { name: 'Tokyo', zone: 'Asia/Tokyo' },
    { name: 'Sydney', zone: 'Australia/Sydney' },
];

export default function ZoneZapperPage() {
    const [selectedCities, setSelectedCities] = useState<string[]>(['America/New_York', 'Europe/London', 'Asia/Tokyo']);
    const [sliderValue, setSliderValue] = useState([12]); // 12 PM local time (relative to first city or user local?) 
    // Let's make the slider represent the time in the FIRST city in the list (or a reference time).
    // Actually, user request says "slider (0-24 hours) representing the meeting time".
    // Let's assume the slider controls UTC time for simplicity, or maybe the first city's time.
    // Let's control UTC time to be neutral. 0-24 UTC.

    // Better UX: Slider controls the time of the first selected city.

    const referenceCity = selectedCities[0] || 'UTC';

    // Helper to format time
    const formatTime = (date: Date, zone: string) => {
        return new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
            timeZone: zone,
            weekday: 'short'
        }).format(date);
    };

    const getHourInZone = (date: Date, zone: string) => {
        const str = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            hour12: false,
            timeZone: zone
        }).format(date);
        return parseInt(str, 10);
    };

    // Calculate the Date object based on slider value (hours from 0-24) applied to TODAY
    // We need a reference date. Let's use today.
    const getReferenceDate = (hours: number) => {
        const now = new Date();
        // We want to set the time such that in 'referenceCity', it is 'hours' o'clock.
        // This is tricky with Intl. 
        // Alternative: Slider is simply 0-24 UTC.
        // Let's stick to: Slider is 0-24 hours in the FIRST city.

        // 1. Get current date in reference city
        // 2. Set hour to slider value
        // 3. Convert to UTC timestamp to derive other times

        // Hacky way to set time in a timezone:
        // Create a date string "YYYY-MM-DD HH:00:00" and append offset? No, offset changes.
        // Let's use a library-free approach.
        // We can find the offset of the reference city for today.

        // Simpler approach:
        // Just use UTC for the slider logic internally, but display "Slider Time" as "UTC Time".
        // Or, just use the browser's local time as the "base" for the slider?
        // Let's use the first city as the anchor.

        // If slider is 14 (2 PM), we want the time in City 1 to be 14:00.
        // We can construct a date that IS 14:00 in that zone.
        // const d = new Date();
        // const str = d.toLocaleString('en-US', { timeZone: referenceCity });
        // This gives us the current time in that city.
        // We calculate the difference between "current hour in city" and "slider hour".
        // Add that difference to the current timestamp.

        const d = new Date();
        const parts = new Intl.DateTimeFormat('en-US', {
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: false,
            timeZone: referenceCity
        }).formatToParts(d);

        const currentHourInCity = parseInt(parts.find(p => p.type === 'hour')?.value || '0', 10);
        const currentMinuteInCity = parseInt(parts.find(p => p.type === 'minute')?.value || '0', 10);

        const diffHours = hours - currentHourInCity;
        const diffMinutes = 0 - currentMinuteInCity; // Snap to :00

        const targetDate = new Date(d.getTime() + (diffHours * 60 * 60 * 1000) + (diffMinutes * 60 * 1000));
        return targetDate;
    };

    const targetDate = getReferenceDate(sliderValue[0]);

    const addCity = (zone: string) => {
        if (selectedCities.length < 4 && !selectedCities.includes(zone)) {
            setSelectedCities([...selectedCities, zone]);
        }
    };

    const removeCity = (zone: string) => {
        setSelectedCities(selectedCities.filter(c => c !== zone));
    };

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl sm:px-6 lg:px-8">
            <div className="mb-8">
                <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-4">
                    <ArrowLeft className="w-4 h-4" /> Back to Home
                </Link>
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Zone Zapper</h1>
                        <p className="text-muted-foreground">Find the perfect meeting time across timezones.</p>
                    </div>
                </div>
            </div>

            <div className="grid gap-8">
                {/* Controls */}
                <Card>
                    <CardContent className="p-6 space-y-6">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <Label className="text-lg font-semibold">Meeting Time (in {CITIES.find(c => c.zone === referenceCity)?.name})</Label>
                                <span className="text-2xl font-bold font-mono text-primary">
                                    {formatTime(targetDate, referenceCity)}
                                </span>
                            </div>
                            <Slider
                                value={sliderValue}
                                onValueChange={setSliderValue}
                                max={24}
                                step={0.5} // 30 min increments
                                className="py-4"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>12 AM</span>
                                <span>6 AM</span>
                                <span>12 PM</span>
                                <span>6 PM</span>
                                <span>12 AM</span>
                            </div>
                        </div>

                        <div className="flex gap-4 items-end">
                            <div className="flex-1 space-y-2">
                                <Label>Add City</Label>
                                <Select onValueChange={addCity}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a city..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CITIES.map(city => (
                                            <SelectItem
                                                key={city.zone}
                                                value={city.zone}
                                                disabled={selectedCities.includes(city.zone)}
                                            >
                                                {city.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="text-sm text-muted-foreground pb-2">
                                {selectedCities.length}/4 Cities
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Cities List */}
                <div className="grid gap-4">
                    {selectedCities.map((zone) => {
                        const hour = getHourInZone(targetDate, zone);
                        const isBusinessHours = hour >= 9 && hour < 17; // 9 AM - 5 PM
                        const isSleepingHours = hour >= 22 || hour < 7; // 10 PM - 7 AM

                        // Determine status color
                        let statusColor = "bg-slate-100 border-slate-200"; // Neutral
                        let statusText = "text-slate-600";
                        let icon = <Clock className="w-5 h-5" />;

                        if (isBusinessHours) {
                            statusColor = "bg-green-50 border-green-200";
                            statusText = "text-green-700";
                            icon = <Sun className="w-5 h-5 text-green-600" />;
                        } else if (isSleepingHours) {
                            statusColor = "bg-red-50 border-red-200";
                            statusText = "text-red-700";
                            icon = <Moon className="w-5 h-5 text-red-600" />;
                        }

                        const cityLabel = CITIES.find(c => c.zone === zone)?.name || zone;

                        return (
                            <div key={zone} className={`flex items-center justify-between p-6 rounded-lg border-2 transition-colors ${statusColor}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-full bg-white shadow-sm ${statusText}`}>
                                        {icon}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{cityLabel}</h3>
                                        <p className={`text-sm font-medium ${statusText}`}>
                                            {isBusinessHours ? 'Business Hours' : isSleepingHours ? 'Off Hours' : 'Personal Time'}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <p className="text-3xl font-bold font-mono tracking-tight">
                                            {new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, timeZone: zone }).format(targetDate)}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {new Intl.DateTimeFormat('en-US', { weekday: 'long', timeZone: zone }).format(targetDate)}
                                        </p>
                                    </div>
                                    <Button variant="ghost" size="icon" onClick={() => removeCity(zone)} className="text-muted-foreground hover:text-destructive">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
