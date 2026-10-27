const Database = require("better-sqlite3");
const fs = require("fs");

const db = new Database("./database/ortflix.db");

const schema = fs.readFileSync(
  "./database/schema.sql",
  "utf8"
);

db.exec(schema);

console.log("Base creada correctamente");
const tablas = db.prepare(`
  SELECT name
  FROM sqlite_master
  WHERE type='table'
`).all();

console.log(tablas);

db.close();