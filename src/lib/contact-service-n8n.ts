/**
 * Contact Service - N8N Version
 *
 * Servicio para gestión de contactos usando N8N como intermediario
 */

import { User } from './supabase';
import { n8nApi } from './n8n-api';

export interface Contact {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  tags?: string[];
  dateAdded?: string;
  lastActivity?: string;
  opportunitiesCount?: number;
  totalValue?: number;
  source?: string;
  assignedTo?: string;
  country?: string;
  city?: string;
  state?: string;
  customFields?: Record<string, any>;
}

export interface Contact360 {
  contact: Contact;
  opportunities: Array<{
    id: string;
    name: string;
    value: number;
    stage: string;
    probability: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
  timeline: Array<{
    id: string;
    type: 'note' | 'task' | 'opportunity';
    title: string;
    description: string;
    date: string;
    completed?: boolean;
    createdBy?: string;
  }>;
  stats: {
    totalInteractions: number;
    notesCount: number;
    tasksTotal: number;
    tasksCompleted: number;
    tasksPending: number;
    opportunitiesCount: number;
    opportunitiesValue: number;
  };
  heatmap: {
    data: Array<{
      date: string;
      count: number;
    }>;
  };
  dealScore: {
    score: number;
    factors: Array<{
      name: string;
      value: number;
      weight: number;
    }>;
  };
}

/**
 * Obtiene lista de contactos a través de N8N
 */
export async function fetchContacts(
  user: User,
  search?: string
): Promise<{ contacts: Contact[]; total: number; summary: any }> {
  console.log('👥 Obteniendo contactos de N8N...');

  try {
    const response = await n8nApi.getContacts({
      userId: user.ghl_user_id || user.id,
      role: user.role || 'broker',
      search,
    });

    return {
      contacts: response.contacts || [],
      total: response.total || 0,
      summary: response.summary || {},
    };
  } catch (error) {
    console.error('❌ Error obteniendo contactos:', error);
    return {
      contacts: [],
      total: 0,
      summary: {},
    };
  }
}

/**
 * Obtiene vista 360° de un contacto específico
 */
export async function fetchContact360(
  user: User,
  contactId: string
): Promise<Contact360 | null> {
  console.log(`🎯 Obteniendo Contact360 de N8N para contactId: ${contactId}...`);

  try {
    const response = await n8nApi.getContact360({
      userId: user.ghl_user_id || user.id,
      role: user.role || 'broker',
      contactId,
    });

    return response as Contact360;
  } catch (error) {
    console.error('❌ Error obteniendo Contact360:', error);
    return null;
  }
}

/**
 * Busca contactos por término de búsqueda
 */
export async function searchContacts(
  user: User,
  searchTerm: string
): Promise<Contact[]> {
  if (!searchTerm || searchTerm.trim().length < 2) {
    return [];
  }

  console.log(`🔍 Buscando contactos: "${searchTerm}"...`);

  try {
    const { contacts } = await fetchContacts(user, searchTerm);
    return contacts;
  } catch (error) {
    console.error('❌ Error buscando contactos:', error);
    return [];
  }
}
