# 🔑 CONFIGURACIÓN DE CREDENCIALES EN WORKFLOWS N8N

## ✅ NUEVO MÉTODO - CREDENCIALES EMBEBIDAS

A partir de ahora, **NO necesitas configurar variables de entorno en N8N**. Las credenciales están embebidas directamente en cada workflow usando un nodo "Edit Fields".

---

## 🎯 VENTAJAS DE ESTE MÉTODO

✅ **Más fácil**: No necesitas configurar variables de entorno del sistema
✅ **Portable**: Los workflows funcionan en cualquier instalación de N8N
✅ **Visual**: Puedes ver y editar las credenciales directamente en el workflow
✅ **Rápido**: Solo importa y activa, ya está listo
✅ **Sin errores**: No hay problemas de variables no definidas

---

## 📦 CÓMO FUNCIONAN LOS WORKFLOWS AHORA

Cada workflow (2-7) tiene esta estructura:

```
Trigger (When workflow is called)
    ↓
Edit Fields (Define credenciales)
    ↓
HTTP Request nodes (Usan credenciales de $json)
    ↓
Process Data
```

### Nodo "Edit Fields"

Este nodo define 4 variables en `$json`:

- **GHL_MCP_ENDPOINT**: URL del MCP de GoHighLevel
- **GHL_API_KEY**: Tu API Key de GHL
- **GHL_ACCESS_TOKEN**: Tu Access Token de GHL
- **GHL_LOCATION_ID**: Tu Location ID de GHL

---

## 🔧 CÓMO CAMBIAR LAS CREDENCIALES

Si necesitas actualizar tus credenciales (porque expiraron, o quieres usar otra cuenta):

### Paso 1: Abre el workflow en N8N

1. Ve a N8N → **Workflows**
2. Abre cualquier workflow (ej: "GHL Metrics Processor")

### Paso 2: Edita el nodo "Edit Fields"

1. Click en el nodo **"Edit Fields"** (es el segundo nodo después del trigger)
2. Verás 4 asignaciones:
   - GHL_MCP_ENDPOINT
   - GHL_API_KEY
   - GHL_ACCESS_TOKEN
   - GHL_LOCATION_ID (nota: tiene un espacio antes del nombre)

### Paso 3: Actualiza los valores

Click en cada campo "Value" y actualiza con tus nuevas credenciales:

```
GHL_MCP_ENDPOINT: https://services.leadconnectorhq.com/mcp/
GHL_API_KEY: TU_NUEVO_API_KEY_AQUI
GHL_ACCESS_TOKEN: TU_NUEVO_ACCESS_TOKEN_AQUI
 GHL_LOCATION_ID: TU_LOCATION_ID_AQUI
```

⚠️ **IMPORTANTE**: No cambies el "Name", solo el "Value"

### Paso 4: Guarda y repite

1. Click **Save** en el workflow
2. **Repite este proceso para TODOS los workflows** (2, 3, 4, 5, 6, 7)

---

## 🚀 IMPORTACIÓN SIMPLIFICADA

### Antes (Método antiguo - ya no usar):

1. ❌ Instalar N8N
2. ❌ Configurar variables de entorno del sistema
3. ❌ Reiniciar N8N para que cargue las variables
4. ❌ Importar workflows
5. ❌ Verificar que las variables se cargaron correctamente

### Ahora (Método nuevo - actual):

1. ✅ Instalar N8N
2. ✅ Importar workflows
3. ✅ Activar workflows
4. ✅ **¡Listo! Ya funcionan**

---

## 📋 WORKFLOWS QUE TIENEN CREDENCIALES EMBEBIDAS

| Workflow | Nodo "Edit Fields" | Credenciales |
|----------|-------------------|--------------|
| **1-API-Gateway-Main** | ❌ No necesita | Solo enruta, no hace llamadas HTTP |
| **2-GHL-Metrics-Processor** | ✅ Sí | GHL_MCP_ENDPOINT, GHL_API_KEY, GHL_ACCESS_TOKEN, GHL_LOCATION_ID |
| **3-GHL-HotLeads-Processor** | ✅ Sí | GHL_MCP_ENDPOINT, GHL_API_KEY, GHL_ACCESS_TOKEN, GHL_LOCATION_ID |
| **4-GHL-Pipeline-Processor** | ✅ Sí | GHL_MCP_ENDPOINT, GHL_API_KEY, GHL_ACCESS_TOKEN, GHL_LOCATION_ID |
| **5-GHL-Contacts-Processor** | ✅ Sí | GHL_MCP_ENDPOINT, GHL_API_KEY, GHL_ACCESS_TOKEN, GHL_LOCATION_ID |
| **6-GHL-Contact360-Processor** | ✅ Sí | GHL_MCP_ENDPOINT, GHL_API_KEY, GHL_ACCESS_TOKEN, GHL_LOCATION_ID |
| **7-GHL-FollowUps-Processor** | ✅ Sí | GHL_MCP_ENDPOINT, GHL_API_KEY, GHL_ACCESS_TOKEN, GHL_LOCATION_ID |

