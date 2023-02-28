const fs = require('fs');
const path = require('path');

const p = path.join(
    path.dirname(require.main.filename),
    'data',
    'cart.json'
);

module.exports = class Cart {
    static addProduct(id, productPrice) {
        fs.readFile(p, (err, fileContent) => {
            let Cart = { products: [], totalprice: 0 };
            if (!err) {
                Cart = JSON.parse(fileContent);
            }
            const existingProductIndex = Cart.products.findIndex(prod => prod.id === id);
            const existingProduct = Cart.products[existingProductIndex];
            let updatedProduct;
            if (existingProduct) {
                updatedProduct = { ...existingProduct };
                updatedProduct.qty = updatedProduct.qty + 1;
                Cart.products = [...Cart.products];
                Cart.products[existingProductIndex] = updatedProduct;
            } else {
                updatedProduct = { id: id, qty: 1 }
                Cart.products = [...Cart.products, updatedProduct];
            }
            Cart.totalprice = Cart.totalprice + +productPrice;
            fs.writeFile(p, JSON.stringify(Cart), (err) => {
                console.log(err);
            })
        });
    }

}