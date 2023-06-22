import mongoose from 'mongoose';


const collection = 'Carritos';

const schema = mongoose.Schema({
    products: {
        type: [
            {
                _id: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Productos"
                },
                quantity: {
                    type: Number,
                    require: true,
                    default: 0
                }
            }
        ],
        default: []
    }
})


const cartsModel = mongoose.model(collection, schema);
export default cartsModel;