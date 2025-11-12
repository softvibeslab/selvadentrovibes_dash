# 🚀 Quick Deploy - Selvadentro Dashboard

**Tiempo estimado**: 5-10 minutos

---

## ✅ Pre-requisitos Completados

- ✅ N8N workflows activos
- ✅ Variables de entorno configuradas
- ✅ Build de producción exitoso
- ✅ Integración híbrida N8N implementada

---

## 🎯 Método Rápido: Docker

### 1. Ejecutar el Script de Deployment

```bash
# Hacer ejecutable (solo primera vez)
chmod +x deploy.sh

# Ejecutar
./deploy.sh

# Seleccionar opción 1 (Docker build local)
```

### 2. Iniciar el Contenedor

```bash
# Opción A: Puerto 8080 (recomendado)
docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest

# Opción B: Puerto 80 (requiere permisos)
docker run -d -p 80:80 --name selvadentro-dashboard selvadentro-dashboard:latest

# Opción C: Puerto personalizado
docker run -d -p 3000:80 --name selvadentro-dashboard selvadentro-dashboard:latest
```

### 3. Verificar

```bash
# Ver logs
docker logs selvadentro-dashboard

# Health check
curl http://localhost:8080/health
# Debe retornar: healthy

# Abrir en navegador
# http://localhost:8080
```

---

## 🎯 Alternativa: Deploy en EasyPanel

### Configuración en EasyPanel

1. **Crear nueva App**:
   - Type: Docker
   - Source: Git Repository
   - Branch: `doc_n8n`

2. **Variables de Entorno** (copiar de `.env.production.example`):
   ```bash
   VITE_SUPABASE_URL=https://qcvioktwdqcnizvqzekm.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjdmlva3R3ZHFjbml6dnF6ZWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1NjA1OTMsImV4cCI6MjA3ODEzNjU5M30.3qNMsVxCGX8mRkgtz7a1Kilx9CWju6P7VobbPpzy9F8
   VITE_GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImNyTjJJaEF1T0JBbDdEODMyNHlJIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ5OTY5Njg5MjkxLCJzdWIiOiJnRFhtNHJJQjZJbjhxa3Q1dXpKWSJ9.HKfmsDYjb30fxRu6n40R39ED-NEuoWYhJjKvGtxjeUg
   VITE_GHL_ACCESS_TOKEN=pit-84d7687f-d43f-4434-9804-c671c669dd0f
   VITE_GHL_LOCATION_ID=crN2IhAuOBAl7D8324yI
   VITE_N8N_BASE_URL=https://softvibes-n8n.vxv5dh.easypanel.host
   VITE_N8N_WEBHOOK_PATH=/webhook/selvadentro
   VITE_DASHBOARD_URL=https://tu-app.easypanel.host
   ```

3. **Deploy**:
   - EasyPanel detectará el Dockerfile automáticamente
   - Build y deploy se harán automáticamente
   - Recibirás una URL como: `https://selvadentro.xxxxx.easypanel.host`

---

## 🎯 Alternativa: Deploy Manual en VPS

### Si estás en un VPS (como 31.97.145.53)

```bash
# 1. Conectar al VPS
ssh user@31.97.145.53

# 2. Clonar o actualizar repositorio
git clone <repo-url> selvadentro-dashboard
cd selvadentro-dashboard
git checkout doc_n8n

# 3. Copiar variables de entorno
cp .env.production.example .env
# Editar si necesitas cambiar algo

# 4. Build con Docker
chmod +x deploy.sh
./deploy.sh
# Seleccionar opción 1

# 5. Iniciar contenedor
docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest

# 6. Verificar
docker ps
curl http://localhost:8080/health
```

---

## ✅ Verificación Post-Deployment

### 1. Verificar Contenedor
```bash
docker ps | grep selvadentro
# Debe mostrar el contenedor corriendo
```

### 2. Verificar Logs
```bash
docker logs selvadentro-dashboard
# No debe haber errores
```

### 3. Verificar Dashboard
Abre en el navegador: `http://tu-ip:8080`

Deberías ver:
- ✅ Página de login
- ✅ Sin errores en consola (F12)
- ✅ Assets cargando correctamente

### 4. Test de Login
1. Intenta hacer login con tus credenciales de Supabase
2. Si funciona → ¡Deployment exitoso! 🎉

### 5. Verificar N8N Integration
Después de login, abre DevTools (F12) → Console

Deberías ver:
```
📊 Obteniendo métricas de N8N...
✅ Métricas obtenidas exitosamente
```

---

## 🔧 Comandos Útiles

```bash
# Ver logs en tiempo real
docker logs -f selvadentro-dashboard

# Restart contenedor
docker restart selvadentro-dashboard

# Stop contenedor
docker stop selvadentro-dashboard

# Eliminar contenedor
docker stop selvadentro-dashboard
docker rm selvadentro-dashboard

# Rebuild después de cambios
docker stop selvadentro-dashboard
docker rm selvadentro-dashboard
./deploy.sh
docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest
```

---

## 🔄 Actualización

Para actualizar a una nueva versión:

```bash
# 1. Pull cambios
git pull origin doc_n8n

# 2. Rebuild
docker stop selvadentro-dashboard
docker rm selvadentro-dashboard
./deploy.sh

# 3. Restart
docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest
```

---

## 🐛 Troubleshooting Rápido

### Dashboard no carga
```bash
# Ver logs
docker logs selvadentro-dashboard

# Verificar que está corriendo
docker ps

# Verificar puerto
netstat -tulpn | grep 8080
```

### Error: "Cannot connect to N8N"
```bash
# Test de endpoint N8N
curl 'https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=metrics&userId=test&role=admin'

# Si falla → Verificar que N8N está activo
```

### Error: CORS
Si ves errores de CORS en la consola:

1. Ve a EasyPanel → N8N
2. Agrega variable de entorno:
   ```
   N8N_WEBHOOK_ALLOW_ORIGIN=http://31.97.145.53:8080
   ```
3. Reinicia N8N

---

## 🎉 ¡Listo!

Si todo funciona:
- ✅ Dashboard accesible
- ✅ Login funciona
- ✅ Datos de N8N se cargan
- ✅ Sin errores en consola

**¡Tu Selvadentro Dashboard está en producción!** 🚀

---

## 📚 Documentación Completa

- **Deployment completo**: `DEPLOYMENT_GUIDE.md`
- **Integración N8N**: `INTEGRACION_N8N_COMPLETADA.md`
- **Variables de entorno**: `.env.production.example`
- **Testing N8N**: `TEST_N8N_ENDPOINTS.sh`
