import { describe, test, expect, beforeAll, afterAll } from "bun:test";
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

  test("PATCH", () => {
    expect(
      axios.patch(`${API_URL}/task/${actualTask?._id}`, { name: "Test123" })
    ).resolves.toMatchObject({
      status: HttpStatusCode.Ok,
      data: {
        name: "Test123",
      },
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

  test.todo("PUT", () => {});
});

describe("Room CRUD", () => {
  let actualTask: Task;
  beforeAll(async () => {
    actualTask = (await axios.post(`${API_URL}/tasks`, task)).data;
  });
  afterAll(async () => {
    await axios.delete(`${API_URL}/task/${actualTask._id}`);
  });

  test("Adding", () => {
    expect(
      axios.post(`${API_URL}/task/${actualTask._id}/room/ABC`, {
        room: "RoomABC",
      })
    ).resolves.toMatchObject({
      data: {
        rooms: {
          ABC: "RoomABC",
        },
      },
    });
    expect(
      axios.post(`${API_URL}/task/${actualTask._id}/room/XYZ`, {
        room: "RoomXYZ",
      })
    ).resolves.toMatchObject({
      data: {
        rooms: {
          ABC: "RoomABC",
          XYZ: "RoomXYZ",
        },
      },
    });
  });
  test("Deleting", async () => {
    expect(
      axios.delete(`${API_URL}/task/${actualTask._id}/room/ABC`)
    ).resolves.toMatchObject({
      data: {
        rooms: {
          XYZ: "RoomXYZ",
        },
      },
    });

    const response = await axios.delete(
      `${API_URL}/task/${actualTask._id}/room/XYZ`
    );

    expect(response.data.rooms).toBeUndefined();
  });
});
