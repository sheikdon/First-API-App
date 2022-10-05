/////////////////////////////////////////////
// Our schema and model for the planet resource
/////////////////////////////////////////////
const mongoose = require("mongoose") // import mongoose

// we're going to pull the Schema and model from mongoose
// we'll use a syntax called "destructuring"
const {Schema, model } = mongoose

// planets schema
const planetSchema = new Schema({
    name: String,
    color: String,
    readyToEat: Boolean
})
// make the planet model
// the model method takes 2 arguments
// the first is what we will call our model
// the second is what we will use to build the model
const Planet = model("Planet", planetSchema)

/////////////////////////////////////////////
// Export our model
/////////////////////////////////////////////
//export the fruit model
module.exports = Planet