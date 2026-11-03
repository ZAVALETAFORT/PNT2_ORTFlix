// Borra y recrea las tablas con schema.sql y carga los mismos datos que src/data/mock.js
// Uso: npm run db:init
import fs from "node:fs";
import db from "../lib/db.js";
import { hashPassword } from "../lib/auth.js";
import { usuarios, credenciales, salas, funciones, reservas } from "../src/data/mock.js";

// Se borra en este orden porque unas tablas dependen de otras
db.exec(`
  DROP TABLE IF EXISTS reserva_asientos;
  DROP TABLE IF EXISTS reservas;
  DROP TABLE IF EXISTS funciones;
  DROP TABLE IF EXISTS salas;
  DROP TABLE IF EXISTS favoritos;
  DROP TABLE IF EXISTS usuarios;
`);

const schema = fs.readFileSync("./database/schema.sql", "utf8");
db.exec(schema);

for (const u of usuarios) {
  db.prepare("INSERT INTO usuarios (id, nombre, email, password, rol) VALUES (?, ?, ?, ?, ?)").run(
    u.id, u.nombre, u.email, hashPassword(credenciales[u.email]), u.rol
  );
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
    r.id, r.usuarioId, r.funcionId, r.estado, r.fechaCreacion
  );
  for (const asiento of r.asientos) {
    db.prepare("INSERT INTO reserva_asientos (reserva_id, funcion_id, asiento) VALUES (?, ?, ?)").run(
      r.id, r.funcionId, asiento
    );
  }
}

console.log(
  `Base database/ortflix.db lista: ${usuarios.length} usuarios, ${salas.length} salas, ${funciones.length} funciones, ${reservas.length} reservas.`
);
db.close();
