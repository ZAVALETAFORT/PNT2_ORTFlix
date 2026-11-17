// Recrea salas, funciones y reservas (dependen de las fechas) y carga los datos de ejemplo.
// Los usuarios (con su rol) y los favoritos se conservan. Para borrar TODO: npm run db:init -- --todo
// Las funciones se arman con las películas en cartelera de TMDB; si TMDB no responde se usan las de src/data/mock.js.
// Uso: npm run db:init
import fs from "node:fs";
import db from "../lib/db.js";
import { hashPassword } from "../lib/auth.js";
import { usuarios, credenciales, salas, funciones as funcionesMock, reservas, armarFunciones } from "../src/data/mock.js";
import { traerPeliculas } from "./funcionesTmdb.js";

const borrarTodo = process.argv.includes("--todo");

// Si la tabla usuarios es de una versión vieja (sin rol), no se puede conservar
const columnas = db.prepare("PRAGMA table_info(usuarios)").all().map((c) => c.name);
if (!borrarTodo && columnas.length > 0 && !columnas.includes("rol")) {
  console.log("La tabla usuarios es de una versión vieja. Corré: npm run db:init -- --todo");
  process.exit(1);
}

let funciones = funcionesMock;
let origen = "el mock";
try {
  funciones = armarFunciones(await traerPeliculas());
  origen = "las películas de TMDB";
} catch (e) {
  console.log(`No se pudo usar TMDB (${e.message}). Se usan las funciones del mock.`);
}

// Se borra en este orden porque unas tablas dependen de otras
db.exec(`
  DROP TABLE IF EXISTS reserva_asientos;
  DROP TABLE IF EXISTS reservas;
  DROP TABLE IF EXISTS funciones;
  DROP TABLE IF EXISTS salas;
`);
if (borrarTodo) {
  db.exec(`
    DROP TABLE IF EXISTS favoritos;
    DROP TABLE IF EXISTS usuarios;
  `);
}

// Las tablas que se conservan no se tocan (CREATE TABLE IF NOT EXISTS)
const schema = fs.readFileSync("./database/schema.sql", "utf8");
db.exec(schema);

// Los usuarios de ejemplo se agregan solo si faltan, y siempre vuelven con su rol (el admin sigue siendo admin)
const idUsuario = {}; // id del mock -> id real en la base
for (const u of usuarios) {
  db.prepare("INSERT OR IGNORE INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)").run(
    u.nombre, u.email, hashPassword(credenciales[u.email]), u.rol
  );
  db.prepare("UPDATE usuarios SET rol = ? WHERE email = ?").run(u.rol, u.email);
  idUsuario[u.id] = db.prepare("SELECT id FROM usuarios WHERE email = ?").get(u.email).id;
}

for (const s of salas) {
  db.prepare("INSERT INTO salas (id, nombre, filas, columnas) VALUES (?, ?, ?, ?)").run(
    s.id, s.nombre, s.filas, s.columnas
  );
}

for (const f of funciones) {
  db.prepare(
    "INSERT INTO funciones (id, movie_id, titulo, sala_id, fecha, hora, formato, idioma, precio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
  ).run(f.id, f.movieId, f.titulo, f.salaId, f.fecha, f.hora, f.formato, f.idioma, f.precio);
}

for (const r of reservas) {
  db.prepare("INSERT INTO reservas (id, usuario_id, funcion_id, estado, fecha_creacion) VALUES (?, ?, ?, ?, ?)").run(
    r.id, idUsuario[r.usuarioId], r.funcionId, r.estado, r.fechaCreacion
  );
  for (const asiento of r.asientos) {
    db.prepare("INSERT INTO reserva_asientos (reserva_id, funcion_id, asiento) VALUES (?, ?, ?)").run(
      r.id, r.funcionId, asiento
    );
  }
}

const totalUsuarios = db.prepare("SELECT COUNT(*) AS n FROM usuarios").get().n;
const totalFavoritos = db.prepare("SELECT COUNT(*) AS n FROM favoritos").get().n;
console.log(
  `Base database/ortflix.db lista (${borrarTodo ? "borrada por completo" : "usuarios y favoritos conservados"}): ` +
  `${totalUsuarios} usuarios, ${totalFavoritos} favoritos, ${salas.length} salas, ` +
  `${funciones.length} funciones (con ${origen}), ${reservas.length} reservas de ejemplo.`
);
db.close();
