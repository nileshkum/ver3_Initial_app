
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
// const expressHBs = require('express-handlebars');

const app = express();

// app.engine('hbs', expressHBs({ layoutsDir: 'views/handlebars/layouts/', defaultLayout: 'main-layout', extname: 'hbs' }));
// app.set('view engine', 'hbs');
app.set('view engine', 'ejs');
app.set('views', 'views/ejs');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');
// const { ExpressHandlebars } = require('express-handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/admin', adminRoutes);
app.use('/admin', adminData.routes);
app.use(shopRoutes);





app.use((req, res, next) => {
    // res.status(404).send('<h1> Page not found</h1>');
    // //res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
    res.status(404).render('404', { pageTitle: 'Page not Found!' });
});


app.listen(3000);