import TicketsDaoMongo from "../persistence/tickets.dao.mongo.js";

const ticketsDaoMongo = new TicketsDaoMongo();

export default class TicketsService {
    createTicket = async (tk) => {
        const ticketCreated = await ticketsDaoMongo.createTicket(tk);
        return ticketCreated;
    };
};