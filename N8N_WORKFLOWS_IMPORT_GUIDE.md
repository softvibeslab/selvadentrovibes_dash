# N8N Workflows - Import Guide & Fix Summary

**Fecha**: 2025-11-12
**Status**: ✅ WORKFLOWS CORREGIDOS - LISTOS PARA IMPORTAR

---

## 🔧 QUÉ SE CORRIGIÓ

### Problema 1: API Gateway - IF Nodes leyendo de ruta incorrecta

**Original (INCORRECTO)**:
```javascript
// 5 de 6 IF nodes usaban:
{{ $('Webhook').item.json.body[0].query.endpoint }}
```

**Corregido**:
```javascript
// Todos los IF nodes ahora usan:
{{ $json.endpoint }}
```

**Razón**: Los IF nodes estaban buscando en `body[0].query` pero los datos llegan en `query`. Ahora el Edit Fields extrae el `endpoint` al nivel superior.

---

### Problema 2: API Gateway - No pasaba parámetros a sub-workflows

**Original (INCORRECTO)**:
El Edit Fields solo tenía los workflow IDs, pero no extraía los query parameters.

**Corregido**:
El Edit Fields ahora extrae TODOS los parámetros:
```json
{
  "WORKFLOW_ID_METRICS": "Oqg9eTzA7Ee5OYyg",
  "WORKFLOW_ID_PIPELINE": "2SRqPp6XOwBtyAep",
  // ... otros workflow IDs
  "endpoint": "={{ $json.query.endpoint }}",
  "userId": "={{ $json.query.userId }}",
  "role": "={{ $json.query.role }}",
  "search": "={{ $json.query.search || '' }}",
  "contactId": "={{ $json.query.contactId || '' }}"
}
```

---

### Problema 3: Sub-workflows - Leyendo parámetros de ruta incorrecta

**Original (INCORRECTO)**:
```javascript
// En workflows 2-7:
{{ $json.query.role }}
{{ $json.query.userId }}
{{ $json.query.search }}
{{ $json.query.contactId }}
```

**Corregido**:
```javascript
// Ahora leen desde el trigger:
{{ $('When workflow is called').item.json.role }}
{{ $('When workflow is called').item.json.userId }}
{{ $('When workflow is called').item.json.search }}
{{ $('When workflow is called').item.json.contactId }}
```

**Razón**: Los sub-workflows reciben los parámetros del workflow padre (API Gateway), que ahora están en el nivel superior del JSON de entrada.

---

## 📦 ARCHIVOS CORREGIDOS

Todos en el directorio `n8n-workflows-FIXED/`:

1. ✅ `1-API-Gateway-Main-FIXED.json` - Gateway con rutas y parámetros corregidos
2. ✅ `2-GHL-Metrics-Processor-FIXED.json` - Lee role/userId correctamente
3. ✅ `3-GHL-HotLeads-Processor-FIXED.json` - Lee role/userId correctamente
4. ✅ `4-GHL-Pipeline-Processor-FIXED.json` - Lee role/userId correctamente
5. ✅ `5-GHL-Contacts-Processor-FIXED.json` - Lee role/userId/search correctamente
6. ✅ `6-GHL-Contact360-Processor-FIXED.json` - Lee contactId correctamente
7. ✅ `7-GHL-FollowUps-Processor-FIXED.json` - Lee role/userId correctamente

---

## 🚀 CÓMO IMPORTAR LOS WORKFLOWS CORREGIDOS

### Opción 1: Importar desde UI (RECOMENDADO)

#### Paso 1: Backup de workflows actuales

1. Ve a N8N: https://softvibes-n8n.vxv5dh.easypanel.host
2. Para cada workflow actual:
   - Click derecho → Download
   - Guarda en carpeta `n8n-workflows-backup/`

#### Paso 2: Eliminar workflows antiguos

1. Para cada uno de los 7 workflows:
   - Click derecho → Delete
   - Confirmar eliminación

#### Paso 3: Importar workflows corregidos

Para cada archivo `-FIXED.json`:

1. Click en el botón **"+"** (New workflow)
2. Click en **"..."** (menu) → **"Import from File..."**
3. Selecciona el archivo correspondiente:
   - `1-API-Gateway-Main-FIXED.json` primero
   - Luego los otros 6 en cualquier orden

4. **IMPORTANTE**: Después de importar cada workflow:
   - Verifica que el nombre sea correcto
   - Click **"Save"** (botón arriba a la derecha)
   - Click **"Active"** para activarlo (toggle arriba)

5. **CRÍTICO**: Anota el Workflow ID del API Gateway
   - En el API Gateway, ve a Settings → Workflow ID
   - Copia el ID (algo como `Abc123XyZ`)
   - Este es el ID que usará el webhook

