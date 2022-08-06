const express = require("express")
require('./db/mongoose.js')
const { findByIdAndUpdate } = require("./models/task.js")
const userRouter = require("./routers/user.js")
const taskRouter = require("./routers/task.js")

const app = express()
const port = process.env.PORT

app.use(express.json())
app.use(userRouter)
app.use(taskRouter)


const Task= require('./models/task')
const User= require('./models/user')

const multer  = require('multer')
const upload = multer({ dest: 'uploads/' })





app.listen(port, () => {
    console.log('Server is running on port ' + port)
})

