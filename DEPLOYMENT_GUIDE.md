# 🚀 Guía de Deployment - Selvadentro Dashboard

**Actualizado**: 2025-11-12
**Con integración N8N completa**

---

## 📋 Pre-requisitos

### 1. Credenciales Requeridas

Asegúrate de tener todas las credenciales necesarias:

**GoHighLevel** (Obligatorio)
- ✅ `VITE_GHL_API_KEY` - Ya configurado
- ✅ `VITE_GHL_ACCESS_TOKEN` - Ya configurado
- ✅ `VITE_GHL_LOCATION_ID` - Ya configurado

**N8N** (Obligatorio)
- ✅ `VITE_N8N_BASE_URL` - `https://softvibes-n8n.vxv5dh.easypanel.host`
- ✅ `VITE_N8N_WEBHOOK_PATH` - `/webhook/selvadentro`
- ✅ `VITE_DASHBOARD_URL` - Tu URL del dashboard

**Supabase** (Opcional - para autenticación)
- ⚠️ `VITE_SUPABASE_URL` - Necesario para login
- ⚠️ `VITE_SUPABASE_ANON_KEY` - Necesario para login

**Anthropic Claude AI** (Opcional - para chat AI)
- ⚠️ `VITE_ANTHROPIC_API_KEY` - Solo si usas chat IA

### 2. Herramientas Instaladas

- Node.js 18+ (para build estático)
- Docker (para deployment con contenedor)
- Git (para control de versiones)

---

## 🎯 Método 1: Docker Build (Recomendado)

### Opción A: Build Local

```bash
# 1. Hacer el script ejecutable
chmod +x deploy.sh

# 2. Ejecutar el script de deployment
./deploy.sh

# 3. Seleccionar opción 1 (Docker build local)

# 4. Correr el contenedor
docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest

# 5. Verificar que está corriendo
docker ps
docker logs selvadentro-dashboard

# 6. Acceder en el navegador
# http://localhost:8080
```

### Opción B: Build Manual con Docker

```bash
# Build de la imagen
docker build \
  --build-arg VITE_SUPABASE_URL="your-supabase-url" \
  --build-arg VITE_SUPABASE_ANON_KEY="your-supabase-key" \
  --build-arg VITE_GHL_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  --build-arg VITE_GHL_ACCESS_TOKEN="pit-84d7687f-d43f-4434-9804-c671c669dd0f" \
  --build-arg VITE_GHL_LOCATION_ID="crN2IhAuOBAl7D8324yI" \
  --build-arg VITE_ANTHROPIC_API_KEY="your-anthropic-key" \
  --build-arg VITE_N8N_BASE_URL="https://softvibes-n8n.vxv5dh.easypanel.host" \
  --build-arg VITE_N8N_WEBHOOK_PATH="/webhook/selvadentro" \
  --build-arg VITE_DASHBOARD_URL="http://31.97.145.53:8080" \
  -t selvadentro-dashboard:latest .

# Run del contenedor
docker run -d -p 8080:80 --name selvadentro-dashboard selvadentro-dashboard:latest
```

---

## 🎯 Método 2: Deploy en EasyPanel

### 1. Configurar App en EasyPanel

1. Accede a tu EasyPanel
2. Crea una nueva aplicación:
   - **Type**: Docker
   - **Source**: Git Repository
   - **Repository**: Tu repositorio de Git
   - **Branch**: `doc_n8n` (o la que uses)

### 2. Configurar Variables de Entorno en EasyPanel

En la sección "Environment Variables", agrega:

