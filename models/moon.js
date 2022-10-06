///////////////////////////////////////
// Import Dependencies
///////////////////////////////////////
const mongoose = require('./connection')
const Planet = require('./planet')

// Here, we're going to set up a seed script
// this will seed our database for us, so we have some starting resources
// This script will be run, with the command in the terminal `npm run seed`

///////////////////////////////////////
// Seed Script code
///////////////////////////////////////
// first we need our connection saved to a variable for easy reference
const db = mongoose.connection

db.on('open', () => {
    // bring in the array of starter fruits
    const startPlanets = [
        { name: "Earth", color: "blue-green", readyToLive: true },
        { name: "Mars", color: "red", readyToLive: false },
        { name: "Venus", color: "brown", readyToLive: false },
        { name: "Saturn", color: "orange", readyToLive: false },
        { name: "Uranus", color: "blue", readyToLive: false },
    ]

    // delete all the existing fruits
    Planet.deleteMany({ owner: null })
        .then(deletedPlanets => {
            console.log('this is what .deleteMany returns', deletedPlanets)

            // create a bunch of new fruits from startFruits
            Planet.create(startPlanets)
                .then(data => {
                    console.log('here are the newly created fruits', data)
                    // always close connection to the db
                    db.close()
                })
                .catch(error => {
                    console.log(error)
                    // always close connection to the db
                    db.close()
                })
        })
        .catch(error => {
            console.log(error)
            // always close connection to the db
            db.close()
        })
})