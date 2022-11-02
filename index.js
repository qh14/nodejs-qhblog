const express = require('express')
const expressSession = require('express-session');
const app = new express()

const ejs = require('ejs')
app.set('view engine', 'ejs')


const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ type: 'application/json' }))
app.use(bodyParser.raw());

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/mydatabase', { useNewUrlParser: true })

const fileUpload = require('express-fileupload')
app.use(fileUpload())

const homeController = require('./controllers/home')
const storePostController = require('./controllers/storePost')
const getPostController = require('./controllers/getPost')
const newPostController = require('./controllers/newPost')
const newUserController = require('./controllers/newUser')
const storeUserController = require('./controllers/storeUser')
const errorController = require('./controllers/errorController')
const loginController = require('./controllers/login')
const loginUserController = require('./controllers/loginUser')
const authMiddleware = require('./middleware/authMiddleware')
const redirectIfAuthenticatedMiddleware = require('./middleware/redirectIfAuthenticatedMiddleware')
const logoutController = require('./controllers/logout')
global.loggedIn = null;


//Đăng ký thư mục public.....
app.use(express.static('public'))
app.use(expressSession({
    secret: 'keyboard cat'
}))
app.use("*", (req, res, next) => {
    loggedIn = req.session.userId;
    next()
})

const validateMiddleWare = require('./middleware/validationMiddleware')
app.use('/posts/store', validateMiddleWare)

//Tao server
app.listen(process.env.PORT, () => {

})

app.post('/users/register', redirectIfAuthenticatedMiddleware, storeUserController)
app.get('/', homeController)


app.get('/about', (req, res) => {
    res.render('about');
})
app.get('/contact', (req, res) => {
    res.render('contact');
})


app.get('/posts/new', authMiddleware, newPostController)

app.get('/auth/login', redirectIfAuthenticatedMiddleware, loginController)
app.get('/post/:id', getPostController)

app.post('/posts/store', authMiddleware, storePostController)
app.post('/users/login', redirectIfAuthenticatedMiddleware, loginUserController)
app.get('/auth/register', redirectIfAuthenticatedMiddleware, newUserController)
app.get('/auth/logout', logoutController)
app.get('/errorPage', errorController)
app.use((req, res) => res.render('notfound'));

