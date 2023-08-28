import userModel from "../Dao/models/User.model.js";

export default class SessionsDaoMongo {
    getUserById = async (uid) => {
        const user = await userModel.findOne({ _id: uid });
        return user;
    };

    userUpdateOne = async (uid, user) => {
        const updatedUser = await userModel.updateOne(uid, user);
        return updatedUser;
    };

    getUserByMail = async (email) => {
        const user = await userModel.findOne( {email} );
        return user;
    };

    updateUserPass = async (uid, newHashedPassword) => {
        const user = await userModel.updateOne({ _id: uid }, { $set: { password: newHashedPassword } });
        return user;
    };

    deleteUserById = async (uid) => {
        const user = await userModel.deleteOne({ _id: uid });
        return user;
    };
};