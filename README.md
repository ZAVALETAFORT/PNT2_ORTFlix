## 🎬 ORTFlix

### Sistema de cartelera y reservas de cine

**Proyecto Integrador – Programación de Nuevas Tecnologías 2 (PNT2)**

**ORTFlix** es una aplicación web de cartelera cinematográfica desarrollada con **React y Next.js**, que permite explorar películas, descubrir estrenos, gestionar favoritos, consultar funciones y realizar reservas.

## 👥 Equipo de desarrollo

**Carrera de Sistemas – ORT**


| Integrante                              | GitHub              |
| ----------------------------------------- | --------------------- |
| Colombo Leandro Nahuel                  | `LeandroColombo111` |
| Cortina Santiago Manuel                 | `santicortina-97`   |
| Pereyra Juan Manuel                     | `JuanMaPereyraDev`  |
| Ruhl Canchero Nicolás                  | `NicoCanchero`      |
| Zavaleta Villavicencio Moisés Fernando | `ZAVALETAFORT`      |

---

## 🍿 ¿Qué es ORTFlix?

### Descubrí. Elegí. Reservá.

ORTFlix busca transformar una cartelera tradicional en una **experiencia digital interactiva**.

En lugar de limitarse a mostrar una lista de películas, la plataforma propone que cada usuario pueda explorar los estrenos, guardar sus títulos favoritos y organizar sus próximas visitas al cine desde una misma aplicación.

La experiencia se organiza alrededor de cuatro funcionalidades principales:

- **🎥 Descubrir películas:** explorar la cartelera actualizada utilizando información de The Movie Database (TMDB).
- **❤️ Personalizar la experiencia:** crear una cuenta y gestionar una colección de películas favoritas.
- **🎟️ Consultar funciones:** conocer las fechas, los horarios y las salas disponibles.
- **📅 Gestionar reservas:** reservar entradas, consultar reservas realizadas y efectuar modificaciones.

Todo mediante una interfaz desarrollada en **Next.js**, con navegación fluida y componentes React reutilizables.

---

## 🎯 Objetivos del proyecto

El objetivo principal es desarrollar una aplicación web que integre los conocimientos adquiridos durante la cursada, aplicándolos a un sistema simplificado de cartelera y reservas de cine.

### Objetivos específicos

1. Implementar una arquitectura basada en componentes reutilizables de React.
2. Utilizar el sistema de rutas de Next.js para navegar entre las diferentes vistas.
3. Consumir APIs REST mediante `fetch`, `async/await` y peticiones HTTP.
4. Implementar operaciones de Alta, Baja y Modificación (ABM).
5. Administrar estados mediante React Hooks.
6. Implementar un flujo completo de autenticación de usuarios.
7. Aplicar validaciones y renderizado condicional.
8. Integrar las funcionalidades desarrolladas por distintos integrantes mediante Git y GitHub.

---

## 🚀 Funcionalidades

### 1. 🎥 Cartelera de películas

**Explorá las películas disponibles en un solo lugar.**

La pantalla principal de ORTFlix está pensada como una cartelera de cine interactiva, utilizando la API de TMDB para obtener información actualizada.

**Características previstas:**

- Visualización de películas mediante tarjetas.
- Póster, título, fecha de estreno y puntuación.
- Búsqueda de películas por nombre.
- Acceso a una vista de detalle.
- Manejo de imágenes e información faltante.
- Mensajes de carga, error y ausencia de resultados.

**API:** The Movie Database (TMDB).

### 2. 👤 Autenticación de usuarios

**Una experiencia personalizada comienza con una cuenta.**

El sistema incorpora registro e inicio de sesión mediante una API REST, permitiendo identificar al usuario y ofrecer funcionalidades asociadas a su cuenta.

**Funcionalidades implementadas:**

- Registro de nuevos usuarios.
- Inicio de sesión con email y contraseña.
- Cierre de sesión.
- Validación de campos obligatorios.
- Validación del formato de email.
- Contraseña mínima de seis caracteres.
- Control de emails duplicados mediante el backend.
- Manejo de mensajes de error y éxito.
- Redirección automática después del registro.
- Persistencia de datos de sesión mediante `localStorage`.

