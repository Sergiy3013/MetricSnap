const express = require('express');
const router = express.Router();
const serverState = require('./serverState');
const projectState = require('./projectState');

router.use('/serverState', serverState);
router.use('/projectState', projectState);

module.exports = router;