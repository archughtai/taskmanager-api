const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)


const sendWelcomeEmail = (email, name)=>{

    const msg = {
        to: email, // Change to your recipient
        from: 'ali_chughtai@live.com', // Change to your verified sender
        subject: 'Welcome to task manager app',
        text: "Hi " +name+" manage your tasks now",
        //or you can use `Hi $(name) manage your tasks now`
       // html: '<strong>and easy to do anywhere, even with Node.js</strong>',

      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
}
const sendDeleteEmail = (email, name)=>{

    const msg = {
        to: email, // Change to your recipient
        from: 'ali_chughtai@live.com', // Change to your verified sender
        subject: 'Good bye',
        text: "Hi " +name+"!!!, hope to see you again. If you want to recommend any changes, please reply to this email",
        //or you can use `Hi $(name) manage your tasks now`
       // html: '<strong>and easy to do anywhere, even with Node.js</strong>',

      }
      sgMail
        .send(msg)
        .then(() => {
          console.log('Email sent')
        })
        .catch((error) => {
          console.error(error)
        })
}

module.exports= {sendWelcomeEmail, sendDeleteEmail}

