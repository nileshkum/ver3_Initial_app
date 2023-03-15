
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorControllers = require('./controllers/error');

const mongoose = require('mongoose');
const User = require('./Model/user');

const app = express();


app.set('view engine', 'ejs');
app.set('views', 'views/ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


app.use((req, res, next) => {
    User.findById('6412139ab6ace7bb4c682cfa')
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

mongoose.connect('mongodb+srv://Neel3004:@cluster0.jour5.mongodb.net/shop?retryWrites=true&w=majority')
    .then(result => {
        User.findOne()
            .then(user => {
                if (!user) {
                    const user = new User({
                        name: 'Max',
                        email: 'maxtest@mail.com',
                        cart: {
                            items: []
                        }
                    })
                    user.save();
                }
            })

        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    })
