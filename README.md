# Finance App

Una aplicación completa de gestión financiera personal construida con Vue 3, TypeScript y Tailwind CSS.

## Características

- ✅ Gestión completa de gastos e ingresos
- ✅ Categorización y etiquetado de transacciones
- ✅ Métodos de pago y productos financieros
- ✅ Seguimiento de inversiones y deudas
- ✅ Presupuestos con comparación real vs planificado
- ✅ Dashboard con resúmenes y estadísticas
- ✅ Autenticación JWT
- ✅ Diseño responsivo con Tailwind CSS

## Tecnologías

- **Frontend**: Vue 3 + Composition API + TypeScript
- **Routing**: Vue Router 4
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios
- **Build Tool**: Vite

## Configuración del Entorno

### Variables de Entorno

Este proyecto utiliza variables de entorno para configurar diferentes aspectos de la aplicación. Todas las variables deben tener el prefijo `VITE_` para ser accesibles en el código del cliente.

#### Archivos de Variables de Entorno

1. **`.env`** - Variables para desarrollo local
2. **`.env.staging`** - Variables para entorno de staging
3. **`.env.production`** - Variables para producción
4. **`.env.example`** - Plantilla de variables (NO modificar)

#### Variables Disponibles

| Variable | Descripción | Valor por defecto |
|----------|-------------|-------------------|
| `VITE_API_BASE_URL` | URL base de la API | `http://127.0.0.1:8000` |
| `APP_NAME` | Nombre de la aplicación | `Finance App` |
| `APP_VERSION` | Versión de la aplicación | `1.0.0` |
| `VITE_APP_ENV` | Entorno actual | `development` |

#### Configuración por Entorno

**Desarrollo (`.env`)**:
```env
VITE_API_BASE_URL=http://127.0.0.1:8000
VITE_APP_NAME=Finance App (Dev)
VITE_APP_ENV=development
```

**Staging (`.env.staging`)**:
```env
VITE_API_BASE_URL=https://api-staging.tu-finanzas.com
VITE_APP_NAME=Finance App (Staging)
VITE_APP_ENV=staging
```

**Producción (`.env.production`)**:
```env
VITE_API_BASE_URL=https://api.tu-finanzas.com
VITE_APP_NAME=Finance App
VITE_APP_ENV=production
```

### Configuración Inicial

1. **Clona el repositorio**:
   ```bash
   git clone <repository-url>
   cd fe-finance
   ```

2. **Instala dependencias**:
   ```bash
   npm install
   ```

3. **Configura variables de entorno**:
   ```bash
   cp .env.example .env
   # Edita .env con tus valores locales
   ```

4. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```

## Scripts Disponibles

```bash
# Desarrollo
npm run dev

# Construcción
npm run build              # Construcción para desarrollo
npm run build:staging      # Construcción para staging
npm run build:production   # Construcción para producción

# Vista previa
npm run preview            # Vista previa de desarrollo
npm run preview:staging    # Vista previa de staging
npm run preview:production # Vista previa de producción
```

## Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
├── layouts/            # Layouts de la aplicación
├── services/           # Servicios (API, etc.)
├── stores/             # Stores de Pinia
├── types/              # Definiciones TypeScript
├── views/              # Vistas/Páginas
├── router/             # Configuración de rutas
└── main.ts             # Punto de entrada
```

## API Backend

Esta aplicación frontend está diseñada para trabajar con la API de Finanzas Personales. Asegúrate de que el backend esté ejecutándose y accesible en la URL configurada en `VITE_API_BASE_URL`.

### Endpoints Principales

- **Autenticación**: `/auth/login`, `/auth/register`, `/auth/me`
- **Gastos**: `/expenses/`
- **Ingresos**: `/incomes/`
- **Categorías**: `/categories/`
- **Presupuestos**: `/budgets/`
- Y más...

## Despliegue

### Construcción para Producción

```bash
# Construir para producción
npm run build:production

# Los archivos se generan en la carpeta 'dist/'
```

### Variables de Entorno en Producción

En plataformas de despliegue como Vercel, Netlify, o servidores tradicionales, configura las variables de entorno en el panel de administración de la plataforma.

**Ejemplo en Vercel**:
- Ve a Project Settings > Environment Variables
- Agrega: `API_BASE_URL=https://tu-api.com`

## Desarrollo

### Convenciones de Código

- Usa TypeScript para todo el código nuevo
- Sigue las convenciones de Vue 3 Composition API
- Usa ESLint y Prettier para formateo
- Escribe commits descriptivos

### Agregar Nuevas Variables de Entorno

1. Agrega la variable al archivo `.env.example`
2. Actualiza esta documentación
3. Usa `import.meta.env.VITE_NOMBRE_VARIABLE` en el código
4. Proporciona un valor por defecto si es necesario

### Consideraciones de Seguridad

- ✅ Nunca expongas claves secretas o tokens sensibles
- ✅ Las variables `VITE_` son públicas (visibles en el navegador)
- ✅ Usa variables del servidor para datos sensibles
- ✅ Valida todas las variables de entorno en el código

## Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## Licencia

Este proyecto está bajo la Licencia MIT.
