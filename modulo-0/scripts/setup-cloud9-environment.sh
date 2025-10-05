#!/usr/bin/env bash
# setup-cloud9-environment.sh
# Script de configuración inicial del entorno Cloud9
# Actualiza Node.js y configura herramientas necesarias para el curso

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}=== CONFIGURACIÓN INICIAL DEL ENTORNO CLOUD9 ===${NC}"
echo

# 1. Actualizar Node.js a versión LTS (20.x)
echo -e "${YELLOW}1) Actualizando Node.js a v20 LTS...${NC}"
CURRENT_NODE=$(node --version 2>/dev/null || echo "none")
echo "   Versión actual: $CURRENT_NODE"

# Descargar e instalar Node.js 20.x
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash - 2>&1 | grep -v "^## " || true
sudo yum install -y nodejs >/dev/null 2>&1

NEW_NODE=$(node --version)
echo -e "   ${GREEN}✅ Node.js actualizado: $NEW_NODE${NC}"
echo

# 2. Actualizar npm a última versión
echo -e "${YELLOW}2) Actualizando npm...${NC}"
sudo npm install -g npm@latest >/dev/null 2>&1
NPM_VERSION=$(npm --version)
echo -e "   ${GREEN}✅ npm actualizado: v$NPM_VERSION${NC}"
echo

# 3. Instalar SAM CLI si no está presente
echo -e "${YELLOW}3) Verificando AWS SAM CLI...${NC}"
if command -v sam >/dev/null 2>&1; then
    SAM_VERSION=$(sam --version | head -1)
    echo -e "   ${GREEN}✅ SAM CLI ya instalado: $SAM_VERSION${NC}"
else
    echo "   Instalando AWS SAM CLI..."
    # Descargar e instalar SAM CLI
    cd /tmp
    wget -q https://github.com/aws/aws-sam-cli/releases/latest/download/aws-sam-cli-linux-x86_64.zip
    unzip -q aws-sam-cli-linux-x86_64.zip -d sam-installation
    sudo ./sam-installation/install >/dev/null 2>&1
    rm -rf sam-installation aws-sam-cli-linux-x86_64.zip
    cd - >/dev/null
    echo -e "   ${GREEN}✅ SAM CLI instalado: $(sam --version | head -1)${NC}"
fi
echo

# 4. Verificar AWS CLI
echo -e "${YELLOW}4) Verificando AWS CLI...${NC}"
if command -v aws >/dev/null 2>&1; then
    AWS_VERSION=$(aws --version 2>&1)
    echo -e "   ${GREEN}✅ AWS CLI disponible: $AWS_VERSION${NC}"
else
    echo -e "   ${RED}❌ AWS CLI no encontrado${NC}"
fi
echo

# 5. Configurar Git con valores por defecto
echo -e "${YELLOW}5) Configurando Git...${NC}"
if ! git config --global user.name >/dev/null 2>&1; then
    git config --global user.name "SSC Student"
    echo -e "   ${GREEN}✅ Git user.name configurado${NC}"
else
    echo -e "   ${GREEN}✅ Git user.name ya configurado: $(git config --global user.name)${NC}"
fi

if ! git config --global user.email >/dev/null 2>&1; then
    git config --global user.email "student@serverless-secure-course.local"
    echo -e "   ${GREEN}✅ Git user.email configurado${NC}"
else
    echo -e "   ${GREEN}✅ Git user.email ya configurado: $(git config --global user.email)${NC}"
fi
echo

# 6. Resumen final
echo -e "${BLUE}=== RESUMEN DE CONFIGURACIÓN ===${NC}"
echo "Node.js: $(node --version)"
echo "npm: v$(npm --version)"
echo "AWS CLI: $(aws --version 2>&1 | cut -d' ' -f1)"
if command -v sam >/dev/null 2>&1; then
    echo "SAM CLI: $(sam --version 2>&1 | head -1)"
fi
echo "Git: $(git --version)"
echo
echo -e "${GREEN}✅ Entorno configurado correctamente${NC}"
echo -e "${YELLOW}⚠️  Es recomendable cerrar y volver a abrir el terminal para que todos los cambios tengan efecto${NC}"
echo
