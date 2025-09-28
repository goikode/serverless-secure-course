#!/bin/bash

echo "=== PRUEBA DEL MÓDULO 0: CONFIGURACIÓN DE ENTORNO ==="
echo

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Función para checks
check_command() {
    if command -v $1 &> /dev/null; then
        echo -e "${GREEN}✅ $1 disponible: $(which $1)${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 no encontrado${NC}"
        return 1
    fi
}

echo "1. Verificando herramientas básicas:"
check_command "aws"
check_command "git"
check_command "curl"
echo

echo "2. Verificando configuración AWS CLI:"
if aws sts get-caller-identity &> /dev/null; then
    echo -e "${GREEN}✅ AWS CLI configurado correctamente${NC}"
    aws sts get-caller-identity --query 'Arn' --output text
else
    echo -e "${RED}❌ AWS CLI no configurado o sin permisos${NC}"
    echo "   Ejecuta: aws configure"
fi
echo

echo "3. Verificando acceso a servicios AWS:"
echo -n "   Lambda: "
if aws lambda list-functions --query 'length(Functions)' --output text &> /dev/null; then
    echo -e "${GREEN}✅ Acceso correcto${NC}"
else
    echo -e "${RED}❌ Sin acceso${NC}"
fi

echo -n "   DynamoDB: "
if aws dynamodb list-tables --query 'length(TableNames)' --output text &> /dev/null; then
    echo -e "${GREEN}✅ Acceso correcto${NC}"
else
    echo -e "${RED}❌ Sin acceso${NC}"
fi

echo -n "   API Gateway: "
if aws apigateway get-rest-apis --query 'length(items)' --output text &> /dev/null; then
    echo -e "${GREEN}✅ Acceso correcto${NC}"
else
    echo -e "${RED}❌ Sin acceso${NC}"
fi
echo

echo "4. Verificando repositorio del curso:"
if [ -d "docs" ]; then
    echo -e "${GREEN}✅ Directorio docs encontrado${NC}"
    if [ -f "docs/modulo-0-configuracion-entorno.md" ]; then
        echo -e "${GREEN}✅ Documentación Módulo 0 disponible${NC}"
    else
        echo -e "${RED}❌ Documentación Módulo 0 no encontrada${NC}"
    fi
else
    echo -e "${RED}❌ Directorio docs no encontrado${NC}"
fi
echo

echo "5. Verificando región AWS:"
REGION=$(aws configure get region)
if [ "$REGION" = "eu-west-1" ]; then
    echo -e "${GREEN}✅ Región configurada correctamente: $REGION${NC}"
else
    echo -e "${YELLOW}⚠️  Región: $REGION (recomendado: eu-west-1)${NC}"
fi
echo

echo "=== RESUMEN ==="
echo "Si todos los checks muestran ✅, estás listo para el Módulo 1"
echo "Si hay ❌, revisa la documentación del Módulo 0 para solucionarlos"
echo