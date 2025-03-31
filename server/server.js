const express = require('express');
const app = express();
const cors = require('cors');
const port = 8080;

// Enable CORS to allow frontend requests
app.use(cors());

app.get('/', (req, res) => {
  res.send('Tervitused serverist!');
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});