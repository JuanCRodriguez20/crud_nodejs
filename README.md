# 💰 Dashboard de Ingresos y Gastos

Una aplicación web fullstack moderna para gestionar ingresos y gastos personales, construida con Node.js, TypeScript, Express, Angular, PostgreSQL y Docker.

## 🚀 Características

- **Gestión de Usuarios**: Registro, login y autenticación con JWT
- **Gestión de Transacciones**: CRUD completo para ingresos y gastos
- **Categorización**: Organiza transacciones por categorías personalizables
- **Dashboard Visual**: Gráficos de barras y pastel para visualizar tendencias financieras
- **Filtros Avanzados**: Filtra por fecha, tipo y categoría
- **Exportación CSV**: Exporta datos de transacciones y resúmenes
- **Responsive Design**: Interfaz adaptable con Tailwind CSS
- **Containerización**: Desarrollo y despliegue con Docker

## 🛠️ Tecnologías

### Backend
- **Node.js** con **TypeScript**
- **Express.js** para el servidor web
- **TypeORM** como ORM
- **PostgreSQL** como base de datos
- **JWT** para autenticación
- **bcryptjs** para hash de contraseñas
- **csv-writer** para exportación
- **Jest** para pruebas unitarias

### Frontend
- **Angular 17** con **TypeScript**
- **Tailwind CSS** para estilos
- **ng2-charts** / **Chart.js** para gráficos
- **RxJS** para programación reactiva
- **Jasmine & Karma** para pruebas

### DevOps
- **Docker** y **Docker Compose**
- **PostgreSQL** containerizado
- **pgAdmin** para gestión de BD

## 📦 Instalación

### Prerrequisitos

- **Node.js** (v18+)
- **npm** o **yarn**
- **Docker** y **Docker Compose** (recomendado)
- **PostgreSQL** (si no usas Docker)

### Instalación con Docker (Recomendado)

1. **Clona el repositorio**
   ```bash
   git clone <repository-url>
   cd crud_nodejs
   ```

2. **Configura las variables de entorno**
   ```bash
   cp backend/.env.example backend/.env
   ```

3. **Levanta los servicios**
   ```bash
   docker-compose up -d
   ```

4. **Instala dependencias**
   ```bash
   # Backend
   cd backend && npm install
   
   # Frontend
   cd ../frontend && npm install
   ```

5. **Accede a la aplicación**
   - Frontend: http://localhost:4200
   - Backend API: http://localhost:3000
   - pgAdmin: http://localhost:5050 (admin@admin.com / admin)

### Instalación Manual

1. **Backend Setup**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Configura tu base de datos PostgreSQL en .env
   npm run dev
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Base de Datos**
   - Crea una base de datos PostgreSQL
   - Actualiza las variables de entorno en `backend/.env`

## 🔧 Scripts Disponibles

### Backend
```bash
npm run dev          # Ejecuta en modo desarrollo
npm run build        # Compila TypeScript
npm start            # Ejecuta versión compilada
npm test             # Ejecuta pruebas unitarias
npm run lint         # Ejecuta linter
```

### Frontend
```bash
npm start            # Ejecuta en modo desarrollo
npm run build        # Compila para producción
npm test             # Ejecuta pruebas unitarias
npm run lint         # Ejecuta linter
```

## 📊 API Endpoints

### Autenticación
- `POST /api/v1/auth/register` - Registro de usuario
- `POST /api/v1/auth/login` - Login de usuario
- `GET /api/v1/auth/profile` - Perfil del usuario
- `POST /api/v1/auth/refresh-token` - Renovar token

### Transacciones
- `GET /api/v1/transactions` - Listar transacciones (con filtros)
- `POST /api/v1/transactions` - Crear transacción
- `GET /api/v1/transactions/:id` - Obtener transacción por ID
- `PUT /api/v1/transactions/:id` - Actualizar transacción
- `DELETE /api/v1/transactions/:id` - Eliminar transacción
- `GET /api/v1/transactions/summary` - Resumen financiero
- `GET /api/v1/transactions/stats/categories` - Estadísticas por categoría

### Categorías
- `GET /api/v1/categories` - Listar categorías
- `POST /api/v1/categories` - Crear categoría
- `GET /api/v1/categories/:id` - Obtener categoría por ID
- `PUT /api/v1/categories/:id` - Actualizar categoría
- `DELETE /api/v1/categories/:id` - Eliminar categoría

### Exportación
- `GET /api/v1/export/transactions` - Exportar transacciones a CSV
- `GET /api/v1/export/summary` - Exportar resumen a CSV

## 🧪 Pruebas

### Backend
```bash
cd backend
npm test                # Ejecutar todas las pruebas
npm run test:watch      # Ejecutar en modo watch
```

### Frontend
```bash
cd frontend
npm test                # Ejecutar todas las pruebas
ng test --watch=false   # Ejecutar una vez
```

## 🐳 Docker

### Desarrollo
```bash
docker-compose up -d
```

### Servicios Incluidos
- **backend**: API Node.js
- **frontend**: Aplicación Angular
- **postgres**: Base de datos PostgreSQL
- **pgadmin**: Interfaz de gestión de BD

## 📝 Variables de Entorno

### Backend (.env)
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=dashboard_db

# JWT
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Server
PORT=3000
NODE_ENV=development

# CORS
ALLOWED_ORIGINS=http://localhost:4200
```

## 🤝 Contribución

## 📄 Principios de Desarrollo

### SOLID
- **S**ingle Responsibility: Cada clase tiene una responsabilidad única
- **O**pen/Closed: Abierto para extensión, cerrado para modificación
- **L**iskov Substitution: Objetos derivados deben ser sustituibles
- **I**nterface Segregation: Interfaces específicas mejor que generales
- **D**ependency Inversion: Depender de abstracciones, no concreciones

### DRY (Don't Repeat Yourself)
- Reutilización de componentes
- Servicios compartidos
- Utilidades comunes
- Configuración centralizada

## 📜 Licencia

MIT License

---

**Desarrollado con ❤️ usando las mejores prácticas de desarrollo fullstack**