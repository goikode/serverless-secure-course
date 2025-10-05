# Módulo 1 - Ejemplo SAM: Catálogo de Vinilos

Este directorio contiene la **migración completa** de los ejemplos de consola a **Infrastructure as Code** usando **AWS SAM** (Serverless Application Model).

## 🎯 Arquitectura

```
┌─────────────┐
│   Cliente   │
│ (curl/web)  │
└──────┬──────┘
       │ HTTP GET
       ↓
┌─────────────────┐
│  API Gateway    │
│ (HTTP API)      │
│ GET /vinilos    │
└────────┬────────┘
         │ invoke
         ↓
┌──────────────────┐      ┌─────────────────┐
│  Lambda          │─────→│   DynamoDB      │
│ get-vinilos      │ scan │ {prefijo}-      │
│                  │      │ vinilos         │
└──────────┬───────┘      └─────────────────┘
           │
           │ read URLs
           ↓
    ┌──────────────┐
    │      S3      │
    │  Imágenes    │
    │  (público)   │
    └──────────────┘
```

## 📁 Estructura del Proyecto

```
sam-example/
├── template.yaml                   # SAM template (IaC)
├── samconfig.toml                  # SAM configuration
├── src/
│   └── handlers/
│       └── get-vinilos/
│           ├── index.js            # Lambda handler
│           └── package.json        # Dependencies
├── scripts/
│   ├── seed-dynamodb.js           # Script para poblar DynamoDB
│   └── upload-images.sh           # Script para subir imágenes a S3
├── .gitignore
└── README.md                       # Este archivo
```

## 🚀 Despliegue Rápido

### Prerequisitos

- **AWS SAM CLI** instalado
- **Node.js 20.x** instalado
- **AWS CLI** configurado con credenciales
- **Tu prefijo de estudiante** (ej: `juan-perez-a7b3f`)

### Paso 1: Instalar Dependencias

```bash
cd src/handlers/get-vinilos
npm install
cd ../../..
```

### Paso 2: Configurar tu Prefijo

Edita `samconfig.toml` y reemplaza los valores:

```toml
stack_name = "{tu-prefijo}-vinilos-stack"
s3_bucket = "{tu-deployment-bucket}"
s3_prefix = "{tu-prefijo}-vinilos"
parameter_overrides = "StudentPrefix={tu-prefijo}"
```

**Ejemplo**:
```toml
stack_name = "juan-perez-a7b3f-vinilos-stack"
s3_bucket = "juan-perez-a7b3f-sam-deployments"
s3_prefix = "juan-perez-a7b3f-vinilos"
parameter_overrides = "StudentPrefix=juan-perez-a7b3f"
```

### Paso 3: Crear Bucket de Despliegue

SAM necesita un bucket S3 para almacenar artefactos:

```bash
aws s3 mb s3://{tu-prefijo}-sam-deployments --region eu-west-1
```

### Paso 4: Build y Deploy

```bash
# Build (empaqueta el código)
sam build

# Deploy (despliega infraestructura)
sam deploy --guided
```

Durante el deploy interactivo:
- **Stack Name**: Confirma el nombre del stack
- **AWS Region**: `eu-west-1`
- **Parameter StudentPrefix**: Confirma tu prefijo
- **Confirm changes before deploy**: `Y` (primera vez)
- **Allow SAM CLI IAM role creation**: `Y`
- **Disable rollback**: `N`
- **Save arguments to configuration file**: `Y`

⏱️ El despliegue tarda ~2-3 minutos.

### Paso 5: Obtener la URL de la API

Después del deploy, SAM mostrará:

```
Outputs
------------------------------------------------------------------------
Key                 VinilosApiUrl
Description         API Gateway endpoint URL for Vinyl catalog
Value               https://xxxxx.execute-api.eu-west-1.amazonaws.com/vinilos
```

📋 **Copia esta URL** para probar la API.

### Paso 6: Poblar DynamoDB

```bash
# Obtén el nombre de la tabla
TABLE_NAME=$(aws cloudformation describe-stacks \
    --stack-name {tu-prefijo}-vinilos-stack \
    --query 'Stacks[0].Outputs[?OutputKey==`VinilosTableName`].OutputValue' \
    --output text)

# Ejecuta el script de seed
cd scripts
npm install
node seed-dynamodb.js "$TABLE_NAME"
```

### Paso 7: Subir Imágenes a S3

```bash
# Obtén el nombre del bucket
BUCKET_NAME=$(aws cloudformation describe-stacks \
    --stack-name {tu-prefijo}-vinilos-stack \
    --query 'Stacks[0].Outputs[?OutputKey==`VinilosImagesBucketName`].OutputValue' \
    --output text)

# Sube imágenes
./upload-images.sh "$BUCKET_NAME"
```

