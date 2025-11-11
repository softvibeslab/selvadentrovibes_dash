# 📦 N8N WORKFLOWS - SELVADENTRO

Este directorio contiene los workflows de N8N para integrar GoHighLevel MCP con el dashboard.

---

## 📁 ARCHIVOS

### 1️⃣ `1-API-Gateway-Main.json`
**Workflow Principal - API Gateway**

- **Función**: Recibe todas las peticiones del frontend y las enruta a los sub-workflows correspondientes
- **Trigger**: Webhook en `/webhook/selvadentro`
- **Parámetros**: `endpoint`, `userId`, `role`
- **Rutas disponibles**:
  - `metrics` → Workflow de Métricas
  - `pipeline` → Workflow de Pipeline
  - `contacts` → Workflow de Contactos
  - `contact360` → Workflow de Contacto 360°
  - `hot-leads` → Workflow de Hot Leads
  - `follow-ups` → Workflow de Follow-ups

**Importar primero este workflow**

---

### 2️⃣ `2-GHL-Metrics-Processor.json`
**Procesador de Métricas**

- **Función**: Obtiene y procesa métricas del dashboard ejecutivo
- **Llamadas MCP**:
  - `contacts_get-contacts` (todos los contactos del broker/admin)
  - `opportunities_search-opportunity` (todas las oportunidades)
- **Procesamiento**:
  - Calcula KPIs: leads, opportunities, revenue, conversion
  - Identifica deals en riesgo (>30 días sin actividad)
  - Agrupa oportunidades por etapa del pipeline
  - Genera insights automáticos con IA
- **Cache**: 5 minutos (opcional con Redis)
- **Output**: JSON con métricas agregadas

**Datos retornados**:
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

---

### 3️⃣ `3-GHL-HotLeads-Processor.json`
**Detector de Hot Leads**

- **Función**: Identifica y puntúa leads con alta probabilidad de conversión
- **Llamadas MCP**:
  - `contacts_get-contacts`
  - `opportunities_search-opportunity`
- **Algoritmo de Scoring** (5 factores):
  1. **Tags VIP** (40 puntos): Tags como "VIP", "Premium", "Hot"
  2. **Actividad Reciente** (25 puntos): Interacciones en últimos 7 días
  3. **Oportunidades Activas** (20 puntos): Número y valor de deals
  4. **Calidad del Contacto** (10 puntos): Email y teléfono completos
  5. **Fuente** (5 puntos): Referidos, partners, website
- **Filtro**: Solo leads con score >= 60
- **Output**: Array de hot leads ordenados por score

**Datos retornados**:
```json
{
  "hotLeads": [
    {
      "contactId": "contact_123",
      "name": "María González",
      "score": 85,
      "temperature": "very-hot",
      "reasons": ["VIP tag", "3 interacciones recientes"],
      "suggestedActions": ["Agendar llamada", "Enviar propuesta"],
      "opportunities": [...]
    }
  ],
  "summary": {
    "total": 12,
    "veryHot": 5,
    "hot": 7,
    "totalPotentialValue": 3200000
  }
}
```

---

## 🔜 WORKFLOWS PENDIENTES (Para crear)

### 4️⃣ `4-GHL-Pipeline-Processor.json`
- Obtiene todas las oportunidades agrupadas por stage
- Identifica deals estancados (>30 días en misma etapa)
- Calcula probabilidades de cierre
- Retorna estructura tipo Kanban

### 5️⃣ `5-GHL-Contacts-Processor.json`
- Lista todos los contactos del broker
- Búsqueda por nombre/email
- Agrega información de oportunidades asociadas
- Retorna contactos con metadata

### 6️⃣ `6-GHL-Contact360-Processor.json`
- Vista completa de un contacto específico
- Historial de actividades (timeline)
- Heatmap de interacciones (últimos 30 días)
- Score de probabilidad de conversión
- Todas las oportunidades asociadas

### 7️⃣ `7-GHL-FollowUps-Processor.json`
- Identifica contactos sin actividad reciente
- Prioriza por valor de oportunidad
- Sugiere acciones específicas de seguimiento
- Calcula días sin contacto

### 8️⃣ `8-GHL-Reports-Generator.json`
- Genera reportes según templates
- Agrega datos de múltiples fuentes
- Exporta en HTML/JSON
- Envía por email (opcional)

