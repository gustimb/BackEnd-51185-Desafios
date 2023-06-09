import mongoose from 'mongoose';

const collection = 'User';

const schema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true
    },
    age: Number,
    password: String,
    cart: [],
    role: {
        type: String,
        default: "user"
    }    ,
    githubID: {
        type: Number,
        default: ""
    }
})

const userModel = mongoose.model(collection, schema);

export default userModel;
