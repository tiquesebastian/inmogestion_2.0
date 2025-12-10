const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ ok: true, version: require('./package.json').dependencies.express });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Demo Express 4.16.0 escuchando en puerto ${PORT}`);
});
