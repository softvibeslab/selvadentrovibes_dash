# ✅ SELVADENTRO DASHBOARD - LISTO PARA DEPLOYMENT

**Fecha**: 2025-11-12
**Estado**: ✅ READY FOR PRODUCTION
**Build**: 428.61 KB (115.60 KB gzipped)

---

## 🎉 CONFIGURACIÓN COMPLETA

### ✅ Credenciales Configuradas

**Supabase** ✅
- URL: `https://qcvioktwdqcnizvqzekm.supabase.co`
- Anon Key: Configurada
- Status: Listo para autenticación

**GoHighLevel** ✅
- API Key: Configurada
- Access Token: Configurado
- Location ID: `crN2IhAuOBAl7D8324yI`
- Status: Listo para CRM integration

**N8N** ✅
- Base URL: `https://softvibes-n8n.vxv5dh.easypanel.host`
- Webhook Path: `/webhook/selvadentro`
- Workflows: 7 activos
- Status: Todos los endpoints funcionando (HTTP 200)

**Anthropic Claude AI** ✅
- API Key: Configurada
- Status: Listo para chat IA

---

## 🚀 DEPLOYMENT OPTIONS

### Opción 1: Docker Local (5 minutos) ⭐ RECOMENDADO PARA TESTING

```bash
# 1. Ejecutar deployment
./deploy.sh
# Seleccionar opción: 1 (Docker build local)

# 2. Iniciar contenedor
docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest

# 3. Abrir navegador
# http://localhost:8080
```

**Cuando usar**: Testing local, desarrollo, demos

---

### Opción 2: EasyPanel (10 minutos) ⭐ RECOMENDADO PARA PRODUCCIÓN

#### Paso 1: Push a Git
```bash
git push origin doc_n8n
```

#### Paso 2: Crear App en EasyPanel
1. Login en EasyPanel
2. Create New App → Docker
3. Git Repository → Tu repo
4. Branch: `doc_n8n`

#### Paso 3: Configurar Variables de Entorno
Copiar y pegar en EasyPanel → Environment Variables:

```bash
VITE_SUPABASE_URL=https://qcvioktwdqcnizvqzekm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdmlva3R3ZHFjbml6dnF6ZWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjA1OTMsImV4cCI6MjA3ODEzNjU5M30.3qNMsVxCGX8mRkgtz7a1Kilx9CWju6P7VobbPpzy9F8
VITE_GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImNyTjJJaEF1T0JBbDdEODMyNHlJIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ5OTY5Njg5MjkxLCJzdWIiOiJnRFhtNHJJQjZJbjhxa3Q1dXpKWSJ9.HKfmsDYjb30fxRu6n40R39ED-NEuoWYhJjKvGtxjeUg
VITE_GHL_ACCESS_TOKEN=pit-84d7687f-d43f-4434-9804-c671c669dd0f
VITE_GHL_LOCATION_ID=crN2IhAuOBAl7D8324yI
VITE_N8N_BASE_URL=https://softvibes-n8n.vxv5dh.easypanel.host
VITE_N8N_WEBHOOK_PATH=/webhook/selvadentro
VITE_DASHBOARD_URL=https://tu-app.easypanel.host
VITE_ANTHROPIC_API_KEY=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
```

⚠️ **IMPORTANTE**: Cambiar `VITE_DASHBOARD_URL` por tu URL real de EasyPanel

#### Paso 4: Deploy
- EasyPanel detectará el Dockerfile automáticamente
- Click "Deploy"
- Esperar 3-5 minutos
- Recibirás una URL como: `https://selvadentro.xxxxx.easypanel.host`

**Cuando usar**: Producción, staging, deploy permanente

---

### Opción 3: VPS Manual (15 minutos)

Para deployment en tu VPS (31.97.145.53):