### 3. ❤️ ABM de Favoritos

**Guardá las películas que no querés perderte.**

Cada usuario podrá construir su propia selección de películas y administrar sus preferencias.


| Operación        | Funcionalidad                                     |
| ------------------- | --------------------------------------------------- |
| **Alta**          | Agregar una película a favoritos                 |
| **Baja**          | Eliminar una película de favoritos               |
| **Modificación** | Editar información personal asociada al favorito |
| **Consulta**      | Visualizar la colección de favoritos             |

### 4. 🎟️ ABM de Funciones

**Cada película tiene su momento.**

Este módulo permitirá administrar las funciones disponibles para cada película.


| Operación        | Funcionalidad                         |
| ------------------- | --------------------------------------- |
| **Alta**          | Crear una función                    |
| **Baja**          | Eliminar una función                 |
| **Modificación** | Cambiar fecha, horario, sala o precio |
| **Consulta**      | Visualizar las funciones disponibles  |

Las funciones estarán asociadas a películas identificadas mediante sus respectivos IDs.

### 5. 📅 ABM de Reservas

**Elegí tu función y organizá tu próxima salida al cine.**

El módulo de reservas permitirá vincular al usuario con una función cinematográfica.


| Operación        | Funcionalidad                              |
| ------------------- | -------------------------------------------- |
| **Alta**          | Realizar una reserva                       |
| **Baja**          | Cancelar una reserva                       |
| **Modificación** | Cambiar de función o modificar la reserva |
| **Consulta**      | Visualizar las reservas realizadas         |

---

## 🖥️ Vistas de la aplicación

La aplicación utiliza **Next.js App Router** para administrar la navegación entre las diferentes secciones.


| Vista                    | Ruta              | Descripción                              |
| -------------------------- | ------------------- | ------------------------------------------- |
| **Home**                 | `/`               | Cartelera principal de películas         |
| **Login**                | `/login`          | Inicio de sesión                         |
| **Register**             | `/register`       | Registro de usuarios                      |
| **Favoritos**            | `/favoritos`      | Gestión de películas favoritas          |
| **Funciones**            | `/funciones`      | Consulta y administración de funciones   |
| **Reservas**             | `/reservas`       | Gestión de reservas                      |
| **Detalle de película** | `/peliculas/[id]` | Información individual de cada película |

**Nota:** las rutas de Favoritos, Funciones, Reservas y Detalle forman parte del alcance previsto y pueden ajustarse durante el desarrollo.

---

## 📑 Contrato de datos

Todas las respuestas de la API usan **camelCase** y estas formas exactas. Los errores siempre vienen como `{ "message": "texto en español" }`.

### Objetos

```js
usuario = { id, nombre, email, rol }                 // rol: "admin" | "cliente". Nunca incluye password ni token
sala    = { id, nombre, filas, columnas }
funcion = { id, movieId, titulo, salaId, fecha, hora, formato, idioma, precio }
          // fecha "2026-11-05", hora "20:30", formato "2D" | "3D" | "4D", idioma "Subtitulada" | "Castellano"
reserva = { id, usuarioId, funcionId, asientos, estado, fechaCreacion }
          // asientos ["A1","A2"], estado "confirmada" | "cancelada"
```

`movieId` es el id de la película en TMDB.

### Endpoints

| Método | Ruta | Acceso | Descripción |
| --- | --- | --- | --- |
| GET | `/api/users/me` | token | Usuario del token con su rol → `usuario` |
| GET | `/api/salas` | público | Lista de `sala` |
| GET | `/api/funciones` | público | Lista de `funcion` (filtro opcional `?movieId=`) |
| GET | `/api/funciones/[id]` | público | Una `funcion` |
| POST | `/api/funciones` | admin | Crea una función |
| PUT | `/api/funciones/[id]` | admin | Modifica una función |
| DELETE | `/api/funciones/[id]` | admin | Borra una función |
| GET | `/api/funciones/[id]/asientos-ocupados` | público | `["A1","B4"]` |
| GET | `/api/reservas` | token | Reservas del usuario logueado |
| POST | `/api/reservas` | token | Body `{ funcionId, asientos }` |
| PUT | `/api/reservas/[id]` | token | `{ estado: "cancelada" }` o `{ funcionId, asientos }` |

