import { DatabaseSync } from "node:sqlite";

// SQLite en un archivo, con el módulo que ya trae Node (no hay que instalar nada)
const db = new DatabaseSync("./database/ortflix.db");

export default db;
