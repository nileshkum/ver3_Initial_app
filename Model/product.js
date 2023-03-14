const getDb = require('../public/util/database').getdb;

const mongodb = require('mongodb');
const { use } = require('../routes/admin');


class Product {
    constructor(title, price, description, imageUrl, id, userid) {
        this.title = title;
        this.price = price;
        this.description = description;
        this.imageUrl = imageUrl;
        this._id = id ? new mongodb.ObjectId(id) : null;
        this.userid = userid;
    }

    save() {
        const db = getDb();
        let dbOp;
        if (this._id) {
            // Update Product
            dbOp = db.collection('products').updateOne({
                _id: this._id
            }, {
                $set: this
            }
            );
        } else {
            dbOp = db.collection('products').insertOne(this);
        }

        return dbOp
            .then(result => {
                // console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
            .find()
            .toArray()
            .then(products => {
                // console.log(products);
                return products;
            })
            .catch(err => {
                console.log(err);
            });

    }

    static findById(prodId) {
        const db = getDb();
        return db.collection('products')
            .find({ _id: new mongodb.ObjectId(prodId) })
            .next()
            .then(product => {
                // console.log(product);
                return product;
            })
            .catch(err => {
                console.log(err);
            });
    }

    static deleteByid(prodId) {
        const db = getDb();
        return db.collection('products').deleteOne({
            _id: new mongodb.ObjectId(prodId)
        })
            .then(result => {
                console.log('Deleted');
            })
            .catch(err => {
                console.log(err);
            })
    }
}



module.exports = Product;