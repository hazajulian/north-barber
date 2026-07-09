# North Barber

North Barber es un sistema completo de gestión para una barbería desarrollado con **React, Node.js, Express y MySQL**.

Este proyecto fue creado como parte de mi portfolio profesional con el objetivo de simular el funcionamiento de una barbería real, incluyendo reservas online, panel administrativo, autenticación, gestión de horarios, notificaciones por correo y mucho más.

> **Este es un proyecto ficticio desarrollado únicamente con fines educativos y para portfolio.**

---

# Vista previa

> **Frontend:** https://north-barber.vercel.app

> **Backend:** https://north-barber.onrender.com

---

# Funcionalidades

## Sitio público

* Landing page moderna
* Sección de servicios
* Sección de barberos
* Galería de imágenes
* Información de contacto
* Diseño responsive
* Reserva de turnos online

## Sistema de reservas

* Selección de servicio
* Selección de barbero
* Fechas disponibles
* Horarios disponibles
* Formulario de datos del cliente
* Resumen de la reserva
* Confirmación del turno

## Panel administrativo

* Inicio de sesión seguro
* Dashboard principal
* Estadísticas generales
* Estadísticas de ingresos
* Panel de notificaciones

### Gestión de servicios

* Crear servicios
* Editar servicios
* Activar o desactivar servicios
* Eliminar servicios

### Gestión de barberos

* Crear barberos
* Editar información
* Subir fotografías
* Recortar imágenes
* Activar o desactivar
* Eliminar barberos

### Gestión de reservas

* Visualizar reservas
* Buscador
* Filtros
* Paginación
* Cambio de estado
* Notificaciones por correo
* Historial de reservas

### Horarios comerciales

* Configuración de horarios
* Días cerrados
* Disponibilidad pública

### Perfil del administrador

* Inicio de sesión
* Cambio de contraseña
* Cambio de correo electrónico
* Recuperación de contraseña
* Administración del perfil

---

# Tecnologías utilizadas

## Frontend

* React
* Vite
* React Router
* React Icons
* React Easy Crop
* CSS3

## Backend

* Node.js
* Express
* MySQL
* JWT
* Zod
* bcrypt
* Multer
* Nodemailer
* Helmet
* CORS
* Express Rate Limit

---

# Estructura del proyecto

```text
north-barber
│
├── frontend
│   ├── public
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   └── utils
│   │
│   ├── package.json
│   └── vite.config.js
│
├── backend
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── database
│   │   ├── middlewares
│   │   ├── models
│   │   ├── routes
│   │   ├── schemas
│   │   ├── services
│   │   ├── utils
│   │   └── server.js
│   │
│   └── package.json
│
├── README.md
└── README.es.md
```

---

# Instalación

Clonar el repositorio

```bash
git clone https://github.com/TU_USUARIO/north-barber.git
```

Ingresar al proyecto

```bash
cd north-barber
```

---

# Frontend

Instalar dependencias

```bash
cd frontend
npm install
```

Crear un archivo `.env`

```env
VITE_API_URL=http://localhost:3000/api/v1
```

Ejecutar en desarrollo

```bash
npm run dev
```

Crear el build de producción

```bash
npm run build
```

Visualizar el build

```bash
npm run preview
```

---

# Backend

Instalar dependencias

```bash
cd backend
npm install
```

Crear un archivo `.env`

```env
PORT=3000

FRONTEND_URL=http://localhost:5173

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=north_barber_db

JWT_SECRET=replace_with_secure_secret
JWT_EXPIRES_IN=1d

JWT_RESET_SECRET=replace_with_secure_reset_secret
JWT_RESET_EXPIRES_IN=15m

MAIL_HOST=smtp-relay.brevo.com
MAIL_PORT=587

MAIL_USER=your_brevo_login
MAIL_PASSWORD=your_brevo_smtp_key

MAIL_FROM="North Barber <your@email.com>"

MAIL_ENABLED=true
```

Ejecutar el backend

```bash
npm run dev
```

Producción

```bash
npm start
```

---

# Base de datos

Los scripts SQL se encuentran en:

```text
backend/src/database
```

Ejecutar en el siguiente orden:

```text
schema.sql

seed.sql
```

---

# Producción

Despliegue recomendado

| Servicio      | Plataforma |
| ------------- | ---------- |
| Frontend      | Vercel     |
| Backend       | Render     |
| Base de datos | MySQL      |
| Correos       | Brevo SMTP |

---

# Seguridad

* Autenticación mediante JWT
* Contraseñas cifradas con bcrypt
* Recuperación de contraseña
* Rate limiting
* Helmet
* Configuración de CORS
* Validaciones con Zod

---

# Diseño responsive

La aplicación fue optimizada para:

* Escritorio
* Notebook
* Tablet
* Dispositivos móviles

---

# Mejoras futuras

Posibles funcionalidades futuras:

* Cuentas para clientes
* Programa de fidelización
* Pagos online
* Varias sucursales
* Roles para empleados
* Estadísticas avanzadas
* Recordatorios automáticos
* Soporte para múltiples idiomas

---

# Autor

**Julian Haza**

GitHub

https://github.com/hazajulian

---

# Licencia

Licencia MIT.

Este proyecto fue desarrollado exclusivamente como proyecto educativo y de portfolio.
