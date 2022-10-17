/////////////////////////////////////////////
// Our schema and model for the planet resource
/////////////////////////////////////////////
const mongoose = require('./connection')
const User = require('./user')

const commentSchema = require('./comment')

// we're going to pull the Schema and model from mongoose
// we'll use a syntax called "destructuring"
const {Schema, model } = mongoose

// planets schema
const planetSchema = new Schema({
    name: String,
    image: String,
    readyToEat: Boolean,
    owner: {
        // here we can refer to an objectId
        // by declaring that as the type
        type: Schema.Types.ObjectId,
        // this line, tells us to refer to the User model
        ref: 'User'
    },
    comments: [commentSchema]
}, { timestamps: true })
// make the planet model
// the model method takes 2 arguments
// the first is what we will call our model
// the second is what we will use to build the model
const Planet = model("Planet", planetSchema)

/////////////////////////////////////////////
// Export our model
/////////////////////////////////////////////
//export the planet model
module.exports = Planet