Los endpoints con token requieren el header `Authorization: Bearer <token>`. El registro y el login **no** son parte de esta API: se hacen contra el backend del profesor (`NEXT_PUBLIC_API_URL`), y el token que devuelve es el que se usa acá.

### Claves de localStorage

| Clave | Contenido |
| --- | --- |
| `token` | Token devuelto por el login del backend del profesor (string) |
| `user` | Usuario que devuelve ese login (`JSON.stringify`): `{ _id, username, email }`. El rol se consulta con `GET /api/users/me` |
| `userEmail` | Email del usuario logueado (string) |

### Datos de prueba (mock)

Mientras no esté el backend, importar los datos de `src/data/mock.js`:

```js
import { funciones, salas, reservas, usuarios } from "@/src/data/mock";
```

Usuarios de prueba (ya registrados en el backend del profesor): `admin@ortflix.com` / `admin123` y `cliente@ortflix.com` / `cliente123`.

---

## 🗄️ Base de datos y API

La base es **SQLite en un archivo** (`database/ortflix.db`, ignorado por git). Se usa con el módulo integrado `node:sqlite` de Node (requiere Node 22.5 o superior), así que no hay que instalar nada extra.

| Archivo | Para qué sirve |
| --- | --- |
| `database/schema.sql` | Las tablas: `usuarios`, `salas`, `funciones`, `reservas`, `reserva_asientos` y `favoritos` |
| `database/initDb.js` | Borra y recrea las tablas y carga los datos de `src/data/mock.js` |
| `lib/db.js` | Conexión a la base, la usan todos los endpoints |
| `lib/auth.js`, `lib/api.js`, `lib/validar.js` | Funciones de ayuda de los endpoints |

Los endpoints son Route Handlers de Next en `app/api/`.

### Inicializar la base

```bash
npm run db:init
```

Borra y recrea las tablas y carga los mismos datos que `src/data/mock.js` (2 usuarios, 2 salas, 4 funciones, 2 reservas). Se puede correr de nuevo cuando se quiera volver al estado inicial. Después, `npm run dev` y la API queda en `http://localhost:3000/api/...`.

`NEXT_PUBLIC_API_URL` tiene que seguir apuntando al **backend del profesor** (no a `localhost:3000`): ahí se hacen el registro y el login. Opcional: `AUTH_API_URL` en `.env` para cambiar el backend con el que nuestra API valida el token (por defecto es el mismo del profesor).

### Autenticación y errores

- **Login y registro:** los hace el backend del profesor (`POST /api/users/login` y `/register`). El login devuelve `{ message, user: { _id, username, email }, token }`. El token es un JWT que vence a las 2 horas.
- **Cómo validamos el token:** nuestros endpoints privados leen `Authorization: Bearer <token>` y le preguntan al backend del profesor (`GET /api/users/<_id>`) si el token es válido. Si lo es, buscan al usuario por email en nuestra base y, si no existe, lo crean como `cliente`.
- **Rol admin:** vive en nuestra base (`usuarios.rol`). `admin@ortflix.com` ya viene como admin con `npm run db:init` y ya está registrado en el backend del profesor. Para hacer admin a otro email: `UPDATE usuarios SET rol = 'admin' WHERE email = '...'`.
- Sin token, con token inválido o vencido → `401`. Endpoint solo admin con un usuario cliente → `403`.
- Los errores siempre vienen como `{ "message": "texto en español" }`.

### Usuarios

**GET `/api/users/me`** (token) → `200` `{ "id": 3, "nombre": "Pablo Hinojosa", "email": "pablo.hinojosa@ort.edu.ar", "rol": "cliente" }`. `401` sin token o con token inválido.

### Salas

**GET `/api/salas`** → `[ { "id": 1, "nombre": "Sala 1", "filas": 8, "columnas": 10 }, ... ]`

