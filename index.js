const express = require('express');
const app = express();
const path = require('path');
const mainRoutes = require('./routes/mainRoutes');

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', mainRoutes);

app.listen(3000, function() {
    console.log("[💥 시작] : frontend 서버");
})