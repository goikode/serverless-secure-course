# SAM Example - Base (GET Endpoint)
## Tu Primera Aplicación con Infrastructure as Code

---

## 🎯 Qué Vas a Aprender

En este ejercicio vas a **desplegar una aplicación serverless completa usando AWS SAM**, sin tocar la consola de AWS. Todo se hará con comandos y código.

**Resultado final**:
- ✅ API REST funcionando (GET /vinilos)
- ✅ Lambda leyendo de DynamoDB
- ✅ Bucket S3 con imágenes públicas
- ✅ Todo desplegado en ~3 minutos

---

## 📋 Prerequisitos

Verifica que tienes instalado:

```bash
# SAM CLI
sam --version
# SAM CLI, version 1.120.0 o superior

# AWS CLI
aws --version
# aws-cli/2.x.x o superior

# Node.js
node --version
# v20.x.x o superior

# Credenciales AWS configuradas
aws sts get-caller-identity
# Debe devolver tu AccountId sin errores
```

Si falta algo, consulta la documentación de setup.

---

## 🚀 Paso 1: Obtener el Código

Clona el repositorio y haz checkout de esta rama:

```bash
cd ~
git clone https://github.com/goikode/serverless-secure-course-workspace.git
cd serverless-secure-course-workspace
git checkout modulo-1-sam-base
cd applications/modulo-1-functional/sam-example
```

---

## 🔧 Paso 2: Configurar Tu Prefijo

### 2.1 Crear samconfig.toml

Copia el archivo de ejemplo:

```bash
cp samconfig.toml.example samconfig.toml
```

### 2.2 Editar samconfig.toml

Abre el archivo con tu editor favorito:

```bash
nano samconfig.toml
# O usa: code samconfig.toml, vim samconfig.toml, etc.
```

**Reemplaza** los valores `REPLACE-WITH-*`:

```toml
stack_name = "{tu-prefijo}-vinilos-stack"
s3_bucket = "{tu-prefijo}-sam-deploy"
s3_prefix = "{tu-prefijo}-vinilos"
parameter_overrides = "StudentPrefix={tu-prefijo}"
```

**Ejemplo** con prefijo `juan-perez-a7b3f`:

```toml
stack_name = "juan-perez-a7b3f-vinilos-stack"
s3_bucket = "juan-perez-a7b3f-sam-deploy"
s3_prefix = "juan-perez-a7b3f-vinilos"
parameter_overrides = "StudentPrefix=juan-perez-a7b3f"
```

**Guarda el archivo** (Ctrl+O, Enter, Ctrl+X en nano).

---

## 📦 Paso 3: Crear Bucket de Despliegue

SAM necesita un bucket S3 para almacenar artefactos. Créalo con este comando (reemplaza `{tu-prefijo}`):

```bash
aws s3 mb s3://{tu-prefijo}-sam-deploy --region eu-west-1
```

**Ejemplo**:
```bash
aws s3 mb s3://juan-perez-a7b3f-sam-deploy --region eu-west-1
```

**Output esperado**:
```
make_bucket: juan-perez-a7b3f-sam-deploy
```

---

## 🔨 Paso 4: Instalar Dependencias del Handler

El handler de Lambda usa AWS SDK para DynamoDB. Instala las dependencias:

```bash
cd src/handlers/get-vinilos
npm install
cd ../../..
```

**Output esperado**:
```
added 15 packages in 2s
```

---

## 🏗️ Paso 5: Build - Empaquetar la Aplicación

El comando `sam build` empaqueta tu código y dependencias:

```bash
sam build
```

**Output esperado**:
```
Building codeuri: /path/to/src/handlers/get-vinilos runtime: nodejs20.x
Running NodejsNpmBuilder:NpmPack
...

Build Succeeded

Built Artifacts  : .aws-sam/build
Built Template   : .aws-sam/build/template.yaml
```

⏱️ **Tiempo**: 10-15 segundos

**¿Qué hace `sam build`?**
- Lee `template.yaml`
- Copia código de handlers
- Ejecuta `npm install` en cada función
- Genera estructura optimizada en `.aws-sam/build/`

---

## 🚀 Paso 6: Deploy - Desplegar a AWS

El comando `sam deploy` crea todos los recursos en AWS:

```bash
sam deploy --guided
```

SAM te hará algunas preguntas. **Responde así**:

```
Stack Name [xxx]: (Presiona Enter - usa valor de samconfig.toml)
AWS Region [eu-west-1]: (Presiona Enter)
Parameter StudentPrefix [xxx]: (Presiona Enter)
#Shows you resources changes to be deployed and require a 'Y' to initiate deploy
Confirm changes before deploy [Y/n]: Y
#SAM needs permission to be able to create roles to connect to the resources in your template
Allow SAM CLI IAM role creation [Y/n]: Y
#Preserves the state of previously provisioned resources when an operation fails
Disable rollback [y/N]: N
GetVinilosFunction may not have authorization defined, Is this okay? [y/N]: y
Save arguments to samconfig.toml [Y/n]: Y
SAM configuration file [samconfig.toml]: (Presiona Enter)
SAM configuration environment [default]: (Presiona Enter)
```