### Funciones

**GET `/api/funciones`** (filtro opcional `?movieId=1400940`)
→ `[ { "id": 1, "movieId": 1400940, "titulo": "Clayface", "salaId": 1, "fecha": "2026-10-28", "hora": "20:30", "formato": "3D", "idioma": "Subtitulada", "precio": 9500 }, ... ]`

**GET `/api/funciones/[id]`** → una función. `404` si no existe.

**POST `/api/funciones`** (solo admin) — body:

```json
{ "movieId": 1255833, "titulo": "Whalefall", "salaId": 1, "fecha": "2026-11-03", "hora": "19:00", "formato": "2D", "idioma": "Castellano", "precio": 8500 }
```

→ `201` con la función creada. `400` si hay datos inválidos, `409` si ya hay una función en esa sala, fecha y hora.

**PUT `/api/funciones/[id]`** (solo admin) — mismo body que el POST → `200` con la función modificada. `404` si no existe, `409` si choca con otra función (o si se cambia la sala y ya hay reservas).

**DELETE `/api/funciones/[id]`** (solo admin) → `200` `{ "message": "Función eliminada." }`. `409` si tiene reservas confirmadas.

**GET `/api/funciones/[id]/asientos-ocupados`** → `["A1","A2"]` (solo de reservas confirmadas).

### Reservas

**GET `/api/reservas`** (token) → reservas del usuario logueado:
`[ { "id": 1, "usuarioId": 2, "funcionId": 1, "asientos": ["A1","A2"], "estado": "confirmada", "fechaCreacion": "2026-10-27T10:00:00" } ]`

**POST `/api/reservas`** (token) — body `{ "funcionId": 2, "asientos": ["B1","B2"] }` → `201` con la reserva confirmada. `400` si los asientos no existen en la sala, `404` si la función no existe, `409` si algún asiento ya está ocupado.

**PUT `/api/reservas/[id]`** (token, solo el dueño de la reserva)
- Cancelar: body `{ "estado": "cancelada" }` → `200`. Los asientos quedan libres, por eso la reserva cancelada devuelve `"asientos": []`.
- Cambiar de función: body `{ "funcionId": 4, "asientos": ["A1","A2"] }` → `200`.
- Errores: `403` si la reserva es de otro usuario, `404` si no existe, `409` si ya está cancelada o hay asientos ocupados.

### Ejemplo con curl

```bash
# login en el backend del profesor (devuelve el token)
curl -X POST https://backendairbnb-befph8eegzabfudb.eastus2-01.azurewebsites.net/api/users/login -H "Content-Type: application/json" -d '{"email":"TU_EMAIL","password":"TU_PASSWORD"}'

# usar el token en nuestra API
curl http://localhost:3000/api/reservas -H "Authorization: Bearer <token>"
```

---

## ⚙️ Instalación y ejecución

### Requisitos previos

- Node.js y npm.
- Git.
- Acceso al backend REST del proyecto.
- Token de acceso a TMDB.

### 1. Clonar el repositorio

```bash
git clone https://github.com/ZAVALETAFORT/PNT2_ORTFlix.git
cd PNT2_ORTFlix
```

### 2. Instalar dependencias

Instalar las dependencias definidas en `package-lock.json`:

```bash
npm ci
```

### 3. Configurar variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```dotenv
# TMDB API
TMDB_TOKEN=TU_TOKEN_TMDB
TMDB_BASE_URL=https://api.themoviedb.org/3
IMG_URL=https://image.tmdb.org/t/p/w500

