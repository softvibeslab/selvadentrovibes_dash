# 🚀 GUÍA COMPLETA DE SETUP N8N
**Selvadentro Dashboard - Integración con GoHighLevel MCP**

---

## 📋 TABLA DE CONTENIDOS

1. [Instalación de N8N](#1-instalación-de-n8n)
2. [Configuración de Variables](#2-configuración-de-variables)
3. [Importación de Workflows](#3-importación-de-workflows)
4. [Testing de Endpoints](#4-testing-de-endpoints)
5. [Modificación del Frontend](#5-modificación-del-frontend)
6. [Deployment](#6-deployment)
7. [Troubleshooting](#7-troubleshooting)

---

## 1. INSTALACIÓN DE N8N

### Opción A: Docker (Recomendado)

```bash
# 1. Crear docker-compose.yml
cat > docker-compose-n8n.yml <<EOF
version: '3.8'

services:
  n8n:
    image: n8nio/n8n:latest
    container_name: selvadentro-n8n
    restart: unless-stopped
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=tu_password_seguro
      - N8N_HOST=0.0.0.0
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://tu-servidor:5678/
      - GENERIC_TIMEZONE=America/Mexico_City

      # GoHighLevel MCP
      - GHL_MCP_ENDPOINT=https://services.leadconnectorhq.com/mcp/
      - GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
      - GHL_ACCESS_TOKEN=pit-84d7687f-d43f-4434-9804-c671c669dd0f
      - GHL_LOCATION_ID=crN2IhAuOBAl7D8324yI

      # Workflow IDs (se llenan después de importar)
      - WORKFLOW_ID_METRICS=
      - WORKFLOW_ID_PIPELINE=
      - WORKFLOW_ID_CONTACTS=
      - WORKFLOW_ID_CONTACT360=
      - WORKFLOW_ID_HOTLEADS=
      - WORKFLOW_ID_FOLLOWUPS=

    volumes:
      - n8n_data:/home/node/.n8n
    networks:
      - selvadentro-network

  # Opcional: Redis para caching
  redis:
    image: redis:7-alpine
    container_name: selvadentro-redis
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    networks:
      - selvadentro-network

volumes:
  n8n_data:
  redis_data:

networks:
  selvadentro-network:
    driver: bridge
EOF

# 2. Iniciar N8N
docker-compose -f docker-compose-n8n.yml up -d

# 3. Verificar que esté corriendo
docker logs selvadentro-n8n

# 4. Acceder a N8N
open http://localhost:5678
```

### Opción B: npm

```bash
# Instalar globalmente
npm install n8n -g

# Configurar variables de entorno
export GHL_MCP_ENDPOINT=https://services.leadconnectorhq.com/mcp/
export GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
export GHL_ACCESS_TOKEN=pit-84d7687f-d43f-4434-9804-c671c669dd0f
export GHL_LOCATION_ID=crN2IhAuOBAl7D8324yI

# Iniciar N8N
n8n start
```

---

## 2. CONFIGURACIÓN DE VARIABLES

### En N8N UI:

1. Ve a **Settings → Variables**
2. Agrega las siguientes variables:

| Nombre | Valor |
|--------|-------|
| `GHL_MCP_ENDPOINT` | `https://services.leadconnectorhq.com/mcp/` |
| `GHL_API_KEY` | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `GHL_ACCESS_TOKEN` | `pit-84d7687f-d43f-4434-9804-c671c669dd0f` |
| `GHL_LOCATION_ID` | `crN2IhAuOBAl7D8324yI` |

---

## 3. IMPORTACIÓN DE WORKFLOWS

### Paso 1: Importar Workflow Principal

1. En N8N, click en **+ New Workflow**
2. Click en el menú (…) → **Import from File**
3. Selecciona `n8n-workflows/1-API-Gateway-Main.json`
4. Click **Save** y activa el workflow
5. **Copia el Webhook URL** (importante para el frontend)

### Paso 2: Importar Sub-Workflows

Repite el proceso para cada sub-workflow:

1. `2-GHL-Metrics-Processor.json`
2. `3-GHL-HotLeads-Processor.json`
3. ... (otros workflows según necesites)

### Paso 3: Configurar IDs de Workflows

1. Para cada sub-workflow, anota su **Workflow ID** (aparece en la URL)
2. Edita el workflow principal (API Gateway)
3. En cada nodo "Execute Workflow", reemplaza:
   - `{{ $env.WORKFLOW_ID_METRICS }}` con el ID real del workflow de métricas
   - `{{ $env.WORKFLOW_ID_HOTLEADS }}` con el ID real del workflow de hot leads
   - Etc.

4. O agrega las variables de entorno en Docker:
```bash
# Editar docker-compose-n8n.yml
environment:
  - WORKFLOW_ID_METRICS=123
  - WORKFLOW_ID_PIPELINE=124
  - WORKFLOW_ID_CONTACTS=125
  - WORKFLOW_ID_CONTACT360=126
  - WORKFLOW_ID_HOTLEADS=127
  - WORKFLOW_ID_FOLLOWUPS=128

# Reiniciar
docker-compose -f docker-compose-n8n.yml restart n8n
```

---

## 4. TESTING DE ENDPOINTS

### Test 1: Metrics Endpoint

```bash
curl -X GET 'http://localhost:5678/webhook/selvadentro?endpoint=metrics&userId=user123&role=broker'
```

**Respuesta esperada**:
```json
{
  "leads": 156,
  "opportunities": 42,
  "revenue": 8450000,
  "conversion": 26.9,
  "pipelineTotal": 8450000,
  "dealAverage": 201190,
  "atRisk": 8,
  "totalDeals": 42,
  "pipelineByStage": [...],
  "insights": [...]
}
```

### Test 2: Hot Leads Endpoint

```bash
curl -X GET 'http://localhost:5678/webhook/selvadentro?endpoint=hot-leads&userId=user123&role=broker'
```

**Respuesta esperada**:
```json
{
  "hotLeads": [
    {
      "contactId": "contact_123",
      "name": "María González",
      "score": 85,
      "temperature": "very-hot",
      "reasons": [...],
      "suggestedActions": [...]
    }
  ],
  "summary": {
    "total": 12,
    "veryHot": 5,
    "hot": 7
  }
}
```

### Usando Postman/Insomnia

Importa esta colección:

```json
{
  "name": "Selvadentro N8N API",
  "requests": [
    {
      "name": "Get Metrics",
      "method": "GET",
      "url": "http://localhost:5678/webhook/selvadentro?endpoint=metrics&userId={{userId}}&role={{role}}"
    },
    {
      "name": "Get Pipeline",
      "method": "GET",
      "url": "http://localhost:5678/webhook/selvadentro?endpoint=pipeline&userId={{userId}}&role={{role}}"
    },
    {
      "name": "Get Hot Leads",
      "method": "GET",
      "url": "http://localhost:5678/webhook/selvadentro?endpoint=hot-leads&userId={{userId}}&role={{role}}"
    }
  ]
}
```

---

## 5. MODIFICACIÓN DEL FRONTEND

### Paso 1: Crear nuevo servicio N8N

Crea `src/lib/n8n-api.ts`:

```typescript
import { User } from './supabase';

const N8N_BASE_URL = import.meta.env.VITE_N8N_BASE_URL || 'http://localhost:5678';
const N8N_WEBHOOK_PATH = '/webhook/selvadentro';

export interface N8NResponse<T = any> {
  data?: T;
  error?: string;
}

async function callN8N<T>(
  endpoint: string,
  userId: string,
  role: string,
  additionalParams?: Record<string, string>
): Promise<T> {
  const params = new URLSearchParams({
    endpoint,
    userId,
    role,
    ...additionalParams
  });

  const url = `${N8N_BASE_URL}${N8N_WEBHOOK_PATH}?${params.toString()}`;

  console.log('🔄 Calling N8N:', { endpoint, userId, role });

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`N8N Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ N8N Response:', { endpoint, dataKeys: Object.keys(data) });

    return data;
  } catch (error) {
    console.error('❌ N8N Error:', error);
    throw error;
  }
}

// Metrics API
export async function fetchMetricsFromN8N(user: User) {
  return callN8N(
    'metrics',
    user.user_id || user.id,
    user.role
  );
}

// Pipeline API
export async function fetchPipelineFromN8N(user: User) {
  return callN8N(
    'pipeline',
    user.user_id || user.id,
    user.role
  );
}

// Contacts API
export async function fetchContactsFromN8N(user: User, search?: string) {
  return callN8N(
    'contacts',
    user.user_id || user.id,
    user.role,
    search ? { search } : undefined
  );
}

// Contact 360 API
export async function fetchContact360FromN8N(contactId: string, user: User) {
  return callN8N(
    'contact360',
    user.user_id || user.id,
    user.role,
    { contactId }
  );
}

// Hot Leads API
export async function fetchHotLeadsFromN8N(user: User) {
  return callN8N(
    'hot-leads',
    user.user_id || user.id,
    user.role
  );
}

// Follow-ups API
export async function fetchFollowUpsFromN8N(user: User) {
  return callN8N(
    'follow-ups',
    user.user_id || user.id,
    user.role
  );
}
```

### Paso 2: Actualizar `metrics-service.ts`

```typescript
import { User } from './supabase';
import { fetchMetricsFromN8N } from './n8n-api';

export interface Metrics {
  leads: number;
  opportunities: number;
  revenue: number;
  conversion: number;
}

export interface DetailedMetrics extends Metrics {
  pipelineTotal: number;
  dealAverage: number;
  atRisk: number;
  totalDeals: number;
  pipelineByStage: Array<{
    stage: string;
    count: number;
    value: number;
    percentage: number;
  }>;
  insights: string[];
}

// Cache (opcional, mantener si quieres)
const metricsCache = new Map<string, {
  data: Metrics | DetailedMetrics;
  timestamp: number;
}>();

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

export async function fetchRealMetrics(user: User): Promise<Metrics> {
  try {
    // ✅ NUEVO: Llamar a N8N en lugar de GHL MCP directo
    const data = await fetchMetricsFromN8N(user);

    return {
      leads: data.leads || 0,
      opportunities: data.opportunities || 0,
      revenue: data.revenue || 0,
      conversion: data.conversion || 0
    };
  } catch (error) {
    console.error('Error fetching metrics from N8N:', error);
    // Fallback a valores por defecto
    return {
      leads: 0,
      opportunities: 0,
      revenue: 0,
      conversion: 0
    };
  }
}

export async function fetchDetailedMetrics(user: User): Promise<DetailedMetrics> {
  try {
    // ✅ NUEVO: Llamar a N8N
    const data = await fetchMetricsFromN8N(user);

    return data as DetailedMetrics;
  } catch (error) {
    console.error('Error fetching detailed metrics from N8N:', error);
    throw error;
  }
}

export function clearMetricsCache(userId?: string): void {
  if (userId) {
    metricsCache.delete(userId);
  } else {
    metricsCache.clear();
  }
}
```

### Paso 3: Actualizar `automation-service.ts`

```typescript
import { User } from './supabase';
import { fetchHotLeadsFromN8N, fetchFollowUpsFromN8N } from './n8n-api';

export interface HotLead {
  contactId: string;
  name: string;
  email?: string;
  phone?: string;
  score: number;
  temperature: 'very-hot' | 'hot' | 'warm';
  reasons: string[];
  suggestedActions: string[];
  opportunities: Array<{
    id: string;
    name?: string;
    value: number;
    stage: string;
  }>;
}

export async function detectHotLeads(user: User): Promise<HotLead[]> {
  try {
    // ✅ NUEVO: Llamar a N8N
    const data = await fetchHotLeadsFromN8N(user);

    return data.hotLeads || [];
  } catch (error) {
    console.error('Error detecting hot leads from N8N:', error);
    return [];
  }
}

export async function generateFollowUpSuggestions(user: User) {
  try {
    // ✅ NUEVO: Llamar a N8N
    const data = await fetchFollowUpsFromN8N(user);

    return data.suggestions || [];
  } catch (error) {
    console.error('Error fetching follow-ups from N8N:', error);
    return [];
  }
}
```

### Paso 4: Agregar variable de entorno

En `.env`:

```bash
# N8N API
VITE_N8N_BASE_URL=http://localhost:5678
```

En producción:

```bash
VITE_N8N_BASE_URL=https://n8n.tudominio.com
```

---

## 6. DEPLOYMENT

### Opción A: N8N en mismo servidor (EasyPanel)

1. En EasyPanel, crea un nuevo servicio "n8n"
2. Usa la imagen `n8nio/n8n:latest`
3. Configura las variables de entorno
4. Expón el puerto 5678
5. Configura dominio (ej: `n8n.selvadentro.com`)

### Opción B: N8N Cloud

1. Crea cuenta en https://n8n.cloud
2. Importa los workflows
3. Configura las variables de entorno
4. Usa la URL de tu instancia cloud en `VITE_N8N_BASE_URL`

### Seguridad

#### 1. Autenticación Básica en N8N

Ya configurada en docker-compose:
```yaml
- N8N_BASIC_AUTH_ACTIVE=true
- N8N_BASIC_AUTH_USER=admin
- N8N_BASIC_AUTH_PASSWORD=tu_password_seguro
```

#### 2. CORS en Webhooks

En cada workflow, el nodo Webhook debe tener:
```json
"options": {
  "allowedOrigins": "https://tu-dashboard.com"
}
```

#### 3. API Key (Opcional)

Agrega validación de API key en el workflow principal:

```javascript
// En el nodo "Validate Request"
const apiKey = $json.headers['x-api-key'];
const validKey = $env.SELVADENTRO_API_KEY;

if (!apiKey || apiKey !== validKey) {
  throw new Error('Unauthorized: Invalid API key');
}
```

---

## 7. TROUBLESHOOTING

### Error: "Workflow not found"

**Causa**: Los IDs de workflows no están configurados correctamente.

**Solución**:
1. Ve a cada sub-workflow en N8N
2. Copia el ID de la URL (ej: `workflow/123`)
3. Actualiza las variables de entorno o el workflow principal

### Error: "Cannot connect to GHL MCP"

**Causa**: Variables de GHL no configuradas o tokens expirados.

**Solución**:
1. Verifica variables en N8N Settings
2. Test con curl directamente al MCP
3. Regenera tokens si es necesario

### Error: "CORS blocked"

**Causa**: Frontend no puede llamar a N8N por CORS.

**Solución**:
1. Configura `allowedOrigins` en webhooks
2. O usa proxy reverso (nginx)

### Workflows muy lentos

**Causa**: Muchas llamadas al MCP sin cache.

**Solución**:
1. Habilita el nodo Redis en los workflows
2. Ajusta el TTL del cache (default 5 min)

---

## 📊 VERIFICACIÓN FINAL

Lista de verificación antes de producción:

- [ ] N8N corriendo y accesible
- [ ] Todos los workflows importados y activos
- [ ] Variables de entorno configuradas
- [ ] Webhooks respondiendo correctamente
- [ ] Tests de todos los endpoints exitosos
- [ ] Frontend modificado para usar N8N
- [ ] Cache configurado (si usas Redis)
- [ ] Autenticación básica habilitada
- [ ] CORS configurado correctamente
- [ ] Logs monitoreando llamadas
- [ ] Backups de workflows configurados

---

## 🎉 ¡LISTO!

Tu dashboard ahora usa N8N como capa intermedia para GoHighLevel MCP.

**Ventajas obtenidas**:
- ✅ Centralización de lógica de negocio
- ✅ Cache y optimización de llamadas
- ✅ Debugging visual en N8N
- ✅ Fácil agregar nuevos endpoints
- ✅ Seguridad mejorada (tokens solo en N8N)
- ✅ Escalabilidad

**Próximos pasos sugeridos**:
1. Crear workflows para Contact360, Pipeline, Reports
2. Implementar webhooks de GHL para actualizaciones en tiempo real
3. Agregar analytics y monitoring
4. Configurar alertas por email/slack en N8N
