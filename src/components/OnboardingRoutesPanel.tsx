import React from 'react';
import { X, Route as RouteIcon } from 'lucide-react';
import RouteFlow3D, { RouteGraph } from './RouteFlow3D';

interface OnboardingRoute {
  id: string;
  title: string;
  badge?: string;
  description: string;
  graph: RouteGraph;
}

const ROUTE1_DESTINATIONS = [
  'Xabi World', 'Spontiva', 'Boostplug', 'Logs Rent', 'Djobba',
  'WoningVry', 'Immigratiepunt', 'Zheavenzy', 'Trusting Work',
];

const ROUTE2_STAGE4 = [
  'Xabi World', 'Spontiva', 'Boostplug', 'Logs Rent', 'Djobba',
  'WoningVry', 'Immigratiepunt', 'Zheavenzy',
];

const ROUTE3_DESTINATIONS = [
  'Xabi World', 'Spontiva', 'VVC', 'Boostplug', 'Logs Rent', 'Djobba',
  'WoningVry', 'Immigratiepunt', 'Zheavenzy', 'Trusting Work',
];

const ROUTE4_STAGE2 = [
  'Spontiva', 'VVC', 'Boostplug', 'Djobba', 'WoningVry', 'Zheavenzy',
];

const ROUTE56_DESTINATIONS = [
  'Xabi World', 'Spontiva', 'Boostplug', 'Logs Rent', 'Djobba',
  'WoningVry', 'Immigratiepunt', 'Zheavenzy', 'Trusting Work',
];

const ROUTE6_DESTINATIONS = [
  'Xabi World', 'Spontiva', 'Boostplug', 'Logs Rent', 'Djobba',
  'WoningVry', 'Immigratiepunt', 'Zheavenzy',
];

function fanOutGraph(entry: string, hops: string[], destinations: string[]): RouteGraph {
  const nodes: RouteGraph['nodes'] = [
    { id: entry, label: entry, stage: 0, kind: 'entry' },
    ...hops.map((h, i) => ({ id: h, label: h, stage: i + 1, kind: 'hub' as const })),
    ...destinations.map((d) => ({ id: d, label: d, stage: hops.length + 1, kind: 'destination' as const })),
  ];
  const edges: RouteGraph['edges'] = [];
  let prev: string[] = [entry];
  hops.forEach((h) => {
    prev.forEach((p) => edges.push([p, h]));
    prev = [h];
  });
  destinations.forEach((d) => edges.push([prev[0], d]));
  return { nodes, edges };
}

export const onboardingRoutes: OnboardingRoute[] = [
  {
    id: 'route-1',
    title: 'Onboarding Route 1 — VVC',
    badge: 'Hoofdroute',
    description:
      'Men komt binnen via VVC. Van VVC gaan ze door naar Investbotiq. Van Investbotiq gaan ze door naar Xabi World, Spontiva, Boostplug, Logs Rent, Djobba, WoningVry, Immigratiepunt, Zheavenzy en Trusting Work.',
    graph: fanOutGraph('VVC', ['Investbotiq'], ROUTE1_DESTINATIONS),
  },
  {
    id: 'route-2',
    title: 'Onboarding Route 2 — Immigratiepunt',
    description:
      'Men komt binnen via Immigratiepunt. Van Immigratiepunt gaan ze door naar Xabi World, WoningVry en Trusting Work. Van Trusting Work gaan ze door naar VVC. Dan nemen ze vanaf VVC weer Route 1: van VVC naar Investbotiq, en van Investbotiq naar Xabi World, Spontiva, Boostplug, Logs Rent, Djobba, WoningVry, Immigratiepunt en Zheavenzy.',
    graph: {
      nodes: [
        { id: 'Immigratiepunt', label: 'Immigratiepunt', stage: 0, kind: 'entry' },
        { id: 'Xabi World S1', label: 'Xabi World', stage: 1, kind: 'destination' },
        { id: 'WoningVry S1', label: 'WoningVry', stage: 1, kind: 'destination' },
        { id: 'Trusting Work S1', label: 'Trusting Work', stage: 1, kind: 'hub' },
        { id: 'VVC', label: 'VVC', stage: 2, kind: 'hub' },
        { id: 'Investbotiq', label: 'Investbotiq', stage: 3, kind: 'hub' },
        ...ROUTE2_STAGE4.map((d) => ({ id: `${d}-d`, label: d, stage: 4, kind: 'destination' as const })),
      ],
      edges: [
        ['Immigratiepunt', 'Xabi World S1'],
        ['Immigratiepunt', 'WoningVry S1'],
        ['Immigratiepunt', 'Trusting Work S1'],
        ['Trusting Work S1', 'VVC'],
        ['VVC', 'Investbotiq'],
        ...ROUTE2_STAGE4.map((d): [string, string] => ['Investbotiq', `${d}-d`]),
      ],
    },
  },
  {
    id: 'route-3',
    title: 'Onboarding Route 3 — Investbotiq',
    description:
      'Van Investbotiq gaan ze door naar Xabi World, Spontiva, VVC, Boostplug, Logs Rent, Djobba, WoningVry, Immigratiepunt, Zheavenzy en Trusting Work.',
    graph: fanOutGraph('Investbotiq', [], ROUTE3_DESTINATIONS),
  },
  {
    id: 'route-4',
    title: 'Onboarding Route 4 — Quantum Initium',
    description:
      'Van Quantum Initium gaan ze door naar Trusting Work, Xabi World, Logs Rent en Investbotiq. Van Logs Rent of Investbotiq gaan ze door naar Spontiva, VVC, Boostplug, Djobba, WoningVry en Zheavenzy.',
    graph: {
      nodes: [
        { id: 'Quantum Initium', label: 'Quantum Initium', stage: 0, kind: 'entry' },
        { id: 'Trusting Work S1', label: 'Trusting Work', stage: 1, kind: 'destination' },
        { id: 'Xabi World S1', label: 'Xabi World', stage: 1, kind: 'destination' },
        { id: 'Logs Rent', label: 'Logs Rent', stage: 1, kind: 'hub' },
        { id: 'Investbotiq', label: 'Investbotiq', stage: 1, kind: 'hub' },
        ...ROUTE4_STAGE2.map((d) => ({ id: `${d}-d`, label: d, stage: 2, kind: 'destination' as const })),
      ],
      edges: [
        ['Quantum Initium', 'Trusting Work S1'],
        ['Quantum Initium', 'Xabi World S1'],
        ['Quantum Initium', 'Logs Rent'],
        ['Quantum Initium', 'Investbotiq'],
        ...ROUTE4_STAGE2.flatMap((d): [string, string][] => [
          ['Logs Rent', `${d}-d`],
          ['Investbotiq', `${d}-d`],
        ]),
      ],
    },
  },
  {
    id: 'route-5',
    title: 'Onboarding Route 5 — Djobba',
    description:
      'Van Djobba gaan ze door naar VVC. Dan nemen ze vanaf VVC weer Route 1: van VVC naar Investbotiq, en van Investbotiq naar Xabi World, Spontiva, Boostplug, Logs Rent, Djobba, WoningVry, Immigratiepunt, Zheavenzy en Trusting Work.',
    graph: fanOutGraph('Djobba', ['VVC', 'Investbotiq'], ROUTE56_DESTINATIONS),
  },
  {
    id: 'route-6',
    title: 'Onboarding Route 6 — Trusting Work',
    description:
      'Van Trusting Work gaan ze door naar VVC. Dan nemen ze vanaf VVC weer Route 1: van VVC naar Investbotiq, en van Investbotiq naar Xabi World, Spontiva, Boostplug, Logs Rent, Djobba, WoningVry, Immigratiepunt en Zheavenzy.',
    graph: fanOutGraph('Trusting Work', ['VVC', 'Investbotiq'], ROUTE6_DESTINATIONS),
  },
];

