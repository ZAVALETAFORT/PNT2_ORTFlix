CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    rol TEXT NOT NULL DEFAULT 'cliente',
    token TEXT,
    fecha_alta DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS salas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    filas INTEGER NOT NULL,
    columnas INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS favoritos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    movie_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    poster TEXT,
    puntaje REAL,
    nota TEXT,

    UNIQUE(usuario_id, movie_id),

    FOREIGN KEY(usuario_id)
        REFERENCES usuarios(id)
);

CREATE TABLE IF NOT EXISTS funciones (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    movie_id INTEGER NOT NULL,
    titulo TEXT NOT NULL,
    sala_id INTEGER NOT NULL,
    fecha TEXT NOT NULL,
    hora TEXT NOT NULL,
    formato TEXT NOT NULL,
    idioma TEXT NOT NULL,
    precio REAL NOT NULL,

    FOREIGN KEY(sala_id)
        REFERENCES salas(id)
);

CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    funcion_id INTEGER NOT NULL,
    estado TEXT NOT NULL DEFAULT 'confirmada',
    fecha_creacion TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY(usuario_id)
        REFERENCES usuarios(id),

    FOREIGN KEY(funcion_id)
        REFERENCES funciones(id)
);

-- UNIQUE(funcion_id, asiento): la base impide reservar dos veces el mismo asiento
CREATE TABLE IF NOT EXISTS reserva_asientos (
    reserva_id INTEGER NOT NULL,
    funcion_id INTEGER NOT NULL,
    asiento TEXT NOT NULL,

    UNIQUE(funcion_id, asiento),

    FOREIGN KEY(reserva_id)
        REFERENCES reservas(id)
);