# Backend REST
NEXT_PUBLIC_API_URL=https://backendairbnb-befph8eegzabfudb.eastus2-01.azurewebsites.net
```

**Importante:** el archivo `.env` está excluido del control de versiones mediante `.gitignore`.

### 4. Iniciar el servidor de desarrollo

```bash
npm run dev
```

Abrir la aplicación desde el navegador:

[**http://localhost:3000**](http://localhost:3000)

### 5. Verificar la compilación

Para comprobar que el proyecto compila:

```bash
npm run build
```

Para ejecutar el análisis estático del código:

```bash
npm run lint
```

---

## 🌿 Metodología de trabajo

El proyecto utiliza **GitHub** para organizar el desarrollo colaborativo, distribuir tareas y mantener un historial de los cambios realizados.

### Estrategia de ramas

- **`main`:** versión principal del proyecto.
- **`develop`:** rama de integración de funcionalidades desarrolladas por el equipo.
- **Ramas individuales:** espacios de trabajo independientes para cada integrante.

Las funcionalidades se desarrollan por separado y posteriormente se integran mediante Pull Requests o merges hacia `develop`.

### Seguimiento mediante GitHub Issues

Cada funcionalidad se organiza como una tarea con su descripción, requisitos y criterios de aceptación.

El objetivo es mantener trazabilidad sobre:

- Responsables de cada módulo.
- Funcionalidades implementadas.
- Errores detectados y corregidos.
- Pruebas funcionales realizadas.
- Cambios incorporados al proyecto.

### Flujo de integración

1. Crear o actualizar una rama individual.
2. Desarrollar la funcionalidad asignada.
3. Ejecutar las pruebas correspondientes.
4. Registrar los cambios mediante commits.
5. Subir los cambios a GitHub.
6. Revisar e integrar los cambios en `develop`.
7. Actualizar el estado del issue correspondiente.

---


## 📊 Estado del desarrollo

El proyecto se desarrolla de forma incremental mediante GitHub Issues, ramas individuales y Pull Requests hacia `develop`.

### ✅ Checklist de avance

**Estructura y configuración**

- [X]  Proyecto Next.js y React.
- [X]  Repositorio GitHub y ramas de trabajo.
- [X]  Integración con TMDB.
- [X]  Estructura inicial SQLite.
- [ ]  API REST propia y persistencia completa.
- [ ]  Integración y pruebas generales.

**Autenticación y usuarios**

- [X]  Registro de usuarios.
- [X]  Login y Logout.
- [X]  Validaciones de formularios.
- [X]  Integración inicial con backend externo.
- [ ]  Sistema de roles (Administrador y Cliente).
- [ ]  Protección de rutas según permisos.
- [ ]  Integración de autenticación con SQLite.

**Cartelera y películas**

- [X]  Consulta de películas mediante TMDB.
- [X]  Visualización de tarjetas.
- [X]  Buscador de películas.
- [ ]  Detalle de película.
- [ ]  Visualización de funciones disponibles.

**Gestión del cine**

- [ ]  ABM de funciones.
- [ ]  ABM de reservas.
- [ ]  Selección de asientos.
- [ ]  Prevención de reservas duplicadas.
- [ ]  ABM de favoritos.
- [ ]  ABM de empleados.
- [ ]  Incorporación del rol Empleado.

---


### 🎯 Entregable para la próxima clase

**Objetivo:** implementar el flujo de selección de películas y reserva de asientos, tomando como referencia Cinemark.

- [ ]  Acceder al detalle de una película.
- [ ]  Seleccionar función, día y horario.
- [ ]  Seleccionar formato (2D, 3D o 4D).
- [ ]  Visualizar asientos disponibles y ocupados.
- [ ]  Seleccionar y confirmar una reserva.
- [ ]  Impedir reservar dos veces el mismo asiento para una función.
- [ ]  Consultar las reservas realizadas.

---

### 🔄 Estado de integración


| Funcionalidad             | Estado                               |
| --------------------------- | -------------------------------------- |
| Login, Registro y Logout  | ✅ Integrado                         |
| Cartelera TMDB y buscador | ✅ Integrado, con ajustes pendientes |
| Estructura inicial SQLite | ✅ Integrado                         |
| Detalle de película      | ⏳ Pendiente                         |
| Sistema de roles          | ⏳ Pendiente                         |
| ABM de funciones          | ⏳ Pendiente                         |
| Reservas y asientos       | ⏳ Pendiente                         |
| API REST propia           | ⏳ Pendiente                         |
| ABM Favoritos y Empleados | ⏳ Pendiente                         |


**Criterio de finalización:** cada funcionalidad debe estar implementada, probada y fusionada en `develop`