---

### Opción 2: Importar vía N8N CLI (Avanzado)

Si tienes acceso SSH a tu servidor de N8N:

```bash
# Conectar al servidor
ssh user@tu-servidor

# Ir al directorio de N8N
cd /path/to/n8n

# Importar workflows
n8n import:workflow --input=/path/to/n8n-workflows-FIXED/1-API-Gateway-Main-FIXED.json
n8n import:workflow --input=/path/to/n8n-workflows-FIXED/2-GHL-Metrics-Processor-FIXED.json
# ... repetir para todos
```

---

## 🔍 VERIFICACIÓN POST-IMPORTACIÓN

### 1. Verificar que los 7 workflows estén activos

En N8N UI, deberías ver:

- ✅ Selvadentro API Gateway - **ACTIVE**
- ✅ GHL Metrics Processor - **ACTIVE**
- ✅ GHL HotLeads Processor - **ACTIVE**
- ✅ GHL Pipeline Processor - **ACTIVE**
- ✅ GHL Contacts Processor - **ACTIVE**
- ✅ GHL Contact360 Processor - **ACTIVE**
- ✅ GHL FollowUps Processor - **ACTIVE**

### 2. Verificar Workflow IDs en API Gateway

Abre el API Gateway y ve al nodo **"Edit Fields"**:

```json
{
  "WORKFLOW_ID_METRICS": "Oqg9eTzA7Ee5OYyg",
  "WORKFLOW_ID_PIPELINE": "2SRqPp6XOwBtyAep",
  "WORKFLOW_ID_CONTACTS": "GUt6LnasyRo8p2PH",
  "WORKFLOW_ID_CONTACT360": "LbMoEZrHRiojjc4V",
  "WORKFLOW_ID_HOTLEADS": "kQJ6TiRdm6KIJzWB",
  "WORKFLOW_ID_FOLLOWUPS": "k3LHqYhgRuPcflGX"
}
```

⚠️ **Si los IDs no coinciden con tus workflows actuales**:

1. Ve a cada sub-workflow
2. Settings → Copia el Workflow ID
3. Actualiza los IDs en el API Gateway Edit Fields node

### 3. Obtener la URL del Webhook

En el workflow **"Selvadentro API Gateway"**:

1. Click en el nodo **"Webhook"**
2. En el panel derecho, copia la **"Webhook URL"**
3. Debería ser algo como:
   ```
   https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro
   ```

4. Actualiza tu `.env` si es diferente:
   ```bash
   VITE_N8N_WEBHOOK_PATH=/webhook/selvadentro
   ```

---

## ✅ TESTING

### Test 1: Endpoint de Metrics

```bash
# Desde tu terminal
curl -X GET "https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=metrics&role=admin&userId=test123"
```

**Respuesta esperada**: JSON con métricas (leads, opportunities, revenue, etc.)

**Si falla con 404**: El webhook no está activo o la URL es incorrecta

**Si falla con JSON parse error**: Revisa los logs de N8N para ver el error específico

---

### Test 2: Endpoint de Pipeline

```bash
curl -X GET "https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=pipeline&role=broker&userId=gDXm4rIB6In8qkt5uzJY"
```

**Respuesta esperada**: JSON con stages y deals

---

### Test 3: Endpoint de Contacts con búsqueda

```bash
curl -X GET "https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=contacts&role=admin&userId=test123&search=John"
```

**Respuesta esperada**: JSON con contactos filtrados por "John"

---

### Test 4: Endpoint de Contact360

```bash
# Reemplaza CONTACT_ID con un ID real de GHL
curl -X GET "https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=contact360&contactId=CONTACT_ID"
```

**Respuesta esperada**: JSON con contact, opportunities, timeline, stats

---

### Test 5: Todos los endpoints con script

Usa el script de testing que ya tienes:

```bash
cd /rogervibes/selvavibes/selvadentrovibes_dash
chmod +x TEST_N8N_ENDPOINTS.sh
./TEST_N8N_ENDPOINTS.sh
```

**Resultado esperado**: Todos los endpoints deberían retornar **HTTP 200**

---

## 🐛 TROUBLESHOOTING

### Error: "404 Not Found"

**Causa**: Webhook no activo o URL incorrecta

**Solución**:
1. Verifica que el API Gateway esté **ACTIVE**
2. Ve al nodo Webhook → Verifica la URL
3. Asegúrate de que el path sea `/webhook/selvadentro`

---

### Error: "Workflow with ID 'xxx' not found"

**Causa**: Los Workflow IDs en el API Gateway no coinciden con los sub-workflows

