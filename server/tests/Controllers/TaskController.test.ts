import { describe, test, expect, beforeEach, afterEach } from "bun:test";
import { TaskController } from "../../src/Controllers/TaskController";
import { TaskType, type Task } from "../../../shared/Entities/Task";
import axios, { HttpStatusCode } from "axios";

const task: Task = {
  subject: "TST",
  type: TaskType.PROJECT,
  required: false,
  name: "test",
  description: "testDesc",
  due_date: new Date().toISOString(),
  due_date_end: null,
  personal: false,
  link: null,
  completed_by: ["xyz"],
  created_by: "tester",
};
const API_URL = "http://localhost:3000";
describe("Task CRUD", () => {
  let actualTask: null | Task = null;

  test("POST", async () => {
    actualTask = (await axios.post<Task>(`${API_URL}/tasks`, task)).data;
    expect(actualTask).toMatchObject(task);
  });
  test("GET", () => {
    expect(
      axios.get(`${API_URL}/task/${actualTask?._id}`)
    ).resolves.toMatchObject({
      data: task,
    });
  });
  test("DELETE", async () => {
    expect(
      axios.delete(`${API_URL}/task/${actualTask?._id}`)
    ).resolves.toMatchObject({
      status: HttpStatusCode.NoContent,
    });
    expect(axios.get(`${API_URL}/task/${task}`)).rejects.toMatchObject({
      status: HttpStatusCode.NotFound,
    });
  });

  test.todo("PATCH", () => {});
  test.todo("PUT", () => {});
});
describe("Room CRUD", () => {
  beforeEach(async () => {
    // taskawait axios.post("/tasks", task);
  });
});
