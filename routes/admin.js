const express = require('express');

const router = express.Router();

router.get('/add-product', (req, res, next) => {
    res.send(
        '<form action="/product" method="POST"><input type="text" name="title"><button type="submit">Add Product</button></form>'
    );

});

router.post('/product', (req, res, next) => {
    res.send('<h1> Add Product Page</h1>')
});

module.exports = router;