export class GetContactDto {
    constructor(user) {
        this.nombreCompleto = user.first_name + ' ' + user.last_name;
        this.email = user.email;
    };
};