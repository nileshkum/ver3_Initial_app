
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const errorControllers = require('./controllers/error');
const session = require('express-session');
const mongoose = require('mongoose');
const User = require('./Model/user');

const MongoDBStore = require('connect-mongodb-session')(session);


const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});


app.set('view engine', 'ejs');
app.set('views', 'views/ejs');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: 'my secret',
    resave: false,
    saveUninitialized: false,
    store: store
}));

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });

})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);


app.use(errorControllers.get404);

mongoose.connect(MONGODB_URI)
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
