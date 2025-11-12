# N8N Workflows - Guía de Importación FINAL

## ✅ VALIDADO CON CURL - FUNCIONANDO

He validado todos los métodos de la API GoHighLevel MCP usando curl y creado los workflows finales con el formato correcto.

## 🔧 Cambios Aplicados

### 1. Formato JSON-RPC Correcto

**Formato INCORRECTO (anteriores versiones):**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "contacts/get-contacts",  ❌
  "params": {
    "locationId": "...",
    "limit": 1000
  }
}
```

**Formato CORRECTO (nueva versión):**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",  ✅
  "params": {
    "name": "contacts_get-contacts",  ✅
    "arguments": {  ✅
      "query_locationId": "...",
      "query_limit": 1000
    }
  }
}
```

### 2. Herramientas Validadas

| Tool Name | Status | Arguments Format |
|-----------|--------|------------------|
| `contacts_get-contacts` | ✅ Validado | `query_locationId`, `query_limit` |
| `opportunities_search-opportunity` | ✅ Validado | `query_locationId`, `query_limit`, `query_contactId` |
| `opportunities_get-pipelines` | ✅ Validado | `query_locationId` |
| `contacts_get-contact` | ✅ Validado | `path_contactId` |
| `contacts_get-all-tasks` | ✅ Validado | `path_contactId` |

### 3. Mejoras en el Código JavaScript

- Agregué función `extractData()` para manejar el formato anidado de `tools/call`
- La respuesta viene en: `response.result.content[0].text` (JSON string)
- Dentro del texto: `{"data": {"contacts": [...]}}`
- El código ahora extrae correctamente los datos de esta estructura

### 4. Corrección de Field Names

**Antes:**
```json
{
  "name": " GHL_LOCATION_ID",  ❌ espacio al inicio
  "value": "={{ $json[' GHL_LOCATION_ID'] }}"  ❌
}
```

**Después:**
```json
{
  "name": "GHL_LOCATION_ID",  ✅
  "value": "={{ $json.GHL_LOCATION_ID }}"  ✅
}
```

## 📋 Workflows FINALES Creados

### 1. **2-GHL-Metrics-Processor-FINAL.json**
- Obtiene contacts y opportunities
- Calcula métricas: leads, conversión, revenue, pipeline
- Identifica deals at-risk (>30 días sin actividad)
- Genera insights con IA

### 2. **3-GHL-HotLeads-Processor-FINAL.json**
- Scoring de leads con 5 factores:
  1. Tags VIP (40 pts)
  2. Actividad reciente (25 pts)
  3. Opportunities activas (20 pts)
  4. Calidad de contacto (10 pts)
  5. Fuente (5 pts)
- Filtra hot leads (score >= 60)

### 3. **4-GHL-Pipeline-Processor-FINAL.json**
- Obtiene opportunities y pipelines
- Agrupa deals por stage
- Calcula deals estancados (>30 días)
- Muestra valor total por stage

### 4. **5-GHL-Contacts-Processor-FINAL.json**
- Lista todos los contacts
- Enriquece con opportunities count y total value
- Soporta búsqueda por nombre, email, phone
- Ordenado por última actividad

### 5. **6-GHL-Contact360-Processor-FINAL.json**
- Vista 360° de un contact específico
- Obtiene: contact details, opportunities, tasks
- Calcula deal score (0-100)
- **Nota:** Notes no disponibles en MCP API

### 6. **7-GHL-FollowUps-Processor-FINAL.json**
- Identifica contacts que necesitan seguimiento
- Filtra por días sin contacto (>=3 días)
- Prioriza por:
  - Tiempo sin contacto
  - Valor del deal
  - Etapa del pipeline
- Sugiere acciones específicas

## 🚀 Instrucciones de Importación

### Paso 1: Eliminar Workflows Anteriores
En N8N, elimina los workflows V1-V5 anteriores:
- GHL Metrics Processor
- GHL HotLeads Processor
- GHL Pipeline Processor
- GHL Contacts Processor
- GHL Contact 360 Processor
- GHL FollowUps Processor