interface OnboardingRoutesPanelProps {
  theme?: 'dark' | 'light';
  onClose: () => void;
}

const OnboardingRoutesPanel: React.FC<OnboardingRoutesPanelProps> = ({ theme = 'dark', onClose }) => {
  const isLight = theme === 'light';
  return (
    <div
      className={`absolute top-4 right-4 bottom-4 z-30 w-[420px] max-w-[92vw] flex flex-col rounded-2xl border backdrop-blur-2xl shadow-2xl overflow-hidden ${
        isLight ? 'bg-white/95 border-sky-200' : 'bg-slate-950/92 border-slate-800/90'
      }`}
    >
      <div className={`flex items-center justify-between px-4 py-3 border-b ${isLight ? 'border-sky-100' : 'border-slate-800/80'}`}>
        <div className="flex items-center gap-2">
          <RouteIcon className={`w-4 h-4 ${isLight ? 'text-cyan-700' : 'text-cyan-400'}`} />
          <div>
            <h2 className={`text-sm font-extrabold ${isLight ? 'text-sky-950' : 'text-white'}`}>Onboarding Routes</h2>
            <p className={`text-[10px] font-mono ${isLight ? 'text-sky-700/70' : 'text-slate-500'}`}>
              6 instroomroutes door het ecosysteem
            </p>
          </div>
        </div>
        <button
          onClick={onClose}
          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
            isLight ? 'bg-sky-50 text-sky-800 hover:bg-sky-100 border border-sky-200' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
          }`}
          aria-label="Sluit routes paneel"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {onboardingRoutes.map((route) => (
          <div
            key={route.id}
            className={`rounded-xl border overflow-hidden ${
              isLight ? 'bg-sky-50/60 border-sky-100' : 'bg-slate-900/60 border-slate-800/80'
            }`}
          >
            <div className="px-3 pt-3 flex items-center justify-between gap-2">
              <h3 className={`text-xs font-bold ${isLight ? 'text-sky-950' : 'text-slate-100'}`}>{route.title}</h3>
              {route.badge && (
                <span className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                  isLight ? 'bg-amber-100 text-amber-900 border-amber-300' : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                }`}>
                  {route.badge}
                </span>
              )}
            </div>
            <div className="h-44 w-full">
              <RouteFlow3D graph={route.graph} theme={theme} />
            </div>
            <p className={`px-3 pb-3 text-[11px] leading-relaxed ${isLight ? 'text-sky-900/80' : 'text-slate-400'}`}>
              {route.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingRoutesPanel;
