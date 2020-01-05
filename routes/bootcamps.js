const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ success: true, msg: 'Get all bootcamps'}).send(200);
});

router.get('/:id', (req, res) => {
res.json({ success: true, msg: `Get bootcamp with id: ${req.params.id} `}).send(200);
});

router.post('/', (req, res) => {
    res.json({ success: true, msg: 'Post bootcamp'}).send(200);
});

router.put('/:id', (req, res) => {
    res.json({ success: true, msg: `Put bootcamp with id: ${req.params.id} `}).send(200);
});

router.delete('/:id', (req, res) => {
    res.json({ success: true, msg: `Delete bootcamp with id: ${req.params.id} `}).send(200);
});

module.exports = router;