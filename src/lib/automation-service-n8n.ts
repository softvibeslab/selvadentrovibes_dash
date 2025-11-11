/**
 * Automation Service - N8N Version
 *
 * Servicio para gestión de automatizaciones y pipeline usando N8N
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