**Solución**:
1. Abre cada sub-workflow
2. Settings → Copia el ID real
3. Actualiza el Edit Fields node en el API Gateway con los IDs correctos
4. Guarda el API Gateway

---

### Error: "Empty response" o "Invalid JSON"

**Causa**: Los sub-workflows no están retornando datos

**Solución**:
1. Abre el workflow correspondiente en N8N
2. Click en **"Execute Workflow"** para testing manual
3. Revisa cada nodo para ver dónde falla
4. Verifica que las credenciales de GHL estén correctas:
   - API Key
   - Access Token
   - Location ID

---

### Error: "role is not defined" o "userId is not defined"

**Causa**: Los parámetros no se están pasando correctamente

**Solución**:
1. Verifica que el API Gateway tenga el Edit Fields corregido
2. En cada sub-workflow, verifica que use:
   ```javascript
   $('When workflow is called').item.json.role
   $('When workflow is called').item.json.userId
   ```
3. NO debe usar `$json.query.role` (eso es el error antiguo)

---

### Datos vacíos pero sin errores

**Causa Posible 1**: Filtro de broker bloqueando datos

Si eres broker, asegúrate de que tu `userId` en GHL tenga deals asignados.

**Causa Posible 2**: Credenciales de GHL incorrectas

Verifica en cada workflow que:
```javascript
GHL_API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImNyTjJJaEF1T0JBbDdEODMyNHlJIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ5OTY5Njg5MjkxLCJzdWIiOiJnRFhtNHJJQjZJbjhxa3Q1dXpKWSJ9.HKfmsDYjb30fxRu6n40R39ED-NEuoWYhJjKvGtxjeUg"
GHL_ACCESS_TOKEN: "pit-84d7687f-d43f-4434-9804-c671c669dd0f"
GHL_LOCATION_ID: "crN2IhAuOBAl7D8324yI"
```

---

## 📊 COMPARACIÓN: ANTES vs DESPUÉS

### ANTES (Con errores)

```
Usuario abre Dashboard
  ↓
Frontend llama: /webhook/selvadentro?endpoint=metrics&role=admin&userId=123
  ↓
API Gateway Webhook recibe: { query: { endpoint: "metrics", role: "admin", userId: "123" } }
  ↓
IF Metrics busca en: $('Webhook').item.json.body[0].query.endpoint ❌ UNDEFINED
  ↓
Ningún IF node coincide
  ↓
⚠️ ERROR: No workflow ejecutado → 404 o respuesta vacía
```

### DESPUÉS (Corregido)

```
Usuario abre Dashboard
  ↓
Frontend llama: /webhook/selvadentro?endpoint=metrics&role=admin&userId=123
  ↓
API Gateway Webhook recibe: { query: { endpoint: "metrics", role: "admin", userId: "123" } }
  ↓
Edit Fields extrae: { endpoint: "metrics", role: "admin", userId: "123", WORKFLOW_ID_METRICS: "xxx" }
  ↓
IF Metrics busca en: $json.endpoint ✅ = "metrics"
  ↓
IF coincide → Ejecuta Metrics Workflow con parámetros { role: "admin", userId: "123" }
  ↓
Metrics Workflow lee: $('When workflow is called').item.json.role ✅ = "admin"
  ↓
Llama a GHL MCP con filtro correcto
  ↓
✅ SUCCESS: Retorna métricas correctamente
```

---

## 🎯 SIGUIENTE PASO

### 1. Importar workflows corregidos en N8N

Sigue las instrucciones en **"Opción 1: Importar desde UI"** arriba.

### 2. Actualizar Workflow IDs si es necesario

Si N8N genera nuevos IDs al importar, actualiza el API Gateway.

### 3. Probar todos los endpoints

```bash
./TEST_N8N_ENDPOINTS.sh
```

### 4. Verificar Dashboard

```bash
# En tu navegador
http://31.97.145.53:8080

# Login con Supabase
# Deberías ver métricas cargando en el Dashboard Ejecutivo
```

---

## 📞 SOPORTE

**Si los workflows aún fallan después de importar**:

1. Exporta los logs de N8N:
   ```bash
   docker logs n8n-container > n8n-logs.txt
   ```

2. Comparte:
   - Los logs de N8N
   - La respuesta exacta del curl test
   - Screenshot del API Gateway Edit Fields node

3. Verifica versión de N8N:
   - Estos workflows fueron creados para N8N v1.x
   - Si usas N8N v0.x, puede haber incompatibilidades

---

**Última actualización**: 2025-11-12
**Workflows corregidos**: 7/7
**Status**: ✅ LISTO PARA IMPORTAR
