
const { json } = require('body-parser');

const db = require('../public/util/database');

const Cart = require('./cart');





module.exports = class Product {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.price = price;
        this.description = description;
    }

    save() {

        return db.execute(
            'INSERT INTO products(title, price, imageUrl, description) VALUES(?,?,?,?)',
            [this.title, this.price, this.imageUrl, this.description]);

    }

    static deleteById(id) {

    }

    static fetchAll() {
        return db.execute('Select * from products');
    }

    static findbyId(id) {
        return db.execute('Select * from products where id = ?', [id]);
    }

}