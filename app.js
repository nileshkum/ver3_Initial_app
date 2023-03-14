
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorControllers = require('./controllers/error');

const mongoConnect = require('./public/util/database').mongoConnect;
const User = require('./Model/user');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views/ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    User.findById('6410ee4faa4139737f60f580')
        .then(user => {
            req.user = new User(user.name, user.email, user.cart, user._id);
            next();
        })
        .catch(err => {
            console.log(err);
        })
    // next();
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);


app.use(errorControllers.get404);

mongoConnect(() => {
    // console.log(client);
    app.listen(3000);
});