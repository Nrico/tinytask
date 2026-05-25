"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@tinytask/ui/buttons/button"
import { Label } from "@tinytask/ui/forms/label"
import { ToolLayout } from "@tinytask/ui/layouts/tool-layout"
import { Card, CardContent } from "@tinytask/ui/cards/card"
import { 
  Clipboard, 
  Check, 
  Sparkles, 
  User, 
  Briefcase, 
  Phone, 
  Globe, 
  Palette,
  Link,
  Code,
  Copy
} from "lucide-react"

type SignatureTemplate = "horizontal" | "vertical"
type AvatarShape = "circle" | "square" | "rounded"

export default function SignatureGeneratorPage() {
  // Form States
  const [name, setName] = useState("Jane Doe")
  const [title, setTitle] = useState("Senior Creative Director")
  const [department, setDepartment] = useState("Marketing & Design")
  const [company, setCompany] = useState("TinyTask Inc.")
  const [email, setEmail] = useState("jane.doe@tinytask.com")
  const [phone, setPhone] = useState("+1 (555) 019-2834")
  const [mobile, setMobile] = useState("+1 (555) 019-5839")
  const [website, setWebsite] = useState("https://tinytask.com")
  
  // Customization States
  const [logoUrl, setLogoUrl] = useState("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80")
  const [avatarShape, setAvatarShape] = useState<AvatarShape>("circle")
  const [primaryColor, setPrimaryColor] = useState("#6366F1")
  const [secondaryColor, setSecondaryColor] = useState("#10B981")
  const [textColor, setTextColor] = useState("#334155")
  const [fontFamily, setFontFamily] = useState("Arial, sans-serif")
  const [template, setTemplate] = useState<SignatureTemplate>("horizontal")

  // Social Links
  const [linkedin, setLinkedin] = useState("https://linkedin.com/company/tinytask")
  const [twitter, setTwitter] = useState("https://twitter.com/tinytask")
  const [github, setGithub] = useState("https://github.com/tinytask")

  // Output States
  const [htmlCode, setHtmlCode] = useState("")
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedRich, setCopiedRich] = useState(false)
  const [toastMessage, setToastMessage] = useState("")

  const getBorderRadius = (): string => {
    if (avatarShape === "circle") return "50%"
    if (avatarShape === "rounded") return "8px"
    return "0px"
  }

  // Generate compliance HTML block
  const generateSignatureHtml = (): string => {
    const borderRadius = getBorderRadius()
    const fontStyle = `font-family: ${fontFamily}; color: ${textColor}; line-height: 1.35;`

    const displayLogo = logoUrl ? `
      <td valign="top" style="padding-right: 16px; padding-bottom: ${template === "vertical" ? "12px" : "0px"};">
        <img src="${logoUrl}" width="80" height="80" style="border-radius: ${borderRadius}; display: block; object-fit: cover; border: 0;" alt="${name}" />
      </td>
    ` : ""

    const contactRows = `
      ${phone ? `
        <tr>
          <td style="padding-right: 8px; color: ${primaryColor}; font-weight: bold; font-family: ${fontFamily}; font-size: 12px; line-height: 1.5;">O:</td>
          <td style="color: ${textColor}; font-family: ${fontFamily}; font-size: 12px; line-height: 1.5;">${phone}</td>
        </tr>
      ` : ""}
      ${mobile ? `
        <tr>
          <td style="padding-right: 8px; color: ${primaryColor}; font-weight: bold; font-family: ${fontFamily}; font-size: 12px; line-height: 1.5;">M:</td>
          <td style="color: ${textColor}; font-family: ${fontFamily}; font-size: 12px; line-height: 1.5;">${mobile}</td>
        </tr>
      ` : ""}
      ${email ? `
        <tr>
          <td style="padding-right: 8px; color: ${primaryColor}; font-weight: bold; font-family: ${fontFamily}; font-size: 12px; line-height: 1.5;">E:</td>
          <td style="font-family: ${fontFamily}; font-size: 12px; line-height: 1.5;">
            <a href="mailto:${email}" style="color: ${secondaryColor}; text-decoration: none;">${email}</a>
          </td>
        </tr>
      ` : ""}
      ${website ? `
        <tr>
          <td style="padding-right: 8px; color: ${primaryColor}; font-weight: bold; font-family: ${fontFamily}; font-size: 12px; line-height: 1.5;">W:</td>
          <td style="font-family: ${fontFamily}; font-size: 12px; line-height: 1.5;">
            <a href="${website}" target="_blank" rel="noopener noreferrer" style="color: ${secondaryColor}; text-decoration: none;">${website.replace(/^https?:\/\/(www\.)?/, "")}</a>
          </td>
        </tr>
      ` : ""}
    `

    const socialLinksRow = `
      ${(linkedin || twitter || github) ? `
        <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 10px;">
          <tr>
            ${linkedin ? `
              <td style="padding-right: 12px; font-family: ${fontFamily}; font-size: 11px;">
                <a href="${linkedin}" target="_blank" rel="noopener noreferrer" style="color: ${primaryColor}; text-decoration: none; font-weight: bold;">LinkedIn</a>
              </td>
            ` : ""}
            ${twitter ? `
              <td style="padding-right: 12px; font-family: ${fontFamily}; font-size: 11px;">
                <a href="${twitter}" target="_blank" rel="noopener noreferrer" style="color: ${primaryColor}; text-decoration: none; font-weight: bold;">Twitter</a>
              </td>
            ` : ""}
            ${github ? `
              <td style="padding-right: 12px; font-family: ${fontFamily}; font-size: 11px;">
                <a href="${github}" target="_blank" rel="noopener noreferrer" style="color: ${primaryColor}; text-decoration: none; font-weight: bold;">GitHub</a>
              </td>
            ` : ""}
          </tr>
        </table>
      ` : ""}
    `

    if (template === "horizontal") {
      return `<!-- TINYTASK SIGNATURE START -->
<table cellpadding="0" cellspacing="0" border="0" style="${fontStyle} font-size: 13px; max-width: 450px;">
  <tr>
    ${displayLogo}
    ${logoUrl ? `<td valign="stretch" style="border-left: 2px solid ${primaryColor}; padding-right: 16px;"></td>` : ""}
    <td valign="top">
      <div style="font-size: 16px; font-weight: bold; color: ${primaryColor}; font-family: ${fontFamily};">${name}</div>
      <div style="font-size: 12px; color: #666666; font-weight: bold; margin-bottom: 6px; font-family: ${fontFamily};">${title}${department ? ` | ${department}` : ""}${company ? ` at ${company}` : ""}</div>
      
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 4px;">
        ${contactRows}
      </table>
      
      ${socialLinksRow}
    </td>
  </tr>
</table>
<!-- TINYTASK SIGNATURE END -->`
    } else {
      return `<!-- TINYTASK SIGNATURE START -->
<table cellpadding="0" cellspacing="0" border="0" style="${fontStyle} font-size: 13px; max-width: 400px;">
  ${logoUrl ? `<tr>${displayLogo}</tr>` : ""}
  <tr>
    <td valign="top" style="border-top: 2px solid ${primaryColor}; padding-top: 8px;">
      <div style="font-size: 16px; font-weight: bold; color: ${primaryColor}; font-family: ${fontFamily};">${name}</div>
      <div style="font-size: 12px; color: #666666; font-weight: bold; margin-bottom: 8px; font-family: ${fontFamily};">${title}${department ? ` - ${department}` : ""}${company ? ` (${company})` : ""}</div>
      
      <table cellpadding="0" cellspacing="0" border="0" style="margin-top: 4px;">
        ${contactRows}
      </table>
      
      ${socialLinksRow}
    </td>
  </tr>
</table>
<!-- TINYTASK SIGNATURE END -->`
    }
  }

  // Update HTML output block
  useEffect(() => {
    setHtmlCode(generateSignatureHtml())
  }, [name, title, department, company, email, phone, mobile, website, logoUrl, avatarShape, primaryColor, secondaryColor, textColor, fontFamily, template, linkedin, twitter, github])

  // Copy raw HTML source to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(htmlCode)
    setCopiedCode(true)
    setToastMessage("HTML source code copied!")
    setTimeout(() => {
      setCopiedCode(false)
      setToastMessage("")
    }, 2500)
  }

  // Copy HTML rendering to clipboard as text/html for direct pasting
  const handleCopyRichText = async () => {
    try {
      const plainText = `${name}\n${title}${department ? ` | ${department}` : ""}\n${phone ? `O: ${phone}\n` : ""}${mobile ? `M: ${mobile}\n` : ""}${email ? `E: ${email}\n` : ""}${website ? `W: ${website}` : ""}`
      
      const htmlBlob = new Blob([htmlCode], { type: "text/html" })
      const plainBlob = new Blob([plainText], { type: "text/plain" })
      
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": htmlBlob,
          "text/plain": plainBlob
        })
      ])
      
      setCopiedRich(true)
      setToastMessage("Rich signature copied! Paste directly into your email client settings.")
      setTimeout(() => {
        setCopiedRich(false)
        setToastMessage("")
      }, 3500)
    } catch (err) {
      console.error(err)
      setToastMessage("Rich copy failed, copying raw HTML instead.")
      handleCopyCode()
    }
  }

  const loadExample = () => {
    setName("Jane Doe")
    setTitle("Senior Creative Director")
    setDepartment("Marketing & Design")
    setCompany("TinyTask Inc.")
    setEmail("jane.doe@tinytask.com")
    setPhone("+1 (555) 019-2834")
    setMobile("+1 (555) 019-5839")
    setWebsite("https://tinytask.com")
    setLogoUrl("https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80")
    setAvatarShape("circle")
    setPrimaryColor("#6366F1")
    setSecondaryColor("#10B981")
    setTextColor("#334155")
    setFontFamily("Arial, sans-serif")
  }

  const clearForm = () => {
    setName("")
    setTitle("")
    setDepartment("")
    setCompany("")
    setEmail("")
    setPhone("")
    setMobile("")
    setWebsite("")
    setLogoUrl("")
    setLinkedin("")
    setTwitter("")
    setGithub("")
  }

  return (
    <ToolLayout
      title="Email Signature Generator"
      description="Design Outlook-safe HTML signatures and copy them as rich text directly into your mail app's settings."
      sidebarContent={
        <div className="space-y-6 max-h-[calc(100vh-180px)] overflow-y-auto pr-1">
          {/* Quick templates / styling */}
          <div className="space-y-3">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400">Design Presets</Label>
            
            <div className="flex gap-2">
              <Button
                variant={template === "horizontal" ? "default" : "outline"}
                onClick={() => setTemplate("horizontal")}
                className="flex-1 text-xs"
                size="sm"
              >
                Horizontal Split
              </Button>
              <Button
                variant={template === "vertical" ? "default" : "outline"}
                onClick={() => setTemplate("vertical")}
                className="flex-1 text-xs"
                size="sm"
              >
                Vertical Stack
              </Button>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={loadExample}
                className="text-xs font-bold text-primary hover:text-primary/90 hover:underline flex items-center gap-1 cursor-pointer select-none"
              >
                <Sparkles className="w-3.5 h-3.5" /> Load Sample
              </button>
              <span className="text-slate-300">|</span>
              <button
                onClick={clearForm}
                className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline flex items-center gap-1 cursor-pointer select-none"
              >
                Clear Form
              </button>
            </div>
          </div>

          {/* Form Personal Details */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <User className="w-3.5 h-3.5 text-slate-400" /> Professional Details
            </Label>
            
            <div className="space-y-2">
              <div>
                <Label htmlFor="name" className="text-[10px] text-slate-500">Full Name</Label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="e.g. Jane Doe"
                />
              </div>

              <div>
                <Label htmlFor="title" className="text-[10px] text-slate-500">Job Title</Label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="e.g. Director of Engineering"
                />
              </div>

              <div>
                <Label htmlFor="dept" className="text-[10px] text-slate-500">Department</Label>
                <input
                  type="text"
                  id="dept"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="e.g. Product Strategy"
                />
              </div>

              <div>
                <Label htmlFor="comp" className="text-[10px] text-slate-500">Company Name</Label>
                <input
                  type="text"
                  id="comp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="e.g. TinyTask Inc."
                />
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Phone className="w-3.5 h-3.5 text-slate-400" /> Contact Info
            </Label>
            
            <div className="space-y-2">
              <div>
                <Label htmlFor="email" className="text-[10px] text-slate-500">Email Address</Label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="jane@company.com"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-[10px] text-slate-500">Office Phone</Label>
                <input
                  type="text"
                  id="phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="+1 (555) 012-3456"
                />
              </div>

              <div>
                <Label htmlFor="mobile" className="text-[10px] text-slate-500">Mobile Phone</Label>
                <input
                  type="text"
                  id="mobile"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="+1 (555) 098-7654"
                />
              </div>

              <div>
                <Label htmlFor="web" className="text-[10px] text-slate-500">Website URL</Label>
                <input
                  type="text"
                  id="web"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="https://company.com"
                />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Link className="w-3.5 h-3.5 text-slate-400" /> Social Links
            </Label>
            
            <div className="space-y-2">
              <div>
                <Label htmlFor="linkedin" className="text-[10px] text-slate-500">LinkedIn URL</Label>
                <input
                  type="text"
                  id="linkedin"
                  value={linkedin}
                  onChange={(e) => setLinkedin(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="https://linkedin.com/in/username"
                />
              </div>

              <div>
                <Label htmlFor="twitter" className="text-[10px] text-slate-500">Twitter/X URL</Label>
                <input
                  type="text"
                  id="twitter"
                  value={twitter}
                  onChange={(e) => setTwitter(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="https://twitter.com/username"
                />
              </div>

              <div>
                <Label htmlFor="github" className="text-[10px] text-slate-500">GitHub URL</Label>
                <input
                  type="text"
                  id="github"
                  value={github}
                  onChange={(e) => setGithub(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>
          </div>

          {/* Visual Customizations */}
          <div className="space-y-3 border-t pt-4">
            <Label className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
              <Palette className="w-3.5 h-3.5 text-slate-400" /> Visual Theme
            </Label>
            
            <div className="space-y-2.5">
              <div>
                <Label htmlFor="logo" className="text-[10px] text-slate-500">Avatar / Logo Image URL</Label>
                <input
                  type="text"
                  id="logo"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="Paste image link..."
                />
              </div>

              <div>
                <Label className="text-[10px] text-slate-500">Logo Border Shape</Label>
                <div className="flex gap-2 mt-0.5">
                  <Button
                    variant={avatarShape === "circle" ? "default" : "outline"}
                    onClick={() => setAvatarShape("circle")}
                    className="flex-1 text-[10px] h-8"
                    size="sm"
                  >
                    Circle
                  </Button>
                  <Button
                    variant={avatarShape === "rounded" ? "default" : "outline"}
                    onClick={() => setAvatarShape("rounded")}
                    className="flex-1 text-[10px] h-8"
                    size="sm"
                  >
                    Rounded
                  </Button>
                  <Button
                    variant={avatarShape === "square" ? "default" : "outline"}
                    onClick={() => setAvatarShape("square")}
                    className="flex-1 text-[10px] h-8"
                    size="sm"
                  >
                    Square
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <Label className="text-[9px] text-slate-500 block truncate">Primary Color</Label>
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      type="color"
                      value={primaryColor}
                      onChange={(e) => setPrimaryColor(e.target.value)}
                      className="w-6 h-6 border-0 rounded-md cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono uppercase text-slate-500">{primaryColor}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-[9px] text-slate-500 block truncate">Secondary Color</Label>
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      type="color"
                      value={secondaryColor}
                      onChange={(e) => setSecondaryColor(e.target.value)}
                      className="w-6 h-6 border-0 rounded-md cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono uppercase text-slate-500">{secondaryColor}</span>
                  </div>
                </div>

                <div>
                  <Label className="text-[9px] text-slate-500 block truncate">Text Color</Label>
                  <div className="flex items-center gap-1 mt-0.5">
                    <input
                      type="color"
                      value={textColor}
                      onChange={(e) => setTextColor(e.target.value)}
                      className="w-6 h-6 border-0 rounded-md cursor-pointer bg-transparent"
                    />
                    <span className="text-[10px] font-mono uppercase text-slate-500">{textColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="font" className="text-[10px] text-slate-500">Typography Font</Label>
                <select
                  id="font"
                  value={fontFamily}
                  onChange={(e) => setFontFamily(e.target.value)}
                  className="w-full mt-0.5 rounded border border-slate-200 text-xs px-2.5 py-1.5 focus:ring-1 focus:ring-ring focus:outline-none bg-white"
                >
                  <option value="Arial, sans-serif">Arial (Recommended)</option>
                  <option value="'Trebuchet MS', sans-serif">Trebuchet MS</option>
                  <option value="Verdana, sans-serif">Verdana</option>
                  <option value="Georgia, serif">Georgia</option>
                  <option value="'Times New Roman', serif">Times New Roman</option>
                  <option value="'Courier New', monospace">Courier New (Mono)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      }
      previewContent={
        <div className="flex flex-col gap-6 w-full h-[calc(100vh-140px)] min-h-[450px]">
          {/* Live Preview Pane */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                Live Outlook Signature Preview
              </span>
              <Button
                onClick={handleCopyRichText}
                size="sm"
                className="h-8 gap-1.5 text-xs bg-primary hover:bg-primary/90 text-white"
              >
                {copiedRich ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedRich ? "Copied Rich!" : "Copy Rich Signature"}
              </Button>
            </div>
            
            <div className="flex-1 flex items-center justify-center p-8 bg-slate-50/40 overflow-auto border-b">
              {/* This inner container mimics the target layout sandbox */}
              <div 
                className="p-6 bg-white border border-slate-200/60 rounded-xl shadow-2xs min-w-[280px]"
                dangerouslySetInnerHTML={{ __html: htmlCode }}
              />
            </div>

            <div className="p-3.5 bg-card/100 text-[10px] text-primary font-medium flex items-center gap-1.5 border-t border-border/50/20">
              <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
              Copying as "Rich Signature" loads the formatted table directly. You can paste it straight into Gmail, Outlook, or Apple Mail signature boxes!
            </div>
          </div>

          {/* HTML Raw Code Export Pane */}
          <div className="flex-1 flex flex-col bg-white rounded-xl border shadow-xs overflow-hidden">
            <div className="p-4 border-b bg-slate-50 flex items-center justify-between flex-shrink-0">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-slate-400" />
                Clean HTML Source Code (Strict Tables & Inline Styles)
              </span>
              <Button
                onClick={handleCopyCode}
                size="sm"
                variant="outline"
                className="h-8 gap-1.5 text-xs"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5" /> : <Clipboard className="w-3.5 h-3.5" />}
                {copiedCode ? "Copied Source!" : "Copy Source Code"}
              </Button>
            </div>
            
            <textarea
              readOnly
              value={htmlCode}
              className="flex-1 p-6 resize-none font-mono text-xs border-0 focus:outline-none focus:ring-0 bg-slate-900 text-slate-400 select-all cursor-text leading-relaxed"
              placeholder="HTML source code will display here..."
            />
          </div>

          {/* Notification Toast */}
          {toastMessage && (
            <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-4 py-2.5 rounded-lg shadow-xl border border-slate-700 flex items-center gap-2 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 z-50">
              <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
              {toastMessage}
            </div>
          )}
        </div>
      }
    />
  )
}
