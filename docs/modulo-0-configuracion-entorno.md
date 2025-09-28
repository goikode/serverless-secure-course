# Módulo 0: Configuración de Entorno
## Serverless Secure Code - Preparación del Espacio de Trabajo

### 🎯 **Objetivos de Aprendizaje**

Al finalizar este módulo, serás capaz de:
- ✅ Acceder a tu consola de AWS personal
- ✅ Configurar tu entorno Cloud9 de desarrollo
- ✅ Usar AWS CLI desde la línea de comandos
- ✅ Clonar el repositorio del curso
- ✅ Verificar acceso a servicios AWS básicos

### ⏱️ **Duración Estimada**: 30-45 minutos

---

## 🔐 **Paso 1: Primer Acceso a AWS**

### **Tu Información de Acceso**
> El instructor te habrá proporcionado un archivo con tus credenciales personales. Busca tu línea correspondiente:

```
Nombre: studentXX-XXXXX
Usuario: studentXX-XXXXX
Contraseña temporal: [Tu contraseña]
Console URL: https://console.aws.amazon.com/
```

### **Acceso Inicial**

1. **Abrir la consola de AWS**
   - Usa el enlace: https://console.aws.amazon.com/
   - O busca "AWS Console" en tu navegador

2. **Iniciar sesión**
   ```
   Account ID: [Proporcionado por el instructor]
   Username: tu-usuario (ej: student01-a7b3f)
   Password: tu-contraseña-temporal
   ```

3. **⚠️ Cambiar contraseña obligatorio**
   - AWS te pedirá cambiar la contraseña en el primer acceso
   - Usa una contraseña segura (mín. 8 caracteres, mayúsculas, números)
   - **Anota tu nueva contraseña** - la necesitarás durante el curso

### **Verificación de Acceso**
Una vez dentro, verifica que puedes ver:
- ✅ Dashboard de AWS con servicios disponibles
- ✅ Región configurada: **eu-west-1 (Irlanda)**
- ✅ Tu usuario en la esquina superior derecha

---

## 🖥️ **Paso 2: Configuración de Cloud9**

### **Acceder a tu IDE Personal**

1. **Navegar a Cloud9**
   - En la consola AWS, busca "Cloud9" en el buscador de servicios
   - O usar tu URL directa: `[Proporcionada en tus credenciales]`

2. **Abrir tu entorno**
   - Verás un entorno llamado `studentXX-XXXXX-ide`
   - Haz clic en "Open IDE"
   - ⏰ **Paciencia**: Puede tardar 1-2 minutos en cargar

3. **Familiarización con Cloud9**
   ```
   Cloud9 Interface:
   ├── File Explorer (izquierda)    # Archivos y carpetas
   ├── Code Editor (centro)         # Editor de código
   ├── Terminal (abajo)             # Línea de comandos
   └── Run/Debug (derecha)          # Herramientas de desarrollo
   ```

### **Configuración Inicial**

1. **Verificar herramientas preinstaladas**
   ```bash
   # En el terminal de Cloud9, ejecuta:
   node --version          # Node.js
   npm --version           # NPM
   aws --version           # AWS CLI
   git --version           # Git
   terraform --version     # Terraform
   ```

2. **Configurar Git (opcional pero recomendado)**
   ```bash
   git config --global user.name "Tu Nombre"
   git config --global user.email "tu-email@ejemplo.com"
   ```

---

## 🔧 **Paso 3: Configuración de AWS CLI**

### **Configurar Credenciales Programáticas**

1. **Obtener tus Access Keys**
   - En la consola AWS, ve a **IAM** > **Users** > `tu-usuario`
   - Tab **"Security Credentials"**
   - Busca tus **Access Keys** (están en tus credenciales proporcionadas)

2. **Configurar AWS CLI en Cloud9**
   ```bash
   # En el terminal de Cloud9:
   aws configure
   ```

   Introduce tus datos cuando se soliciten:
   ```
   AWS Access Key ID: [Tu Access Key ID]
   AWS Secret Access Key: [Tu Secret Access Key]
   Default region: eu-west-1
   Default output format: json
   ```

3. **Verificar configuración**
   ```bash
   # Verificar identidad
   aws sts get-caller-identity

   # Deberías ver algo como:
   {
       "UserId": "AIDAXXXXXXXXXXX",
       "Account": "123456789012",
       "Arn": "arn:aws:iam::123456789012:user/studentXX-XXXXX"
   }
   ```

---

## 📁 **Paso 4: Clonar Repositorio del Curso**

### **Obtener el Código del Curso**

1. **Clonar el repositorio público**
   ```bash
   # En Cloud9, clonar el repo del curso
   git clone https://github.com/goikode/serverless-secure-course.git
   cd serverless-secure-course
   ```

2. **Explorar la estructura del proyecto**
   ```bash
   # Ver estructura de directorios
   tree -L 2

   # O usar ls si tree no está disponible
   ls -la
   ls -la modulos/
   ```

