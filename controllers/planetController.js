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
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // this is fine for initial testing
            // res.send()
            // this the preferred method for APIs
            // res.json({ planets: planets })
            res.render('planets/index', { planets, username, loggedIn, userId })

        })
        .catch(err => console.log(err))
})
// GET for new planet
// renders the form to create a planet
router.get('/new', (req, res) => {
    const username = req.session.username
    const loggedIn = req.session.loggedIn
    const userId = req.session.userId

    res.render('planets/new', { username, loggedIn, userId })
})

// POST request
// create route -> gives the ability to create new fruits
router.post("/", (req, res) => {
    req.body.readyToLive = req.body.readyToLive === 'on' ? true : false


    req.body.owner = req.session.userId
    console.log('the planet from the form', req.body)

    // here, we'll get something called a request body
    // inside this function, that will be referred to as req.body
    // we'll use the mongoose model method `create` to make a new fruit
    Planet.create(req.body)
        .then(planet => {
            // send the user a '201 created' response, along with the new fruit
            // res.status(201).json({ planet: planet.toObject() })
            res.redirect('/planets')

        })
        .catch(error => console.log(error))
})

// we're going to build another route, that is owner specific, to list all the fruits owned by a certain(logged in) user
router.get('/mine', (req, res) => {
    // find the fruits, by ownership
    Planet.find({ owner: req.session.userId })
    // then display the fruits
        .then(planets => {
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId

            // res.status(200).json({ fruits: fruits })
            res.render('planets/index', { planets, username, loggedIn, userId })
        })
    // or throw an error if there is one
        .catch(error => res.json(error))
})

// GET request to show the update page
router.get("/edit/:id", (req, res) => {
    // const username = req.session.username
    // const loggedIn = req.session.loggedIn
    // const userId = req.session.userId
    res.send('edit page')
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

router.delete('/:id', (req, res) => {
    // get the fruit id
    const planetId = req.params.id

    // delete and REDIRECT
    Planet.findByIdAndRemove(planetId)
        .then(fruit => {
            // if the delete is successful, send the user back to the index page
            res.redirect('/planets')
        })
        .catch(error => {
            res.json({ error })
        })
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
            const username = req.session.username
            const loggedIn = req.session.loggedIn
            const userId = req.session.userId
            // res.json({ planet: planet })
            res.render('planets/show', { planets, username, loggedIn, userId })

        })
        .catch(err => console.log(err))
})



//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router