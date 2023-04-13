const fs = require('fs');
const path = require('path');

const PDFDcoument = require('pdfkit');

const Product = require('../Model/product');
const Order = require('../Model/orders');

exports.getProducts = (req, res, next) => {

    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        });



}
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then((product) => {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: '/products'
            });
        })
        .catch(err => {
            console.log(err);
        })

}
exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/'

            });
        })
        .catch(err => {
            console.log(err);
        });


}

exports.getCart = (req, res, next) => {
    // console.log(req.user.cart);
    // Populate does not return promise we have to call next method
    req.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products

            });
        })
        .catch(err => {
            console.log(err);
        });

}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(product => {
            return req.user.addToCart(product);
        })
        .then(result => {
            // console.log(result);
            res.redirect('/cart');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postCartDeletProduct = (req, res, next) => {
    const prodId = req.body.productId;

    req.user.removeFromCart(prodId)
        .then(result => {
            res.redirect('/cart');
        }
        )
        .catch(err => {
            console.log(err);
        })
};

exports.postOrder = (req, res, next) => {

    req.user
        .populate('cart.items.productId')
        // .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user._id
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.user.clearCart();

        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getOrders = (req, res, next) => {
    Order.find({
        'user.userId': req.user._id
    })
        .then(orders => {

            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Your Orders',
                orders: orders

            });
        })
        .catch(err => {
            console.log(err);
        })

}

exports.getCheckout = (req, res, next) => {
    res.render('shop/cart', {
        path: '/checkout',
        pageTitle: 'Your Checkout'

    });

}

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {

            if (!order) {
                console.log('check this');
                return next(new Error('No Order Found'));
            }
            if (order.user.userId.toString() !== req.user._id.toString()) {
                console.log('check this2')
                return next(new Error('User not authorized to download'));
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            const invoicePath = path.join('data', 'invoices', invoiceName);
            const pdfDoc = new PDFDcoument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', 'attachment; filename="' + 'invoice' + '"');


            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);
            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('--------------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;

                pdfDoc
                    .fontSize(14)
                    .text(prod.product.title + ' - ' + prod.quantity + ' x ' + '$' + prod.product.price);
            });
            pdfDoc.text('-------');
            pdfDoc.text('Total Price: $' + totalPrice);
            pdfDoc.end();


            // fs.readFile(invoicePath, (error, data) => {
            //     if (error) {
            //         return next(error);
            //     }
            //     res.setHeader('Content-Type', 'application/pdf');
            //     res.setHeader('Content-Disposition', 'attachment; filename="' + 'invoice' + '"');
            //     res.send(data);
            // });
            // const file = fs.createReadStream(invoicePath);

            // file.pipe(res);
        })

        .catch(err => {
            next(err);
        });

}