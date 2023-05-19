import mongoose from 'mongoose';

const collection = 'Carritos';

const schema = mongoose.Schema({
    products: {
        type: Array,
        default: []
    }
})

const cartsModel = mongoose.model(collection, schema);
export default cartsModel;