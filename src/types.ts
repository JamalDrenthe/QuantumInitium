export interface EntityItem {
  name: string;
  role?: string;
  desc?: string;
  shape?: 'cube' | 'diamond' | 'sphere' | 'cylinder' | 'pyramid' | 'torus' | 'octahedron';
  color?: string;
  badge?: string;
  type?: 'Moederholding' | 'Werkmaatschappij' | 'Flankerende Module';
  synergyWith?: string;
  synergyEffect?: string;
  financialContribution?: string;
  compliance?: string;
}

export interface NodeData {
  id: string;
  objectName: string;
  title: string;
  subTitle: string;
  desc: string;
  entities: EntityItem[];
  color: string;
  accent: string;
  pos: [number, number, number];
  corporateDetails?: {
    focus: string;
    model: string;
    governance?: string;
    substance?: string;
    firewalling?: string;
  };
}

export interface SynergyItem {
  flankerendeModule: string;
  kernEntiteit: string;
  synergetischeVersnelling: string;
  effectType: string;
}

export interface FourComponentItem {
  naam: string;
  bedrag: number;
  omschrijving: string;
  detail: string;
  categorie: string;
}

export interface GrowthProjection {
  jaar: string;
  titel: string;
  actieveLeden: number;
  cumulatieveCycli: number;
  omzet: number;
  omzetLabel: string;
  status: string;
  toelichting: string;
}

export interface CapTableItem {
  aandeelhouder: string;
  percentage: number;
  aandelen: number;
  aandelenLabel: string;
  rechten: string;
  kleur: string;
}

export interface RoadmapStep {
  periode: string;
  titel: string;
  beschrijving: string;
  mijlpalen: string[];
}

export interface CapitalAllocationItem {
  categorie: string;
  percentage: number;
  bedrag: string;
  doel: string;
  toelichting: string;
}

export interface GovernancePillar {
  nummer: number;
  titel: string;
  ondertitel: string;
  inhoud: string;
  garanties: string[];
}

export interface InfiniteLoopStep {
  stapNummer: number;
  knooppunt: string;
  titel: string;
  entiteiten: string;
  mechanisme: string;
}
