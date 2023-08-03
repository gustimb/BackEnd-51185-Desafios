import mongoose from 'mongoose';

const collection = 'Mensajes';

const schema = mongoose.Schema({
    user: {
        type: String,
        require: true
    },
    message: {
        type: String,
        require: true
    }
})

const chatModel = mongoose.model(collection, schema);
export default chatModel;