```bash
# 1. Conectar al VPS
ssh user@31.97.145.53

# 2. Instalar Docker (si no está)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# 3. Clonar repositorio
git clone <tu-repo-url> selvadentro-dashboard
cd selvadentro-dashboard
git checkout doc_n8n

# 4. Copiar .env
cp .env.production.example .env
# (Ya tiene todas las credenciales configuradas)

# 5. Build y deploy
chmod +x deploy.sh
./deploy.sh
# Seleccionar opción 1

# 6. Iniciar contenedor
docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest

# 7. Verificar
docker ps
curl http://localhost:8080/health

# 8. Configurar como servicio (opcional pero recomendado)
# Ver DEPLOYMENT_GUIDE.md sección "Configurar como Servicio"
```

**Cuando usar**: Control total, servidor dedicado, infraestructura propia

---

## 🎯 DEPLOYMENT RÁPIDO (RECOMENDADO)

Si quieres el método más rápido para ver el dashboard funcionando:

```bash
# En tu terminal actual
./deploy.sh
# Opción 1

docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest

# Abrir: http://localhost:8080
```

**Tiempo total**: ~3 minutos

---

## ✅ VERIFICACIÓN POST-DEPLOYMENT

### 1. Health Check
```bash
curl http://localhost:8080/health
# Debe retornar: healthy
```

### 2. Verificar Contenedor
```bash
docker ps | grep selvadentro
# Debe mostrar contenedor RUNNING
```

### 3. Verificar Logs
```bash
docker logs selvadentro-dashboard | tail -20
# No debe haber errores
```

### 4. Test en Navegador

1. Abre: `http://localhost:8080` (o tu URL de producción)
2. Deberías ver:
   - ✅ Página de login de Supabase
   - ✅ Assets cargando correctamente
   - ✅ Sin errores en consola (F12)

### 5. Test de Login

1. Login con tus credenciales de Supabase
2. Después de login, abre DevTools (F12) → Console
3. Deberías ver:
   ```
   Supabase Config: {url: '...', hasKey: true}
   📊 Obteniendo métricas de N8N...
   ✅ Métricas obtenidas exitosamente
   ```

### 6. Verificar Funcionalidades

- ✅ Dashboard Ejecutivo: Muestra KPIs
- ✅ Pipeline View: Kanban con deals
- ✅ Contactos: Lista y búsqueda funcionan
- ✅ Hot Leads: Detección automática
- ✅ Chat IA: Claude responde (si está configurado)
- ✅ Automations: Sugerencias de follow-up

---

## 🔧 COMANDOS ÚTILES

```bash
# Ver logs en tiempo real
docker logs -f selvadentro-dashboard

# Restart contenedor
docker restart selvadentro-dashboard

# Stop/Start
docker stop selvadentro-dashboard
docker start selvadentro-dashboard

# Eliminar y recrear
docker stop selvadentro-dashboard
docker rm selvadentro-dashboard
./deploy.sh
docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest

# Ver uso de recursos
docker stats selvadentro-dashboard

# Acceder al contenedor (debugging)
docker exec -it selvadentro-dashboard sh

# Ver logs de nginx (dentro del contenedor)
docker exec selvadentro-dashboard tail -f /var/log/nginx/access.log
```

---

## 🐛 TROUBLESHOOTING

### Problema: Dashboard no carga

**Solución**:
```bash
# 1. Verificar que el contenedor está corriendo
docker ps

# 2. Ver logs
docker logs selvadentro-dashboard

# 3. Verificar puerto
netstat -tulpn | grep 8080
```

### Problema: Error de CORS con N8N

**Síntoma**: En consola ves `CORS policy blocked`

**Solución**:
1. Ve a EasyPanel → N8N → Environment Variables
2. Agrega:
   ```
   N8N_WEBHOOK_ALLOW_ORIGIN=http://31.97.145.53:8080
   ```
   O tu URL real del dashboard
3. Reinicia N8N

### Problema: Login falla

