console.log('Backend server starting...');
console.log('Environment:', process.env.NODE_ENV);
console.log('Database URL:', process.env.DATABASE_URL);

const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ message: 'Backend API is running!' });
});

app.listen(port, () => {
  console.log(`Backend API listening on port ${port}`);
});