---

## 🔒 SEGURIDAD

### ¿Es seguro tener las credenciales en el workflow?

**Sí, es seguro** si:

✅ Tu instalación de N8N tiene autenticación habilitada (usuario/contraseña)
✅ Solo tú y tu equipo tienen acceso a N8N
✅ N8N está en una red privada o protegida con HTTPS
✅ No compartes los archivos JSON de los workflows públicamente

### ¿Qué pasa si quiero más seguridad?

Si prefieres usar el método antiguo con variables de entorno:

1. Edita el nodo "Edit Fields" en cada workflow
2. Cambia los valores hardcodeados por referencias a variables:
   ```
   Value: ={{ $env.GHL_API_KEY }}
   ```
3. Configura las variables de entorno en N8N Settings → Environments

---

## 🛠️ SOLUCIÓN DE PROBLEMAS

### Error: "GHL_API_KEY is not defined"

**Causa**: El nodo "Edit Fields" no se ejecutó o tiene un error

**Solución**:
1. Abre el workflow
2. Verifica que el nodo "Edit Fields" existe
3. Verifica que está conectado después del trigger
4. Ejecuta el workflow manualmente para verificar

---

### Error: "Cannot read property 'GHL_LOCATION_ID' of undefined"

**Causa**: El nombre de la variable tiene un espacio al inicio: `" GHL_LOCATION_ID"`

**Solución**: Usa `$json[' GHL_LOCATION_ID']` (con corchetes y comillas) en lugar de `$json.GHL_LOCATION_ID`

Esto ya está configurado correctamente en los workflows actuales.

---

### Mis credenciales expiraron, ¿cómo actualizo?

1. Ve a GoHighLevel → Settings → API → Regenera tus tokens
2. Copia los nuevos valores
3. En N8N, abre cada workflow (2-7)
4. Edita el nodo "Edit Fields" y pega los nuevos valores
5. Guarda cada workflow

---

## 📝 EJEMPLO DE CONFIGURACIÓN

### Antes de importar:

Los workflows ya tienen estas credenciales de ejemplo:

```javascript
GHL_MCP_ENDPOINT: "https://services.leadconnectorhq.com/mcp/"
GHL_API_KEY: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6ImNyTjJJaEF1T0JBbDdEODMyNHlJIiwidmVyc2lvbiI6MSwiaWF0IjoxNzQ5OTY5Njg5MjkxLCJzdWIiOiJnRFhtNHJJQjZJbjhxa3Q1dXpKWSJ9.HKfmsDYjb30fxRu6n40R39ED-NEuoWYhJjKvGtxjeUg"
GHL_ACCESS_TOKEN: "pit-84d7687f-d43f-4434-9804-c671c669dd0f"
GHL_LOCATION_ID: "crN2IhAuOBAl7D8324yI"
```

**Si estas son tus credenciales**: ¡No hagas nada! Ya están configuradas.

**Si usas otras credenciales**: Edita el nodo "Edit Fields" en cada workflow.

---

## ✅ CHECKLIST DE CONFIGURACIÓN

Usa esta lista después de importar los workflows:

- [ ] Workflows 1-7 importados en N8N
- [ ] Todos los workflows activados (switch ON)
- [ ] ¿Tus credenciales son diferentes a las del ejemplo?
  - [ ] Sí → Edita nodo "Edit Fields" en workflows 2-7
  - [ ] No → No hagas nada
- [ ] Test del endpoint metrics exitoso
- [ ] Sin errores en logs de N8N

---

## 🔄 MIGRACIÓN DESDE MÉTODO ANTIGUO

Si ya tenías los workflows instalados con variables de entorno:

1. **Descarga los nuevos workflows** desde GitHub
2. **Elimina los workflows antiguos** en N8N
3. **Importa los nuevos workflows** (con Edit Fields)
4. **Edita las credenciales** si son diferentes
5. **Activa todos los workflows**
6. **Elimina las variables de entorno** antiguas (ya no se necesitan)

---

## 📞 SOPORTE

Si tienes problemas con la configuración:

1. Verifica que el nodo "Edit Fields" existe y está conectado
2. Verifica que los valores no tengan espacios extra
3. Revisa los logs de N8N: Settings → Execution Logs
4. Ejecuta el workflow manualmente y ve qué nodo falla

---

## 🎉 RESUMEN

### Lo que cambió:

❌ **Antes**: Variables de entorno del sistema (`$env.GHL_API_KEY`)
✅ **Ahora**: Variables en el workflow (`$json.GHL_API_KEY`)

### Por qué es mejor:

- ✅ Más fácil de configurar
- ✅ Más portable entre instalaciones
- ✅ Más visual y fácil de actualizar
- ✅ Sin dependencia del sistema operativo
- ✅ Funciona igual en Docker, npm, y cualquier instalación

---

**¡Disfruta de tus workflows más fáciles de configurar!** 🚀

**Versión actualizada - Noviembre 2025**
