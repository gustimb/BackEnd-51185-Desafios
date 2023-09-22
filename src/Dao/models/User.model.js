import mongoose from 'mongoose';

const collection = 'Users';

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
        required: true,
        enum: ["user", "admin", "premium"],
        default: 'user'
    },
    githubID: {
        type: Number,
        default: ""
    },
    documents: {
        type: [
            {
                name: { type: String, required: true },
                reference: { type: String, required: true }
            }
        ],
        default: []
    },
    last_connection: {
        type: String,
        default: null
    },
    status: {
        type: String,
        require: true,
        enums: ["completo", "incompleto", "pendiente"],
        default: "pendiente"
    },
    avatar: {
        type: String,
        default: ""
    }
})

const userModel = mongoose.model(collection, schema);

export default userModel;
