const express = require('express');
const connectDB = require('./config/db');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');
const path = require('path');

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); // to accept json data
app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.send('API is running..');
});

// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, console.log(`Server running on PORT ${PORT}...`));
