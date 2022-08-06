//CRUD
// const mongodb = require('mongodb')
// const MongoClient = mongodb.MongoClient

// const ObjectID= mongodb.ObjectID
const {MongoClient, ObjectID} = require('mongodb')

const connectionURL= "mongodb://127.0.0.1:27017"
const databaseName= "task-manager"

// const id = new ObjectID()
// console.log(id)

MongoClient.connect(connectionURL, {useNewUrlParser: true}, (error, client) => {
    if (error){
        return console.log('unable to connect to database')
    }
    console.log('connected correctly!')
    
    const db = client.db(databaseName)

    db.collection('tasks').deleteOne({description:"have breakfast"}).then((result)=>{console.log(result.deletedCount)}).catch((error)=>{
      console.log(error)  
    })
})  


//     db.collection('tasks').updateMany({completed: false}, {$set:{completed: true}}).then((result)=>
//     {console.log(result)}).catch((error)=>{console.log(error)
// })

// db.collection('users').updateOne({_id: new ObjectID("62e03cf0a2ada596d9e33c4e")}, 
// {$inc: {Age: 2}}).then((result)=>{console.log(result)}).catch((error)=>{
//     console.log(error)
// })


//  const collection = db.collection('users')
//  collection.insertMany([     {     name:'Jen',     Age: 28  },  {     name : 'Diana', Age: 31 } ]  , (error,result)=>{//     if(error){//         return console.log('issue with adding')//     }//     console.log(result.insertedCount+" were added")//     debugger// }// )
// db.collection('tasks').insertMany([{//     description: "wake up", completed: true// }, {description: 'have breakfast', completed: false},// {description: 'study', completed: false}], (error,result)=>{//     if (error){return console.log('addition failed')}//     console.log(result.insertedCount+ " were added")// })

    // db.collection('users').findOne({_id: new ObjectID("62e04c20a35483424e8ed8d7")},(error,result)=>{
    //     console.log(result)
    // })
    // db.collection('users').find({Age: 34}).toArray((error,result)=>
    // console.log(result)
    // )
    // db.collection('users').find({Age: 34}).count((error,result)=>
    // console.log(result)
    // )
    
    // db.collection('tasks').findOne({_id: new ObjectID("62e04dd468a6d75226cf1c7c")},(error, result)=>{
    //     console.log(result)
    // })
    // db.collection('tasks').find({completed: false}).toArray((error, result)=>{console.log(result)})