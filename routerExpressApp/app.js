'use strict';
const express = require('express');
const app = express();

app.use('/api/todos', require('./routes/todos'));

app.listen(3000);
