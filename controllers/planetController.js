////////////////////////////////////////
// Import Dependencies
////////////////////////////////////////
const express = require("express")
const Planet = require("../models/planet")

/////////////////////////////////////////
// Create Router
/////////////////////////////////////////
const router = express.Router()

/////////////////////////////////////////////
// Routes
////////////////////////////////////////////
// GET request
// index route -> shows all instances of a document in the db
router.get("/", (req, res) => {
    // console.log("this is the request", req)
    // in our index route, we want to use mongoose model methods to get our data
    Planet.find({})
        .then(planets => {
            // this is fine for initial testing
            // res.send(fruits)
            // this the preferred method for APIs
            res.json({ planets: planets })
        })
        .catch(err => console.log(err))
})

// POST request
// create route -> gives the ability to create new fruits
router.post("/", (req, res) => {

    req.body.owner = req.session.userId

    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // we'll use the mongoose model method `create` to make a new fruit
    Planet.create(req.body)
        .then(planet => {
            // send the user a '201 created' response, along with the new fruit
            res.status(201).json({ planet: planet.toObject() })
        })
        .catch(error => console.log(error))
})

// PUT request
// update route -> updates a specific fruit
router.put("/:id", (req, res) => {
    // console.log("I hit the update route", req.params.id)
    const id = req.params.id
    Planet.findById(id)
        .then(planet => {
            if (planet.owner == req.session.userId) {
                res.sendStatus(204)
                return planet.updateOne(req.body)
            } else {
                res.sendStatus(401)
            }
        })
        .catch(error => res.json(error))
})

// DELETE request
// destroy route -> finds and deletes a single resource(fruit)
router.delete("/:id", (req, res) => {
    // grab the id from the request
    const id = req.params.id
    // find and delete the fruit
    // Fruit.findByIdAndRemove(id)
    Planet.findById(id)
        .then(planet => {
            // we check for ownership against the logged in user's id
            if (planet.owner == req.session.userId) {
                // if successful, send a status and delete the fruit
                res.sendStatus(204)
                return planet.deleteOne()
            } else {
                // if they are not the user, send the unauthorized status
                res.sendStatus(401)
            }
        })
        // send the error if not
        .catch(err => res.json(err))
})

/// SHOW request
// read route -> finds and displays a single resource
router.get("/:id", (req, res) => {
    const id = req.params.id

    Planet.findById(id)
        // populate will provide more data about the document that is in the specified collection
        // the first arg is the field to populate
        // the second can specify which parts to keep or which to remove
        // .populate("owner", "username")
        // we can also populate fields of our subdocuments
        .populate("comments.author", "username")
        .then(planet => {
            res.json({ planet: planet })
        })
        .catch(err => console.log(err))
})



//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router