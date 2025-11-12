/**
 * Automation Service - Hybrid Version (N8N + Direct MCP)
 *
 * Servicio híbrido para automatizaciones y pipeline:
 * - Funciones principales: N8N (optimizado con cache)
 * - Funciones auxiliares: Direct MCP calls
 */

import { User } from './supabase';
import { n8nApi } from './n8n-api';

export interface PipelineStage {
  id: string;
  name: string;
  deals: Array<{
    id: string;
    name: string;
    value: number;
    contactName: string;
    contactId: string;
    status: string;
    probability: number;
    createdAt: string;
    updatedAt: string;
    lastActivityDate?: string;
    daysInStage?: number;
    isStale?: boolean;
  }>;
  totalValue: number;
  dealsCount: number;
}

export interface PipelineData {
  stages: PipelineStage[];
  summary: {
    totalDeals: number;
    totalValue: number;
    averageDealSize: number;
    staleDeals: number;
  };
}

/**
 * Obtiene datos del pipeline para vista Kanban
 */
export async function fetchPipeline(user: User): Promise<PipelineData> {
  console.log('📈 Obteniendo pipeline de N8N...');

  try {
    const response = await n8nApi.getPipeline({
      userId: user.ghl_user_id || user.id,
      role: user.role || 'broker',
    });

    return {
      stages: response.stages || [],
      summary: response.summary || {
        totalDeals: 0,
        totalValue: 0,
        averageDealSize: 0,
        staleDeals: 0,
      },
    };
  } catch (error) {
    console.error('❌ Error obteniendo pipeline:', error);
    return {
      stages: [],
      summary: {
        totalDeals: 0,
        totalValue: 0,
        averageDealSize: 0,
        staleDeals: 0,
      },
    };
  }
}

/**
 * Obtiene deals en riesgo (>30 días sin actividad)
 */
export async function fetchDealsAtRisk(user: User) {
  console.log('⚠️ Obteniendo deals en riesgo...');

  try {
    const pipelineData = await fetchPipeline(user);

    // Filtrar deals que están estancados
    const atRiskDeals = pipelineData.stages.flatMap((stage) =>
      stage.deals.filter((deal) => deal.isStale || (deal.daysInStage && deal.daysInStage > 30))
    );

    return atRiskDeals;
  } catch (error) {
    console.error('❌ Error obteniendo deals en riesgo:', error);
    return [];
  }
}

/**
 * Obtiene estadísticas del pipeline por etapa
 */
export async function fetchPipelineStats(user: User) {
  console.log('📊 Obteniendo estadísticas del pipeline...');

  try {
    const pipelineData = await fetchPipeline(user);

    // Calcular estadísticas por etapa
    const statsByStage = pipelineData.stages.map((stage) => ({
      stage: stage.name,
      dealsCount: stage.dealsCount,
      totalValue: stage.totalValue,
      averageValue: stage.dealsCount > 0 ? Math.round(stage.totalValue / stage.dealsCount) : 0,
      percentage: pipelineData.summary.totalValue > 0
        ? ((stage.totalValue / pipelineData.summary.totalValue) * 100).toFixed(1)
        : '0.0',
    }));

    return {
      byStage: statsByStage,
      summary: pipelineData.summary,
    };
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error);
    return {
      byStage: [],
      summary: {
        totalDeals: 0,
        totalValue: 0,
        averageDealSize: 0,
        staleDeals: 0,
      },
    };
  }
}

/**
 * Filtra deals por criterios específicos
 */
export function filterDeals(
  stages: PipelineStage[],
  criteria: {
    minValue?: number;
    maxValue?: number;
    status?: string;
    isStale?: boolean;
  }
) {
  return stages
    .flatMap((stage) => stage.deals)
    .filter((deal) => {
      if (criteria.minValue && deal.value < criteria.minValue) return false;
      if (criteria.maxValue && deal.value > criteria.maxValue) return false;
      if (criteria.status && deal.status !== criteria.status) return false;
      if (criteria.isStale !== undefined && deal.isStale !== criteria.isStale) return false;
      return true;
    });
}

// ===== FUNCIONES AUXILIARES =====

/**
 * Hot lead interface
 */
export interface HotLead {
  contactId: string;
  name: string;
  email: string;
  score: number;
  level: 'hot' | 'warm' | 'cold';
  reasons: string[];
  suggestedAction: string;
}

/**
 * Follow-up suggestion interface
 */
export interface FollowUpSuggestion {
  contactId: string;
  dealId?: string;
  name: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedAction: string;
  daysSinceLastContact: number;
  dealValue?: number;
}

/**
 * Detecta hot leads (usa N8N)
 */
export async function detectHotLeads(user: User): Promise<HotLead[]> {
  console.log('🔥 Obteniendo hot leads...');

  try {
    const response = await n8nApi.getHotLeads({
      userId: user.ghl_user_id || user.id,
      role: user.role || 'broker',
    });

    return response.hotLeads || [];
  } catch (error) {
    console.error('❌ Error obteniendo hot leads:', error);
    return [];
  }
}

/**
 * Genera sugerencias de follow-up (usa N8N)
 */
export async function generateFollowUpSuggestions(user: User): Promise<FollowUpSuggestion[]> {
  console.log('📋 Obteniendo sugerencias de follow-up...');

  try {
    const response = await n8nApi.getFollowUps({
      userId: user.ghl_user_id || user.id,
      role: user.role || 'broker',
    });

    return response.suggestions || [];
  } catch (error) {
    console.error('❌ Error obteniendo sugerencias de follow-up:', error);
    return [];
  }
}

/**
 * Regla de asignación automática
 */
export interface AssignmentRule {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  conditions: {
    tags?: string[];
    source?: string[];
    leadValue?: { min?: number; max?: number };
  };
  assignTo: string;
  createdAt: string;
}

/**
 * Obtiene reglas de asignación automática guardadas
 * (Esta es una función de ejemplo - en producción vendría de una BD)
 */
export function getSavedAssignmentRules(): AssignmentRule[] {
  // TODO: Implementar lectura de reglas desde BD o API
  // Por ahora retornamos reglas de ejemplo
  return [
    {
      id: '1',
      name: 'VIP Leads a equipo senior',
      enabled: true,
      priority: 1,
      conditions: {
        tags: ['VIP', 'premium'],
      },
      assignTo: 'senior-team',
      createdAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Leads de Facebook a equipo digital',
      enabled: true,
      priority: 2,
      conditions: {
        source: ['facebook', 'instagram'],
      },
      assignTo: 'digital-team',
      createdAt: new Date().toISOString(),
    },
  ];
}
