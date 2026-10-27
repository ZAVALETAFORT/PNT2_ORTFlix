CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    poster TEXT,
    puntaje REAL,
    nota TEXT,

    FOREIGN KEY(usuario_id)
        REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS funciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    sala TEXT NOT NULL,
    precio REAL NOT NULL,
    capacidad INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    funcion_id INTEGER NOT NULL,
    cantidad INTEGER NOT NULL,

    FOREIGN KEY(usuario_id)
        REFERENCES usuarios(id),

    FOREIGN KEY(funcion_id)
        REFERENCES funciones(id)
);