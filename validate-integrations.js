#!/usr/bin/env node

/**
 * Script de Validación de Integraciones
 * Dashboard Selvadentro IA
 *
 * Valida:
 * 1. Supabase (Auth + Edge Function)
 * 2. GoHighLevel MCP
 * 3. Claude AI
 */

import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  section: (msg) => console.log(`\n${colors.cyan}${colors.bright}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`)
};

// Variables de entorno
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const GHL_API_KEY = process.env.VITE_GHL_API_KEY;
const GHL_ACCESS_TOKEN = process.env.VITE_GHL_ACCESS_TOKEN;
const GHL_LOCATION_ID = process.env.VITE_GHL_LOCATION_ID;
const ANTHROPIC_API_KEY = process.env.VITE_ANTHROPIC_API_KEY;

// ============================================
// 1. VALIDAR VARIABLES DE ENTORNO
// ============================================
async function validateEnvironmentVariables() {
  log.section('🔧 PASO 1: VALIDANDO VARIABLES DE ENTORNO');

  const vars = [
    { name: 'VITE_SUPABASE_URL', value: SUPABASE_URL },
    { name: 'VITE_SUPABASE_ANON_KEY', value: SUPABASE_ANON_KEY },
    { name: 'VITE_GHL_API_KEY', value: GHL_API_KEY },
    { name: 'VITE_GHL_ACCESS_TOKEN', value: GHL_ACCESS_TOKEN },
    { name: 'VITE_GHL_LOCATION_ID', value: GHL_LOCATION_ID },
    { name: 'VITE_ANTHROPIC_API_KEY', value: ANTHROPIC_API_KEY }
  ];

  let allPresent = true;

  for (const variable of vars) {
    if (variable.value && variable.value.length > 0) {
      log.success(`${variable.name}: Configurada (${variable.value.substring(0, 20)}...)`);
    } else {
      log.error(`${variable.name}: NO CONFIGURADA`);
      allPresent = false;
    }
  }

  if (allPresent) {
    log.success('Todas las variables de entorno están configuradas');
    return true;
  } else {
    log.error('Faltan variables de entorno');
    return false;
  }
}

// ============================================
// 2. VALIDAR SUPABASE
// ============================================
async function validateSupabase() {
  log.section('🗄️  PASO 2: VALIDANDO INTEGRACIÓN CON SUPABASE');

  try {
    // Crear cliente de Supabase
    log.info('Creando cliente de Supabase...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    // Test 1: Verificar conexión básica
    log.info('Test 1: Verificando conexión básica...');
    const { data: health, error: healthError } = await supabase
      .from('_supabase_health')
      .select('*')
      .limit(1);

    if (healthError && !healthError.message.includes('does not exist')) {
      log.warning(`Health check warning: ${healthError.message}`);
    } else {
      log.success('Conexión básica establecida');
    }

    // Test 2: Verificar Edge Function ai-chat
    log.info('Test 2: Verificando Edge Function ai-chat...');

    const { data: edgeData, error: edgeError } = await supabase.functions.invoke('ai-chat', {
      body: {
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 100,
        messages: [
          { role: 'user', content: 'Di "test exitoso" en 2 palabras' }
        ]
      }
    });

    if (edgeError) {
      log.error(`Edge Function error: ${edgeError.message}`);
      log.warning('Verifica que la Edge Function esté desplegada con: supabase functions deploy ai-chat');
      return false;
    }

    if (edgeData && edgeData.content) {
      log.success('Edge Function ai-chat respondió correctamente');
      log.info(`Respuesta: ${JSON.stringify(edgeData.content[0]?.text || edgeData).substring(0, 100)}...`);
    } else {
      log.warning('Edge Function respondió pero sin formato esperado');
      log.info(`Respuesta: ${JSON.stringify(edgeData).substring(0, 200)}...`);
    }

    log.success('✓ Supabase: VALIDACIÓN EXITOSA');
    return true;

  } catch (error) {
    log.error(`Error validando Supabase: ${error.message}`);
    console.error(error);
    return false;
  }
}

// ============================================
// 3. VALIDAR GOHIGHLEVEL MCP
// ============================================
async function validateGoHighLevel() {
  log.section('📊 PASO 3: VALIDANDO INTEGRACIÓN CON GOHIGHLEVEL MCP');

  try {
    const MCP_ENDPOINT = 'https://services.leadconnectorhq.com/mcp/';

    log.info('Configuración GHL:');
    console.log({
      endpoint: MCP_ENDPOINT,
      hasApiKey: !!GHL_API_KEY,
      hasAccessToken: !!GHL_ACCESS_TOKEN,
      locationId: GHL_LOCATION_ID
    });

    // Test 1: Listar contactos
    log.info('Test 1: Intentando obtener contactos...');

    // GoHighLevel MCP usa formato JSON-RPC 2.0
    const response = await fetch(MCP_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json, text/event-stream',
        'Authorization': `Bearer ${GHL_ACCESS_TOKEN}`,
        'X-API-Key': GHL_API_KEY,
        'locationId': GHL_LOCATION_ID
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'contacts_get-contacts',
        params: {
          locationId: GHL_LOCATION_ID,
          limit: 5
        }
      })
    });

    log.info(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      log.error(`Error ${response.status}: ${errorText}`);

      if (response.status === 401) {
        log.warning('Error de autenticación. Verifica:');
        console.log('  - VITE_GHL_ACCESS_TOKEN es válido');
        console.log('  - VITE_GHL_API_KEY es válido');
      } else if (response.status === 406) {
        log.warning('Error 406: Not Acceptable. Verifica:');
        console.log('  - Que todos los headers estén presentes');
        console.log('  - Formato correcto del body');
      }

      return false;
    }

    const data = await response.json();

    // JSON-RPC 2.0 response format
    if (data.result) {
      const result = data.result;
      const contacts = result.contacts || result;

      log.success(`✓ GoHighLevel MCP: VALIDACIÓN EXITOSA`);

      if (Array.isArray(contacts)) {
        log.info(`Contactos obtenidos: ${contacts.length}`);

        if (contacts.length > 0) {
          log.info('Primer contacto:');
          console.log({
            id: contacts[0].id,
            name: contacts[0].name || contacts[0].firstName + ' ' + contacts[0].lastName,
            email: contacts[0].email
          });
        }
      } else {
        log.info('Respuesta recibida:');
        console.log(JSON.stringify(result, null, 2).substring(0, 300));
      }

      return true;
    } else if (data.error) {
      log.error(`Error de GHL MCP: ${data.error.message}`);
      return false;
    } else {
      log.warning('Respuesta inesperada de GHL MCP:');
      console.log(JSON.stringify(data, null, 2).substring(0, 500));
      return false;
    }

  } catch (error) {
    log.error(`Error validando GoHighLevel: ${error.message}`);
    console.error(error);
    return false;
  }
}

