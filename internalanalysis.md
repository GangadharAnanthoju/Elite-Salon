# SysInt — Salon Application Pricing Analysis
> Internal document — SaaS cost & pricing model for selling salon platform to salon owners

---

## What We're Selling

A fully managed salon platform including:
- Custom branded static website (5 pages)
- AI booking assistant (chat widget)
- Azure hosting & deployment
- DNS setup & SSL
- Ongoing maintenance & updates
- Agent trained on salon-specific FAQ

---

## Our Cost Per Customer (Azure Infrastructure)

### Per Salon Per Month

| Service | Usage Estimate | Monthly Cost |
|---|---|---|
| Azure Static Web Apps | Free tier | $0 |
| Azure Container Apps | Agent (0.5 vCPU, 1GB RAM) | ~$15–$25 |
| Azure OpenAI (gpt-4.1-mini) | ~500 chats/mo × 500 tokens | ~$1–$2/mo |
| Azure Container Registry | 1 image stored | ~$5 |
| DNS / Custom Domain | Via client's registrar | $0 |
| Calendly Standard | 4 barbers × $10/seat/mo (yearly) | $40/mo |
| **Total infra/month** | | **~$70–$90** |

> 📄 See [calendly-setup.md](calendly-setup.md) for full Calendly pricing breakdown and setup steps.

### One-Time Setup Cost (Your Time)

| Task | Est. Hours | At $75/hr |
|---|---|---|
| Website build & customisation | 8–12 hrs | $600–$900 |
| AI agent training (FAQ, prompt) | 2–4 hrs | $150–$300 |
| Azure deployment & DNS | 1–2 hrs | $75–$150 |
| Content (photos, copy) | 2–4 hrs | $150–$300 |
| **Total setup** | **13–22 hrs** | **$975–$1,650** |

---

## Recommended Pricing Models

### Option A — One-Time + Monthly Retainer (Simple)

| Fee | Amount |
|---|---|
| Setup fee (one-time) | $1,500–$2,500 |
| Monthly retainer (hosting + support + AI) | $99–$149/mo |

**Break-even:** ~3–4 months  
**Best for:** Small independent salons, first clients

---

### Option B — Monthly SaaS Only (No setup fee)

| Tier | Features | Price/mo |
|---|---|---|
| **Starter** | Website only, no AI agent | $49/mo |
| **Pro** | Website + AI chat (FAQ only) | $99/mo |
| **Elite** | Website + AI + Calendly + analytics | $149/mo |
| **Enterprise** | Multi-location, custom integrations | $299+/mo |

**Break-even:** 1–2 months  
**Best for:** Scale — easier to sell, recurring revenue

---

### Option C — Hybrid (Recommended)

| Fee | Amount |
|---|---|
| Setup fee | $999 (reduced to close deals) |
| Monthly Pro plan | $129/mo |

**Why this works:**
- Setup fee covers your initial time investment
- Monthly covers infra + profit margin
- Low barrier to entry for the salon owner
- Predictable recurring revenue for you

---

## Profit Margin Analysis (Per Customer)

### Monthly (Option C — $129/mo plan)

| | Amount |
|---|---|
| Revenue | $129/mo |
| Azure infra cost | ~$40/mo |
| Support time (1hr/mo @ $75) | ~$75/mo |
| **Net profit/month** | **~$14/mo** |
| **Net profit/year** | **~$168/yr** |

> ⚠️ Margins are thin at $129 with full support. Solutions:
> - Automate support (the AI agent handles most questions)
> - Batch deployments (same infra, multiple salons)
> - Reduce support to 30min/mo once stable

### Monthly (Scaled — 20 salons, shared infra)

| | Amount |
|---|---|
| Revenue (20 × $129) | $2,580/mo |
| Shared Azure infra (20 salons) | ~$400/mo |
| Support (5hrs total @ $75) | ~$375/mo |
| **Net profit/month** | **~$1,805/mo** |
| **Net profit/year** | **~$21,660/yr** |

---

## Competitive Landscape

| Competitor | What they offer | Price |
|---|---|---|
| Squarespace + Acuity | DIY website + booking | $23–$65/mo |
| Wix + Wix Bookings | DIY website + booking | $17–$35/mo |
| Vagaro | Full salon management | $30–$90/mo |
| Fresha | Booking only (free + commission) | Free + 20% new clients |
| **Our product** | Custom AI-powered site + agent | $129/mo |

