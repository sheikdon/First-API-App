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
    // bring in the array of starter planets
    const startPlanets = [
        { name: "Earth", image: "https://www.gstatic.com/culturalinstitute/searchar/assets/earth/desktop_dark.mp4", readyToLive: true },
        { name: "Mars", image: "https://www.gstatic.com/culturalinstitute/searchar/assets/mars/desktop_dark.mp4", readyToLive: false },
        { name: "Venus", image: "https://www.gstatic.com/culturalinstitute/searchar/assets/venus_surface/desktop_dark.mp4", readyToLive: false },
        { name: "Saturn", image: "https://www.gstatic.com/culturalinstitute/searchar/assets/saturn/desktop_dark.mp4", readyToLive: false },
        { name: "Uranus", image: "https://www.gstatic.com/culturalinstitute/searchar/assets/uranus/desktop_dark.mp4", readyToLive: false },
    ]

    // delete all the existing planets
    Planet.deleteMany({ owner: null })
        .then(deletedPlanets => {
            console.log('this is what .deleteMany returns', deletedPlanets)

            // create a bunch of new planets from startplanets
            Planet.create(startPlanets)
                .then(data => {
                    console.log('here are the newly created planets', data)
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