**Solución**:
```bash
# 1. Verificar que Supabase está configurado
curl https://qcvioktwdqcnizvqzekm.supabase.co/rest/v1/

# 2. Verificar variables en el build
docker exec selvadentro-dashboard env | grep VITE_

# 3. Si las variables están mal, rebuild
docker stop selvadentro-dashboard
docker rm selvadentro-dashboard
rm -rf dist/
npm run build
./deploy.sh
```

### Problema: N8N no responde

**Solución**:
```bash
# Test de endpoints
./TEST_N8N_ENDPOINTS.sh

# Si falla alguno:
# 1. Verificar que N8N está activo
# 2. Verificar workflows en N8N UI
# 3. Revisar credenciales GHL en workflows
```

---

## 📊 INFORMACIÓN DEL BUILD

**Archivos Generados**:
- `dist/index.html` - 1.11 KB (0.52 KB gzip)
- `dist/assets/index-CEHR3aw7.js` - 428.61 KB (115.60 KB gzip)
- `dist/assets/index-BFC926SS.css` - 34.54 KB (6.46 KB gzip)

**Características**:
- ✅ React 18 + TypeScript
- ✅ PWA con Service Worker
- ✅ Optimizado para producción
- ✅ Gzip compression habilitado
- ✅ Cache de assets (1 año)
- ✅ SPA routing configurado

**Compatibilidad**:
- ✅ Chrome 120+
- ✅ Firefox 121+
- ✅ Safari 17+
- ✅ Edge 120+

---

## 📁 ESTRUCTURA DEL PROYECTO

```
selvadentrovibes_dash/
├── dist/                          # ✅ Build de producción
├── src/                           # Código fuente
│   ├── components/               # 26 componentes React
│   └── lib/                      # Servicios híbridos N8N
├── n8n-workflows/                # 7 workflows N8N
├── Dockerfile                    # ✅ Con variables N8N
├── nginx.conf                    # ✅ Configuración optimizada
├── deploy.sh                     # ✅ Script automatizado
├── .env                          # ✅ Configuración local (no en git)
├── .env.production.example       # ✅ Template con credenciales
├── QUICK_DEPLOY.md               # Guía rápida
├── DEPLOYMENT_GUIDE.md           # Guía completa
├── INTEGRACION_N8N_COMPLETADA.md # Documentación técnica
└── DEPLOYMENT_READY.md           # Este archivo
```

---

## 🎯 PRÓXIMO PASO

Elige tu método de deployment y ejecuta:

### Testing Local (Más Rápido)
```bash
./deploy.sh
docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest
```

### Producción en EasyPanel (Recomendado)
```bash
git push origin doc_n8n
# Luego configurar en EasyPanel UI
```

### VPS Manual
```bash
ssh user@31.97.145.53
# Seguir pasos en "Opción 3" arriba
```

---

## 🎉 ¡ESTÁS LISTO!

Tu Selvadentro Dashboard tiene:
- ✅ Todas las credenciales configuradas
- ✅ Integración híbrida N8N funcionando
- ✅ Build de producción optimizado
- ✅ Docker configurado
- ✅ Documentación completa
- ✅ Scripts de deployment automatizados

**Solo falta ejecutar el deployment** 🚀

---

## 📞 SOPORTE

**Documentación**:
- Quick Start: `QUICK_DEPLOY.md`
- Guía Completa: `DEPLOYMENT_GUIDE.md`
- Integración N8N: `INTEGRACION_N8N_COMPLETADA.md`

**Testing**:
- Test N8N: `./TEST_N8N_ENDPOINTS.sh`
- Health Check: `curl http://localhost:8080/health`

**Logs**:
- Docker: `docker logs selvadentro-dashboard`
- Nginx: `docker exec selvadentro-dashboard tail -f /var/log/nginx/access.log`

---

**Última actualización**: 2025-11-12
**Commits realizados**: 3
**Branch**: `doc_n8n`
**Status**: ✅ PRODUCTION READY