### Paso 8: Probar la API

```bash
# Con curl
curl https://xxxxx.execute-api.eu-west-1.amazonaws.com/vinilos

# O abre en navegador
open https://xxxxx.execute-api.eu-west-1.amazonaws.com/vinilos
```

✅ Deberías ver el catálogo de 5 vinilos con imágenes!

---

## 🔧 Comandos SAM Útiles

### Ver Logs en Tiempo Real

```bash
sam logs -n GetVinilosFunction --stack-name {tu-prefijo}-vinilos-stack --tail
```

### Invocar Lambda Localmente

```bash
sam local invoke GetVinilosFunction
```

### Correr API Localmente

```bash
sam local start-api
```

Luego accede a: `http://127.0.0.1:3000/vinilos`

### Ver Outputs del Stack

```bash
aws cloudformation describe-stacks \
    --stack-name {tu-prefijo}-vinilos-stack \
    --query 'Stacks[0].Outputs' \
    --output table
```

### Actualizar Stack (después de cambios)

```bash
sam build
sam deploy
```

### Eliminar Stack Completo

```bash
sam delete --stack-name {tu-prefijo}-vinilos-stack
```

**⚠️ Esto eliminará todos los recursos**: Lambda, API Gateway, DynamoDB, S3, IAM roles.

---

## 📋 Recursos Creados

| Recurso | Nombre | Tipo |
|---------|--------|------|
| Lambda | `{prefijo}-get-vinilos` | Node.js 20.x, 128MB |
| API Gateway | `{prefijo}-vinilos-api` | HTTP API |
| DynamoDB | `{prefijo}-vinilos` | PAY_PER_REQUEST |
| S3 Bucket | `{prefijo}-vinilos-imagenes` | Public read |
| CloudFormation Stack | `{prefijo}-vinilos-stack` | - |
| IAM Role | `{prefijo}-vinilos-stack-GetVinilosFunction-xxx` | Auto-created |

---

## 🎓 Comparación: Consola vs SAM

| Aspecto | Consola AWS | SAM (IaC) |
|---------|-------------|-----------|
| **Tiempo despliegue inicial** | 70 min (manual) | 5 min (automatizado) |
| **Reproducibilidad** | ❌ Manual cada vez | ✅ `sam deploy` |
| **Version control** | ❌ No versionable | ✅ Git-friendly |
| **Rollback** | ❌ Manual | ✅ Automático |
| **Documentación** | ❌ Capturas/notas | ✅ Template como código |
| **CI/CD** | ❌ No automatizable | ✅ Pipeline-ready |
| **Multi-entorno** | ❌ Recrear todo | ✅ Parametrizable |
| **Permisos IAM** | 🟡 Manual | ✅ SAM Policy Templates |

---

## 📚 Próximos Pasos

1. **Añadir POST /vinilos** - Crear nuevo vinilo
2. **Añadir GET /vinilos/{id}** - Obtener vinilo por ID
3. **Añadir validación de entrada** - Evitar datos inválidos
4. **Añadir autenticación** - Proteger API con Cognito
5. **Añadir logging estructurado** - Mejorar observabilidad

Estos pasos se cubrirán en las siguientes secciones del módulo.

---

## 🐛 Troubleshooting

### Error: "Unable to upload artifact... Access Denied"

**Solución**: Verifica que el bucket S3 de despliegue exista y tengas permisos.

```bash
aws s3 ls s3://{tu-prefijo}-sam-deployments
```

### Error: "Stack {name} already exists"

**Solución**: El stack ya fue desplegado. Usa `sam deploy` sin `--guided` para actualizar.

### Error: "Parameter validation failed: Unknown parameter..."

**Solución**: Verifica que `StudentPrefix` en `samconfig.toml` tenga el formato correcto: `nombre-apellido-xxxxx`

### Lambda devuelve error 500

**Solución**: Ver logs:
```bash
sam logs -n GetVinilosFunction --stack-name {tu-prefijo}-vinilos-stack
```

### DynamoDB vacía (sin datos)

**Solución**: Ejecuta el script de seed:
```bash
node scripts/seed-dynamodb.js {tabla-name}
```

---

## 📖 Referencias

- [AWS SAM Documentation](https://docs.aws.amazon.com/serverless-application-model/)
- [SAM CLI Reference](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-command-reference.html)
- [AWS Lambda Node.js Runtime](https://docs.aws.amazon.com/lambda/latest/dg/lambda-nodejs.html)
- [DynamoDB SDK for JavaScript v3](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-dynamodb/)
