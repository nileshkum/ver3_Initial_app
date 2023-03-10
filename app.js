
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorControllers = require('./controllers/error');

const sequelize = require('./public/util/database');
const Product = require('./Model/product');
const User = require('./Model/user');
const Cart = require('./Model/cart');
const CartItem = require('./Model/cart-item');
const Order = require('./Model/order');
const OrderItem = require('./Model/order-item');


const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views/ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        })
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errorControllers.get404);

Product.belongsTo(User, {
    constraints: true,
    onDelete: 'CASCADE'
});
User.hasMany(Product);
User.hasOne(Cart);
Cart.belongsTo(User);
Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });
Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product, { through: OrderItem });

// Sync method syncs all the models of your code as Tables in DB and creates its relation if any
// sequelize.sync({ force: true })
sequelize.sync()
    .then(result => {
        return User.findByPk(1);
        // console.log(result);

    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'Nilesh',
                email: 'test@testmail.ca'
            })
        }
        return user;
    })
    .then(user => {
        // console.log(user);
        return user.createCart();

    })
    .then(cart => {
        app.listen(3000);
    }

    )
    .catch(err => {
        console.log(err);
    })
