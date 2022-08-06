const express=require('express');
const { JsonWebTokenError } = require('jsonwebtoken');
const User = require('../models/user.js')
const {sendWelcomeEmail, sendDeleteEmail}= require('../emails/account.js')
const auth = require('../middleware/auth')
const multer  = require('multer')
const sharp = require('sharp');



const router = new express.Router()

//create new user sign up
router.post("/users", async (req, res) => {

    const user = new User(req.body)
    
    try {
        await user.save()
        sendWelcomeEmail(user.email, user.name)
        const token = await user.generateAuthToken()
        res.status(201).send({user,token})

    } catch (error) {
        res.status(400).send(error)
    }



});

router.post("/users/login", async (req,res)=>{
    try {

        const user = await User.findByCredentials(req.body.email, req.body.password)

        const token = await user.generateAuthToken()
       
        res.send({user, token})
    } catch (error) {
        res.status(400).send()
    }
})

//logout one user
router.post("/users/logout", auth, async (req,res)=>{
try {
    req.user.tokens= req.user.tokens.filter((token)=>{
        console.log(token._id)
        return token.token!==req.token
    })
    await req.user.save()
    res.send()
} catch (error) {
    res.status(500).send()
}
}),

//logout all users
router.post("/users/logoutall", auth, async(req,res)=>{
    try {
        req.user.tokens= []
        await req.user.save()
        res.send()
    } catch (error) {
        res.status(500).send()
    }
})


//list all users
router.get("/users/me", auth, async (req, res) => {
    
    res.send(req.user)
   
})



//update user by id
router.patch("/users/me", auth, async (req, res) => {
    
    const updates = Object.keys(req.body)
    //will return array of incoming in an array
    const allowedUpdates = ['name', 'age', 'email', 'password']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))
    //every will return false even if one doesnt match

    if (!isValidOperation) { return res.status(400).send('Invalid updates') }
    
    

    try {
        const user = req.user
  //      if (!user) { return res.status(404).send(_id) }
  updates.forEach((update)=>{
            user[update]=req.body[update]
            console.log(req.body[update])
            
        })
        
        await user.save()
        
        //changed the below code because we need save function for pre(save) to work to hash the password
        //const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
        //new: true will return the new user.
        //     console.log(user)
        res.send(user)
    } catch (error) {
        res.status(400).send(error)
    }
})

//delete user
router.delete('/users/me', auth, async (req, res) => {
    
    try {
        // const user = await User.findByIdAndDelete(req.user._id)
       // if (!user) { return res.status(404).send() }
        req.user.remove()
        sendDeleteEmail(req.user.email, req.user.name)
       res.send(req.user)
    } catch (error) {
        res.status(500).send(error)
    }

})

//upload user profile
const upload = multer({  limits:{fileSize:1000000}, fileFilter (req, file, cb){
    
    // \. looks for . character in the filename, to check regular expression go to regex101.com
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){

        cb(new Error('Please upload a jpg/jpeg or png file'))
    }
    
    cb(null, true)
}  })

//upload image
router.post('/users/me/avatar',auth, upload.single('avatar'), async (req, res)=>{
    const buffer = await sharp(req.file.buffer).resize(250,250).png().toBuffer()
    req.user.avatar=buffer

    await req.user.save()
    res.send()
}, (error,req, res, next)=>{//this function needs to have the exact call signature for express to know its error handling
    res.status(400).send(error.message)
})

//delete avatar
router.delete('/users/me/avatar', auth, async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/users/:id/avatar', async(req,res)=>{
    try {
        const user= await User.findById(req.params.id)
        if (!user||!user.avatar){throw new Error()}
        console.log(req.params)
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)
        
    } catch (error) {
       res.status(404).send() 
    }
})

module.exports= router













// //read user by id
// router.get("/users/:id", async (req, res) => {
    //     const _id = req.params.id
    //     try {
        //         const result = await User.findById(_id)
//         if (!result) { return res.status(404).send('No such user exists') }
//         res.status(201).send(result)
//     } catch (error) {
//         res.status(500).send(error)
//     }
// })