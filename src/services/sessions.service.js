import SessionsDaoMongo from "../persistence/sessions.dao.mongo.js";
import { GetContactDto } from "../Dao/dto/user.dto.js";

const sessionsDao = new SessionsDaoMongo();

export default class SessionsService {

    userUpdateOne = async (uid, user) => {
        const updatedUser = await sessionsDao.userUpdateOne(uid, user);
        return updatedUser;
    };

    getUserById = async (uid) => {
        const user = await sessionsDao.getUserById(uid);
        return user;
    };

    getUserByIdDTO = async (uid) => {
        const user = await sessionsDao.getUserById(uid);
        const DtoUser = new GetContactDto(user);
        return DtoUser;
    };

    getUserByMail = async (email) => {
        const user = await sessionsDao.getUserByMail(email);
        return user;
    };

    updateUserPass = async (uid, newHashedPassword) => {
        const user = await sessionsDao.updateUserPass(uid, newHashedPassword);
        return user;
    };
};