**Proceso de deploy**:

```
Uploading to s3://...
Waiting for changeset to be created...

CloudFormation stack changeset
---------------------------------------------------------------------
Operation            LogicalResourceId             ResourceType
---------------------------------------------------------------------
+ Add                GetVinilosFunction            AWS::Lambda::Function
+ Add                GetVinilosRole                AWS::IAM::Role
+ Add                VinilosHttpApi                AWS::ApiGatewayV2::Api
+ Add                VinilosTable                  AWS::DynamoDB::Table
+ Add                VinilosImagenesBucket         AWS::S3::Bucket
+ Add                VinilosImagenesBucketPolicy   AWS::S3::BucketPolicy
---------------------------------------------------------------------

Deploy this changeset? [y/N]: y

CREATE_IN_PROGRESS   AWS::CloudFormation::Stack        juan-perez-vinilos-stack
CREATE_IN_PROGRESS   AWS::DynamoDB::Table              VinilosTable
CREATE_IN_PROGRESS   AWS::S3::Bucket                   VinilosImagenesBucket
...
CREATE_COMPLETE      AWS::CloudFormation::Stack        juan-perez-vinilos-stack

CloudFormation outputs from deployed stack
------------------------------------------------------------------------
Outputs
------------------------------------------------------------------------
Key                 VinilosApiUrl
Description         API Gateway endpoint URL for Vinyl catalog
Value               https://abcd1234.execute-api.eu-west-1.amazonaws.com/vinilos

Key                 VinilosTableName
Description         DynamoDB table name
Value               juan-perez-a7b3f-vinilos

Key                 VinilosImagesBucketName
Description         S3 bucket for vinyl cover images
Value               juan-perez-a7b3f-vinilos-imagenes
------------------------------------------------------------------------

Successfully created/updated stack - juan-perez-a7b3f-vinilos-stack
```

⏱️ **Tiempo**: 2-3 minutos

**📋 IMPORTANTE: Copia la URL de VinilosApiUrl**, la necesitarás para probar.

---

## ✅ Paso 7: Verificar el Deploy

### 7.1 Probar la API (Aún sin datos)

Prueba la API con curl (reemplaza la URL por la tuya):

```bash
curl https://abcd1234.execute-api.eu-west-1.amazonaws.com/vinilos
```

**Output esperado**:
```json
{
  "mensaje": "Catálogo de vinilos desde DynamoDB (SAM deployment)",
  "total": 0,
  "vinilos": [],
  "metadata": {
    "table": "juan-perez-a7b3f-vinilos",
    "bucket": "juan-perez-a7b3f-vinilos-imagenes",
    "region": "eu-west-1"
  }
}
```

✅ **Si ves esto, ¡funciona!** (aunque `vinilos` esté vacío todavía).

---

## 📊 Paso 8: Poblar DynamoDB con Datos

Vamos a añadir 5 vinilos de ejemplo a la tabla.

### 8.1 Instalar dependencias del script

```bash
cd scripts
npm install
cd ..
```

### 8.2 Ejecutar script de seed

Obtén el nombre de tu tabla desde los outputs del deploy:

```bash
aws cloudformation describe-stacks \
    --stack-name {tu-prefijo}-vinilos-stack \
    --query 'Stacks[0].Outputs[?OutputKey==`VinilosTableName`].OutputValue' \
    --output text
```

Ejecuta el script con el nombre de la tabla:

```bash
node scripts/seed-dynamodb.js {nombre-tabla}
```

**Ejemplo**:
```bash
node scripts/seed-dynamodb.js juan-perez-a7b3f-vinilos
```

**Output esperado**:
```
🌱 Iniciando seed de DynamoDB...
📋 Tabla: juan-perez-a7b3f-vinilos

✅ Insertado: Abbey Road - The Beatles
✅ Insertado: Dark Side of the Moon - Pink Floyd
✅ Insertado: Thriller - Michael Jackson
✅ Insertado: Songs of Leonard Cohen - Leonard Cohen
✅ Insertado: Naturally (Shades) - J.J. Cale

📊 Resumen:
  ✅ Insertados: 5
  ❌ Errores: 0

🎉 Seed completado exitosamente!
```

---

## 🖼️ Paso 9: Subir Imágenes a S3

Obtén el nombre de tu bucket:

```bash
aws cloudformation describe-stacks \
    --stack-name {tu-prefijo}-vinilos-stack \
    --query 'Stacks[0].Outputs[?OutputKey==`VinilosImagesBucketName`].OutputValue' \
    --output text
```

Ejecuta el script de upload:

```bash
./scripts/upload-images.sh {nombre-bucket}
```

**Ejemplo**:
```bash
./scripts/upload-images.sh juan-perez-a7b3f-vinilos-imagenes
```

