const express = require('express')
const methodOverride = require('method-override')

const app = express()


const session = require('express-session')
const bcrypt = require('bcrypt')

require('dotenv').config()

const mongoose = require('mongoose')
const mongoURI = process.env.MONGO_URI
const PORT = process.env.PORT

//MIDDLEWARE
app.use(express.urlencoded({extended:true}))
app.use(methodOverride('_method'))
app.use(express.static('public'))

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    })
)




const isAuthenticated = (req, res, next) => {
    if(req.session.currentUser || req.path === '/'){
        next()
    }else{
        res.redirect('/')
    }
}




const usersController = require('./controllers/users.js')
app.use('/users', usersController)
//app.use(isAuthenticated)


//CONTROLLERS
const albumsController = require('./controllers/albums.js')
app.use('/albums', albumsController)



//MONGODB
mongoose.connect(mongoURI)

const db = mongoose.connection
db.on('error', (error)=>{
    console.log(error + ' error with mongo connection')
})
db.on('connected', ()=>{
    console.log('mongo connection')
})
db.on('disconnectedf', ()=>{
    console.log('mongo disconnectedf')
})


//ROUTES
app.get('/', async (req, res)=>{
    res.render("frontPage.ejs", {
        pageTitle: "Album Collector"
    })
})

//RUN SERVER
app.listen( PORT, () => { console.log(`Sever is listening on ${PORT}`) } )