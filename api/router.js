const express = require('express');
const router = express.Router();
const v1 = require('./v1');

router.use('/v1', v1);

router.use('/serverState', (req, res) => {
    const queryString = req.url.includes('?') ? req.url.substring(req.url.indexOf('?')) : '';
    res.redirect(307, `/api/v1/serverState${queryString}`);
});

module.exports = router;