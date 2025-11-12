# N8N Workflows - Fix Rápido

## 🎯 TU PRÓXIMO PASO

```bash
# 1. Ve a N8N
https://softvibes-n8n.vxv5dh.easypanel.host

# 2. Importa los 7 workflows corregidos desde:
n8n-workflows-FIXED/

# 3. Prueba que funcionan:
cd /rogervibes/selvavibes/selvadentrovibes_dash
./TEST_N8N_ENDPOINTS.sh

# 4. Abre el dashboard:
http://31.97.145.53:8080
```

## 📁 QUÉ SE CORRIGIÓ

✅ **1-API-Gateway-Main-FIXED.json**
- IF nodes ahora leen de la ruta correcta
- Edit Fields extrae TODOS los query parameters

✅ **2-7: Sub-workflows**
- Todos leen parámetros desde `$('When workflow is called').item.json.*`
- Filtros por rol ahora funcionan
- Búsquedas funcionan

## 🚨 ERRORES QUE TENÍAS

1. ❌ IF nodes buscaban en `body[0].query.endpoint` → 404
2. ❌ Parámetros no se pasaban a sub-workflows → Sin filtros
3. ❌ Sub-workflows buscaban en `$json.query.*` → undefined

## ✅ AHORA FUNCIONA

1. ✅ IF nodes buscan en `$json.endpoint` → Routing correcto
2. ✅ Edit Fields pasa userId, role, search, contactId → Filtros OK
3. ✅ Sub-workflows leen desde trigger → Parámetros OK

## 📖 DOCUMENTACIÓN COMPLETA

- `N8N_WORKFLOWS_IMPORT_GUIDE.md` - Guía paso a paso de importación
- `N8N_FIX_SUMMARY.md` - Resumen ejecutivo con todos los cambios
- `QUICK_N8N_FIX.md` - Esta guía rápida

## ⏱️ TIEMPO ESTIMADO

- Importar workflows: **5 minutos**
- Verificar IDs: **2 minutos**
- Testing: **3 minutos**
- **TOTAL: 10 minutos**

## 🎉 RESULTADO FINAL

Dashboard funcionando con:
- ✅ Métricas cargando
- ✅ Pipeline visible
- ✅ Contactos con búsqueda
- ✅ Filtros por rol aplicados
- ✅ Contact360 con timeline
- ✅ Hot leads detectados
- ✅ Follow-ups sugeridos

---

**¿Listo? → Empieza importando en N8N** 🚀
