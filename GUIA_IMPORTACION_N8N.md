# 📥 GUÍA DE IMPORTACIÓN N8N - SELVADENTRO
**Paso a paso para configurar todos los workflows**

---

## 🎉 NUEVO - CONFIGURACIÓN SIMPLIFICADA

**¡Ya no necesitas configurar variables de entorno!**

Las credenciales de GoHighLevel ahora están **embebidas en cada workflow** usando un nodo "Edit Fields".

✅ **Más fácil**: Solo importa y activa
✅ **Más rápido**: Setup en 10 minutos
✅ **Más portable**: Funciona en cualquier instalación de N8N

👉 Si necesitas cambiar las credenciales, lee: **`N8N_CONFIGURACION_CREDENCIALES.md`**

---

## 📋 INFORMACIÓN NECESARIA

Antes de empezar, ten a mano:

### URLs que necesitas proporcionar:
- [ ] **URL de N8N**: `http://tu-ip:5678` o `https://n8n.tudominio.com`
- [ ] **URL del Dashboard**: `https://dashboard.selvadentro.com`

### ✅ Credenciales de GoHighLevel

**¡BUENAS NOTICIAS!** Las credenciales ya están embebidas en los workflows.

Si usas las mismas credenciales del ejemplo, **no necesitas hacer nada**.

Si usas otras credenciales, solo necesitas editarlas después de importar (ver `N8N_CONFIGURACION_CREDENCIALES.md`).

---

## 🚀 PASO 1: ACCEDER A N8N (1 min)

1. Abre tu navegador
2. Ve a tu URL de N8N: `http://TU_IP:5678`
3. Login con tus credenciales

---

## 📦 PASO 3: IMPORTAR WORKFLOWS (15 min)

### 3.1 Importar Workflow Principal (API Gateway)

1. En N8N, click en **Workflows** (panel izquierdo)
2. Click en **+ Create new workflow**
3. Click en el menú **⋮** (tres puntos) arriba a la derecha
4. Selecciona **Import from file**
5. Navega a: `n8n-workflows/1-API-Gateway-Main.json`
6. Click **Open**
7. El workflow se cargará
8. **MUY IMPORTANTE**:
   - Click en el nodo **"Webhook"**
   - Copia la **Webhook URL** que aparece (algo como: `http://tu-ip:5678/webhook/selvadentro`)
   - **Anótala**, la necesitarás para el frontend
9. Click **Save** (arriba a la derecha)
10. Activa el workflow con el switch **Active**
11. **Anota el ID del workflow** (aparece en la URL, ej: `/workflow/123`)

---

### 3.2 Importar Sub-Workflows (uno por uno)

Repite los pasos 2-4 del paso 3.1 para cada archivo:

#### A. **Metrics Processor**
- Archivo: `n8n-workflows/2-GHL-Metrics-Processor.json`
- Nombre: "GHL Metrics Processor"
- ID del workflow: **____** (anótalo)

#### B. **HotLeads Processor**
- Archivo: `n8n-workflows/3-GHL-HotLeads-Processor.json`
- Nombre: "GHL HotLeads Processor"
- ID del workflow: **____** (anótalo)

#### C. **Pipeline Processor**
- Archivo: `n8n-workflows/4-GHL-Pipeline-Processor.json`
- Nombre: "GHL Pipeline Processor"
- ID del workflow: **____** (anótalo)

#### D. **Contacts Processor**
- Archivo: `n8n-workflows/5-GHL-Contacts-Processor.json`
- Nombre: "GHL Contacts Processor"
- ID del workflow: **____** (anótalo)

#### E. **Contact360 Processor**
- Archivo: `n8n-workflows/6-GHL-Contact360-Processor.json`
- Nombre: "GHL Contact360 Processor"
- ID del workflow: **____** (anótalo)

#### F. **FollowUps Processor**
- Archivo: `n8n-workflows/7-GHL-FollowUps-Processor.json`
- Nombre: "GHL FollowUps Processor"
- ID del workflow: **____** (anótalo)

**IMPORTANTE**: Guarda y activa cada workflow después de importarlo.

---

## 🔗 PASO 4: CONECTAR SUB-WORKFLOWS AL GATEWAY (5 min)

Ahora que tienes todos los IDs, debes conectarlos al workflow principal:

### Opción A: Configurar en el Workflow Principal

1. Abre el workflow **"Selvadentro API Gateway"**
2. Encuentra cada nodo **"Execute ... Workflow"**
3. Click en cada nodo y edita el campo **Workflow ID**:

| Nodo | Workflow ID a poner |
|------|---------------------|
| Execute Metrics Workflow | ID que anotaste del workflow 2 |
| Execute HotLeads Workflow | ID que anotaste del workflow 3 |
| Execute Pipeline Workflow | ID que anotaste del workflow 4 |
| Execute Contacts Workflow | ID que anotaste del workflow 5 |
| Execute Contact360 Workflow | ID que anotaste del workflow 6 |
| Execute FollowUps Workflow | ID que anotaste del workflow 7 |

