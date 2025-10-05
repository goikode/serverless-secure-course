# Serverless Secure Course - Goikode

Curso completo de desarrollo serverless seguro en AWS.

## 🚀 Inicio Rápido

### 📖 Documentación HTML Interactiva

**¡La documentación está disponible en la rama `docs`!**

```bash
# 1. Clona el repositorio
git clone https://github.com/goikode/serverless-secure-course.git
cd serverless-secure-course

# 2. Cambia a la rama de documentación
git checkout docs

# 3. Abre la documentación HTML
open docs/index.html  # macOS
xdg-open docs/index.html  # Linux
start docs/index.html  # Windows
```

O con un servidor local:
```bash
git checkout docs
cd docs
python3 -m http.server 8000
# Visita: http://localhost:8000
```

### ✨ Características de la Documentación

- **Prefijo Personalizado**: Se te pedirá tu prefijo único en la primera visita
- **Navegación con Sidebar**: Índice completo del curso siempre visible
- **Branding Goikode**: Diseño profesional con colores corporativos
- **Responsive**: Funciona en desktop, tablet y móvil
- **Comandos Personalizados**: Todos los comandos AWS usan TU prefijo

## 📚 Estructura del Curso

### Módulo 0: Configuración de Entorno
Configuración inicial de AWS Cloud9 y verificación de acceso

### Módulo 1.A: Desarrollo con Consola AWS (2.5h)
Construye una aplicación serverless funcional desde la consola:
- Lambda con datos hardcoded
- DynamoDB para persistencia
- S3 para almacenamiento de imágenes
- API Gateway para exponer endpoints
- **Ejercicio opcional**: S3 Trigger event-driven

### Módulo 1.B: Infraestructura como Código con SAM (2.5h)
Aprende a automatizar despliegues serverless:
- Introducción a Infrastructure as Code (IaC)
- AWS SAM CLI workflow
- Templates SAM y gestión de recursos
- Despliegues automatizados vs manual
- **Ramas**: `modulo-1-base` (inicial), `modulo-1-completo` (solución)

### Módulo 2: Pentesting (3h) - Próximamente
Aprende a identificar vulnerabilidades comunes:
- NoSQL Injection
- Autenticación débil
- Exposición de datos sensibles
- Control de acceso roto

### Módulo 3: Securización (3h) - Próximamente
Implementa las mejores prácticas de seguridad:
- Validación y sanitización de inputs
- Gestión segura de secretos
- Monitoring y logging
- Rate limiting y CORS

## 📂 Estructura del Repositorio

### Rama `main`:
```
serverless-secure-course/
├── README.md                   # Este archivo
├── .gitignore
└── (código de estudiantes en ramas específicas)
```

### Rama `docs`:
```
docs/
├── index.html                  # Índice principal
├── modulo-0/                   # Configuración entorno
│   └── 00-configuracion-entorno.html
├── modulo-1a-consola/          # Módulo 1.A (7 guías)
│   ├── 00-vision-general.html
│   ├── 01-lambda-hardcoded.html
│   ├── 02-dynamodb-table.html
│   ├── 03-s3-imagenes.html
│   ├── 04-api-gateway.html
│   └── ejercicio-opcional-s3-trigger.html
├── modulo-1b-sam/              # Módulo 1.B (4 guías)
│   ├── 01-introduccion-sam.html
│   ├── 02-ejercicio-despliegue-base.html
│   ├── 03-ejercicio-post.html
│   └── 04-ejercicio-get-by-id.html
├── styles/                     # CSS con branding Goikode
├── scripts/                    # JavaScript para prefijos
└── assets/                     # Logo y recursos
```

### Ramas de código:
- `modulo-0`: Configuración inicial
- `modulo-1-base`: Código inicial Módulo 1
- `modulo-1-completo`: Solución completa Módulo 1

## 🎯 Tu Prefijo Único

Cada estudiante tiene un prefijo único en formato:
```
nombre-apellido-xxxxx
```

Ejemplo: `juan-perez-a7b3f`

Este prefijo se usa en TODOS los recursos AWS que crees:
- ✅ `juan-perez-a7b3f-get-vinilos` (Lambda)
- ✅ `juan-perez-a7b3f-vinilos` (DynamoDB)
- ✅ `juan-perez-a7b3f-imagenes` (S3 Bucket)

**Importante**: Siempre inicia el nombre del recurso con tu prefijo.

## 🌐 Acceso a la Documentación

La documentación está disponible en la rama `docs`:
- **Local**: Clona el repo y haz `git checkout docs`
- **Offline**: Funciona sin conexión después de clonar

## 🛠️ Requisitos Previos

- Cuenta AWS (proporcionada por el instructor)
- Credenciales de acceso (IAM user)
- AWS CLI configurado
- Node.js 20.x (para desarrollo local)

## 📞 Soporte

Para dudas o problemas:
- **Instructor**: alberto.pena@goikode.com
- **Web**: https://goikode.com

---

**Goikode S.L.** - Formación técnica especializada en cloud y seguridad
