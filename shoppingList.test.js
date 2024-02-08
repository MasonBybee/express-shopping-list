process.env.NODE_ENV = "test";

const request = require("supertest");

const app = require("./app");
let items = require("./fakeDb");
const supertest = require("supertest");

let popsicle = { name: "popsicle", price: 1.45 };
let cheerios = { name: "cheerios", price: 3.4 };

beforeEach(function () {
  items.push(popsicle);
  items.push(cheerios);
});

afterEach(function () {
  items.length = 0;
});

describe("/GET /items", () => {
  test("gets list of items", async () => {
    const res = await supertest(app).get("/items");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([popsicle, cheerios]);
  });
});

describe("GET /items/:name", () => {
  test("Get item by name", async () => {
    const res = await request(app).get(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(popsicle);
  });
});

describe("POST /items", function () {
  test("Creating a item", async () => {
    const res = await request(app).post("/items").send({
      name: "Chocolate",
      price: 1.5,
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual({
      added: {
        name: "Chocolate",
        price: 1.5,
      },
    });
  });
});

describe("/PATCH /items/:name", () => {
  test("Updating a item's name", async () => {
    const res = await request(app).patch(`/items/${popsicle.name}`).send({
      name: "Soda",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: {
        name: "Soda",
        price: 1.45,
      },
    });
  });
  test("Updating a item's price", async () => {
    const res = await request(app).patch(`/items/${cheerios.name}`).send({
      price: 2.88,
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      updated: {
        name: "cheerios",
        price: 2.88,
      },
    });
  });
  test("Responds with 404 for invalid name", async () => {
    const res = await request(app).patch(`/items/dragon`).send({
      name: "Monster",
      price: 399.89,
    });
    expect(res.statusCode).toBe(404);
  });
});

describe("/DELETE /items/:name", () => {
  test("Deleting a item", async () => {
    const res = await request(app).delete(`/items/${popsicle.name}`);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: "Deleted" });
  });
  test("Responds with 404 for deleting invalid item", async () => {
    const res = await request(app).delete(`/items/milk`);
    expect(res.statusCode).toBe(404);
  });
});
