# QuantumInitium Ltd

Interactief stakeholder- en investeerdersportaal voor de holdingstructuur van
QuantumInitium Ltd. De applicatie brengt de groepsarchitectuur, strategische
deelnemingen, financiële modellen en de route naar een mogelijke LSE Main
Market-beursgang samen in één dashboard.

## Functionaliteiten

- Interactieve 2D- en 3D-weergave van het QuantumInitium-ecosysteem.
- Institutioneel dossier met governance, synergieën, kapitaalallocatie,
  groeiprojecties en IPO-roadmap.
- Investeerdersdashboard met portefeuille-overzicht, waardering,
  transacties en participatie-informatie.
- Admin-dashboard voor een demo-cap table, investeerdersregistratie en
  aandeelhoudersinzichten.
- Demo-authenticatie voor investeerders en administrators, inclusief
  registratieflow.
- Interactieve investment calculator en simulators voor aandelen en
  waarderingsscenario's.
- Digitale Quantum-walletkaarten met parallax-effect, kaartselectie,
  zichtbaarheid en tijdelijke blokkering.
- Responsive visuele identiteit met animaties, modals en dark-theme styling.

## Tech stack

- React 19 en TypeScript
- Vite
- Tailwind CSS 4
- Motion
- Three.js
- Lucide React
- Bun of npm

## Lokaal uitvoeren

### Vereisten

- Node.js 20+ of Bun

### Installatie

```bash
npm install
```

Of met Bun:

```bash
bun install
```

Kopieer daarna `.env.example` naar `.env.local`. De app gebruikt Supabase Auth
voor investor-login en registratie. Demo-accountgegevens worden buiten de
repository beheerd en mogen niet in publieke documentatie worden geplaatst.

### Development server

```bash
npm run dev
```

De applicatie is daarna beschikbaar op
`http://localhost:3000`.

## Scripts

| Script | Beschrijving |
| --- | --- |
| `npm run dev` | Start de Vite-developmentserver op poort 3000. |
| `npm run build` | Bouwt een productieversie in `dist/`. |
| `npm run preview` | Serveert de productiebuild lokaal. |
| `npm run lint` | Controleert TypeScript met `tsc --noEmit`. |
| `npm run clean` | Verwijdert lokale build- en serverartefacten. |

## Projectstructuur

```text
.
├── public/                 # Publieke logo's en statische bestanden
├── src/
│   ├── components/         # Dashboard-, auth- en dossiercomponenten
│   ├── data/               # Ecosysteem- en institutionele modeldata
│   ├── types/              # Auth- en domeintypen
│   ├── App.tsx             # Hoofdnavigatie en applicatieshell
│   ├── index.css           # Globale styling en design tokens
│   └── main.tsx            # React-entrypoint
├── index.html              # HTML-entrypoint en metadata
├── package.json            # Scripts en dependencies
├── metadata.json           # Projectmetadata
└── vite.config.ts          # Vite-configuratie
```

## Status

Dit project is een interactieve demonstratie- en presentatielaag. De
authenticatie, cap table en financiële gegevens zijn lokaal als demo-data
ingebouwd en vormen geen productie-backend.
