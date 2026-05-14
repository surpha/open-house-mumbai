# 🏠 Open House Mumbai

**Open-sourcing Mumbai's housing information — one society at a time.**

---

## The Problem

Mumbai's housing market is notoriously opaque. Information is hoarded by brokers, society committees operate behind closed doors, and entire demographics — bachelors, pet owners, specific communities — face hidden gatekeeping with no way to know the rules before they waste time and money.

## Our Mission

Open House Mumbai is a **non-commercial, community-driven housing directory** that aims to be the "Glassdoor for Mumbai Housing." We believe housing information should be free, transparent, and accessible to everyone.

This project open-sources society-level data so that anyone searching for a home in Mumbai can make informed decisions *before* they engage with brokers or visit a flat.

## What We Track (V1)

| Data Point | Description |
|---|---|
| **Bachelor-Friendly Index** | 1–10 rating based on community reports |
| **Vibe Check** | Sentiment on society committee & neighbour culture |
| **Logistics** | Proximity to Metro, water reliability, nearby essentials |
| **Rent Transparency** | Actual rent paid vs. flat type (community-contributed) |

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js (App Router, TypeScript, Tailwind CSS) |
| Backend / Auth | Supabase (Postgres, Row Level Security) |
| Maps | Mapbox / Leaflet |
| Data Pipeline | Python (pandas, cleaning & scraping scripts) |
| Hosting | Vercel |

## Project Structure

```
open-house-mumbai/
├── frontend/          # Next.js application
├── data_pipeline/     # Python scripts for data cleaning & ingestion
├── .gitignore
├── LICENSE            # MIT
└── README.md
```

## Getting Started

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Data Pipeline

```bash
cd data_pipeline
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

## Contributing

We welcome contributions! Whether you want to add a society listing, improve the UI, or help with data cleaning — open an issue or submit a PR.

## License

MIT © 2026 Suraj Phalod