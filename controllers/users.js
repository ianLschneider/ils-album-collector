const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/users.js')

router.get('/', (req, res)=>{
    res.render('newUser.ejs', {
        pageTitle: "Album Collector | Add User"
    })
})


router.get('/login', (req, res)=>{
    res.render('login.ejs', {
        pageTitle: "Album Collector | Login"
    })
})

router.post('/', async (req, res)=>{   
    try {
        req.body.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10))
        const newUser = await User.create(req.body)
        res.redirect('/login')
    } catch (err) {
        console.log(err)
        res.status(500).send('Please try a differnet username or password')
    }
})


router.post('/login', async (req, res)=>{
    
    try {
        const foundUser = await User.findOne({username: req.body.username})
        if(foundUser){
            const isAMatch = bcrypt.compareSync(req.body.password, foundUser.password)
            if(isAMatch){
                console.log('login successful')
                req.session.currentUser = foundUser.username
                res.redirect('/albums/')
            }else{
                res.status(500).send('Username or password does not match or does not exist.')
            }
        }else{
            res.status(500).send('Username or password does not match or does not exist.')
        }

    } catch (err) {
        console.log(err)
        res.status(500).send('Username or password does not match or does not exist.')
    }
})


router.delete('/logout', (req, res)=>{
    req.session.destroy( err => {
        if(err){
            res.status(500).send('logout failed')    
        }else{
            res.redirect('/users/login')
        }  
    })
})

module.exports = router