const mongoose = require('mongoose')

const albumSchema = new mongoose.Schema({
    name: { type: String, required: true},
    description: { type: String },
    band: { type: String },
    rating: { type: Number },
    coverImage: {
        path: { type: String } ,
        alt: { type: String }
    }
})

const Albums = mongoose.model('Albums', albumSchema)

module.exports = Albums