**Our edge:**
- AI chat agent (competitors don't have this)
- Fully custom branded — not a template
- No commission on bookings
- White-glove setup

---

## Go-To-Market Recommendation

1. **Land first 5 clients at $999 setup + $99/mo** — build case studies
2. **Use Elite Saloon as the demo** — it's live, polished, real
3. **Target independent salons 1–4 chairs** — not chains (they have IT teams)
4. **Upsell path:** Starter → Pro → Elite as they see value
5. **Add booking commission model later** — e.g. $1 per AI-assisted booking

---

## Summary

| Scenario | Monthly Revenue | Monthly Cost | Profit |
|---|---|---|---|
| 5 salons @ $129 | $645 | $400 | $245 |
| 10 salons @ $129 | $1,290 | $600 | $690 |
| 20 salons @ $129 | $2,580 | $775 | $1,805 |
| 50 salons @ $129 | $6,450 | $1,500 | $4,950 |

**Sweet spot: 20+ salons is where this becomes a real business.**

---

---

## Client Onboarding Questionnaire

Questions to ask every new salon owner before setup begins.

---

### 1. Business Basics
- What is the full salon name and tagline?
- What is the business address?
- What is the main contact phone number and email?
- Do you have an existing domain? If yes, what is it?
- Do you have a logo? (PNG with transparent background preferred)

---

### 2. Working Hours
- What are your **actual opening hours** each day?
  - Monday – Friday: _____ to _____
  - Saturday: _____ to _____
  - Sunday: _____ to _____ (or Closed?)
  - Public Holidays: Open / Closed / By appointment?
- Do you have a **lunch break** where no bookings should be taken?
  - Lunch hours: _____ to _____ (e.g. 1:00pm – 2:00pm)
- What is the **earliest** appointment slot? (e.g. 9:00am)
- What is the **last** appointment slot? (e.g. 7:00pm)
- What is your standard **appointment slot duration**? (e.g. 30 min, 45 min, 60 min)

---

### 3. Booking & Reminders
- Do you want **SMS reminders** sent to clients before appointments?
  - **24 hours prior** reminder — Yes / No
  - **4 hours prior** reminder — Yes / No
  - Any other reminder timing preferred? (e.g. 1 hour, 48 hours)
- Do you want **email confirmations** sent automatically after booking?
- What is your **cancellation policy**?
  - How many hours notice required? (e.g. 24 hrs)
  - Is there a cancellation fee?
- Do you want to allow **online rescheduling**? Yes / No
- Preferred cancellation alert method: Push notification / SMS?

> 📄 See [calendly-setup.md](calendly-setup.md) for full Calendly configuration steps.

---

### 4. Team & Barbers
- How many barbers/stylists do you have?
- For each barber, please provide:
  - Full name and role/title
  - Profile photo (portrait, dark background preferred)
  - Their personal tagline / quote
  - Specialties (e.g. Fades, Colour, Hot Shave)
  - Years of experience
  - Individual Calendly link (or we set up per barber)

---

### 5. Services & Pricing
- What services do you offer? (list all)
- What is the price for each service?
- Are prices different per barber? (e.g. senior barber charges more)
- Any services with variable pricing based on hair length or complexity?
- Do you offer **packages or bundles**?
- Do you sell **retail products** in-salon?

---

### 6. AI Agent Configuration
- What language should the AI assistant respond in? (English / bilingual?)
- Are there any questions the AI should **never** answer? (e.g. pricing negotiation)
- Should the AI be able to **take booking requests** or just direct to Calendly?
- What tone should the AI use? (e.g. formal / friendly / luxury)
- Any **promotions or offers** to mention? (e.g. 10% off first visit)

---

### 7. Gallery & Branding
- Do you have photos of the salon interior? (min. 6 recommended)
- Do you have before/after or work photos to showcase?
- Brand colours (if known)?
- Any specific fonts or style preferences?

---

### 8. Social Media
- Instagram handle: @_______
- Facebook page URL:
- TikTok handle: @_______
- Google Business profile link:

---

*Use this form during first client call. Estimated time to complete: 30–45 minutes.*

---

*Last updated: May 2026 | SysInt Internal Use Only*
