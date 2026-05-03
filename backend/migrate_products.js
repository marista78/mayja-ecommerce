const db = require('./db');
const fs = require('fs');
const path = require('path');

const migrate = async () => {
  try {
    // Leer el archivo JSON desde el frontend
    const jsonPath = path.join(__dirname, '../frontend/src/utils/products.json');
    const products = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

    console.log(`Iniciando migración de ${products.length} productos...`);

    for (const p of products) {
      const query = `
        INSERT INTO productos 
        (nombre, precio, precio_original, categoria, subcategoria, imagenes, badge, descripcion, detalles, envio, stock)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          nombre = EXCLUDED.nombre,
          precio = EXCLUDED.precio,
          precio_original = EXCLUDED.precio_original,
          categoria = EXCLUDED.categoria,
          subcategoria = EXCLUDED.subcategoria,
          imagenes = EXCLUDED.imagenes,
          badge = EXCLUDED.badge,
          descripcion = EXCLUDED.descripcion,
          detalles = EXCLUDED.detalles,
          envio = EXCLUDED.envio,
          stock = EXCLUDED.stock;
      `;

      const values = [
        p.nombre,
        p.precio,
        p.precioOriginal || null,
        p.categoria,
        p.subcategoria,
        p.imagenes,
        p.badge || null,
        p.descripcion,
        p.detalles,
        p.envio,
        p.stock || 0
      ];

      await db.query(query, values);
      console.log(`✅ Producto migrado: ${p.nombre}`);
    }

    console.log('Migración completada con éxito.');
    process.exit(0);
  } catch (err) {
    console.error('Error durante la migración:', err);
    process.exit(1);
  }
};

migrate();