**Output esperado**:
```
📦 Subiendo imágenes a S3...
🪣 Bucket: juan-perez-a7b3f-vinilos-imagenes

⬆️  Subiendo: abbey-road.jpg
✅ Subido: abbey-road.jpg
...

📊 Resumen:
  ✅ Subidas: 5
  ❌ Errores: 0

🎉 Imágenes subidas exitosamente!
```

---

## 🎉 Paso 10: Probar la API Completa

Ahora sí, prueba la API con datos reales:

```bash
curl https://abcd1234.execute-api.eu-west-1.amazonaws.com/vinilos
```

**Output esperado**:
```json
{
  "mensaje": "Catálogo de vinilos desde DynamoDB (SAM deployment)",
  "total": 5,
  "vinilos": [
    {
      "id": "1",
      "titulo": "Abbey Road",
      "artista": "The Beatles",
      "precio": 25.99,
      "año": 1969,
      "imagen": "https://juan-perez-a7b3f-vinilos-imagenes.s3.eu-west-1.amazonaws.com/abbey-road.jpg"
    },
    ...
  ],
  "metadata": { ... }
}
```

🎊 **¡Éxito!** Tu API serverless está funcionando.

---

## 📝 Paso 11: Ver Logs de Lambda

Puedes ver los logs de tu Lambda en tiempo real:

```bash
sam logs -n GetVinilosFunction --stack-name {tu-prefijo}-vinilos-stack --tail
```

Haz otra petición curl en otra terminal y verás los logs aparecer:

```
2025-01-15T12:34:56 START RequestId: abc123
2025-01-15T12:34:56 Lambda invocada - GET vinilos
2025-01-15T12:34:56 Scanning DynamoDB table: juan-perez-a7b3f-vinilos
2025-01-15T12:34:56 DynamoDB Scan result: 5 items found
2025-01-15T12:34:57 END RequestId: abc123
2025-01-15T12:34:57 REPORT Duration: 523ms Memory: 85MB
```

**Presiona Ctrl+C** para salir.

---

## 🏆 ¡Lo Lograste!

Has desplegado tu primera aplicación serverless con Infrastructure as Code. Compara:

| Método | Tiempo | Reproducible | Versionable |
|--------|--------|--------------|-------------|
| **Consola AWS** | 70 min | ❌ No | ❌ No |
| **SAM** | 3 min | ✅ Sí | ✅ Sí |

---

## 🧹 (Opcional) Eliminar Todo

Si quieres eliminar todos los recursos creados:

```bash
sam delete --stack-name {tu-prefijo}-vinilos-stack
```

**⚠️ Esto eliminará**:
- Lambda function
- API Gateway
- DynamoDB table (con todos los datos)
- S3 bucket (con todas las imágenes)
- IAM roles

---

## 🐛 Troubleshooting

### Error: "Unable to upload artifact... Access Denied"

**Causa**: El bucket de deployment no existe o no tienes permisos.

**Solución**: Verifica que creaste el bucket en Paso 3:
```bash
aws s3 ls s3://{tu-prefijo}-sam-deploy
```

### Error: "Stack with id {name} does not exist"

**Causa**: Nombre de stack incorrecto en samconfig.toml.

**Solución**: Verifica que el `stack_name` en samconfig.toml coincida con el que usaste en deploy.

### API devuelve 403 "Missing Authentication Token"

**Causa**: URL incorrecta o ruta mal escrita.

**Solución**: Verifica la URL completa incluyendo `/vinilos` al final.

### DynamoDB vacía (no hay datos)

**Causa**: No ejecutaste el script de seed.

**Solución**: Ejecuta el Paso 8 completo.

### La API no devuelve imágenes

**Causa**: No subiste imágenes a S3.

**Solución**: Ejecuta el Paso 9 completo.

---

## 📚 Próximos Pasos

Una vez que tengas esto funcionando:

1. **Lee la documentación** en `docs/sam-workflow/` para entender:
   - Qué es cada sección del template.yaml
   - Cómo funciona SAM por dentro
   - Comparación con otros frameworks IaC

2. **Ejercicio guiado**: Añadir endpoint POST /vinilos
   - Ver `docs/sam-workflow/03-ejercicio-post.md`

3. **Ejercicio autónomo**: Añadir endpoint GET /vinilos/{id}
   - Ver `docs/sam-workflow/04-ejercicio-get-by-id.md`

---

## ✅ Checklist de Verificación

Marca todo lo que hayas completado:

- [ ] Sam CLI, AWS CLI y Node.js instalados
- [ ] Bucket de deployment creado
- [ ] samconfig.toml configurado con tu prefijo
- [ ] `sam build` ejecutado sin errores
- [ ] `sam deploy --guided` ejecutado sin errores
- [ ] API devuelve 200 (aunque vacía inicialmente)
- [ ] DynamoDB poblada con 5 vinilos
- [ ] Imágenes subidas a S3
- [ ] API devuelve los 5 vinilos con URLs de imágenes
- [ ] Logs visibles con `sam logs --tail`

Si marcaste todo ✅, ¡estás listo para el siguiente ejercicio!
