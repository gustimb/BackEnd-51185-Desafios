import chai from "chai";
import supertest from "supertest";

import SessionsService from "../src/services/sessions.service.js";
import CartService from "../src/services/carts.service.js";
import { app } from "../src/app.js";

const sessionsService = new SessionsService();
const cartService = new CartService();
const expect = chai.expect;
const requester = supertest(app);
const userTest = 'test-user@user.com';

describe("Testing de App BackEnd", () => {

    const userMock = {
        first_name: 'User',
        last_name: 'Test',
        email: userTest,
        age: '21',
        password: '12345'
    };

    const productTestID = "64dd19ee07ec54a0f09dcf51";
    const cartTestID ="64ddb0979f574bb6f39a329a";

    describe("Session: Registro y logueo de usuario", () => {

        after(async function(){
            const user = await sessionsService.getUserByMail(userMock.email);
            await sessionsService.deleteUserById(user._id.toString());
            await cartService.deleteCart(user.cart[0]._id);
        });

        it("Registro de un usuario", async () => {
            const response = await requester.post('/api/session/register').send(userMock);
            expect(response.statusCode).to.be.equal(200);
            expect(await sessionsService.getUserByMail(userMock.email)).to.be.ok;
        });

        it("Logueo de un usuario", async () => {
            const response = await requester.post('/api/session/login').send(userMock);
            expect(response.statusCode).to.be.equal(200);
        });
    });

    describe("Products", () => {

        it("GET Productos", async () => {
            const response = await requester.get('/api/products/');
            expect(Array.isArray(response._body)).to.be.equal(true);
        });

        it("GET Productos", async () => {
            const response = await requester.get(`/api/products/${productTestID}`);
            expect(response._body._id).to.be.ok;
        });
    });

    describe("Carts", () => {

        it("GET Productos", async () => {
            const response = await requester.get('/api/carts/');
            expect(Array.isArray(response._body)).to.be.equal(true);
        });

        it("GET Productos", async () => {
            const response = await requester.get(`/api/carts/${cartTestID}`);
            expect(response._body._id).to.be.ok;
        });
    });
});

