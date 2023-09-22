export class GetContactDto {
    constructor(user) {
        this.nombreCompleto = user.first_name + ' ' + user.last_name;
        this.email = user.email;
        this.role = user.role;
    };
};

export class GetUsersDto {
    constructor(user) {
        this.nombre = user.first_name + ' ' + user.last_name;
        this.correo = user.email;
        this.rol = user.role;
    };
};