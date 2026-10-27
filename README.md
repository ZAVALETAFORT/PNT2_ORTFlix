
## 🎬 ORTFlix

### Sistema de cartelera y reservas de cine

**Proyecto Integrador – Programación de Nuevas Tecnologías 2 (PNT2)**

**ORTFlix** es una aplicación web de cartelera cinematográfica desarrollada con **React y Next.js**, que permite explorar películas, descubrir estrenos, gestionar favoritos, consultar funciones y realizar reservas.

---

## 👥 Equipo de desarrollo


| Integrante                              | GitHub              |
| ----------------------------------------- | --------------------- |
| Colombo Leandro Nahuel                  | `LeandroColombo111` |
| Cortina Santiago Manuel                 | `santicortina-97`   |
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

El proyecto se desarrolla de forma incremental. Las funcionalidades se marcan como completadas una vez implementadas, probadas e integradas en `develop`.

### ✅ Checklist de avance

- [X]  Estructura inicial Next.js.
- [X]  Configuración del repositorio y ramas Git.
- [X]  Login de usuarios.
- [X]  Registro de usuarios.
- [X]  Logout (cierre de sesión).
- [X]  Validaciones del formulario de registro.
- [X]  Integración del registro con el backend.
- [ ]  Cartelera de películas mediante TMDB API.
- [ ]  ABM Favoritos.
- [ ]  ABM Funciones.
- [ ]  ABM Reservas.
- [ ]  Persistencia propia de datos.

**Criterio de finalización:** cada módulo debe estar implementado, probado funcionalmente e integrado en la rama `develop`.
