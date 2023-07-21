import userModel from "../Dao/models/User.model.js";

export default class SessionsDaoMongo {
    getUserById = async (uid) => {
        const user = await userModel.findOne({ _id: uid });
        return user;
    };

    getUserByMail = async (email) => {
        const user = await userModel.findOne( {email} );
        return user;
    };

    updateUserPass = async (uid, newHashedPassword) => {
        const user = await userModel.updateOne({ _id: uid }, { $set: { password: newHashedPassword } });
        return user;
    };
};