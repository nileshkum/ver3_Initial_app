
const Product = require('../Model/product');

exports.getAddProduct = (req, res, next) => {

    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        isAuthenticated: req.session.isAuthenticated

    });
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;

    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user
    });

    product
        .save()
        .then(result => {
            console.log('Product Created');
            res.redirect('/');
        })
        .catch(err => {
            console.log(err);
        });

}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                isAuthenticated: req.session.isAuthenticated

            });
        })
        .catch(err => {
            console.log(err);
        });



}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatePrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;

    Product.findById(prodId)
        .then(product => {
            product.title = updatedTitle;
            product.price = updatePrice;
            product.description = updatedDescription;
            product.imageUrl = updatedImageUrl;
            return product.save()
        })
        .then(results => {
            console.log('Updated product');
            res.redirect('/admin/products');
        })
        .catch(err => {
            console.log(err);
        });
}

exports.postDeleteProduct = (req, res, next) => {

    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(result => {
            console.log('Product Deleted');
            res.redirect('/admin/products');
        })
        .catch(err => {
            confirm.log(err);
        });



};

exports.getProducts = (req, res, next) => {

    Product.find()
        //mongoose special find query to pull specific fields
        // .select('title price -_id')
        // .populate('userId', 'name')
        .then(products => {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                isAuthenticated: req.session.isAuthenticated
            });
        })
        .catch(err => {
            console.log(err);
        });


}