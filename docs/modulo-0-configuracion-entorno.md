# Módulo 0: Configuración de Entorno
## Serverless Secure Code - Preparación del Espacio de Trabajo

### 🎯 **Objetivos de Aprendizaje**
Al finalizar este módulo, serás capaz de:
- ✅ Acceder a tu consola de AWS personal
- ✅ Configurar tu entorno Cloud9 de desarrollo
- ✅ Usar AWS CLI desde la línea de comandos
- ✅ Crear tu espacio de trabajo y clonar el repositorio del curso
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
## ℹ️ Nota sobre Cloud9 y rutas por defecto
Cuando entras en Cloud9, el IDE te sitúa por defecto en:
- /home/ec2-user/environment

Este directorio es el "workspace por defecto" del entorno Cloud9. Para mantener el curso uniforme, trabajaremos en la subcarpeta recomendada:
- ~/environment/mi-workspace-ssc

Si no estás en Cloud9 (por ejemplo trabajas localmente), la carpeta alternativa será:
- ~/mi-workspace-ssc

---
## 🗂️ **Paso 1.5: Crear tu espacio de trabajo (IMPORTANTE — antes de clonar)**
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
- modulo-0-configuracion-entorno

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
   Deberías ver algo como `remotes/origin/modulo-0-configuracion-entorno` en la lista.

4. Cambia a la rama del módulo 0:
   ```bash
   # Si la rama existe remotamente pero no localmente
   git checkout -b modulo-0-configuracion-entorno origin/modulo-0-configuracion-entorno

   # Si ya existe localmente
   git checkout modulo-0-configuracion-entorno
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

3. Configura AWS CLI si no lo has hecho:
   ```bash
   aws configure
   # Default region: eu-west-1
   ```

4. Verifica identidad:
   ```bash
   aws sts get-caller-identity
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
- [ ] ✅ **En la rama del Módulo 0** - `modulo-0-configuracion-entorno`
- [ ] ✅ **Servicios AWS verificados**
- [ ] ✅ **Git configurado (opcional)**

### **Comando de Verificación Completa**
```bash
# Desde ~/environment/mi-workspace-ssc/serverless-secure-course
./scripts/test-modulo-0.sh
```
El script comprueba herramientas, configuración AWS, servicios, que el repo esté presente y si estás (o no) en la rama del módulo 0; si no lo estás te indicará cómo cambiarte.

---
## 🚨 **Troubleshooting Común**
- **No puedo clonar por HTTPS**: el repo puede ser privado → usa PAT o configura SSH.
- **No veo la rama del módulo**: ejecuta `git fetch --all --prune` y luego crea la rama local con:
  `git checkout -b modulo-0-configuracion-entorno origin/modulo-0-configuracion-entorno`
- **AWS CLI no configurado**: ejecuta `aws configure` y revisa las Access Keys.
- **Cloud9 no carga**: refresca la página o reinicia el entorno.

---
*Preparado por: Equipo Goikode | Serverless Secure Course | Versión 1.3*