const express = require('express')
const router = express.Router()
const Albums = require('../models/albums.js')

const multer  = require('multer')
const upload = multer({ 
  dest: 'public/images/albums/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }
    //https://stackoverflow.com/questions/60408575/how-to-validate-file-extension-with-multer-middleware
}})


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
            name: "Indigo Girls",
            band: "Indigo Girls",
            description: "The Indigo Girls' self-titled album",
            rating: "5",
            coverImage: {
                path: "indigo-girls.jpg",
                alt: "Indigo Girls",
                originalname: "indigo-girls.jpg" 
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

router.post('/', upload.single('coverImage'), async (req, res) => {
    try {
        console.log("req",req)
        if(req.file){
            req.body.coverImage = {
                path: req.file.filename,
                alt: req.file.originalname
            }
        }
        const newAlbum = await Albums.create(req.body)

        console.log("req.file:",req.file)

        res.redirect('/albums')
    } catch (err) {
        console.log("ERROR ADDING PRODUCT: ", err)
        res.status(500).send(err)
    }
})


router.put('/:id', upload.single('coverImage'), async(req, res)=>{
    try {
        if(req.file){
            req.body.coverImage = {
                path: req.file.filename,
                alt: req.file.originalname
            }
        }
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