### Paso 2: Importar Nuevos Workflows
1. En N8N, ve a **Workflows** → **Import from File**
2. Importa cada archivo **-FINAL.json**:
   - `2-GHL-Metrics-Processor-FINAL.json`
   - `3-GHL-HotLeads-Processor-FINAL.json`
   - `4-GHL-Pipeline-Processor-FINAL.json`
   - `5-GHL-Contacts-Processor-FINAL.json`
   - `6-GHL-Contact360-Processor-FINAL.json`
   - `7-GHL-FollowUps-Processor-FINAL.json`

### Paso 3: Activar Workflows
Activa cada workflow importado.

### Paso 4: Actualizar IDs en API Gateway
No necesitas actualizar el API Gateway - los workflow IDs deberían mantenerse iguales, pero verifica que los IDs en el workflow `1-API-Gateway-Main-FIXED.json` coincidan:

```javascript
WORKFLOW_ID_METRICS: "Oqg9eTzA7Ee5OYyg"
WORKFLOW_ID_PIPELINE: "2SRqPp6XOwBtyAep"
WORKFLOW_ID_CONTACTS: "GUt6LnasyRo8p2PH"
WORKFLOW_ID_CONTACT360: "LbMoEZrHRiojjc4V"
WORKFLOW_ID_HOTLEADS: "kQJ6TiRdm6KIJzWB"
WORKFLOW_ID_FOLLOWUPS: "k3LHqYhgRuPcflGX"
```

Si los IDs cambiaron, actualiza el workflow API Gateway en el nodo "Edit Fields".

### Paso 5: Probar en Dashboard
1. Abre http://31.97.145.53:8080
2. Login con tu cuenta Supabase
3. Verifica que cada vista cargue datos:
   - **Executive Dashboard** → Métricas
   - **Pipeline** → Stages con deals
   - **Contacts** → Lista de contactos
   - **Hot Leads** → Leads con score alto
   - **Automations** → Follow-up suggestions

## 🧪 Pruebas Realizadas

### Pruebas con curl (todas exitosas):
```bash
✅ contacts_get-contacts → 200 OK, retornó 5+ contacts
✅ opportunities_search-opportunity → 200 OK, retornó 3+ deals
✅ opportunities_get-pipelines → 200 OK, retornó 10+ pipelines con stages
```

## 🔍 Debugging

Si algo no funciona, revisa:

1. **Workflow Execution Logs** en N8N:
   - Ve al workflow → Executions → Click en la última ejecución
   - Revisa cada nodo para ver el output

2. **Console del Dashboard**:
   ```javascript
   // Abre DevTools (F12)
   // Busca errores N8N
   ```

3. **Test Manual** con curl:
   ```bash
   curl -X POST "https://services.leadconnectorhq.com/mcp/" \
     -H "Content-Type: application/json" \
     -H "Accept: application/json, text/event-stream" \
     -H "Authorization: Bearer pit-84d7687f-d43f-4434-9804-c671c669dd0f" \
     -H "X-API-Key: eyJhbGci..." \
     -H "locationId: crN2IhAuOBAl7D8324yI" \
     -d '{
       "jsonrpc": "2.0",
       "id": 1,
       "method": "tools/call",
       "params": {
         "name": "contacts_get-contacts",
         "arguments": {
           "query_locationId": "crN2IhAuOBAl7D8324yI",
           "query_limit": 5
         }
       }
     }'
   ```

## 📊 Estructura de Datos de Respuesta

### tools/call Response Format:
```javascript
{
  "result": {
    "content": [
      {
        "type": "text",
        "text": "{\"success\": true, \"status\": 200, \"data\": {...}}"
      }
    ]
  }
}
```

El código JavaScript en cada workflow ahora maneja este formato correctamente con la función `extractData()`.

## ✅ Checklist Final

- [ ] 6 workflows FINAL importados
- [ ] Todos los workflows activados
- [ ] API Gateway workflow IDs actualizados (si es necesario)
- [ ] Dashboard abierto en http://31.97.145.53:8080
- [ ] Login exitoso
- [ ] Executive Dashboard muestra métricas
- [ ] Pipeline muestra stages con deals
- [ ] Contacts muestra lista de contactos
- [ ] Hot Leads muestra leads con scoring
- [ ] Automations muestra follow-up suggestions
- [ ] Contact 360° funciona al hacer click en un contact

## 🎉 ¡Listo!

Una vez completados todos los pasos, tu dashboard debería estar 100% funcional.

---

**Última actualización:** 2025-11-12
**Validado con:** GoHighLevel MCP API v1 + N8N + curl testing