```bash
# GoHighLevel
VITE_GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImNyTjJJaEF1T0JBbDdEODMyNHlJIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ5OTY5Njg5MjkxLCJzdWIiOiJnRFhtNHJJQjZJbjhxa3Q1dXpKWSJ9.HKfmsDYjb30fxRu6n40R39ED-NEuoWYhJjKvGtxjeUg
VITE_GHL_ACCESS_TOKEN=pit-84d7687f-d43f-4434-9804-c671c669dd0f
VITE_GHL_LOCATION_ID=crN2IhAuOBAl7D8324yI

# N8N
VITE_N8N_BASE_URL=https://softvibes-n8n.vxv5dh.easypanel.host
VITE_N8N_WEBHOOK_PATH=/webhook/selvadentro
VITE_DASHBOARD_URL=https://tu-dashboard.easypanel.host

# Supabase (opcional)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key

# Anthropic (opcional)
VITE_ANTHROPIC_API_KEY=your-anthropic-key
```

### 3. Configurar Dockerfile en EasyPanel

EasyPanel detectará automáticamente el `Dockerfile` en la raíz del proyecto.

### 4. Deploy

1. Guarda la configuración
2. EasyPanel automáticamente:
   - Clonará el repositorio
   - Ejecutará el build de Docker
   - Desplegará el contenedor
3. Obtendrás una URL como: `https://selvadentro-dashboard.xxxxx.easypanel.host`

---

## 🎯 Método 3: Build Estático (Sin Docker)

Si prefieres servir solo archivos estáticos:

```bash
# 1. Build de producción
npm run build

# 2. Los archivos estarán en dist/
# dist/
# ├── index.html
# ├── assets/
# │   ├── index-DUTnfsTm.js
# │   └── index-BFC926SS.css
# └── ...

# 3. Subir a tu servidor
scp -r dist/* user@server:/var/www/html/

# O usar cualquier servicio de hosting estático:
# - Netlify
# - Vercel
# - Cloudflare Pages
# - AWS S3 + CloudFront
```

### Configuración para Hosting Estático

**Importante**: Necesitarás configurar el servidor para SPA (Single Page Application):

#### Nginx
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

#### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

---

## 🎯 Método 4: Deploy en VPS (Manual)

### 1. Conectar al VPS

```bash
ssh user@31.97.145.53
```

### 2. Instalar Docker (si no está instalado)

```bash
# Instalar Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Verificar instalación
docker --version
```

### 3. Clonar Repositorio

```bash
# Clonar
git clone <tu-repositorio> selvadentro-dashboard
cd selvadentro-dashboard
git checkout doc_n8n

# O actualizar si ya existe
cd selvadentro-dashboard
git pull origin doc_n8n
```

### 4. Crear archivo .env

```bash
nano .env
```

Pega la configuración:
```bash
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-key
VITE_GHL_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImNyTjJJaEF1T0JBbDdEODMyNHlJIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ5OTY5Njg5MjkxLCJzdWIiOiJnRFhtNHJJQjZJbjhxa3Q1dXpKWSJ9.HKfmsDYjb30fxRu6n40R39ED-NEuoWYhJjKvGtxjeUg
VITE_GHL_ACCESS_TOKEN=pit-84d7687f-d43f-4434-9804-c671c669dd0f
VITE_GHL_LOCATION_ID=crN2IhAuOBAl7D8324yI
VITE_ANTHROPIC_API_KEY=your-anthropic-key
VITE_N8N_BASE_URL=https://softvibes-n8n.vxv5dh.easypanel.host
VITE_N8N_WEBHOOK_PATH=/webhook/selvadentro
VITE_DASHBOARD_URL=http://31.97.145.53:8080
```

### 5. Build y Deploy

```bash
# Hacer script ejecutable
chmod +x deploy.sh

# Ejecutar deployment
./deploy.sh

# Seleccionar opción 1 (Docker build)

# Verificar que está corriendo
docker ps
```

### 6. Configurar como Servicio (Opcional)

Para que se inicie automáticamente al reiniciar:

```bash
# Crear servicio systemd
sudo nano /etc/systemd/system/selvadentro-dashboard.service
```

Contenido:
```ini
[Unit]
Description=Selvadentro Dashboard
After=docker.service
Requires=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/user/selvadentro-dashboard
ExecStart=/usr/bin/docker start selvadentro-dashboard
ExecStop=/usr/bin/docker stop selvadentro-dashboard

[Install]
WantedBy=multi-user.target
```

