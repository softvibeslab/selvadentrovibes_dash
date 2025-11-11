# 🔄 ARQUITECTURA N8N - SELVADENTRO DASHBOARD
**Integración GoHighLevel MCP → N8N → Dashboard**

---

## 📊 VISIÓN GENERAL

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                          │
│  Dashboard | Pipeline | Contacts | Automations | Reports    │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼ HTTP REST API
┌─────────────────────────────────────────────────────────────┐
│                        N8N WORKFLOWS                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Metrics  │  │Contacts  │  │Pipeline  │  │Automation│   │
│  │Endpoints │  │Endpoints │  │Endpoints │  │Endpoints │   │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│       │             │              │              │          │
│  ┌────┴─────────────┴──────────────┴──────────────┴─────┐  │
│  │           Data Processing & Transformation           │  │
│  │  • Caching • Aggregation • Scoring • Enrichment     │  │
│  └────┬────────────────────────────────────────────────┬┘  │
│       │                                                 │   │
└───────┼─────────────────────────────────────────────────┼───┘
        │                                                 │
        ▼ JSON-RPC 2.0                                   ▼
┌─────────────────────────────────────────────────────────────┐
│               GOHIGHLEVEL MCP API                            │
│  contacts | opportunities | tasks | notes | appointments    │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎯 ENDPOINTS NECESARIOS

### 1. **Metrics API** (Dashboard Ejecutivo)

```
GET /webhook/selvadentro/metrics
Query params:
  - userId: string (GHL user ID del broker)
  - role: 'admin' | 'broker'

Response:
{
  "leads": 156,
  "opportunities": 42,
  "revenue": 8450000,
  "conversion": 26.9,
  "pipelineTotal": 8450000,
  "dealAverage": 201190,
  "atRisk": 8,
  "totalDeals": 42,
  "pipelineByStage": [
    {
      "stage": "Nuevo",
      "count": 12,
      "value": 2400000,
      "percentage": 28.4
    },
    ...
  ],
  "insights": [
    "8 deals llevan más de 30 días sin actividad",
    "El ticket promedio es 40% menor que el objetivo"
  ]
}
```

### 2. **Pipeline API** (Pipeline Visual)

```
GET /webhook/selvadentro/pipeline
Query params:
  - userId: string
  - role: string

Response:
{
  "stages": [
    {
      "id": "stage_nuevo",
      "name": "Nuevo",
      "deals": [
        {
          "id": "deal_123",
          "contactName": "Juan Pérez",
          "contactId": "contact_456",
          "value": 250000,
          "createdAt": "2025-11-01T10:00:00Z",
          "lastActivity": "2025-11-10T15:30:00Z",
          "daysInStage": 9,
          "isStale": false,
          "probability": 70
        },
        ...
      ]
    },
    ...
  ],
  "summary": {
    "totalValue": 8450000,
    "totalDeals": 42,
    "avgDealValue": 201190
  }
}
```

### 3. **Contacts API** (Contactos 360°)

#### 3.1 List Contacts
```
GET /webhook/selvadentro/contacts
Query params:
  - userId: string
  - role: string
  - limit: number (default: 100)
  - search: string (optional)

Response:
{
  "contacts": [
    {
      "id": "contact_123",
      "name": "María González",
      "email": "maria@example.com",
      "phone": "+52 984 123 4567",
      "tags": ["VIP", "Interesado"],
      "dateAdded": "2025-10-15T08:00:00Z",
      "lastActivity": "2025-11-10T14:00:00Z",
      "opportunitiesCount": 2,
      "totalValue": 500000
    },
    ...
  ],
  "total": 156
}
```

