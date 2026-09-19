# Orbit Robot Login

A responsive login page with an original robot character and state-driven animation.

## Run locally

```bash
npm start
```

Open `http://127.0.0.1:4173`. No installation is needed; the server uses Node.js built-ins only. You can also open `index.html` directly.

## Demo login

- Email: `admin@robot.dev`
- Password: `robot123`

The **Fill for me** button inserts both credentials instantly.

## Editable files

- `index.html` — structure and accessible form markup
- `styles.css` — colors, layout, responsive rules, and animations
- `app.js` — credentials, validation, messages, confetti, and login states
- `assets/byte-robot.png` — original robot artwork
- `server.js` — dependency-free development server

For a real product, replace the local credential comparison in `app.js` with a secure API request. Never keep real passwords in front-end code.