Habilitar:
```bash
sudo systemctl daemon-reload
sudo systemctl enable selvadentro-dashboard
sudo systemctl start selvadentro-dashboard
```

---

## ✅ Verificación Post-Deployment

### 1. Health Check

```bash
# Verificar que el contenedor está corriendo
docker ps | grep selvadentro

# Ver logs
docker logs selvadentro-dashboard

# Health check endpoint
curl http://localhost:8080/health
# Debe retornar: healthy
```

### 2. Verificar N8N Integration

```bash
# Test de endpoint de métricas
curl 'https://softvibes-n8n.vxv5dh.easypanel.host/webhook/selvadentro?endpoint=metrics&userId=test&role=admin'

# Debe retornar JSON con datos
```

### 3. Verificar Dashboard

1. Abre el navegador en tu URL
2. Abre DevTools (F12) → Console
3. Deberías ver logs como:
   ```
   📊 Obteniendo métricas de N8N...
   ✅ Métricas obtenidas exitosamente
   ```
4. Verifica que:
   - Login funciona
   - Dashboard carga datos
   - Métricas se muestran
   - Pipeline funciona
   - Contactos se cargan

---

## 🔧 Troubleshooting

### Error: "Network Error" al llamar N8N

**Problema**: CORS blocking

**Solución**: Configurar CORS en N8N

En EasyPanel → N8N → Variables de entorno:
```bash
N8N_WEBHOOK_ALLOW_ORIGIN=http://31.97.145.53:8080
# O permitir todos (no recomendado en producción):
N8N_WEBHOOK_ALLOW_ORIGIN=*
```

### Error: Variables de entorno no se leen

**Problema**: Las variables VITE_ no están disponibles en tiempo de ejecución

**Causa**: En Vite, las variables se embeden en build time

**Solución**: Rebuild con las variables correctas:
```bash
# Eliminar build anterior
rm -rf dist/

# Rebuild con variables correctas
npm run build
```

### Dashboard muestra página en blanco

**Problema**: Errores de JavaScript

**Solución**:
1. Abre DevTools (F12) → Console
2. Revisa errores
3. Verifica que todas las variables estén configuradas
4. Rebuild si es necesario

### Docker build falla

**Problema**: Falta memoria o errores de npm

**Solución**:
```bash
# Limpiar cache de Docker
docker system prune -a

# Rebuild sin cache
docker build --no-cache -t selvadentro-dashboard:latest .
```

---

## 📊 Monitoreo

### Ver Logs en Tiempo Real

```bash
# Docker logs
docker logs -f selvadentro-dashboard

# Nginx logs (dentro del contenedor)
docker exec selvadentro-dashboard tail -f /var/log/nginx/access.log
docker exec selvadentro-dashboard tail -f /var/log/nginx/error.log
```

### Métricas de Contenedor

```bash
# Stats en tiempo real
docker stats selvadentro-dashboard

# Uso de recursos
docker container inspect selvadentro-dashboard
```

---

## 🔄 Actualización

Para actualizar a una nueva versión:

```bash
# 1. Pull cambios
git pull origin doc_n8n

# 2. Stop contenedor actual
docker stop selvadentro-dashboard
docker rm selvadentro-dashboard

# 3. Rebuild
./deploy.sh

# 4. Verificar
docker ps
curl http://localhost:8080/health
```

---

## 🎉 Deployment Completado

Si todo funcionó correctamente, deberías tener:

- ✅ Dashboard accesible en tu URL
- ✅ Integración N8N funcionando
- ✅ Métricas cargando con cache
- ✅ Pipeline y contactos funcionando
- ✅ Logs sin errores

**¡Felicidades! Tu Selvadentro Dashboard está en producción** 🚀

---

## 📞 Soporte

Si tienes problemas:

1. Revisa los logs: `docker logs selvadentro-dashboard`
2. Verifica N8N: `./TEST_N8N_ENDPOINTS.sh`
3. Revisa las variables de entorno
4. Consulta `INTEGRACION_N8N_COMPLETADA.md`