---

## 🔧 CONFIGURACIÓN REQUERIDA

### Variables de Entorno (en N8N)

```bash
# GoHighLevel MCP
GHL_MCP_ENDPOINT=https://services.leadconnectorhq.com/mcp/
GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GHL_ACCESS_TOKEN=pit-84d7687f-d43f-4434-9804-c671c669dd0f
GHL_LOCATION_ID=crN2IhAuOBAl7D8324yI

# IDs de Workflows (después de importar)
WORKFLOW_ID_METRICS=<ID del workflow 2>
WORKFLOW_ID_PIPELINE=<ID del workflow 4>
WORKFLOW_ID_CONTACTS=<ID del workflow 5>
WORKFLOW_ID_CONTACT360=<ID del workflow 6>
WORKFLOW_ID_HOTLEADS=<ID del workflow 3>
WORKFLOW_ID_FOLLOWUPS=<ID del workflow 7>

# Opcional: Redis para cache
REDIS_URL=redis://localhost:6379
```

---

## 📥 CÓMO IMPORTAR

1. **Accede a N8N**: http://localhost:5678
2. **Nuevo Workflow**: Click en "+" → Import from File
3. **Selecciona el archivo JSON**
4. **Guarda y activa** el workflow
5. **Anota el Workflow ID** (aparece en la URL)
6. **Repite para cada workflow**
7. **Configura IDs** en el workflow principal o variables de entorno

---

## 🧪 TESTING

### Test individual de cada workflow:

```bash
# Test Metrics
curl 'http://localhost:5678/webhook/selvadentro?endpoint=metrics&userId=test123&role=broker'

# Test Hot Leads
curl 'http://localhost:5678/webhook/selvadentro?endpoint=hot-leads&userId=test123&role=broker'
```

### Debugging en N8N:

1. Abre el workflow en N8N
2. Click en "Execute Workflow"
3. Observa el flujo de datos en cada nodo
4. Verifica logs en cada paso

---

## 🎨 PERSONALIZACIÓN

### Modificar algoritmo de Hot Leads:

Edita el nodo "Calculate Hot Lead Scores" en el workflow 3:

```javascript
// Ajustar pesos de los factores
const factors = {
  vipTags: 40,      // Cambiar a tu preferencia
  activity: 25,     // Cambiar a tu preferencia
  opportunities: 20,
  quality: 10,
  source: 5
};
```

### Agregar nuevos endpoints:

1. Crea nuevo sub-workflow
2. Agrega nuevo caso en el Switch del workflow principal
3. Conecta al nuevo sub-workflow

---

## 📊 MONITOREO

### Métricas útiles en N8N:

- **Executions**: Número de ejecuciones por workflow
- **Success Rate**: Tasa de éxito de las llamadas
- **Execution Time**: Tiempo promedio de respuesta
- **Error Log**: Errores y stack traces

### Alertas recomendadas:

- Ejecutar > 5 segundos → Notificar
- Error rate > 10% → Notificar
- GHL MCP down → Notificar

---

## 🔄 MANTENIMIENTO

### Actualizar workflows:

1. Edita el workflow en N8N UI
2. Exporta el JSON actualizado
3. Reemplaza el archivo en este directorio
4. Commit al repositorio

### Backup:

```bash
# Exportar todos los workflows
# Desde N8N UI: Settings → Import/Export → Export All

# O usar N8N CLI
n8n export:workflow --all --output=./n8n-workflows/
```

---

## 📚 DOCUMENTACIÓN

- **Arquitectura completa**: Ver `../N8N_ARQUITECTURA.md`
- **Guía de setup**: Ver `../N8N_SETUP_GUIDE.md`
- **Quick start**: Ver `../N8N_QUICK_START.md`
- **N8N Docs**: https://docs.n8n.io/

---

## ✅ SIGUIENTE PASO

**Crear los workflows restantes** (4-8) usando los mismos patrones que 2 y 3.

**Estructura base de cada workflow**:
1. Trigger (Execute Workflow)
2. HTTP Request(s) a GHL MCP (JSON-RPC 2.0)
3. Parse SSE Response
4. Transform/Calculate Data
5. Cache (opcional)
6. Return JSON
