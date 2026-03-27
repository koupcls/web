require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { errorMiddleware, notFoundMiddleware, authMiddleware } = require('./middleware/index.js'); 
const routes = require('./routes');

const router = express.Router();

const app = express();

app.use(cors({
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => { console.log(`Server started on port ${PORT}`);});