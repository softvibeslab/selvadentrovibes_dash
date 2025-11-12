/**
 * N8N API Client - Selvadentro Dashboard
 *
 * Cliente HTTP para comunicarse con los workflows de N8N
 * que actúan como API Gateway para GoHighLevel MCP
 */

// Configuración de URLs
const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'https://softvibes-n8n.vxv5dh.easypanel.host';
const WEBHOOK_PATH = '/webhook/selvadentro';

/**
 * Parámetros base para todas las peticiones
 */
interface BaseParams {
  userId: string;
  role: 'admin' | 'broker' | 'user';
  [key: string]: string;
}

/**
 * Respuesta genérica de N8N
 */
interface N8NResponse<T> {
  data?: T;
  _metadata?: {
    processedAt: string;
    [key: string]: any;
  };
  error?: string;
  [key: string]: any;
}

/**
 * Cliente HTTP para N8N
 */
class N8NClient {
  private baseUrl: string;
  private webhookPath: string;

  constructor(baseUrl: string = N8N_BASE_URL, webhookPath: string = WEBHOOK_PATH) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
    this.webhookPath = webhookPath;
  }

  /**
   * Construye la URL completa para un endpoint
   */
  private buildUrl(endpoint: string, params: Record<string, string>): string {
    const url = new URL(this.webhookPath, this.baseUrl);
    url.searchParams.set('endpoint', endpoint);

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value);
      }
    });

    return url.toString();
  }

  /**
   * Realiza una petición GET al webhook de N8N
   */
  private async request<T = any>(
    endpoint: string,
    params: Record<string, string>
  ): Promise<T> {
    const url = this.buildUrl(endpoint, params);

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json() as T;
      return data;
    } catch (error) {
      console.error(`N8N API Error [${endpoint}]:`, error);
      throw error;
    }
  }

  /**
   * Obtiene métricas del dashboard ejecutivo
   */
  async getMetrics(params: BaseParams) {
    return this.request('metrics', params);
  }

  /**
   * Obtiene hot leads detectados por el algoritmo
   */
  async getHotLeads(params: BaseParams) {
    return this.request('hot-leads', params);
  }

  /**
   * Obtiene datos del pipeline para vista Kanban
   */
  async getPipeline(params: BaseParams) {
    return this.request('pipeline', params);
  }

  /**
   * Obtiene lista de contactos con búsqueda opcional
   */
  async getContacts(params: BaseParams & { search?: string }) {
    const { search, ...baseParams } = params;
    const requestParams: Record<string, string> = { ...baseParams };

    if (search && search.trim()) {
      requestParams.search = search;
    }

    return this.request('contacts', requestParams);
  }

  /**
   * Obtiene vista 360° de un contacto
   */
  async getContact360(params: BaseParams & { contactId: string }) {
    return this.request('contact360', params);
  }

  /**
   * Obtiene sugerencias de follow-up priorizadas
   */
  async getFollowUps(params: BaseParams) {
    return this.request('follow-ups', params);
  }
}

// Instancia singleton del cliente
export const n8nApi = new N8NClient();

// Exportar tipos
export type { BaseParams, N8NResponse };
