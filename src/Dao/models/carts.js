import mongoose from 'mongoose';

const collection = 'Carritos';

const schema = new mongoose.Schema({
    products: {}
})

const cartsModel = mongoose.model(collection, schema);
export default cartsModel;