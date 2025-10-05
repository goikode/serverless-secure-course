# Módulo 0: Configuración de Entorno
## Serverless Secure Code - Preparación del Espacio de Trabajo

### 🎯 **Objetivos de Aprendizaje**
Al finalizar este módulo, serás capaz de:
- ✅ Acceder a tu consola de AWS personal
- ✅ Configurar tu entorno Cloud9 de desarrollo
- ✅ Usar AWS CLI desde la línea de comandos
- ✅ Crear tu espacio de trabajo y clonar el repositorio del curso
- ✅ Verificar acceso a servicios AWS básicos

### ⏱️ **Duración Estimada**: 40 minutos (con explicaciones del instructor)

| Fase | Tiempo | Contenido |
|------|--------|-----------|
| Introducción y contexto | 10 min | Presentación del curso, arquitectura serverless |
| Acceso a AWS Console | 3 min | Login con credenciales proporcionadas |
| Cloud9 Setup | 5 min | Acceso al IDE, ejecución script de configuración |
| AWS CLI Configuration | 7 min | Configuración de credenciales |
| Repositorio y Workspace | 10 min | Creación workspace, git clone, checkout rama |
| Verificación final | 5 min | Script de verificación, resolución de dudas |

---
## 🔐 **Paso 1: Primer Acceso a AWS**
### **Tu Información de Acceso**
> **El instructor te entregará un archivo JSON con tu nombre**: `tu-nombre.json`

**Descarga tu archivo desde la carpeta compartida** que el instructor te indicará.

**Contenido del archivo**:
```json
{
  "estudiante": "juan-perez",
  "credenciales_consola": {
    "url": "https://111109666774.signin.aws.amazon.com/console",
    "usuario": "juan-perez",
    "password": "TempPassword123!"
  },
  "credenciales_cli": {
    "aws_access_key_id": "AKIAIOSFODNN7EXAMPLE",
    "aws_secret_access_key": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
  },
  "entorno_cloud9": {
    "url_directa": "https://eu-west-1.console.aws.amazon.com/cloud9/ide/abc123",
    "nombre": "juan-perez-ide"
  },
  "region": "eu-west-1"
}
```

> 💡 **Tip**: Guarda este archivo JSON en un lugar seguro, lo necesitarás durante todo el curso.

### **Acceso Inicial**
1. **Abrir la consola de AWS**
   - Usa el enlace: https://console.aws.amazon.com/
2. **Iniciar sesión**
   ```
   Account ID: [Proporcionado por el instructor]
   Username: tu-usuario (ej: student01-a7b3f)
   Password: tu-contraseña-temporal
   ```
3. **🔐 Contraseña configurada**
   - Tu contraseña temporal ya está configurada para uso directo
   - No es necesario cambiarla al primer acceso (puedes si quieres)
   - **Anota tu contraseña actual** - la necesitarás durante el curso

---
## 🖥️ **Paso 1.5: Acceso a Cloud9 y Configuración Inicial**

### **Acceso al IDE**
1. **Usa la URL directa de tu archivo JSON**:
   - Copia la URL de `entorno_cloud9.url_directa`
   - Pégala en tu navegador
   - Debería abrirse directamente el IDE de Cloud9

2. **Si tienes problemas de "Not Authorized"**:
   - Abre una pestaña en modo incógnito
   - Vuelve a pegar la URL del IDE de Cloud9
   - O bien: desde la consola AWS, vuelve a pegar manualmente la URL

### **Configuración Inicial del Entorno (RECOMENDADO)**

Una vez dentro de Cloud9, ejecuta el script de configuración para actualizar Node.js y otras herramientas:

```bash
# Descargar y ejecutar el script de setup
curl -fsSL https://raw.githubusercontent.com/goikode/serverless-secure-course/modulo-0/scripts/setup-cloud9-environment.sh | bash
```

**¿Qué hace este script?**
- ✅ Actualiza Node.js de v18 a v20 LTS
- ✅ Actualiza npm a la última versión
- ✅ Instala AWS SAM CLI (si no está presente)
- ✅ Configura Git con valores por defecto
- ✅ Verifica todas las herramientas necesarias

> 💡 **Nota**: Este paso es opcional pero muy recomendado para tener las últimas versiones.

---
## ℹ️ Nota sobre Cloud9 y rutas por defecto
Cuando entras en Cloud9, el IDE te sitúa por defecto en:
- `/home/ec2-user/environment`

Este directorio es el "workspace por defecto" del entorno Cloud9. Para mantener el curso uniforme, trabajaremos en la subcarpeta recomendada:
- `~/environment/mi-workspace-ssc`

Si no estás en Cloud9 (por ejemplo trabajas localmente), la carpeta alternativa será:
- `~/mi-workspace-ssc`

---
## 🗂️ **Paso 1.6: Crear tu espacio de trabajo (IMPORTANTE — antes de clonar)**
1. En Cloud9 (o en tu terminal), crea el directorio recomendado:
   ```bash
   # En Cloud9 (recomendado)
   mkdir -p ~/environment/mi-workspace-ssc
   cd ~/environment/mi-workspace-ssc

   # Si no usas Cloud9:
   # mkdir -p ~/mi-workspace-ssc
   # cd ~/mi-workspace-ssc
   ```
2. Este será el lugar donde clonaremos el repositorio y guardaremos el trabajo durante el curso.

