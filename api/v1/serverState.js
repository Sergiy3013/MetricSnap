const express = require('express');
const router = express.Router();
const { generateImage } = require('../../imageGenerator');

router.get('/', async (req, res) => {
    try {
        if (!req.query.data) {
            return renderExample(req, res);
        }

        const decodedData = decodeURIComponent(req.query.data);
        const data = JSON.parse(decodedData);
        
        const image = await generateImage(data);
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': image.length
        });
        res.end(image);
    } catch (error) {
        console.error('Error processing request:', error.message);
        return renderExample(req, res);
    }
});

function renderExample(req, res) {
    const host = req.get('host');
    const exampleData = {
        title: "Server Stats Example",
        uptime: "1 day, 2:30",
        dataSource: [
            {
                name: "CPU",
                usedPercent: "25"
            },
            {
                name: "RAM",
                total: "16GB",
                used: "8GB",
                left: "8GB",
                usedPercent: "50"
            },
            {
                name: "Disk",
                total: "512GB",
                used: "128GB",
                left: "384GB",
                usedPercent: "25"
            }
        ]
    };

    const jsonString = JSON.stringify(exampleData);
    res.render('serverState', {
        jsonData: JSON.stringify(exampleData, null, 2),
        rawUrl: `http://${host}/api/v1/serverState?data=${jsonString}`,
        encodedUrl: `http://${host}/api/v1/serverState?data=${encodeURIComponent(jsonString)}`,
        path: req.originalUrl
    });
}

module.exports = router;