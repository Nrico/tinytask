# TinyTask Product Backlog & Ideas

This document serves as a repository of feature ideas, upcoming micro-apps, and infrastructure expansions.

---

## 1. Upcoming Tools (Micro-apps)

### InspectPass (Beta)
- **Concept**: A client-side password strength checker and generator.
- **Features**:
  - Entropy calculator (tells user how long it would take to brute force).
  - Pwned Passwords API integration (check if the password has been leaked previously).
  - Secure generator with copy-to-clipboard.

### MileSnap (Concept)
- **Concept**: A simple mileage and travel expense calculator.
- **Features**:
  - Google Maps route planning interface.
  - Automatic calculation of standard IRS tax deduction rates.
  - CSV export of trip logs.

### Invoice Helper (Concept)
- **Concept**: Interactive spreadsheet-to-invoice generator.
- **Features**:
  - Upload CSV of billable timesheet rows.
  - Automatically group rows by client.
  - Batch export multiple PDF invoices.

---

## 2. Platform Infrastructure Roadmaps

### Unified Authentication (Future)
- Add user account dashboard.
- Save user preferences, custom default configurations for templates, and recent logs.
- Powered by Firebase Auth or Clerk.

### Shared Billing & Pro Subscription (Future)
- Restrict certain high-overhead operations (e.g. bulk OCR, big pdf conversions) to Pro tier.
- Integrates Stripe checkout with a customer portal.
