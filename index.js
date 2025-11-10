const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB = path.join(__dirname, 'repertorio.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

function readDB() {
  if (!fs.existsSync(DB)) fs.writeFileSync(DB, '[]', 'utf8');
  const raw = fs.readFileSync(DB, 'utf8');
  try { return JSON.parse(raw || '[]'); } catch (e) { return []; }
}
function writeDB(data) { fs.writeFileSync(DB, JSON.stringify(data, null, 2), 'utf8'); }

// Devuelve una página web simple (requisito)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// GET /canciones -> lista todas las canciones
app.get('/canciones', (req, res) => {
  const canciones = readDB();
  res.json(canciones);
});

// POST /canciones -> agrega una nueva canción
app.post('/canciones', (req, res) => {
  const canciones = readDB();
  const body = req.body;
  if (!body.titulo || !body.artista) {
    return res.status(400).json({ message: 'Faltan campos requeridos: titulo y artista' });
  }
  const maxId = canciones.reduce((max, c) => Math.max(max, Number(c.id) || 0), 0);
  const newId = (maxId || 0) + 1;
  const nueva = { id: newId, ...body };
  canciones.push(nueva);
  writeDB(canciones);
  res.status(201).json({ message: 'Canción agregada', cancion: nueva });
});

// PUT /canciones/:id -> actualiza una canción
app.put('/canciones/:id', (req, res) => {
  const id = req.params.id;
  const canciones = readDB();
  const index = canciones.findIndex(c => String(c.id) === String(id));
  if (index === -1) return res.status(404).json({ message: 'Canción no encontrada' });
  const updated = { ...canciones[index], ...req.body, id: canciones[index].id };
  canciones[index] = updated;
  writeDB(canciones);
  res.json({ message: 'Canción actualizada', cancion: updated });
});

// DELETE /canciones/:id  o DELETE /canciones?id=ID -> elimina
app.delete('/canciones/:id?', (req, res) => {
  const id = req.params.id || req.query.id;
  if (!id) return res.status(400).json({ message: 'Falta id (path o query)' });
  const canciones = readDB();
  const filtered = canciones.filter(c => String(c.id) !== String(id));
  if (filtered.length === canciones.length) return res.status(404).json({ message: 'Canción no encontrada' });
  writeDB(filtered);
  res.json({ message: 'Canción eliminada' });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));
