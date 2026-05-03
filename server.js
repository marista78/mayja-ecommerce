const express = require('express');
const cors = require('cors');
const db = require('./db');
const multer = require('multer');
const path = require('path');
const fs = require('fs-extra');
const slugify = require('slugify');
require('dotenv').config();
9
const app = express();
const PORT = process.env.PORT || 5000;
12
// Middleware
app.use(cors());
app.use(express.json());
// Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
18
// Configuración de Multer
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      const productSlug = slugify(req.body.nombre || 'producto', { lower: true, strict: true });
      const categorySlug = slugify(req.body.categoria || 'general', { lower: true, strict: true });
      const dir = path.join(__dirname, `public/uploads/products/${categorySlug}/${productSlug}`);
      await fs.ensureDir(dir);
      cb(null, dir);
    } catch (e) {
      cb(e);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
37
const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }
});
42
// Wrapper para capturar errores de Multer y devolverlos como JSON
const uploadFields = (req, res, next) => {
  upload.fields([
    { name: 'imagenes', maxCount: 5 },
    { name: 'video', maxCount: 1 }
  ])(req, res, (err) => {
    if (err) {
      console.error('Error de Multer:', err);
      return res.status(500).json({ error: 'Error al procesar archivos: ' + err.message });
    }
    next();
  });
};
56
// --- ROUTES ---
58
// GET Products
app.get('/api/products', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM productos ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
69
// POST Create Product
app.post('/api/products', uploadFields, async (req, res) => {
  try {
    const { nombre, precio, precio_original, categoria, stock, descripcion, badge, concepto } = req.body;
74
    const cleanPrecioOriginal = !precio_original || precio_original === '' ? null : precio_original;
    const cleanStock = !stock || stock === '' ? 0 : parseInt(stock);
77
    const imageUrls = (req.files && req.files['imagenes']) ? req.files['imagenes'].map(file => {
      const relativePath = path.relative(path.join(__dirname, 'public'), file.path);
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      return `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;
    }) : [];
83
    let videoUrl = null;
    if (req.files && req.files['video'] && req.files['video'][0]) {
      const relativePath = path.relative(path.join(__dirname, 'public'), req.files['video'][0].path);
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      videoUrl = `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;
    }
90
    // Insertar producto primero para obtener el ID
    const insertResult = await db.query(
      `INSERT INTO productos
      (nombre, precio, precio_original, categoria, stock, descripcion, badge, imagenes, video_url, concepto)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id`,
      [nombre, precio, cleanPrecioOriginal, categoria, cleanStock, descripcion, badge, imageUrls, videoUrl, concepto]
    );
99
    // Generar SKU automático basado en categoría + ID
    const newId = insertResult.rows[0].id;
    const catPrefixes = { 'Hogar': 'HOG', 'Sensorial': 'SEN', 'Tecnología': 'TEC', 'Tecnologia': 'TEC', 'Ropa': 'ROP' };
    const prefix = catPrefixes[categoria] || 'GEN';
    const sku = `${prefix}-${String(newId).padStart(4, '0')}`;
105
    // Actualizar con el SKU generado y retornar el producto completo
    const result = await db.query(
      'UPDATE productos SET sku = $1 WHERE id = $2 RETURNING *',
      [sku, newId]
    );
111
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error detallado al crear producto:', err);
    res.status(500).json({ error: 'Error al crear el producto: ' + err.message });
  }
});
118
// PUT Update Product
app.put('/api/products/:id', uploadFields, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, precio_original, categoria, stock, descripcion, badge, imagenesExistentes, videoExistente, concepto } = req.body;
124
    const cleanPrecioOriginal = !precio_original || precio_original === '' ? null : precio_original;
    const cleanStock = !stock || stock === '' ? 0 : parseInt(stock);
127
    let finalImages = [];
    if (imagenesExistentes) {
      try { finalImages = JSON.parse(imagenesExistentes); } catch(e) { finalImages = []; }
    }
132
    if (req.files && req.files['imagenes'] && req.files['imagenes'].length > 0) {
      const newImages = req.files['imagenes'].map(file => {
        const relativePath = path.relative(path.join(__dirname, 'public'), file.path);
        const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
        return `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;
      });
      finalImages = [...finalImages, ...newImages];
    }
141
    let finalVideo = videoExistente || null;
    if (req.files && req.files['video'] && req.files['video'][0]) {
      const relativePath = path.relative(path.join(__dirname, 'public'), req.files['video'][0].path);
      const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
      finalVideo = `${baseUrl}/${relativePath.replace(/\\/g, '/')}`;
    }
148
    const result = await db.query(
      `UPDATE productos SET
      nombre = $1, precio = $2, precio_original = $3, categoria = $4,
      stock = $5, descripcion = $6, badge = $7, imagenes = $8, video_url = $9, concepto = $10
      WHERE id = $11 RETURNING *`,
      [nombre, precio, cleanPrecioOriginal, categoria, cleanStock, descripcion, badge, finalImages, finalVideo, concepto, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error detallado al actualizar producto:', err);
    res.status(500).json({ error: 'Error al actualizar el producto: ' + err.message });
  }
});
162
// DELETE Product
app.delete('/api/products/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM productos WHERE id = $1', [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al eliminar el producto' });
  }
});
174
// GET Pedidos
app.get('/api/pedidos', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM pedidos ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});
185
// POST Pedidos
app.post('/api/pedidos', async (req, res) => {
  const { nombre, email, whatsapp, direccion, productos, total } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO pedidos (cliente_nombre, cliente_email, cliente_whatsapp, direccion, productos, total) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nombre, email, whatsapp, direccion, JSON.stringify(productos), total]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al procesar el pedido' });
  }
});
200
// POST Contacto
app.post('/api/contacto', async (req, res) => {
  const { nombre, email, asunto, mensaje } = req.body;
  try {
    const result = await db.query(
      'INSERT INTO mensajes (nombre, email, asunto, mensaje) VALUES ($1, $2, $3, $4) RETURNING *',
      [nombre, email, asunto, mensaje]
    );
    res.status(201).json({ success: true, message: 'Mensaje recibido correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al enviar el mensaje' });
  }
});

// POST Reclamación (Libro de Reclamaciones)
app.post('/api/reclamaciones', async (req, res) => {
  const {
    tipo_persona, nombre, domicilio, tipo_documento, num_documento,
    telefono, email, departamento, provincia, distrito,
    es_menor, padre_tutor, apoderado_dni, apoderado_email, apoderado_telefono, apoderado_direccion,
    tipo_bien, tipo_comprobante, num_comprobante, descripcion_bien,
    tipo_reclamo, detalle_reclamo
  } = req.body;
223
  try {
    // Generar correlativo
    const countRes = await db.query('SELECT COUNT(*) FROM reclamaciones');
    const nextNum = parseInt(countRes.rows[0].count) + 1;
    const year = new Date().getFullYear();
    const correlativo = `RECL-${year}-${String(nextNum).padStart(4, '0')}`;
230
    const result = await db.query(
      `INSERT INTO reclamaciones
      (correlativo, tipo_persona, nombre, domicilio, tipo_documento, num_documento, telefono, email, departamento, provincia, distrito, es_menor, padre_tutor, apoderado_dni, apoderado_email, apoderado_telefono, apoderado_direccion, tipo_bien, tipo_comprobante, num_comprobante, descripcion_bien, tipo_reclamo, detalle_reclamo, pedido_consumidor)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24)
      RETURNING *`,
      [
        correlativo, tipo_persona, nombre, domicilio, tipo_documento, num_documento, telefono, email, departamento, provincia, distrito,
        es_menor, padre_tutor, apoderado_dni, apoderado_email, apoderado_telefono, apoderado_direccion,
        tipo_bien, tipo_comprobante, num_comprobante, descripcion_bien, tipo_reclamo, detalle_reclamo, ''
      ]
    );
    res.status(201).json({ success: true, correlativo: result.rows[0].correlativo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al registrar el reclamo' });
  }
});
248
app.get('/', (req, res) => {
  res.send('Mayja API is running...');
});
252
// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
