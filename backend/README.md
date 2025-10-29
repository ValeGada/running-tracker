# Running Tracker Backend API

Backend API para la aplicación móvil Running Tracker, desarrollado con NestJS, TypeScript, PostgreSQL y TypeORM.

## 🚀 Características

- **Autenticación JWT** con registro y login
- **CRUD completo** para usuarios y sesiones de running
- **Validación de datos** con class-validator
- **Documentación automática** con Swagger
- **Base de datos PostgreSQL** con TypeORM
- **Arquitectura modular** escalable
- **CORS configurado** para frontend móvil

## 📁 Estructura del proyecto

backend/
├── src/
│   ├── modules/
│   │   ├── auth/           # Autenticación y autorización
│   │   ├── users/          # Gestión de usuarios
│   │   └── runs/           # Gestión de sesiones de running
│   ├── common/             # Utilidades compartidas
│   ├── app.module.ts       # Módulo principal
│   └── main.ts            # Punto de entrada
├── docker-compose.yml      # Configuración Docker
├── Dockerfile             # Imagen Docker
└── README.md


## 🛠️ Instalación y configuración

### Prerrequisitos

- Node.js 18+
- PostgreSQL 15+
- npm o yarn

### Instalación local

1. **Instalar dependencias:**
```bash
npm install
```

2. **Configurar variables de entorno:**
Copia el archivo `.env.example` a `.env` y configura las variables:
```bash
cp .env.example .env
```

3. **Configurar base de datos:**
Asegúrate de tener PostgreSQL ejecutándose y crea la base de datos:
```sql
CREATE DATABASE running_tracker;
```

4. **Ejecutar en modo desarrollo:**
```bash
npm run start:dev
```

### Instalación con Docker

1. **Ejecutar con Docker Compose:**
```bash
docker-compose up -d
```

Esto iniciará tanto la base de datos PostgreSQL como el backend API.

## 📚 API Endpoints

### Autenticación

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión

### Usuarios

- `GET /users/:id` - Obtener usuario por ID
- `GET /users/profile/me` - Obtener perfil del usuario actual

### Sesiones de Running

- `POST /runs` - Crear nueva sesión de running
- `GET /runs/my-runs` - Obtener sesiones del usuario actual
- `GET /runs/user/:userId` - Obtener sesiones por usuario
- `GET /runs/stats/me` - Obtener estadísticas del usuario
- `GET /runs/:id` - Obtener sesión por ID
- `PATCH /runs/:id` - Actualizar sesión
- `DELETE /runs/:id` - Eliminar sesión

## 📖 Documentación API

Una vez que el servidor esté ejecutándose, puedes acceder a la documentación interactiva de Swagger en: http://localhost:3000/api/docs


## 🔧 Scripts disponibles

```bash
# Desarrollo
npm run start:dev      # Modo desarrollo con hot reload
npm run start:debug    # Modo debug

# Producción
npm run build          # Compilar proyecto
npm run start:prod     # Ejecutar en producción

# Testing
npm run test           # Ejecutar tests
npm run test:watch     # Tests en modo watch
npm run test:cov       # Tests con cobertura

# Linting
npm run lint           # Ejecutar ESLint
npm run format         # Formatear código con Prettier
```

## 🗄️ Esquema de base de datos

### Tabla Users
- `id` (UUID, PK)
- `email` (string, unique)
- `name` (string)
- `password` (string, hashed)
- `avatar` (string, optional)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

### Tabla Runs
- `id` (UUID, PK)
- `userId` (UUID, FK)
- `startTime` (timestamp)
- `endTime` (timestamp)
- `distance` (decimal) - en kilómetros
- `duration` (integer) - en segundos
- `averagePace` (decimal) - minutos por kilómetro
- `maxSpeed` (decimal) - km/h
- `calories` (integer)
- `route` (jsonb) - coordenadas GPS
- `status` (enum: active, paused, completed)
- `createdAt` (timestamp)
- `updatedAt` (timestamp)

## 🔐 Autenticación

El API utiliza JWT (JSON Web Tokens) para la autenticación. Para acceder a endpoints protegidos:

1. Registra un usuario o inicia sesión
2. Incluye el token en el header Authorization: Authorization: Bearer


## 🌐 CORS

El backend está configurado para aceptar requests desde:
- `http://localhost:8081` (Expo development server)
- `http://localhost:19006` (Expo web)
- `exp://192.168.*:8081` (Expo tunnel mode)

## 🚀 Despliegue

### Variables de entorno para producción

```bash
NODE_ENV=production
DB_HOST=your-production-db-host
DB_PORT=5432
DB_USERNAME=your-db-user
DB_PASSWORD=your-secure-password
DB_NAME=running_tracker
JWT_SECRET=your-super-secure-jwt-secret
PORT=3000
```

### Docker en producción

```bash
# Construir imagen
docker build -t running-tracker-backend .

# Ejecutar contenedor
docker run -p 3000:3000 --env-file .env running-tracker-backend
```

## 🧪 Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## 📝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 🤝 Soporte

Para reportar bugs o solicitar features, por favor abre un issue en el repositorio de GitHub.

---

**¡Feliz running! 🏃‍♂️💨**
