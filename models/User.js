const {Schema, model} = require('mongoose');

const User = new Schema ({
    name: {type:String, unique:true, required: true},
    id: {type:Number, unique:true, required: true}
})

module.exports = model("User", User);