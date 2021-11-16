const nodemailer=require('nodemailer')

const transporter=nodemailer.createTransport({
    service:'hotmail',
    auth:{
        user:'es-roaaali2021@alexu.edu.eg',
        pass:process.env.My_EMAIL_PASSWORD
    }
}
)

const sendWelcomeEmailForUsers=(email,name)=>{
    
    const options={
        from:'es-roaaali2021@alexu.edu.eg',
        to:email,
        subject:'Thank you for joining in',
        text:`Welcome ${name} to the task manager app.Let us know how you get along`
    }
    transporter.sendMail(options,function(err,info){
        if(err){
            
            return console.log(err)
        }
    
        console.log(info.response)
    })
}

const sendEmailAfterDeleteAccount=(email,name)=>{
    console.log('Deleting account')
    const options={
        from:'es-roaaali2021@alexu.edu.eg',
        to:email,
        subject:'Your account has been deleted',
        text:`Hello ${name},We are so sorry that you have decedied to delete your account .Let us know what went wrong`
    }
    transporter.sendMail(options,function(err,info){
        if(err){
           return console.log(err)
        }

        console.log(info.response)
    })
}

module.exports={
    sendWelcomeEmailForUsers,
    sendEmailAfterDeleteAccount
}