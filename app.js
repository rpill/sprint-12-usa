const express = require('express');
const mongoose = require('mongoose');
const mainRouter = require('./routes/index');

const app = express();
const { PORT = 3001 } = process.env;

mongoose.connect('mongodb://localhost:27017/wtwr_db');

app.use(express.json());

app.use((req, res, next) => {
  req.user = { _id: '6335733ecd4c291272d7fb23' };
  next();
});

app.use('/', mainRouter);

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
