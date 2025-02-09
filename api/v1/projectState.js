const express = require('express');
const router = express.Router();
const { generateProjectImage } = require('../../imageGenerator');

router.get('/', async (req, res) => {
    try {
        if (!req.query.data) {
            return renderExample(req, res);
        }

        const decodedData = decodeURIComponent(req.query.data);
        const data = JSON.parse(decodedData);
        
        const image = await generateProjectImage(data);
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
    
    // Первый пример - смешанные типы интерфейсов
    const exampleData1 = {
        title: "Project Status",
        subtitle: "main server",
        dataSource: [
            {
                name: "homepage",
                container: "true",
                interface: {
                    local: true,
                    global: "true"
                }
            },
            {
                name: "pi_hole",
                container: "true",
                interface: {
                    local: "true"
                }
            },
            {
                name: "portainer",
                container: true,
                interface: {
                    local: "false",
                    global: false
                }
            },
            {
                name: "botDiscord",
                container: "true",
                interface: false
            }
        ]
    };

    // Второй пример - простые значения интерфейсов
    const exampleData2 = {
        title: "Project Status",
        subtitle: "main server",
        dataSource: [
            {
                name: "homepage",
                container: "true",
                interface: true
            },
            {
                name: "pi_hole",
                container: "true",
                interface: "true"
            },
            {
                name: "portainer",
                container: true,
                interface: false
            },
            {
                name: "botDiscord",
                container: "true"
            }
        ]
    };

    const jsonString1 = JSON.stringify(exampleData1);
    const jsonString2 = JSON.stringify(exampleData2);

    res.render('projectState', {
        jsonData1: JSON.stringify(exampleData1, null, 2),
        jsonData2: JSON.stringify(exampleData2, null, 2),
        rawUrl1: `http://${host}/api/v1/projectState?data=${jsonString1}`,
        rawUrl2: `http://${host}/api/v1/projectState?data=${jsonString2}`,
        encodedUrl1: `http://${host}/api/v1/projectState?data=${encodeURIComponent(jsonString1)}`,
        encodedUrl2: `http://${host}/api/v1/projectState?data=${encodeURIComponent(jsonString2)}`,
        path: req.originalUrl
    });
}

module.exports = router;