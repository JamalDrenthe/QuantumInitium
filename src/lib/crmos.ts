/**
 * CRMos REST API Client
 * Bi-directionele integratie met CRMos (https://crmos.one/api/v1)
 * Ecosysteem: Quantum Initium & CRMos
 */

export interface CRMContactUpsertPayload {
  first_name: string;
  last_name?: string;
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
  stage?: 'lead' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost';
  company_name: string;
  contact_id?: string;
  contact_email?: string;
  probability?: number;
  notes?: string;
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
  last_name?: string;
  email: string;
  phone?: string;
  role_applied?: string;
  deal_model?: 'no_cure_no_pay' | 'fixed' | 'percentage' | string;
  company?: string;
  skills?: string[];
  experience_years?: number;
  location?: string;
  tags?: string[];
  notes?: string;
}

export interface CRMWebhookRegistrationPayload {
  company: string;
  url: string;
  events: string[];
  secret?: string;
}

export interface CRMosConfig {
  baseUrl: string;
  apiKey: string;
}

/**
 * Ecosystem API Key Directory
 */
export const CRMOS_API_KEYS = {
  MASTER: 'crm_live_master_jamaldrenthe_2026_all_ecosystem',
  VVC: 'crm_live_vvc_verdienende_vrienden_club_2026',
  SPONTIVA: 'crm_live_spontiva_recruitment_2026',
  BOOSTPLUG: 'crm_live_boostplug_energy_iot_2026',
  QUANTUM_INITIUM: 'crm_live_quantum_initium_enterprise_2026',
  IMMIGRATIEPUNT: 'crm_live_immigratiepunt_portal_2026',
  WONINGVRY: 'crm_live_woningvry_realestate_2026',
  DJOBBA_WORKS: 'crm_live_djobba_works_freelance_2026',
  TRUSTING_WORK: 'crm_live_trusting_work_staffing_2026',
  LOGS_RENT: 'crm_live_logs_rent_logistics_2026',
  ZHEAVENZY: 'crm_live_zheavenzy_atelier_2026',
  XABI_WORLD: 'crm_live_xabi_world_international_2026',
  CRMOS: 'crm_live_crmos_core_platform_2026'
} as const;

const DEFAULT_CONFIG: CRMosConfig = {
  baseUrl: import.meta.env.VITE_CRMOS_API_URL || 'https://crmos.one/api/v1',
  apiKey: import.meta.env.VITE_CRMOS_API_KEY || CRMOS_API_KEYS.QUANTUM_INITIUM
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

      if (response.status === 204) {
        return { success: true };
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

  // --- 1. HEALTH & CONNECTIVITEIT ---

  /**
   * Health check endpoint
   */
  async health() {
    return this.request<{ status: string }>('health');
  }

  // --- 2. DATA OPHALEN & REALTIME ZOEKEN (GET) ---

  /**
   * Universeel zoeken in contacten, deals, kandidaten en teams tegelijk
   */
  async search(query: string) {
    return this.request<any>(`search?q=${encodeURIComponent(query)}`);
  }

  /**
   * Contacten filteren op email, zoekterm, company_tag of tag
   */
  async getContacts(params?: { email?: string; q?: string; company_tag?: string; tag?: string }) {
    const query = new URLSearchParams();
    if (params?.email) query.append('email', params.email);
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
   * VVC Tag verifiëren
   */
  async lookupVvcTag(tag: string) {
    return this.request<any>(`vvc/lookup?tag=${encodeURIComponent(tag)}`);
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

  // --- 3. DATA TERUGSCHRIJVEN & VERRIJKEN (POST, PUT, PATCH) ---

  /**
   * A. Contact Inschrijven of Slim Verrijken (Upsert)
   * Dedupliceert automatisch op email (LOWER(TRIM(email))).
   * Wist nooit oude data, voegt tags en notities met timestamp samen.
   */
  async upsertContact(contact: CRMContactUpsertPayload) {
    return this.request<any>('contacts/upsert', {
      method: 'POST',
      body: JSON.stringify(contact)
    });
  }

  /**
   * B. Nieuw Contact Aanmaken (standaard)
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
   * D. Deal / Verkooporder Inschrijven in de Sales Pipeline
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

  // --- 4. WEBHOOKS (CRMos ➡️ Partner Agent) ---

  /**
   * Registreer een webhook bij CRMos voor real-time status updates (deal.won, candidate.placed, etc.)
   */
  async registerWebhook(webhook: CRMWebhookRegistrationPayload) {
    return this.request<any>('webhooks', {
      method: 'POST',
      body: JSON.stringify(webhook)
    });
  }
}

export const crmos = new CRMosClient();
export default crmos;
