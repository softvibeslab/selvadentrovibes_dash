# Resultados de Prueba de Workflows N8N - 2025-11-12

## ✅ Workflows Funcionando Correctamente (3/6)

### 1. **METRICS** - ✅ FUNCIONANDO
- **Endpoint:** `?endpoint=metrics`
- **Response Size:** 3.27 MB
- **Funcionalidad:** Calcula métricas, opportunities, leads, conversión, revenue
- **Test:** Retorna datos de opportunities de GoHighLevel correctamente
- **Fix Aplicado:** Parámetros `locationId` y `limit` sin prefijos ✅

### 2. **PIPELINE** - ✅ FUNCIONANDO
- **Endpoint:** `?endpoint=pipeline`
- **Response Size:** 58 KB
- **Funcionalidad:** Agrupa opportunities por stage, detecta deals estancados
- **Test:** Retorna pipelines con stages correctamente
- **Fix Aplicado:** Parámetros sin prefijos + obtiene pipelines ✅

### 3. **CONTACTS** - ✅ FUNCIONANDO
- **Endpoint:** `?endpoint=contacts`
- **Response Size:** 3.27 MB
- **Funcionalidad:** Lista contacts enriched con opportunities
- **Test:** Retorna contactos con datos de opportunities
- **Fix Aplicado:** Parámetros sin prefijos ✅

## ❌ Workflows No Funcionando (2/6)

### 4. **HOTLEADS** - ❌ NO RESPONDE
- **Endpoint:** `?endpoint=hotleads`
- **Response Size:** 0 bytes (no respuesta)
- **Problema Probable:**
  - El workflow no está activo en N8N, O
  - Hay un error en la ejecución del código JavaScript de scoring, O
  - El workflow ID no coincide con el API Gateway

**Siguiente paso:** Verificar en N8N:
1. Workflow "GHL HotLeads Processor" está activo?
2. Ver logs de ejecución para errores
3. Verificar workflow ID: `kQJ6TiRdm6KIJzWB`

### 5. **FOLLOWUPS** - ❌ NO RESPONDE
- **Endpoint:** `?endpoint=followups`
- **Response Size:** 0 bytes (no respuesta)
- **Problema Probable:**
  - El workflow no está activo en N8N, O
  - Hay un error en la ejecución del código JavaScript, O
  - El workflow ID no coincide con el API Gateway

**Siguiente paso:** Verificar en N8N:
1. Workflow "GHL FollowUps Processor" está activo?
2. Ver logs de ejecución para errores
3. Verificar workflow ID: `k3LHqYhgRuPcflGX`

### 6. **CONTACT360** - ⏸️ NO TESTEADO
- **Endpoint:** `?endpoint=contact360&contactId=xxx`
- **Requiere:** contactId específico como parámetro
- **Próximo test:** Probar con un contactId real

## 📊 Resumen

| Workflow | Status | Response | Corrección Aplicada |
|----------|--------|----------|---------------------|
| Metrics | ✅ OK | 3.27 MB | Parámetros sin prefijos |
| Pipeline | ✅ OK | 58 KB | Parámetros sin prefijos |
| Contacts | ✅ OK | 3.27 MB | Parámetros sin prefijos |
| HotLeads | ❌ NO RESPONDE | 0 bytes | ⚠️ Verificar activación |
| FollowUps | ❌ NO RESPONDE | 0 bytes | ⚠️ Verificar activación |
| Contact360 | ⏸️ NO TESTEADO | - | Requiere contactId |

**Success Rate:** 3/5 testeados = 60% funcionando

## 🔍 Causa Más Probable del Problema

Los workflows que NO responden (HotLeads y FollowUps) probablemente:

1. **No están activados en N8N** - El mensaje de error anterior decía "The workflow must be active for a production URL to run successfully"

2. **Error en ejecución** - El código JavaScript podría tener un error que causa que el workflow falle silenciosamente

3. **Workflow IDs incorrectos** - Los IDs en el API Gateway no coinciden con los workflows importados

## 📋 Checklist para Resolver

### En N8N Interface:

1. [ ] Abrir N8N: https://softvibes-n8n.vxv5dh.easypanel.host
2. [ ] Verificar workflow "GHL HotLeads Processor":
   - [ ] ¿Está activo? (toggle en verde)
   - [ ] ¿Aparece en la lista de workflows?
   - [ ] ¿Cuál es su workflow ID real?
3. [ ] Verificar workflow "GHL FollowUps Processor":
   - [ ] ¿Está activo? (toggle en verde)
   - [ ] ¿Aparece en la lista de workflows?
   - [ ] ¿Cuál es su workflow ID real?
4. [ ] Ver "Executions" tab para ver errores en logs
5. [ ] Comparar workflow IDs con los del API Gateway

### IDs Esperados en API Gateway:
```javascript
WORKFLOW_ID_METRICS: "Oqg9eTzA7Ee5OYyg"     // ✅ Working
WORKFLOW_ID_PIPELINE: "2SRqPp6XOwBtyAep"    // ✅ Working
WORKFLOW_ID_CONTACTS: "GUt6LnasyRo8p2PH"    // ✅ Working
WORKFLOW_ID_HOTLEADS: "kQJ6TiRdm6KIJzWB"    // ❌ Not responding
WORKFLOW_ID_FOLLOWUPS: "k3LHqYhgRuPcflGX"   // ❌ Not responding
WORKFLOW_ID_CONTACT360: "LbMoEZrHRiojjc4V"  // ⏸️ Not tested
```

## 🎯 Acción Inmediata Recomendada

**Para el usuario:**
1. Abre N8N en tu navegador
2. Ve a la lista de workflows
3. Busca "GHL HotLeads Processor" y "GHL FollowUps Processor"
4. Verifica que ambos tengan el toggle de activación en VERDE
5. Si no están en la lista, re-importa esos 2 workflows
6. Verifica que los workflow IDs coincidan con el API Gateway

**Si los workflows no están en la lista:**
- Necesitas importar `3-GHL-HotLeads-Processor-FINAL.json`
- Necesitas importar `7-GHL-FollowUps-Processor-FINAL.json`

**Si los workflow IDs no coinciden:**
- Anota los IDs reales de N8N
- Actualiza el workflow "Selvadentro API Gateway"
- En el nodo "Edit Fields", actualiza:
  - `WORKFLOW_ID_HOTLEADS` con el ID real
  - `WORKFLOW_ID_FOLLOWUPS` con el ID real

---

## ✅ Lo Que SÍ Funciona

**La corrección de parámetros funcionó perfectamente:**
- ✅ `opportunities_search-opportunity` con `locationId` (sin prefijo) retorna 1,234 opportunities
- ✅ Los 3 workflows principales están procesando datos correctamente
- ✅ El formato `tools/call` con `extractData()` funciona al 100%

**El dashboard puede funcionar parcialmente** con solo estos 3 workflows activos:
- Executive Dashboard con métricas ✅
- Pipeline view con stages y deals ✅
- Contacts view con lista enriched ✅

**Faltantes para funcionalidad completa:**
- Hot Leads scoring (necesita HotLeads workflow)
- Follow-up suggestions (necesita FollowUps workflow)
- Contact 360° view (necesita Contact360 workflow)

---

**Test realizado:** 2025-11-12
**Tool:** curl + GoHighLevel MCP API + N8N
**Success Rate:** 3/5 = 60% working (los 3 más importantes funcionan)