---
## 📁 **Paso 2: Clonar Repositorio del Curso (desde tu workspace)**
Nota: cada módulo del curso está en una rama distinta del mismo repositorio. Para el Módulo 0 hay una rama llamada:
- **modulo-0**

1. Entra en tu espacio de trabajo y clona el repo:
   ```bash
   cd ~/environment/mi-workspace-ssc

   # Si el repo es público:
   git clone https://github.com/goikode/serverless-secure-course.git

   # Si el repo es privado (usa PAT o SSH)
   # HTTPS (te pedirá usuario + token):
   git clone https://github.com/goikode/serverless-secure-course.git

   # Opción recomendada: SSH (si tienes clave SSH en GitHub)
   git clone git@github.com:goikode/serverless-secure-course.git
   ```
2. Navega al repo:
   ```bash
   cd serverless-secure-course
   ```
3. Bájate todas las ramas remotas y comprueba que existe la rama del módulo:
   ```bash
   git fetch --all --prune
   git branch -a
   ```
   Deberías ver algo como `remotes/origin/modulo-0` en la lista.

4. Cambia a la rama del módulo 0:
   ```bash
   # Cambiar a la rama del Módulo 0
   git checkout modulo-0
   ```

---
## 🧪 **Paso 3: Verificación de Servicios AWS y herramientas**
1. Asegúrate de estar en tu workspace:
   ```bash
   cd ~/environment/mi-workspace-ssc/serverless-secure-course
   ```

2. Comprueba herramientas básicas:
   ```bash
   aws --version
   git --version
   curl --version
   ```

3. **⚠️ IMPORTANTE: Configura AWS CLI** (si no lo has hecho):
   ```bash
   aws configure
   ```

   **Todos los campos son OBLIGATORIOS:**
   ```
   AWS Access Key ID [None]: AKIAIOSFODNN7EXAMPLE       # De tu archivo JSON
   AWS Secret Access Key [None]: wJalrXUtnFEMI/K7M...   # De tu archivo JSON
   Default region name [None]: eu-west-1                # ⚠️ OBLIGATORIO
   Default output format [None]: json                   # Recomendado
   ```

   > 💡 **Importante sobre la región**:
   > - **NO dejes la región vacía** - debe ser `eu-west-1`
   > - Si no configuras la región, AWS CLI no funcionará correctamente
   > - Todos los recursos del curso están en `eu-west-1` (Irlanda)

4. Verifica identidad:
   ```bash
   aws sts get-caller-identity
   ```

   Deberías ver algo como:
   ```json
   {
     "UserId": "AIDAIOSFODNN7EXAMPLE",
     "Account": "111109666774",
     "Arn": "arn:aws:iam::111109666774:user/students/student02-wtvlt"
   }
   ```

5. Probar servicios:
   ```bash
   aws lambda list-functions
   aws apigateway get-rest-apis
   aws dynamodb list-tables
   ```

---
## ✅ **Paso 4: Lista de Verificación Final**
- [ ] ✅ **Acceso a consola AWS**
- [ ] ✅ **Cloud9 funcionando**
- [ ] ✅ **Workspace creado** - `~/environment/mi-workspace-ssc`
- [ ] ✅ **AWS CLI configurado**
- [ ] ✅ **Repositorio clonado en `~/environment/mi-workspace-ssc/serverless-secure-course`**
- [ ] ✅ **En la rama del Módulo 0** - `modulo-0`
- [ ] ✅ **Servicios AWS verificados**
- [ ] ✅ **Node.js actualizado** (opcional pero recomendado)

### **Comando de Verificación Completa**
```bash
# Desde ~/environment/mi-workspace-ssc/serverless-secure-course
./scripts/test-modulo-0.sh
```
El script comprueba herramientas, configuración AWS, servicios, que el repo esté presente y si estás (o no) en la rama del módulo 0; si no lo estás te indicará cómo cambiarte.

---
## 🚨 **Troubleshooting Común**

### **Problema: "Not Authorized" al acceder a Cloud9**
**Solución**:
1. Abre una pestaña en modo incógnito
2. Vuelve a pegar la URL directa del IDE desde tu archivo JSON
3. O bien: desde la consola AWS, navega manualmente a Cloud9

### **Problema: No puedo clonar el repositorio por HTTPS**
**Solución**:
- El repo puede ser privado → usa Personal Access Token (PAT) o configura SSH
- Verifica que tienes acceso al repositorio en GitHub

### **Problema: No veo la rama `modulo-0`**
**Solución**:
```bash
git fetch --all --prune
git checkout modulo-0
```

### **Problema: AWS CLI devuelve errores**
**Solución**:
1. Verifica que ejecutaste `aws configure` correctamente
2. **Asegúrate de haber configurado la región**: `eu-west-1`
3. Revisa que las Access Keys sean correctas
4. Comprueba: `aws configure list`

### **Problema: Cloud9 no carga o va muy lento**
**Solución**:
- Refresca la página (F5)
- Cierra pestañas innecesarias en el IDE
- En casos extremos: reinicia el entorno desde la consola AWS

### **Problema: Node.js sigue en versión 18**
**Solución**:
- Ejecuta el script de setup: `curl -fsSL https://raw.githubusercontent.com/goikode/serverless-secure-course/modulo-0/scripts/setup-cloud9-environment.sh | bash`
- Cierra y vuelve a abrir el terminal
- Verifica: `node --version` (debería mostrar v20.x.x)

---
*Preparado por: Equipo Goikode | Serverless Secure Course | Versión 1.3*