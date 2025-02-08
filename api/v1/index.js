const express = require('express');
const router = express.Router();
const serverState = require('./serverState');

router.use('/serverState', serverState);

module.exports = router;