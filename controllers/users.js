const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const User = require('../models/users.js')



router.get('/login', (req, res)=>{
    res.render('login.ejs', {
        pageTitle: "Album Collector | Login"
    })
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