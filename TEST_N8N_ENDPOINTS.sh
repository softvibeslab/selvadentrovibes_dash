#!/bin/bash

# 🧪 Script de Testing para Endpoints N8N - Selvadentro
# URLs Personalizadas para tu instalación

# Colores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# URLs configuradas
N8N_URL="https://softvibes-n8n.vxv5dh.easypanel.host"
WEBHOOK_PATH="/webhook/selvadentro"

echo "========================================"
echo "🧪 Testing N8N Endpoints - Selvadentro"
echo "========================================"
echo "N8N URL: $N8N_URL"
echo "Dashboard: http://31.97.145.53:8080/"
echo ""

# Test 1: Metrics Endpoint
echo -e "${YELLOW}📊 Test 1: Metrics Endpoint${NC}"
echo "URL: ${N8N_URL}${WEBHOOK_PATH}?endpoint=metrics&userId=test123&role=admin"
echo ""
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "${N8N_URL}${WEBHOOK_PATH}?endpoint=metrics&userId=test123&role=admin")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ FAILED (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""
echo "========================================"
echo ""

# Test 2: Hot Leads Endpoint
echo -e "${YELLOW}🔥 Test 2: Hot Leads Endpoint${NC}"
echo "URL: ${N8N_URL}${WEBHOOK_PATH}?endpoint=hot-leads&userId=test123&role=admin"
echo ""
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "${N8N_URL}${WEBHOOK_PATH}?endpoint=hot-leads&userId=test123&role=admin")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ FAILED (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""
echo "========================================"
echo ""

# Test 3: Pipeline Endpoint
echo -e "${YELLOW}📈 Test 3: Pipeline Endpoint${NC}"
echo "URL: ${N8N_URL}${WEBHOOK_PATH}?endpoint=pipeline&userId=test123&role=admin"
echo ""
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "${N8N_URL}${WEBHOOK_PATH}?endpoint=pipeline&userId=test123&role=admin")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ FAILED (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""
echo "========================================"
echo ""

# Test 4: Contacts Endpoint
echo -e "${YELLOW}👥 Test 4: Contacts Endpoint${NC}"
echo "URL: ${N8N_URL}${WEBHOOK_PATH}?endpoint=contacts&userId=test123&role=admin"
echo ""
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "${N8N_URL}${WEBHOOK_PATH}?endpoint=contacts&userId=test123&role=admin")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ FAILED (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""
echo "========================================"
echo ""

# Test 5: Contact360 Endpoint
echo -e "${YELLOW}🎯 Test 5: Contact360 Endpoint${NC}"
echo "URL: ${N8N_URL}${WEBHOOK_PATH}?endpoint=contact360&contactId=test123&userId=test123&role=admin"
echo ""
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "${N8N_URL}${WEBHOOK_PATH}?endpoint=contact360&contactId=test123&userId=test123&role=admin")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ FAILED (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""
echo "========================================"
echo ""

# Test 6: Follow-ups Endpoint
echo -e "${YELLOW}📋 Test 6: Follow-ups Endpoint${NC}"
echo "URL: ${N8N_URL}${WEBHOOK_PATH}?endpoint=follow-ups&userId=test123&role=admin"
echo ""
RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "${N8N_URL}${WEBHOOK_PATH}?endpoint=follow-ups&userId=test123&role=admin")
HTTP_CODE=$(echo "$RESPONSE" | grep "HTTP_CODE:" | cut -d':' -f2)
BODY=$(echo "$RESPONSE" | sed '/HTTP_CODE:/d')

if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ SUCCESS (HTTP $HTTP_CODE)${NC}"
    echo "$BODY" | jq '.' 2>/dev/null || echo "$BODY"
else
    echo -e "${RED}❌ FAILED (HTTP $HTTP_CODE)${NC}"
    echo "$BODY"
fi
echo ""
echo "========================================"
echo ""

echo "🎉 Testing completado!"
echo ""
echo "Si todos los tests devuelven HTTP 200 y JSON válido, tu N8N está funcionando correctamente."
echo ""
