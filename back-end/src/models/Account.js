const mongoose = require('mongoose')
const accountSchema=new mongoose.Schema( {
    //Add pubId to Acoount
    pubId: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    idTokens: [{
        type: String,
        required: false,
    }],
    picture: {
        type: Buffer,
        required: false,
    },
    tutorat: [{//PublicID of the course
        type: String,
        required: false,
    }],

    
    

})
accountSchema.index( { username: "text" } )
const Account = mongoose.model('Account',accountSchema
)

module.exports = Account