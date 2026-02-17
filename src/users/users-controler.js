import { getUsers } from "./user-service.js";
import { json } from "../utils/response.js";

export function listUsers(request, response) {
  if (request.method !== "GET") {
    return json(response, 405, { error: "Method not allowed" });
  }
  const users = getUsers();
  return json(response, 200, { users });
}