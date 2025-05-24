const express = require("express");
const routes = require('./routes');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (CSS, JS, imagens, etc.)
app.use(express.static(path.join(__dirname, 'frontend')));

// Configurar a engine para arquivos .html usando EJS
app.use(express.static(path.join(__dirname, 'frontend')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.resolve(__dirname, 'src', 'views'));

app.use(routes);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Porta ${port} http://localhost:${port}/`);
});
