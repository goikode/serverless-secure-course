#!/bin/bash
##
# Upload Vinyl Cover Images to S3
#
# This script uploads placeholder vinyl cover images to the S3 bucket
#
# Usage:
#   ./scripts/upload-images.sh <bucket-name>
#
# Example:
#   ./scripts/upload-images.sh juan-perez-a7b3f-vinilos-imagenes
##

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

BUCKET_NAME="$1"

if [ -z "$BUCKET_NAME" ]; then
    echo -e "${RED}❌ Error: Debes proporcionar el nombre del bucket${NC}"
    echo ""
    echo "Uso: ./scripts/upload-images.sh <bucket-name>"
    echo ""
    echo "Ejemplo: ./scripts/upload-images.sh juan-perez-a7b3f-vinilos-imagenes"
    exit 1
fi

echo -e "${BLUE}📦 Subiendo imágenes a S3...${NC}"
echo -e "${BLUE}🪣 Bucket: ${BUCKET_NAME}${NC}"
echo ""

# Array of image files (these should match imagen_key in DynamoDB seed data)
IMAGES=(
    "abbey-road.jpg"
    "dark-side.jpg"
    "thriller.jpg"
    "leonard-cohen.jpg"
    "jj-cale.jpg"
)

# Check if sample-images directory exists
if [ ! -d "sample-images" ]; then
    echo -e "${YELLOW}⚠️  Directorio 'sample-images' no encontrado${NC}"
    echo -e "${YELLOW}📁 Creando directorio con imágenes placeholder...${NC}"
    mkdir -p sample-images

    # Create placeholder text files (in real scenario, these would be actual images)
    for img in "${IMAGES[@]}"; do
        echo "Placeholder image: $img" > "sample-images/$img"
        echo -e "${GREEN}✅ Creado placeholder: $img${NC}"
    done
    echo ""
fi

# Upload images to S3
SUCCESS_COUNT=0
ERROR_COUNT=0

for img in "${IMAGES[@]}"; do
    if [ -f "sample-images/$img" ]; then
        echo -e "${BLUE}⬆️  Subiendo: $img${NC}"

        if aws s3 cp "sample-images/$img" "s3://$BUCKET_NAME/$img" --region eu-west-1; then
            echo -e "${GREEN}✅ Subido: $img${NC}"
            ((SUCCESS_COUNT++))
        else
            echo -e "${RED}❌ Error al subir: $img${NC}"
            ((ERROR_COUNT++))
        fi
    else
        echo -e "${YELLOW}⚠️  No encontrado: sample-images/$img${NC}"
        ((ERROR_COUNT++))
    fi
done

echo ""
echo -e "${BLUE}📊 Resumen:${NC}"
echo -e "  ${GREEN}✅ Subidas: $SUCCESS_COUNT${NC}"
echo -e "  ${RED}❌ Errores: $ERROR_COUNT${NC}"
echo ""

if [ $ERROR_COUNT -eq 0 ]; then
    echo -e "${GREEN}🎉 Imágenes subidas exitosamente!${NC}"
    echo ""
    echo -e "${BLUE}🔗 URL base de imágenes:${NC}"
    echo "https://$BUCKET_NAME.s3.eu-west-1.amazonaws.com/"
else
    echo -e "${YELLOW}⚠️  Carga completada con errores${NC}"
    exit 1
fi
