# ⚡ N8N QUICK START - SELVADENTRO
**Setup en 10 minutos**

---

## 🚀 PASOS RÁPIDOS

### 1️⃣ Instalar N8N (2 min)

```bash
# Copiar docker-compose
cp docker-compose-n8n.yml .

# Editar credenciales de GHL
nano docker-compose-n8n.yml

# Iniciar
docker-compose -f docker-compose-n8n.yml up -d

# Verificar
docker logs selvadentro-n8n
```

### 2️⃣ Importar Workflows (3 min)

1. Accede a http://localhost:5678
2. Login con: `admin` / `tu_password`
3. Importa workflows:
   - `n8n-workflows/1-API-Gateway-Main.json`
   - `n8n-workflows/2-GHL-Metrics-Processor.json`
   - `n8n-workflows/3-GHL-HotLeads-Processor.json`

### 3️⃣ Configurar IDs (2 min)

```bash
# Anota los IDs de cada workflow
# Edita docker-compose-n8n.yml:

environment:
  - WORKFLOW_ID_METRICS=TU_ID_AQUI
  - WORKFLOW_ID_HOTLEADS=TU_ID_AQUI

# Reinicia
docker-compose -f docker-compose-n8n.yml restart
```

### 4️⃣ Test Endpoint (1 min)

```bash
curl 'http://localhost:5678/webhook/selvadentro?endpoint=metrics&userId=test&role=broker'
```

✅ **Debe retornar JSON con métricas**

### 5️⃣ Actualizar Frontend (2 min)

```bash
# Agregar al .env
echo "VITE_N8N_BASE_URL=http://localhost:5678" >> .env

# Crear archivo n8n-api.ts
cp src/lib/n8n-api.ts.example src/lib/n8n-api.ts

# Rebuild
npm run build
```

---

## 🎯 ENDPOINTS DISPONIBLES

| Endpoint | URL Example |
|----------|-------------|
| **Metrics** | `/webhook/selvadentro?endpoint=metrics&userId=X&role=broker` |
| **Pipeline** | `/webhook/selvadentro?endpoint=pipeline&userId=X&role=broker` |
| **Contacts** | `/webhook/selvadentro?endpoint=contacts&userId=X&role=broker` |
| **Contact 360** | `/webhook/selvadentro?endpoint=contact360&contactId=Y&userId=X&role=broker` |
| **Hot Leads** | `/webhook/selvadentro?endpoint=hot-leads&userId=X&role=broker` |
| **Follow-ups** | `/webhook/selvadentro?endpoint=follow-ups&userId=X&role=broker` |

---

## 📊 FLUJO DE DATOS

```
Dashboard → N8N Webhook → Route by Endpoint → Execute Sub-Workflow
                ↓                                       ↓
            Validate                            Call GHL MCP (JSON-RPC 2.0)
                ↓                                       ↓
            Return JSON                          Parse SSE Response
                                                        ↓
                                                 Calculate/Transform
                                                        ↓
                                                   Cache (5 min)
                                                        ↓
                                                   Return JSON
```

---

## 🛠️ TROUBLESHOOTING RÁPIDO

### Error: "Cannot connect"
```bash
# Verificar que N8N esté corriendo
docker ps | grep n8n

# Ver logs
docker logs selvadentro-n8n
```

### Error: "Workflow not found"
```bash
# Verificar IDs en docker-compose
docker-compose -f docker-compose-n8n.yml config | grep WORKFLOW_ID
```

### Error: "GHL MCP 400"
```bash
# Verificar variables de GHL
docker exec selvadentro-n8n env | grep GHL
```

---

## 📝 CHECKLIST

- [ ] N8N instalado y corriendo
- [ ] Workflows importados
- [ ] IDs configurados
- [ ] Test endpoint exitoso
- [ ] Frontend actualizado
- [ ] Build exitoso
- [ ] Probado en navegador

---

## 🎉 ¡LISTO EN 10 MINUTOS!

**Ahora tu dashboard usa N8N como API Gateway**

**Ver documentación completa**: `N8N_SETUP_GUIDE.md`
**Ver arquitectura**: `N8N_ARQUITECTURA.md`
