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
// POST
// only loggedIn users can post comments
router.post("/:planetId", (req, res) => {
    const planetId = req.params.planetId

    if (req.session.loggedIn) {
        // we want to adjust req.body so that the author is automatically assigned
        req.body.author = req.session.userId
    } else {
        res.sendStatus(401)
    }
    // find a specific planet
    Planet.findById(planetId)
        // do something if it works
        //  --> send a success response status and maybe the comment? maybe the planet?
        .then(planet => {
            // push the comment into the planet.comments array
            planet.comments.push(req.body)
            // we need to save the planet
            return planet.save()
        })
        .then(planet => {
            // res.status(200).json({ planet: planet })
            res.redirect(`/planets/${planet.id}`)
        })
        // do something else if it doesn't work
        //  --> send some kind of error depending on what went wrong
        .catch(err => res.redirect(`/error?error=${err}`))
})

// DELETE
// only the author of the comment can delete it
router.delete('/delete/:planetId/:commId', (req, res) => {
    // isolate the ids and save to vars for easy ref
    const planetId = req.params.planetId 
    const commId = req.params.commId
    // get the planet
    Planet.findById(planetId)
        .then(planet => {
            // get the comment
            // subdocs have a built in method that you can use to access specific subdocuments when you need to.
            // this built in method is called .id()
            const theComment = planet.comments.id(commId)
            console.log('this is the comment that was found', theComment)
            // make sure the user is logged in
            if (req.session.loggedIn) {
                // only let the author of the comment delete it
                if (theComment.author == req.session.userId) {
                    // find some way to remove the comment
                    // here's another built in method
                    theComment.remove()
                    planet.save()
                    res.redirect(`/planets/${planet.id}`)
                    // return the saved planet
                    // return planet.save()
                } else {
                    const err = 'you%20are%20not%20authorized%20for%20this%20action'
                    res.redirect(`/error?error=${err}`)
                }
            } else {
                const err = 'you%20are%20not%20authorized%20for%20this%20action'
                res.redirect(`/error?error=${err}`)
            }
        })
        // send an error if error
        .catch(err => res.redirect(`/error?error=${err}`))

})

//////////////////////////////////////////
// Export the Router
//////////////////////////////////////////
module.exports = router