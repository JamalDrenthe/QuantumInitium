# QuantumInitium Ltd

Interactief portaal voor de holdingstructuur en strategische deelnemingen van QuantumInitium Ltd. De applicatie combineert een visuele ecosysteemkaart met institutionele dossiers, investeerdersinformatie en een beheerdersweergave voor de geplande LSE Main Market-strategie.

## Functionaliteiten

- Interactieve 3D-ecosysteemweergave van de moederholding, vijf subholdings en onderliggende entiteiten.
- Architectuuroverzicht met filters, zoekfunctie, detailkaarten en relaties tussen deelnemingen.
- Institutionele dossierlezer met governance, kapitaalstructuur, groeimodellen, compliance en IPO-roadmap.
- Investeerdersdashboard met aandelenoverzicht, cap table-informatie, transacties, waarderingsscenario's en ROI-calculator.
- Admin-dashboard voor accountselectie, Investor- en Shareholder-beheer, subholdingstatussen, auditacties en export van de cap table.
- Investor-integraties met directe links naar de officiële bedrijfsdomeinen.
- Firebase Authentication voor login en registratie met Firestore-profielen.
- Beveiligde accountregels; alleen een server-uitgegeven Firebase custom claim geeft adminrechten.
- Demo-login voor lokale ontwikkeling wanneer Firebase niet is geconfigureerd of expliciet is ingeschakeld.
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
- Firebase Web SDK voor Authentication en Cloud Firestore

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

Vul de Firebase-webappconfiguratie in `.env.local` in. `.firebaserc` wijst standaard naar `quantum-initium-dev`; controleer dit doel voordat je Firebase-instellingen of regels publiceert. Schakel in Firebase Authentication minimaal e-mail/wachtwoord in voordat live registratie werkt. OAuth-knoppen werken pas nadat de overeenkomstige providers in Firebase zijn ingesteld; LinkedIn gebruikt de OIDC-provider-ID `oidc.linkedin`.

Accountprofielen worden opgeslagen in `user_accounts/{Firebase UID}`. Eigenaren kunnen alleen hun profielvelden lezen en aanpassen; de hele accountlijst en beheermutaties vereisen de server-side Firebase custom claim `admin: true`. Ken die claim alleen toe vanuit een vertrouwde Admin SDK-omgeving. De `role`-waarde in Firestore verleent zelf geen adminrechten.

Voor lokale demo's kun je `VITE_ENABLE_DEMO_MODE="true"` instellen. Zonder Firebase-configuratie start de app automatisch in demo-modus. Demo-aanmeldingen en profieldata blijven lokaal; gesimuleerde aandelen- en cashflow-mutaties worden niet als echte transacties naar Firestore geschreven.

Voer `npm run test:rules` uit om de Firestore-toegangsregels tegen de lokale Emulator te testen.

De historische SQL-bestanden in `supabase/migrations/` blijven als schemareferentie staan. Er is nog geen Supabase-data naar Firebase overgezet: de bronprojectdatabase was inactief en niet uitleesbaar. Herstel en export van die bron zijn een aparte stap; zet geen bestaande records over voordat ze zijn gecontroleerd en aan Firebase-gebruikers gekoppeld.

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
├── firestore.rules        # Development Firestore-toegangsregels
├── supabase/migrations/   # Historische schemareferentie, niet actief gebruikt
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
