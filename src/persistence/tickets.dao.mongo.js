import ticketsModel from "../Dao/models/ticket.model.js";

export default class TicketsDaoMongo {
    createTicket = async (tk) => {
        const ticketCreated = await ticketsModel.create(tk);
        return ticketCreated;
    };
};