#### 3.2 Contact 360° View
```
GET /webhook/selvadentro/contacts/:contactId
Query params:
  - userId: string

Response:
{
  "contact": {
    "id": "contact_123",
    "name": "María González",
    "email": "maria@example.com",
    "phone": "+52 984 123 4567",
    "tags": ["VIP", "Interesado"],
    "source": "Website",
    "dateAdded": "2025-10-15T08:00:00Z"
  },
  "opportunities": [
    {
      "id": "opp_456",
      "name": "Lote Premium",
      "value": 300000,
      "stage": "Negociación",
      "probability": 75,
      "createdAt": "2025-10-20T10:00:00Z"
    }
  ],
  "timeline": [
    {
      "id": "activity_789",
      "type": "call",
      "title": "Llamada de seguimiento",
      "date": "2025-11-10T14:00:00Z",
      "description": "Discutió opciones de pago"
    },
    ...
  ],
  "stats": {
    "totalInteractions": 15,
    "emailsSent": 8,
    "callsMade": 5,
    "meetingsHeld": 2,
    "responseRate": 87,
    "avgResponseTime": "2h 30m"
  },
  "heatmap": {
    "data": [
      {"date": "2025-10-15", "count": 3},
      {"date": "2025-10-16", "count": 1},
      ...
    ]
  },
  "dealScore": {
    "score": 78,
    "factors": [
      {"name": "Historical Win Rate", "value": 30, "weight": 0.30},
      {"name": "Recent Activity", "value": 20, "weight": 0.25},
      ...
    ]
  }
}
```

### 4. **Automation API** (Automatizaciones)

#### 4.1 Hot Leads Detection
```
GET /webhook/selvadentro/automation/hot-leads
Query params:
  - userId: string
  - role: string

Response:
{
  "hotLeads": [
    {
      "contactId": "contact_123",
      "name": "María González",
      "email": "maria@example.com",
      "phone": "+52 984 123 4567",
      "score": 85,
      "temperature": "very-hot",
      "reasons": [
        "VIP tag asignado",
        "3 interacciones en últimos 7 días",
        "Respondió último email en 1 hora"
      ],
      "suggestedActions": [
        "Agendar llamada de cierre",
        "Enviar propuesta formal",
        "Ofrecer tour personalizado"
      ],
      "opportunities": [
        {
          "id": "opp_456",
          "value": 300000,
          "stage": "Negociación"
        }
      ]
    },
    ...
  ]
}
```

#### 4.2 Follow-up Suggestions
```
GET /webhook/selvadentro/automation/follow-ups
Query params:
  - userId: string

Response:
{
  "suggestions": [
    {
      "contactId": "contact_789",
      "name": "Carlos Ramírez",
      "priority": "high",
      "daysWithoutContact": 7,
      "lastInteraction": "2025-11-03T10:00:00Z",
      "reason": "Deal en etapa de negociación sin actividad por 7 días",
      "suggestedAction": "Enviar email con opciones de pago",
      "dealValue": 450000,
      "stage": "Negociación"
    },
    ...
  ]
}
```

### 5. **Reports API** (Reportes)

#### 5.1 Generate Report
```
POST /webhook/selvadentro/reports/generate
Body:
{
  "templateId": "daily-summary",
  "userId": "user_123",
  "role": "broker"
}

Response:
{
  "report": {
    "template": {
      "id": "daily-summary",
      "name": "Resumen Diario"
    },
    "data": {
      "metrics": {
        "leads": 156,
        "opportunities": 42,
        "revenue": 8450000,
        "conversion": 26.9
      },
      "activities": [
        {
          "type": "call",
          "count": 12,
          "contacts": ["María González", "Carlos Ramírez"]
        },
        ...
      ],
      "deals": [
        {
          "contactName": "Juan Pérez",
          "stage": "Cerrado Ganado",
          "value": 300000,
          "date": "2025-11-10"
        }
      ]
    },
    "generatedAt": "2025-11-11T09:00:00Z"
  }
}
```

### 6. **AI Context API** (Chat IA)

```
GET /webhook/selvadentro/ai/context
Query params:
  - userId: string
  - role: string

Response:
{
  "user": {
    "id": "user_123",
    "name": "Ana Broker",
    "role": "broker"
  },
  "summary": {
    "totalContacts": 156,
    "activeOpportunities": 42,
    "pipelineValue": 8450000,
    "pendingTasks": 8
  },
  "recentActivity": [
    "Llamada con María González hace 2 horas",
    "Email enviado a Carlos Ramírez hace 1 día"
  ],
  "alerts": [
    "8 deals sin actividad por más de 7 días",
    "3 tareas vencidas"
  ]
}
```

