const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()


//create a task
router.post('/tasks', auth, async (req, res) => {
    console.log(req.user._id)
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })

    try {
        await task.save()
        res.status(201).send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//get all tasks
//limit and skip
//sorting ?sortBy ascending=1 descending= -1
router.get('/tasks', auth, async (req, res) => {
   const match={}
   const sort={}
   if (req.query.sortBy){
//    console.log(req.query.sortBy) createdAt:desc
    const array= req.query.sortBy.split(':')
//    console.log(array) [ 'createdAt', 'desc' ]
    //terniary operator,condition checks, if true after ?, if false after :
    sort[array[0]]=array[1]==='desc' ? -1 : 1
   // console.log(sort){ createdAt: -1 }
}
   if (req.query.completed){match.completed=req.query.completed}
    
    try {
        
        //below code will also work instead of populate
        // const tasks = await Task.find({owner:req.user._id})
      //  await req.user.populate({path:'tasks', match:{completed: req.query.completed}})
      await req.user.populate({path:'tasks', match, options:{limit:req.query.limit, skip:req.query.skip, 
        sort}})
        res.send(req.user.tasks)
    } catch (e) {
        res.status(500).send()
    }
})

//find one task by id
router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id

    try {
        //const task = await Task.findById(_id)
        const task= await Task.findOne({_id, owner: req.user._id})
        if (!task) {
            return res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

//update a task
router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
       // const task = await Task.findById(req.params.id)
        const task= await Task.findOne({_id: req.params.id, owner: req.user._id})
        
        if (!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()
        
        res.send(task)
    } catch (e) {
        res.status(400).send(e)
    }
})

//delete a task
router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id, owner: req.user._id})

        if (!task) {
            res.status(404).send()
        }

        res.send(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router