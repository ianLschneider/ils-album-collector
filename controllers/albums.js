const express = require('express')
const router = express.Router()
const Albums = require('../models/albums.js')

router.get('/', async (req, res)=>{
    const foundAlbums = await Albums.find()
    console.log("req.session.username",  req.session.currentUser)
    res.render('index.ejs', {
        albums: foundAlbums,
        pageTitle: "Album Collector | Albums",
        username: req.session.currentUser
    })
})

router.get('/add', async (req, res)=>{
    res.render('newAlbum.ejs', {
        pageTitle: "Album Collector"
    })
})

router.get('/seed', async (req, res)=>{
    const p = await Albums.create([
        {
            name: "album 1",
            band: "band 1",
            description: "Band 1 Album 1",
            rating: "5",
            image: {
                path: "/images/albums/indigo-girls/indigo-girls.jpg",
                alt: "Indigo Girls"
            }
        }
    ])
    res.redirect('/albums')
})

router.get('/:id/edit', async (req, res) => {
    const foundAlbum = await Albums.findById(req.params.id)
    res.render('edit.ejs', {
      album: foundAlbum,
      pageTitle: "Album Collector | Edit"
    })
})

router.get('/:id', async (req, res)=>{
    const foundAlbum = await Albums.findById(req.params.id)
    res.render('show.ejs', {
        album: foundAlbum,
        pageTitle: `Album Collector | ${foundAlbum.name}`
    })
})

router.post('/', async (req, res) => {
    try {
        const newAlbum = await Albums.create(req.body)
        res.redirect('/albums')
    } catch (err) {
        console.log("ERROR ADDING PRODUCT: ", err)
        res.status(500).send(error)
    }
})


router.put('/:id', async(req, res)=>{
    try {
        const updatedAlbum = await Albums.findByIdAndUpdate(req.params.id, req.body, {new: true})
        console.log("put", updatedAlbum)
        res.redirect(`/albums/${req.params.id}`)
    } catch (err) {
        console.log("ERROR IN EDIT: ", err)
        res.status(500).send(err)
    }
})


router.delete('/:id', async (req, res)=>{
  try{
      const album = await Albums.findByIdAndDelete(req.params.id)
      console.log(`Deleted ${album}`)
      res.redirect("/albums")
  } catch ( err ){
      console.log("ERROR ON DELETE REQUEST: ", err)
      res.status(500).send(err)
  }
})

module.exports = router