/**
 * Metrics Service - N8N Version
 *
 * Servicio para obtener métricas del dashboard usando N8N como intermediario
 * Reemplaza las llamadas directas a GHL MCP
 */

import { User } from './supabase';
import { n8nApi } from './n8n-api';

export interface Metrics {
  leads: number;
  opportunities: number;
  revenue: number;
  conversion: number;
  pipelineTotal?: number;
  dealAverage?: number;
  atRisk?: number;
  totalDeals?: number;
  pipelineByStage?: Array<{
    stage: string;
    count: number;
    value: number;
    percentage: string;
  }>;
  insights?: string[];
  loading: boolean;
  error?: string;
}

// Cache para evitar llamadas excesivas a la API
interface CacheEntry {
  data: Metrics;
  timestamp: number;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const metricsCache = new Map<string, CacheEntry>();

/**
 * Obtiene métricas reales de GoHighLevel a través de N8N
 */
export async function fetchRealMetrics(user: User): Promise<Metrics> {
  const cacheKey = `metrics-${user.id}`;

  // Verificar cache
  const cached = metricsCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📊 Usando métricas desde cache');
    return cached.data;
  }

  console.log('📊 Obteniendo métricas de N8N...');

  try {
    // Llamar al endpoint de N8N
    const response = await n8nApi.getMetrics({
      userId: user.ghl_user_id || user.id,
      role: user.role || 'broker',
    });

    // Extraer datos de la respuesta
    const metricsData = {
      leads: response.leads || 0,
      opportunities: response.opportunities || 0,
      revenue: response.revenue || 0,
      conversion: response.conversion || 0,
      pipelineTotal: response.pipelineTotal || 0,
      dealAverage: response.dealAverage || 0,
      atRisk: response.atRisk || 0,
      totalDeals: response.totalDeals || 0,
      pipelineByStage: response.pipelineByStage || [],
      insights: response.insights || [],
      loading: false,
    };

    // Guardar en cache
    metricsCache.set(cacheKey, {
      data: metricsData,
      timestamp: Date.now(),
    });

    console.log('✅ Métricas obtenidas exitosamente:', metricsData);
    return metricsData;
  } catch (error) {
    console.error('❌ Error obteniendo métricas:', error);

    // Retornar métricas vacías en caso de error
    return {
      leads: 0,
      opportunities: 0,
      revenue: 0,
      conversion: 0,
      loading: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
}

/**
 * Limpia el cache de métricas
 */
export function clearMetricsCache(userId?: string) {
  if (userId) {
    metricsCache.delete(`metrics-${userId}`);
  } else {
    metricsCache.clear();
  }
}

/**
 * Obtiene hot leads a través de N8N
 */
export async function fetchHotLeads(user: User) {
  console.log('🔥 Obteniendo hot leads de N8N...');

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
 * Obtiene sugerencias de follow-up a través de N8N
 */
export async function fetchFollowUpSuggestions(user: User) {
  console.log('📋 Obteniendo sugerencias de follow-up de N8N...');

  try {
    const response = await n8nApi.getFollowUps({
      userId: user.ghl_user_id || user.id,
      role: user.role || 'broker',
    });

    return {
      suggestions: response.suggestions || [],
      summary: response.summary || {
        total: 0,
        high: 0,
        medium: 0,
        low: 0,
        totalPotentialValue: 0,
      },
    };
  } catch (error) {
    console.error('❌ Error obteniendo follow-ups:', error);
    return {
      suggestions: [],
      summary: { total: 0, high: 0, medium: 0, low: 0, totalPotentialValue: 0 },
    };
  }
}

/**
 * Obtiene métricas detalladas para el Executive Dashboard
 */
export async function fetchDetailedMetrics(user: User) {
  const metrics = await fetchRealMetrics(user);

  // Transformar al formato esperado por ExecutiveDashboard
  return {
    pipelineAnalysis: metrics.pipelineByStage?.reduce((acc, stage) => {
      acc[stage.stage] = {
        count: stage.count,
        value: stage.value,
      };
      return acc;
    }, {} as Record<string, { count: number; value: number }>) || {},
    dealsAtRisk: metrics.atRisk || 0,
    avgDealSize: metrics.dealAverage || 0,
    totalPipelineValue: metrics.pipelineTotal || 0,
  };
}
