const express = require('express');
const app = express();

const registerRoutes = require('./routes/register');

app.use(express.json());
app.use(express.static('public'));

app.use('/register', registerRoutes);

app.listen(3000, () => console.log("Server started"))
