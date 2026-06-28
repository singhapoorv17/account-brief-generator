# Account Brief Generator

A web app that turns a single company URL into a structured sales and research brief: company overview, recent funding and signals, leadership team, and relevant contacts with email and LinkedIn links. Point it at a domain, and it assembles a one-page brief you would otherwise spend an hour building by hand.

Built with Next.js and Claude Code (scaffolded with v0), deployed on Vercel, using the Orthogonal API marketplace to chain multiple data providers behind one workflow.

## What it does

Give it a company URL (plus an optional ICP and product), and it generates:

- **Company overview** and what the company does
- **Recent funding and signals** from the web
- **Leadership team** for the account
- **Relevant contacts** with email and LinkedIn links for outreach

## How it works

The app calls the **Orthogonal API marketplace**, which routes a single request across several specialist data providers and chains them into one enrichment workflow:

| Provider | Role |
|---|---|
| Linkup | Web search and signals |
| People Data Labs (PDL) | Company and people data |
| ScrapeGraph | Structured scraping of the company site |
| Apollo.io | Contact email and LinkedIn lookup |
| GPT-4o | Synthesis of the brief |

A `FALLBACK_MODE` toggle lets the app run on canned sample data for local development without spending API credits.

## Stack

- **Next.js** (App Router), TypeScript
- **Tailwind CSS** with shadcn/ui components
- **Orthogonal API** for provider orchestration
- Deployed on **Vercel**

## Repo guide

| Path | What it is |
|---|---|
| `app/api/research/route.ts` | The core API route: takes a URL, calls Orthogonal, returns the brief |
| `app/page.tsx` | The main page and input form |
| `components/research-form.tsx` | The company URL, ICP, and product input form |
| `components/brief-output.tsx` | Renders the generated brief |
| `components/loading-panel.tsx` | Shows provider progress while the brief generates |
| `components/ui/` | shadcn/ui component library |

## Running locally

```bash
npm install
cp .env.example .env.local   # add your Orthogonal API key; set FALLBACK_MODE as needed
npm run dev
```

Then open the local URL and enter a company domain.

## Notes

One hard problem worth calling out: company-name lookups are unreliable when multiple companies share a name. The fix is to key every provider call off the unique domain rather than the display name, and to reject placeholder results (for example "John Doe" contacts) instead of treating them as real data.
