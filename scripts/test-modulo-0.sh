#!/usr/bin/env bash
# scripts/test-modulo-0.sh
# Comprueba que el entorno del Módulo 0 está correcto.
# Devuelve 0 si todo OK, >0 si hay fallos.
set +e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

MODULE_BRANCH="modulo-0-configuracion-entorno"

# Preferimos workspace dentro de Cloud9 default: ~/environment/mi-workspace-ssc
if [ -d "$HOME/environment" ]; then
    WORKSPACE="$HOME/environment/mi-workspace-ssc"
else
    # Fallback si no hay carpeta environment (por ejemplo fuera de Cloud9)
    WORKSPACE="$HOME/mi-workspace-ssc"
fi

REPO_DIR="$WORKSPACE/serverless-secure-course"

fail=0

echo "=== PRUEBA DEL MÓDULO 0: CONFIGURACIÓN DE ENTORNO ==="
echo

# 1) Workspace
echo "1) Verificando workspace:"
if [ -d "$WORKSPACE" ]; then
    echo -e "${GREEN}✅ Workspace existe: ${WORKSPACE}${NC}"
else
    echo -e "${YELLOW}⚠️  Workspace no encontrado, se creará: ${WORKSPACE}${NC}"
    mkdir -p "$WORKSPACE" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Workspace creado: ${WORKSPACE}${NC}"
    else
        echo -e "${RED}❌ No se pudo crear el workspace: $WORKSPACE${NC}"
        fail=$((fail+1))
    fi
fi
echo

# Helper: check command
check_command() {
    if command -v "$1" >/dev/null 2>&1; then
        path=$(command -v "$1")
        echo -e "${GREEN}✅ $1 disponible: $path${NC}"
        return 0
    else
        echo -e "${RED}❌ $1 no encontrado${NC}"
        fail=$((fail+1))
        return 1
    fi
}

echo "2) Verificando herramientas básicas:"
check_command aws
check_command git
check_command curl
echo

# 3) AWS CLI configurado
echo "3) Verificando configuración AWS CLI (sts get-caller-identity):"
if command -v aws >/dev/null 2>&1; then
    caller_json=$(aws sts get-caller-identity --output json 2>/dev/null)
    if [ $? -eq 0 ] && [ -n "$caller_json" ]; then
        arn=$(echo "$caller_json" | grep -o '"Arn"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*: "\(.*\)"/\1/' || true)
        account=$(echo "$caller_json" | grep -o '"Account"[[:space:]]*:[[:space:]]*"[0-9]*"' | sed 's/.*: "\(.*\)"/\1/' || true)
        echo -e "${GREEN}✅ AWS CLI configurado. Arn: ${arn:-(no disponible)}${NC}"
        echo -e "${GREEN}   Account: ${account:-(no disponible)}${NC}"
    else
        echo -e "${RED}❌ AWS CLI no configurado o sin permisos para sts:get-caller-identity${NC}"
        echo "   Ejecuta: aws configure"
        fail=$((fail+1))
    fi
else
    echo -e "${RED}❌ aws no disponible, se saltan comprobaciones de AWS${NC}"
    fail=$((fail+1))
fi
echo

# 4) Verificar acceso a servicios AWS (intenta, pero no falla el script si falta permiso)
if command -v aws >/dev/null 2>&1; then
    echo "4) Verificando acceso a servicios AWS (no crítico):"

    lambda_count=$(aws lambda list-functions --query 'length(Functions)' --output text 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✅ Lambda accesible (funciones: ${lambda_count})${NC}"
    else
        echo -e "${YELLOW}   ⚠️  Lambda no accesible o sin permisos${NC}"
    fi

    ddb_count=$(aws dynamodb list-tables --query 'length(TableNames)' --output text 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✅ DynamoDB accesible (tablas: ${ddb_count})${NC}"
    else
        echo -e "${YELLOW}   ⚠️  DynamoDB no accesible o sin permisos${NC}"
    fi

    apigw_count=$(aws apigateway get-rest-apis --query 'length(items)' --output text 2>/dev/null)
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}   ✅ API Gateway (REST) accesible (APIs: ${apigw_count})${NC}"
    else
        apigw_v2_count=$(aws apigatewayv2 get-apis --query 'length(items)' --output text 2>/dev/null)
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}   ✅ API Gateway v2 accesible (APIs: ${apigw_v2_count})${NC}"
        else
            echo -e "${YELLOW}   ⚠️  API Gateway no accesible o sin permisos${NC}"
        fi
    fi
