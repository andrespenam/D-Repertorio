# Mi Repertorio - Backend (Express + JSON file)

## Requisitos
- Node.js (versión LTS recomendada)
- npm (incluido con Node)
- Editor de código (recomendado: Visual Studio Code)
- Cliente HTTP para probar (Postman / Insomnia / curl)

## Instalación
```bash
npm install
```

## Ejecutar
- Desarrollo (con nodemon):
```bash
npm run dev
```
- Producción / ejecución normal:
```bash
npm start
```

## Endpoints principales
- `GET /canciones` -> lista todas las canciones
- `POST /canciones` -> agrega (body JSON: { "titulo": "...", "artista": "..." })
- `PUT /canciones/:id` -> actualiza (body JSON con campos)
- `DELETE /canciones/:id` o `DELETE /canciones?id=ID` -> elimina

## Nota
Este proyecto usa un archivo local `repertorio.json`. Para un entorno multiusuario o producción, considere usar una base de datos real.
