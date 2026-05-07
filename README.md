# Elite Saloon — Website

Premium barbershop website with AI booking assistant.  
**Live:** https://elite.sysintinc.com

---

## Project Structure

```
Elite-Salon/
├── site/                        # Static website (deployed to Azure)
│   ├── index.html               # Home page
│   ├── services.html            # Services & Pricing
│   ├── barbers.html             # Our Barbers
│   ├── gallery.html             # Gallery
│   ├── contact.html             # Contact
│   ├── 404.html                 # Error page
│   ├── staticwebapp.config.json # Azure routing config
│   ├── assets/
│   │   ├── css/
│   │   │   ├── main.css         # Design system (dark gold theme)
│   │   │   └── components.css   # Chat widget, lightbox, toasts
│   │   ├── js/
│   │   │   ├── main.js          # Page logic + embedded data
│   │   │   └── chat-widget.js   # AI chat (set CHAT_API_URL to go live)
│   │   └── images/
│   │       ├── logo/            # Elite-Salon-Logo.png
│   │       ├── gallery/         # gallery-01.png → gallery-10.png
│   │       └── team/            # Adrian, Marcus, AlexR, DeanK
│   └── data/                    # JSON data (backup reference)
│       ├── services.json
│       ├── pricing.json
│       ├── team.json
│       └── faqs.json
│
├── agent/                       # AI Agent backend (not yet deployed)
│   ├── prompts/
│   │   └── system-prompt.md     # Salon AI personality & knowledge
│   └── config/
│       └── agent-config.json    # Model, CORS, rate limit config
│
└── infra/
    ├── deploy-swa.ps1           # Deploy site to Azure Static Web Apps
    └── deploy-site.ps1          # Legacy Blob Storage deploy (unused)
```

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML · CSS · Vanilla JS |
| Hosting | Azure Static Web Apps (Free tier) |
| DNS | GoDaddy → `elite.sysintinc.com` |
| AI Chat (planned) | Azure AI Foundry + Azure Function |
| Font | Montserrat (Google Fonts) |
| Theme | Dark `#0C0A07` · Gold `#C9A030` |

---

## Redeploy Site

```powershell
$token = az staticwebapp secrets list `
  --name "elite-saloon" `
  --resource-group "rg-sysint-elite-saloon" `
  --query "properties.apiKey" --output tsv

swa deploy "c:\Data_AI\projects\Elite-Salon\site" `
  --deployment-token $token `
  --env production
```

---

## Update Content

All content is embedded directly in the JS and HTML — no CMS needed.

| What to change | Where |
|---|---|
| Services & pricing | `site/assets/js/main.js` → `SERVICES_DATA` / `PRICING_DATA` |
| Barber profiles | `site/barbers.html` + `main.js` → `TEAM_DATA` |
| Opening hours | `site/index.html` footer + `site/contact.html` |
| Address / phone | `site/contact.html` |
| Reviews | `site/index.html` → Reviews section |

---

## Add a Barber Photo

1. Drop photo into `site/assets/images/team/` (PNG recommended)
2. Update `src` in `site/barbers.html`
3. Add filename to `hasPhoto()` in `site/assets/js/main.js`
4. Redeploy

---

## Enable AI Chat

The chat widget is live but using local keyword fallback responses.  
To connect real AI:

1. Deploy `agent/` as an **Azure Function** (Node 20 LTS)
2. Set `ANTHROPIC_API_KEY` in the Function's environment variables
3. Update `CHAT_API_URL` in `site/assets/js/chat-widget.js`:
   ```js
   const CHAT_API_URL = 'https://<your-function>.azurewebsites.net/api/chat';
   ```
4. Redeploy the site

The AI personality and salon knowledge is defined in:  
`agent/prompts/system-prompt.md`

---

## Azure Resources

| Resource | Name | Group |
|---|---|---|
| Static Web App | `elite-saloon` | `rg-sysint-elite-saloon` |
| Custom Domain | `elite.sysintinc.com` | — |

---

## Local Preview

Open `site/index.html` directly in a browser — all pages work without a server since data is embedded in JS.
