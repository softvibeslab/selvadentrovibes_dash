# 🚀 SETUP PERSONALIZADO - SELVADENTRO DASHBOARD

**Configuración específica para tu instalación**

---

## 📍 TUS URLs CONFIGURADAS

### N8N (EasyPanel)
```
https://softvibes-n8n.vxv5dh.easypanel.host/
```

### Dashboard
```
http://31.97.145.53:8080/
```

---

## ✅ PASO 1: VERIFICAR N8N (5 min)

### 1.1 Accede a tu N8N

Abre en tu navegador:
```
https://softvibes-n8n.vxv5dh.easypanel.host/
```

Login con tus credenciales de EasyPanel.

### 1.2 Verifica que los workflows estén importados

Deberías ver 7 workflows:
- ✅ Selvadentro API Gateway
- ✅ GHL Metrics Processor
- ✅ GHL HotLeads Processor
- ✅ GHL Pipeline Processor
- ✅ GHL Contacts Processor
- ✅ GHL Contact360 Processor
- ✅ GHL FollowUps Processor

### 1.3 Verifica que todos estén ACTIVOS

Cada workflow debe tener el switch "Active" en ON (azul).

---

## 🧪 PASO 2: TESTING DE ENDPOINTS (10 min)

### 2.1 Hacer el script ejecutable

```bash
chmod +x TEST_N8N_ENDPOINTS.sh
```

### 2.2 Ejecutar tests

```bash
./TEST_N8N_ENDPOINTS.sh
```

### 2.3 Verificar resultados

Todos los endpoints deben retornar:
- ✅ HTTP 200
- ✅ JSON válido con datos

### 2.4 Tests individuales (si necesitas)

**Test Metrics:**
```bash
curl 'https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=metrics&userId=test123&role=admin'
```

**Test Hot Leads:**
```bash
curl 'https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=hot-leads&userId=test123&role=admin'
```

**Test Pipeline:**
```bash
curl 'https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=pipeline&userId=test123&role=admin'
```

**Test Contacts:**
```bash
curl 'https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=contacts&userId=test123&role=admin'
```

**Test Contact360:**
```bash
curl 'https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=contact360&contactId=test123&userId=test123&role=admin'
```

**Test Follow-ups:**
```bash
curl 'https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=follow-ups&userId=test123&role=admin'
```

---

## ⚙️ PASO 3: CONFIGURAR DASHBOARD (15 min)

### 3.1 Configurar variables de entorno

```bash
# Copiar el archivo de configuración personalizado
cp .env.n8n .env

# Verificar contenido
cat .env
```

Deberías ver:
```bash
VITE_N8N_BASE_URL=https://softvibes-n8n.vxv5dh.easypanel.host
VITE_N8N_WEBHOOK_PATH=/webhook/selvadentro
VITE_DASHBOARD_URL=http://31.97.145.53:8080
```

### 3.2 Instalar dependencias (si aún no lo hiciste)

```bash
npm install
```

### 3.3 Actualizar servicios del frontend

Los nuevos servicios están listos en:
- ✅ `src/lib/n8n-api.ts` - Cliente HTTP para N8N
- ✅ `src/lib/metrics-service-n8n.ts` - Métricas via N8N
- ✅ `src/lib/contact-service-n8n.ts` - Contactos via N8N
- ✅ `src/lib/automation-service-n8n.ts` - Pipeline via N8N

**Opción A: Usar nuevos servicios (recomendado)**

Renombra los archivos para usarlos:
```bash
# Backup de servicios antiguos
mv src/lib/metrics-service.ts src/lib/metrics-service.old.ts
mv src/lib/contact-service.ts src/lib/contact-service.old.ts
mv src/lib/automation-service.ts src/lib/automation-service.old.ts

# Activar nuevos servicios
mv src/lib/metrics-service-n8n.ts src/lib/metrics-service.ts
mv src/lib/contact-service-n8n.ts src/lib/contact-service.ts
mv src/lib/automation-service-n8n.ts src/lib/automation-service.ts
```

**Opción B: Integración manual**

Si prefieres integrar manualmente, usa los nuevos servicios como referencia.

### 3.4 Build del dashboard

```bash
npm run build
```

### 3.5 Verificar build

```bash
# Debe completar sin errores
# Deberías ver: "dist/ generado exitosamente"
```

---

## 🚀 PASO 4: DEPLOYMENT (10 min)

### 4.1 Si usas desarrollo local

```bash
npm run dev
```

Accede a: `http://localhost:5173` (o el puerto que configure Vite)

