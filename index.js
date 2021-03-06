const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');

  res.end(fs.readFileSync('./index.html'));
})

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
})
