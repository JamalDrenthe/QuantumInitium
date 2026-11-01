/**
 * CRMos REST API Client
 * Bi-directionele integratie met CRMos (https://crmos.one/api/v1)
 * Ecosysteem: Quantum Initium & CRMos
 */

export interface CRMContactUpsertPayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  company?: string;
  company_tags?: string[];
  tags?: string[];
  notes?: string;
  status?: 'lead' | 'qualified' | 'customer' | 'archived';
  vvc_tag?: string;
}

export interface CRMDealPayload {
  name: string;
  value: number;
  stage: 'lead' | 'contacted' | 'proposal' | 'negotiation' | 'won' | 'lost';
  company_name: string;
  contact_id?: string;
  probability?: number;
}

export interface CRMActivityPayload {
  contact_id?: string;
  type: 'call' | 'email' | 'meeting' | 'note' | 'task';
  title: string;
  description: string;
  performed_by: string;
}

export interface CRMCandidatePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  skills?: string[];
  experience_years?: number;
  location?: string;
  notes?: string;
}

export interface CRMosConfig {
  baseUrl: string;
  apiKey: string;
}

const DEFAULT_CONFIG: CRMosConfig = {
  baseUrl: import.meta.env.VITE_CRMOS_API_URL || 'https://crmos.one/api/v1',
  apiKey: import.meta.env.VITE_CRMOS_API_KEY || 'crm_live_master_jamaldrenthe_2026_all_ecosystem'
};

class CRMosClient {
  private config: CRMosConfig;

  constructor(config: Partial<CRMosConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<{ success: boolean; data?: T; error?: string }> {
    const url = `${this.config.baseUrl.replace(/\/$/, '')}/${endpoint.replace(/^\//, '')}`;
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'X-CRMOS-API-KEY': this.config.apiKey,
      ...(options.headers as Record<string, string> || {})
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers
      });

      if (!response.ok) {
        const errorText = await response.text();
        return {
          success: false,
          error: `HTTP ${response.status}: ${errorText || response.statusText}`
        };
      }

      const data = await response.json();
      return { success: true, data };
    } catch (err: any) {
      console.warn(`[CRMos API] Request failed for ${endpoint}:`, err);
      return {
        success: false,
        error: err?.message || 'Network request failed'
      };
    }
  }

  // --- 1. DATA OPHALEN & REALTIME ZOEKEN (GET) ---

  /**
   * Universeel zoeken in contacten, deals, kandidaten en teams tegelijk
   */
  async search(query: string) {
    return this.request<any>(`search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Contacten filteren op zoekterm, company_tag of tag
   */
  async getContacts(params?: { q?: string; company_tag?: string; tag?: string }) {
    const query = new URLSearchParams();
    if (params?.q) query.append('q', params.q);
    if (params?.company_tag) query.append('company_tag', params.company_tag);
    if (params?.tag) query.append('tag', params.tag);
    const qs = query.toString();
    return this.request<any>(`contacts${qs ? `?${qs}` : ''}`);
  }

  /**
   * Enkel contact ophalen op ID
   */
  async getContact(id: string) {
    return this.request<any>(`contacts/${encodeURIComponent(id)}`);
  }

  /**
   * Referral Teams & Kernleiders
   */
  async getTeams() {
    return this.request<any>('teams');
  }

  /**
   * Bedrijven & Pipelines
   */
  async getCompanies() {
    return this.request<any>('companies');
  }

  async getDeals(company?: string) {
    const qs = company ? `?company=${encodeURIComponent(company)}` : '';
    return this.request<any>(`deals${qs}`);
  }

  async getCandidates() {
    return this.request<any>('candidates');
  }

  // --- 2. DATA TERUGSCHRIJVEN & VERRIJKEN (POST, PUT, PATCH) ---

  /**
   * A. Contact Inschrijven of Slim Verrijken (Upsert)
   * Als contact bestaat (e-mail of vvc_tag), wordt het verrijkt; anders automatisch aangemaakt.
   */
  async upsertContact(contact: CRMContactUpsertPayload) {
    return this.request<any>('contacts/upsert', {
      method: 'POST',
      body: JSON.stringify(contact)
    });
  }

  /**
   * B. Nieuw Contact Aanmaken
   */
  async createContact(contact: CRMContactUpsertPayload) {
    return this.request<any>('contacts', {
      method: 'POST',
      body: JSON.stringify(contact)
    });
  }

  /**
   * C. Bestaand Contact Bijwerken
   */
  async updateContact(id: string, updates: Partial<CRMContactUpsertPayload>) {
    return this.request<any>(`contacts/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  /**
   * D. Deal / Verkoopkans Inschrijven in de Sales Pipeline
   */
  async createDeal(deal: CRMDealPayload) {
    return this.request<any>('deals', {
      method: 'POST',
      body: JSON.stringify(deal)
    });
  }

  /**
   * E. Activiteit / Gespreksnotitie Loggen (Call Log van de Agent)
   */
  async logActivity(activity: CRMActivityPayload) {
    return this.request<any>('activities', {
      method: 'POST',
      body: JSON.stringify(activity)
    });
  }

  /**
   * F. Sollicitant / No Cure No Pay Kandidaat Inschrijven
   */
  async submitCandidate(candidate: CRMCandidatePayload) {
    return this.request<any>('candidates', {
      method: 'POST',
      body: JSON.stringify(candidate)
    });
  }
}

export const crmos = new CRMosClient();
export default crmos;