3. **Estructura esperada**
   ```
   serverless-secure-course/
   ├── README.md                    # Información general
   ├── modulos/                     # Contenido del curso
   │   ├── modulo-0-configuracion-entorno.md
   │   ├── modulo-1-desarrollo/
   │   ├── modulo-2-pentesting/
   │   └── modulo-3-securizacion/
   ├── recursos/                    # Materiales adicionales
   └── ejemplos/                    # Código de ejemplo
   ```

### **Configurar Espacio de Trabajo**

1. **Crear directorio personal de trabajo**
   ```bash
   # Crear tu carpeta de trabajo personal
   mkdir ~/mi-workspace-ssc
   cd ~/mi-workspace-ssc

   # Copiar ejemplos iniciales
   cp -r ~/serverless-secure-course/ejemplos/* .
   ls -la
   ```

---

## 🧪 **Paso 5: Verificación de Servicios AWS**

### **Probar Acceso a Servicios Clave**

1. **Verificar acceso a Lambda**
   ```bash
   # Listar funciones Lambda (debería estar vacío inicialmente)
   aws lambda list-functions

   # Resultado esperado:
   {
       "Functions": []
   }
   ```

2. **Verificar acceso a API Gateway**
   ```bash
   # Listar APIs (debería estar vacío inicialmente)
   aws apigateway get-rest-apis

   # Resultado esperado:
   {
       "items": []
   }
   ```

3. **Verificar acceso a DynamoDB**
   ```bash
   # Listar tablas DynamoDB
   aws dynamodb list-tables

   # Resultado esperado:
   {
       "TableNames": []
   }
   ```

4. **Verificar acceso a S3**
   ```bash
   # Listar buckets S3 accesibles
   aws s3 ls

   # Podrías ver buckets compartidos del curso o ninguno
   ```

5. **Verificar región y zona de disponibilidad**
   ```bash
   # Ver información de región
   aws ec2 describe-availability-zones --query 'AvailabilityZones[0].{Zone:ZoneName,Region:RegionName}'
   ```

---

## ✅ **Paso 6: Lista de Verificación Final**

### **Completar Antes de Continuar**

Marca cada item cuando lo hayas completado:

- [ ] ✅ **Acceso a consola AWS** - Puedo entrar con mi usuario y nueva contraseña
- [ ] ✅ **Cloud9 funcionando** - Mi IDE personal está operativo y puedo abrir archivos
- [ ] ✅ **AWS CLI configurado** - `aws sts get-caller-identity` muestra mi usuario
- [ ] ✅ **Repositorio clonado** - Tengo el código del curso en Cloud9
- [ ] ✅ **Espacio de trabajo creado** - Carpeta `~/mi-workspace-ssc` lista
- [ ] ✅ **Servicios AWS verificados** - Puedo acceder a Lambda, API Gateway, DynamoDB
- [ ] ✅ **Git configurado** - (Opcional) Mi nombre y email están configurados

### **Comando de Verificación Completa**
```bash
# Ejecutar el script de verificación incluido en el repositorio
cd ~/serverless-secure-course
./scripts/test-modulo-0.sh
```

Este script verificará automáticamente:
- ✅ Herramientas disponibles (AWS CLI, Git, Curl)
- ✅ Configuración AWS CLI
- ✅ Acceso a servicios AWS (Lambda, DynamoDB, API Gateway)
- ✅ Estructura del repositorio
- ✅ Configuración de región AWS

---

## 🚨 **Troubleshooting Común**

### **Problema: No puedo acceder a la consola**
- ✅ Verificar que usas el Account ID correcto
- ✅ Usuario y contraseña escritos exactamente como se proporcionaron
- ✅ Probar navegador en modo incógnito/privado

### **Problema: Cloud9 no carga**
- ✅ Esperar 2-3 minutos (es normal que tarde)
- ✅ Refrescar la página
- ✅ Verificar que estás en la región correcta (eu-west-1)

### **Problema: AWS CLI no funciona**
- ✅ Verificar que introduces las Access Keys correctas
- ✅ Comprobar región: `aws configure get region`
- ✅ Re-ejecutar: `aws configure` si hay errores

### **Problema: Git clone falla**
- ✅ Verificar conexión a Internet desde Cloud9
- ✅ Probar: `ping github.com`
- ✅ Usar HTTPS en lugar de SSH para el clone

---

## 🎉 **¡Felicidades!**

Has completado la configuración de tu entorno de desarrollo. Estás listo para comenzar con el **Módulo 1: Desarrollo Serverless**.

### **Próximos Pasos**
1. Mantén Cloud9 abierto durante las sesiones
2. Guarda tus credenciales en un lugar seguro
3. Familiarízate con el terminal y editor de Cloud9
4. Revisa la documentación en `~/serverless-secure-course/README.md`

---

## 📚 **Recursos Adicionales**

- **Documentación AWS CLI**: https://docs.aws.amazon.com/cli/
- **Guía Cloud9**: https://docs.aws.amazon.com/cloud9/
- **Git Cheat Sheet**: https://education.github.com/git-cheat-sheet-education.pdf
- **Soporte del Curso**: Pregunta al instructor o usa el canal de Slack del curso

---

*Preparado por: Equipo Goikode | Serverless Secure Course | Versión 1.0*