4. **Save** el workflow

### Opción B: Configurar Variables de Entorno (más limpio)

Si prefieres usar variables de entorno:

1. Ve a **Settings → Environments**
2. Agrega estas variables:

```
WORKFLOW_ID_METRICS=<ID del workflow 2>
WORKFLOW_ID_HOTLEADS=<ID del workflow 3>
WORKFLOW_ID_PIPELINE=<ID del workflow 4>
WORKFLOW_ID_CONTACTS=<ID del workflow 5>
WORKFLOW_ID_CONTACT360=<ID del workflow 6>
WORKFLOW_ID_FOLLOWUPS=<ID del workflow 7>
```

3. Los workflows ya están configurados para usar `{{ $env.WORKFLOW_ID_METRICS }}`, etc.

---

## 🧪 PASO 5: TESTING (5 min)

### Test 1: Metrics Endpoint

```bash
curl 'http://TU_IP:5678/webhook/selvadentro?endpoint=metrics&userId=test123&role=broker'
```

**Respuesta esperada**: JSON con `leads`, `opportunities`, `revenue`, `conversion`

### Test 2: Hot Leads Endpoint

```bash
curl 'http://TU_IP:5678/webhook/selvadentro?endpoint=hot-leads&userId=test123&role=broker'
```

**Respuesta esperada**: JSON con array `hotLeads`

### Test 3: Pipeline Endpoint

```bash
curl 'http://TU_IP:5678/webhook/selvadentro?endpoint=pipeline&userId=test123&role=broker'
```

**Respuesta esperada**: JSON con array `stages`

### Test 4: Contacts Endpoint

```bash
curl 'http://TU_IP:5678/webhook/selvadentro?endpoint=contacts&userId=test123&role=broker'
```

**Respuesta esperada**: JSON con array `contacts`

### Test 5: Follow-ups Endpoint

```bash
curl 'http://TU_IP:5678/webhook/selvadentro?endpoint=follow-ups&userId=test123&role=broker'
```

**Respuesta esperada**: JSON con array `suggestions`

---

## ✅ VERIFICACIÓN

Marca cada item cuando esté completado:

- [ ] N8N accesible
- [ ] ~~Variables de entorno configuradas~~ **YA NO NECESARIO** ✅
- [ ] Workflow Principal importado y activo
- [ ] Webhook URL copiada
- [ ] Todos los sub-workflows importados (6 workflows)
- [ ] Todos los sub-workflows activos
- [ ] IDs anotados para cada workflow
- [ ] IDs conectados en el workflow principal
- [ ] **Si usas otras credenciales**: Editadas en nodo "Edit Fields" de workflows 2-7
- [ ] Test de Metrics exitoso (200 OK con datos)
- [ ] Test de Hot Leads exitoso
- [ ] Test de Pipeline exitoso
- [ ] Test de Contacts exitoso
- [ ] Test de Follow-ups exitoso

---

## 📋 INFORMACIÓN PARA EL FRONTEND

Una vez completados todos los pasos, proporciona esta información para configurar el frontend:

### URL del Webhook de N8N:
```
http://TU_IP:5678/webhook/selvadentro
```
o
```
https://n8n.tudominio.com/webhook/selvadentro
```

Esta URL se usará en el archivo `.env` del dashboard como:
```bash
VITE_N8N_BASE_URL=http://TU_IP:5678
VITE_N8N_WEBHOOK_PATH=/webhook/selvadentro
```

---

## 🐛 TROUBLESHOOTING

### Error: "Workflow not found"

**Solución**: Verifica que el ID del workflow sea correcto. El ID se ve en la URL cuando abres el workflow.

### Error: "Variable not defined"

**Solución**: Ve a Settings → Environments y verifica que todas las variables `GHL_*` estén configuradas.

### Error: "Connection refused"

**Solución**: Verifica que N8N esté corriendo:
```bash
docker ps | grep n8n
# o
curl http://localhost:5678
```

### Error 400 o 406 en tests

**Solución**: Verifica que las credenciales de GHL sean correctas y no hayan expirado.

### Webhook retorna vacío

**Solución**:
1. Verifica que el workflow principal esté **Active**
2. Verifica que TODOS los sub-workflows estén **Active**
3. Revisa los logs de ejecución en N8N

---

## 📊 SIGUIENTE PASO

Una vez que todos los tests pasen, continúa con:

**→ Modificación del Frontend** (ver `N8N_SETUP_GUIDE.md` - Paso 5)

---

## 📞 ¿NECESITAS LAS URLs?

**Por favor proporciona**:

1. **URL de N8N**: ___________________________
2. **URL del Dashboard**: ___________________________

Con estas URLs podré generar los comandos de test específicos y el código exacto para el frontend.

---

✅ **Guarda este documento y marca cada paso conforme avances**
