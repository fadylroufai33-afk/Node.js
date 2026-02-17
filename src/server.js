import http from "node:http";
import { json } from "./utils/response.js";
import { listUsers } from "./users/user-controler.js";

const listener = (request, response) => {
  if (request.url === "/users" && request.method === "GET") {
    return listUsers(request, response);
  }
  return json(response, 404, { error: "Not found" });
};

const server = http.createServer(listener);
server.listen(3000);

console.log("server running at http://127.0.0.1/3000/");