---

## 🗺️ MAPEO DE DATOS GHL MCP

### Llamadas MCP necesarias por endpoint:

| Endpoint | MCP Tools Requeridos |
|----------|----------------------|
| `/metrics` | `contacts_get-contacts`, `opportunities_search-opportunity` |
| `/pipeline` | `opportunities_search-opportunity`, `pipeline_get-pipelines` |
| `/contacts` | `contacts_get-contacts` |
| `/contacts/:id` | `contacts_get-contact-by-id`, `opportunities_search-opportunity`, `tasks_get-tasks`, `notes_get-notes`, `appointments_get-appointments` |
| `/automation/hot-leads` | `contacts_get-contacts`, `opportunities_search-opportunity` |
| `/automation/follow-ups` | `contacts_get-contacts`, `opportunities_search-opportunity`, `tasks_get-tasks` |
| `/reports/generate` | Combinación de múltiples según template |
| `/ai/context` | `contacts_get-contacts`, `opportunities_search-opportunity`, `tasks_get-tasks` |

---

## 🔐 CONFIGURACIÓN N8N

### Variables de Entorno en N8N

```env
# GoHighLevel MCP
GHL_MCP_ENDPOINT=https://services.leadconnectorhq.com/mcp/
GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
GHL_ACCESS_TOKEN=pit-84d7687f-d43f-4434-9804-c671c669dd0f
GHL_LOCATION_ID=crN2IhAuOBAl7D8324yI

# Cache (Redis opcional)
REDIS_URL=redis://localhost:6379
CACHE_TTL=300

# Selvadentro Config
SELVADENTRO_BASE_URL=https://tu-dashboard.com
```

---

## 🏗️ ARQUITECTURA DE WORKFLOWS

### Workflow Principal: **Selvadentro API Gateway**

Este workflow actúa como API Gateway y enruta las peticiones:

```
Webhook Trigger (Wildcard)
    ↓
  Switch (por ruta)
    ↓
  ┌─────────────┬─────────────┬─────────────┐
  ↓             ↓             ↓             ↓
Metrics      Pipeline     Contacts    Automation
Sub-Workflow Sub-Workflow Sub-Workflow Sub-Workflow
```

### Sub-Workflows:

1. **GHL-Metrics-Processor**
2. **GHL-Pipeline-Processor**
3. **GHL-Contacts-Processor**
4. **GHL-Contact360-Processor**
5. **GHL-HotLeads-Processor**
6. **GHL-FollowUps-Processor**
7. **GHL-Reports-Generator**
8. **GHL-AI-Context-Builder**

---

## 📦 BENEFICIOS DE ESTA ARQUITECTURA

### ✅ Ventajas

1. **Centralización**: Toda la lógica de GHL MCP en un solo lugar
2. **Cache**: N8N puede cachear respuestas para reducir llamadas
3. **Rate Limiting**: Control de cuotas y throttling
4. **Transformación**: Enriquecimiento y agregación de datos
5. **Monitoreo**: Logs centralizados y debugging fácil
6. **Seguridad**: Credenciales solo en N8N, no en el frontend
7. **Escalabilidad**: Fácil agregar nuevos endpoints
8. **Debugging**: Ver flujo de datos en tiempo real
9. **Testing**: Fácil probar endpoints individualmente
10. **Evolución**: Cambiar GHL por otro CRM sin tocar el frontend

### 📊 Performance

- **Sin N8N**: Frontend → GHL MCP (5-10 llamadas por página)
- **Con N8N**: Frontend → N8N (1 llamada) → N8N procesa y cachea → GHL MCP (optimizado)

---

## 🔄 PRÓXIMOS PASOS

1. ✅ Diseño de arquitectura (este documento)
2. 🔄 Crear JSON del workflow principal
3. ⏳ Crear sub-workflows para cada módulo
4. ⏳ Modificar servicios del frontend
5. ⏳ Testing e2e
6. ⏳ Deploy a producción

---

**¿Continuamos con la creación de los workflows de N8N?**