else
    echo -e "${YELLOW}⚠️  Saltando comprobaciones de servicios AWS porque 'aws' no está disponible${NC}"
fi
echo

# 5) Verificar repositorio del curso dentro del workspace y rama del módulo
echo "5) Verificando repositorio del curso en: $REPO_DIR"
if [ -d "$REPO_DIR" ]; then
    echo -e "${GREEN}✅ Repositorio encontrado: $REPO_DIR${NC}"
    cd "$REPO_DIR" || { echo -e "${RED}❌ No se puede acceder al directorio del repo${NC}"; fail=$((fail+1)); }

    # Intentar actualizar remotos (no fatal si falla)
    git fetch --all --prune >/dev/null 2>&1 || true

    # Obtener branch actual
    current_branch=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "(no-detectado)")

    if [ "$current_branch" = "$MODULE_BRANCH" ]; then
        echo -e "${GREEN}✅ Estás en la rama correcta: ${MODULE_BRANCH}${NC}"
    else
        # Comprobar si la rama existe localmente
        if git show-ref --verify --quiet "refs/heads/${MODULE_BRANCH}"; then
            echo -e "${YELLOW}⚠️  La rama '${MODULE_BRANCH}' existe localmente pero no estás en ella (actual: ${current_branch})${NC}"
            echo "   Para cambiarte, ejecuta:"
            echo "     git checkout ${MODULE_BRANCH}"
            fail=$((fail+1))
        # Comprobar rama remota
        elif git ls-remote --heads origin "${MODULE_BRANCH}" | grep -q "${MODULE_BRANCH}"; then
            echo -e "${YELLOW}⚠️  La rama '${MODULE_BRANCH}' existe en el remoto pero no localmente${NC}"
            echo "   Ejecuta para crearla y cambiarte:"
            echo "     git checkout -b ${MODULE_BRANCH} origin/${MODULE_BRANCH}"
            fail=$((fail+1))
        else
            echo -e "${RED}❌ La rama '${MODULE_BRANCH}' NO se encontró (ni local ni remota)${NC}"
            echo "   Comprueba que el repo es correcto y que has hecho 'git fetch --all --prune'"
            fail=$((fail+1))
        fi
    fi
else
    echo -e "${RED}❌ Repositorio no encontrado en el workspace: ${REPO_DIR}${NC}"
    echo "   Clona el repo dentro de tu workspace con:"
    echo "     cd $WORKSPACE"
    echo "     git clone https://github.com/goikode/serverless-secure-course.git"
    echo "   (o usa SSH: git@github.com:goikode/serverless-secure-course.git)"
    fail=$((fail+1))
fi
echo

# 6) Verificar región
echo "6) Verificando región AWS configurada:"
region=$(aws configure get region 2>/dev/null || true)
if [ -z "$region" ]; then
    echo -e "${YELLOW}⚠️  Región no configurada${NC}"
    fail=$((fail+1))
else
    if [ "$region" = "eu-west-1" ]; then
        echo -e "${GREEN}✅ Región configurada correctamente: $region${NC}"
    else
        echo -e "${YELLOW}⚠️  Región configurada: $region (recomendado: eu-west-1)${NC}"
    fi
fi
echo

# Resumen
echo "=== RESUMEN ==="
if [ "$fail" -eq 0 ]; then
    echo -e "${GREEN}🎉 TODO OK. Listo para el Módulo 1${NC}"
else
    echo -e "${RED}❌ Se han detectado $fail puntos a revisar. Revisa lo indicado arriba.${NC}"
fi

exit $fail