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
    const host = req.get('host');
    const exampleData = {
        title: "rockPi 4b state",
        uptime: "6 days, 23:03",
        dataSource: [
            {
                name: "CPU",
                usedPercent: "3"
            },
            {
                name: "RAM",
                total: "3788.8MB",
                used: "1228.8MB",
                left: "2560.0MB",
                usedPercent: "32"
            },
            {
                name: "Disk",
                total: "57.4G",
                used: "8.9G",
                left: "46.2G",
                usedPercent: "16"
            }
        ]
    };

    const jsonString = JSON.stringify(exampleData);
    
    const templateData = {
        jsonData: JSON.stringify(exampleData, null, 2),
        rawUrl: `http://${host}/api/v1/serverState?data=${jsonString}`,
        encodedUrl: `http://${host}/api/v1/serverState?data=${encodeURIComponent(jsonString)}`
    };

    res.render('index', templateData);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
