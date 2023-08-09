import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const collection = 'Productos';

const schema = mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    code: {
        type: String,
        require: true
    },
    price: {
        type: Number,
        require: true
    },
    status: {
        type: String,
        require: true
    },
    stock: {
        type: Number,
        require: true
    },
    category: {
        type: String,
        require: true
    },
    thumbnail: {
        type: String,
        require: true
    },
    owner:
    {
        type: String,
        default: "admin"
    }
    // {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Users"
    // }
})

schema.plugin(mongoosePaginate)
const productsModel = mongoose.model(collection, schema);
export default productsModel;