// ============================================
// 4. VALIDAR CLAUDE AI (Directo)
// ============================================
async function validateClaudeAI() {
  log.section('🤖 PASO 4: VALIDANDO INTEGRACIÓN CON CLAUDE AI');

  try {
    log.info('Test: Llamada directa a Anthropic API...');

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 100,
        messages: [
          { role: 'user', content: 'Di "test exitoso" en exactamente 2 palabras' }
        ]
      })
    });

    log.info(`Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      const errorText = await response.text();
      log.error(`Error ${response.status}: ${errorText}`);

      if (response.status === 401) {
        log.warning('API Key inválida o expirada');
      } else if (response.status === 429) {
        log.warning('Rate limit excedido');
      }

      return false;
    }

    const data = await response.json();

    if (data.content && data.content[0]) {
      log.success('✓ Claude AI: VALIDACIÓN EXITOSA');
      log.info(`Respuesta: "${data.content[0].text}"`);
      log.info(`Modelo: ${data.model}`);
      log.info(`Tokens usados: ${data.usage?.input_tokens || 0} in, ${data.usage?.output_tokens || 0} out`);
      return true;
    } else {
      log.warning('Respuesta inesperada de Claude AI:');
      console.log(JSON.stringify(data, null, 2).substring(0, 500));
      return false;
    }

  } catch (error) {
    log.error(`Error validando Claude AI: ${error.message}`);
    console.error(error);
    return false;
  }
}

// ============================================
// MAIN EXECUTION
// ============================================
async function main() {
  console.log(`
${colors.cyan}${colors.bright}
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║        🚀 VALIDACIÓN DE INTEGRACIONES                         ║
║        Dashboard Selvadentro IA                               ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
${colors.reset}
`);

  const results = {
    env: false,
    supabase: false,
    ghl: false,
    claude: false
  };

  try {
    // Paso 1: Variables de entorno
    results.env = await validateEnvironmentVariables();

    if (!results.env) {
      log.error('⛔ No se puede continuar sin las variables de entorno configuradas');
      process.exit(1);
    }

    // Paso 2: Supabase
    results.supabase = await validateSupabase();

    // Paso 3: GoHighLevel
    results.ghl = await validateGoHighLevel();

    // Paso 4: Claude AI
    results.claude = await validateClaudeAI();

    // Resumen final
    log.section('📊 RESUMEN DE VALIDACIÓN');

    console.log(`
Variables de Entorno: ${results.env ? colors.green + '✅ OK' : colors.red + '❌ FAIL'}${colors.reset}
Supabase Integration: ${results.supabase ? colors.green + '✅ OK' : colors.red + '❌ FAIL'}${colors.reset}
GoHighLevel MCP:      ${results.ghl ? colors.green + '✅ OK' : colors.red + '❌ FAIL'}${colors.reset}
Claude AI:            ${results.claude ? colors.green + '✅ OK' : colors.red + '❌ FAIL'}${colors.reset}
    `);

    const allPassed = results.env && results.supabase && results.ghl && results.claude;

    if (allPassed) {
      log.success('🎉 TODAS LAS INTEGRACIONES VALIDADAS EXITOSAMENTE');
      process.exit(0);
    } else {
      log.error('⚠️  ALGUNAS INTEGRACIONES FALLARON');
      log.info('Revisa los logs arriba para más detalles');
      process.exit(1);
    }

  } catch (error) {
    log.error(`Error fatal en validación: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Ejecutar
main();
