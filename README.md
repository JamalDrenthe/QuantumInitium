# QuantumInitium Ltd

Interactief portaal voor de holdingstructuur en strategische deelnemingen van QuantumInitium Ltd. De applicatie combineert een visuele ecosysteemkaart met institutionele dossiers, investeerdersinformatie en een beheerdersweergave voor de geplande LSE Main Market-strategie.

## Functionaliteiten

- Interactieve 3D-ecosysteemweergave van de moederholding, vijf subholdings en onderliggende entiteiten.
- Architectuuroverzicht met filters, zoekfunctie, detailkaarten en relaties tussen deelnemingen.
- Institutionele dossierlezer met governance, kapitaalstructuur, groeimodellen, compliance en IPO-roadmap.
- Investeerdersdashboard met aandelenoverzicht, cap table-informatie, transacties, waarderingsscenario's en ROI-calculator.
- Admin-dashboard voor accountselectie, Investor- en Shareholder-beheer, subholdingstatussen, auditacties en export van de cap table.
- Investor-integraties met directe links naar de officiële bedrijfsdomeinen.
- Demo-login voor investeerders en beheerders, inclusief registratieflow.
- Licht/donker thema en responsive navigatie voor desktop- en mobiele schermen.
- Animaties, modals, notificaties en interactieve financiële visualisaties.

## Tech stack

- React 19 en TypeScript
- Vite
- Tailwind CSS 4
- Three.js voor de 3D-ecosysteemvisualisatie
- Lucide React voor iconen
- Motion voor animaties
- Express en `tsx` voor ondersteunende server- en runtime-scripts
- Bun-lockfile voor reproduceerbare dependency-installatie

## Lokaal starten

### Vereisten

- Node.js 20 of hoger
- npm of Bun

### Installatie

```bash
npm install
```

Of met Bun:

```bash
bun install
```

Maak indien nodig een lokale omgevingsconfiguratie:

```bash
cp .env.example .env.local
```

Vul voor persistente accountdata de Supabase-URL en publishable key in `.env.local` in. De SQL-migratie staat in `supabase/migrations/`; zonder deze variabelen gebruikt de demo automatisch lokale fallback-accounts.

Start daarna de ontwikkelserver:

```bash
npm run dev
```

De applicatie is vervolgens beschikbaar op `http://localhost:3000`.

## Scripts

| Script | Beschrijving |
| --- | --- |
| `npm run dev` | Start de Vite-ontwikkelserver op poort 3000. |
| `npm run build` | Bouwt de productieversie van de applicatie. |
| `npm run preview` | Serveert lokaal de gegenereerde productie-build. |
| `npm run lint` | Voert de TypeScript-controle uit zonder outputbestanden te maken. |
| `npm run clean` | Verwijdert de lokale build-output en `server.js`. |

## Projectstructuur

```text
.
├── public/                 # Publieke logo's en statische bestanden
├── src/
│   ├── components/         # Dashboard-, login-, dossier- en visualisatiecomponenten
│   ├── data/               # Ecosysteem- en institutionele brondata
│   ├── assets/             # Geïmporteerde beeldassets
│   ├── App.tsx             # Hoofdnavigatie en applicatiestatus
│   ├── index.css           # Globale styling en Tailwind-laag
│   ├── main.tsx            # React-entrypoint
│   └── types.ts            # Gedeelde TypeScript-types
├── index.html              # HTML-entrypoint en metadata
├── metadata.json           # Projectnaam en projectbeschrijving
├── package.json            # Dependencies en scripts
├── supabase/migrations/    # Schema en seeddata voor accountbeheer
├── tsconfig.json           # TypeScript-configuratie
└── vite.config.ts          # Vite-configuratie
```

## Domeinmodel

QuantumInitium Ltd wordt in de interface weergegeven als moederholding boven vijf gespecialiseerde clusters:

1. IP & Tech
2. Fintech & Liquidity
3. Talent & Gateway
4. Compute & Media
5. PropTech & Real Estate

De inhoud en financiële waarden in deze applicatie zijn als centraal datamodel opgenomen in `src/data/` en dienen als interactieve presentatie- en simulatiegegevens.
