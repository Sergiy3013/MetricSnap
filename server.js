require('dotenv').config();
const express = require('express');
const path = require('path');
const apiRouter = require('./api/router');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/styles', express.static(path.join(__dirname, 'views/styles')));

app.use('/api', apiRouter);

app.get('/', (req, res) => {
    const templateData = {
        path: req.originalUrl
    };

    res.render('index', templateData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
