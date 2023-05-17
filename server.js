const express = require('express');
const upload = require('./router/upload');
const app = express();

app.use('/upload', upload);

app.listen(8000, () => console.log('Server started on port 8000'));