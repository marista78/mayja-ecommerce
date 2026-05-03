const db = require('./db');

const initDB = async () => {
  console.log('DATABASE_URL length:', process.env.DATABASE_URL ? process.env.DATABASE_URL.length : 0);
  console.log('DATABASE_URL prefix:', process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) : 'none');
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS productos (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      precio DECIMAL(10, 2) NOT NULL,
      precio_original DECIMAL(10, 2),
      categoria VARCHAR(100),
      subcategoria VARCHAR(100),
      imagenes TEXT[],
      badge VARCHAR(50),
      descripcion TEXT,
      detalles TEXT[],
      envio TEXT,
      stock INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS pedidos (
      id SERIAL PRIMARY KEY,
      cliente_nombre VARCHAR(255) NOT NULL,
      cliente_email VARCHAR(255),
      cliente_whatsapp VARCHAR(50),
      direccion TEXT,
      productos JSONB NOT NULL,
      total DECIMAL(10, 2) NOT NULL,
      estado VARCHAR(50) DEFAULT 'pendiente',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS mensajes (
      id SERIAL PRIMARY KEY,
      nombre VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL,
      asunto VARCHAR(255),
      mensaje TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    console.log('Iniciando conexión con Supabase...');
    await db.query(createTablesQuery);
    console.log('Tablas "productos", "pedidos" y "mensajes" verificadas/creadas exitosamente.');
    process.exit(0);
  } catch (err) {
    console.error('Error al inicializar la base de datos:', err);
    process.exit(1);
  }
};

initDB();