### 4.2 Si despliegas en producción

**Opción A: Copiar build a servidor**
```bash
# Copiar dist/ a tu servidor
scp -r dist/* user@31.97.145.53:/path/to/dashboard/
```

**Opción B: Usar Docker**
```bash
# Build de la imagen
docker build -t selvadentro-dashboard .

# Run del contenedor en puerto 8080
docker run -d -p 8080:80 --name dashboard selvadentro-dashboard
```

**Opción C: Desplegar en EasyPanel**

1. Sube el proyecto a EasyPanel
2. Configura las variables de entorno en EasyPanel
3. Deploy

---

## ✅ PASO 5: VERIFICACIÓN FINAL (5 min)

### 5.1 Accede al dashboard

Abre en tu navegador:
```
http://31.97.145.53:8080/
```

### 5.2 Verifica que cargue sin errores

- ✅ Login funciona
- ✅ Dashboard principal carga
- ✅ Métricas se muestran
- ✅ Sin errores en consola del navegador

### 5.3 Revisa la consola del navegador (F12)

Deberías ver logs como:
```
📊 Obteniendo métricas de N8N...
✅ Métricas obtenidas exitosamente
```

### 5.4 Verifica que los datos se carguen

- ✅ Dashboard Ejecutivo muestra KPIs
- ✅ Pipeline muestra deals
- ✅ Contactos muestra lista
- ✅ Hot Leads muestra sugerencias

---

## 🔧 TROUBLESHOOTING

### Error: "Network Error" o CORS

**Problema**: N8N rechaza peticiones del dashboard

**Solución**: Configura CORS en N8N

En EasyPanel → N8N → Variables de entorno:
```
N8N_WEBHOOK_ALLOW_ORIGIN=http://31.97.145.53:8080
```

O permite todos:
```
N8N_WEBHOOK_ALLOW_ORIGIN=*
```

Reinicia N8N después de cambiar.

---

### Error: "Cannot find module './n8n-api'"

**Problema**: El archivo n8n-api.ts no está en la ubicación correcta

**Solución**:
```bash
# Verifica que existe
ls src/lib/n8n-api.ts

# Si no existe, lo creamos (ya debería estar)
```

---

### Error: "404 Not Found" en endpoints

**Problema**: Los workflows no están activos en N8N

**Solución**:
1. Ve a N8N: https://softvibes-n8n.vxv5dh.easypanel.host/
2. Abre cada workflow
3. Activa el switch "Active" en ON
4. Guarda

---

### Métricas muestran 0 o vacío

**Problema**:
- Credenciales de GHL incorrectas en workflows
- O no hay datos en GHL

**Solución**:
1. Ve a N8N
2. Abre workflow "GHL Metrics Processor"
3. Click en nodo "Edit Fields"
4. Verifica las credenciales GHL
5. Ejecuta el workflow manualmente para probar

---

## 📊 MONITOREO

### Ver logs de N8N

En EasyPanel:
1. Ve a tu proyecto N8N
2. Click en "Logs"
3. Filtra por errores

### Ver logs del dashboard

En el navegador:
1. F12 para abrir DevTools
2. Tab "Console"
3. Busca mensajes con 📊 🔥 📈 👥

---

## 🎯 CHECKLIST COMPLETO

- [ ] N8N accesible en https://softvibes-n8n.vxv5dh.easypanel.host/
- [ ] 7 workflows importados y activos
- [ ] Test de endpoints exitoso (HTTP 200)
- [ ] Archivo .env configurado con tus URLs
- [ ] Servicios del frontend actualizados
- [ ] Build del dashboard exitoso
- [ ] Dashboard accesible en http://31.97.145.53:8080/
- [ ] Login funciona
- [ ] Métricas se cargan correctamente
- [ ] Pipeline muestra datos
- [ ] Contactos funcionan
- [ ] Sin errores en consola

---

## 🎉 ¡LISTO!

Si completaste todos los pasos y el checklist, tu dashboard Selvadentro está completamente funcional con N8N como intermediario.

### Próximos pasos opcionales:

1. **Configurar HTTPS**: Usa Let's Encrypt para el dashboard
2. **Optimizar cache**: Ajusta el CACHE_DURATION en los servicios
3. **Personalizar credenciales**: Si usas otras credenciales de GHL
4. **Monitoreo**: Configura alertas en EasyPanel

---

**¿Tienes problemas?** Revisa la sección de Troubleshooting o consulta los logs.

**¿Todo funciona?** ¡Felicidades! 🎉 Ahora tu dashboard usa N8N como API Gateway.
