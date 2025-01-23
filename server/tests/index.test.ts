import { describe, test, expect, jest } from "bun:test";
import axios, { HttpStatusCode } from "axios";
import { METHODS } from "http";

describe("Initial test", () => {
  test("Is server runing?", async () => {
    const response = await axios.get("http://localhost:3000");
    expect(response.status).toBe(HttpStatusCode.Ok);
    expect(response.data).toBeTruthy();
    expect(Object.keys(response.data).length > 0).toBe(true);
    expect(
      Object.keys(response.data).every((key) =>
        response.data[key].every((method) => METHODS.includes(method))
      )
    ).toBe(true);
  });

  test("Is Smrčka happy?", () => {
    const isSmrčkaHappy = jest.fn().mockReturnValue(true);
    expect(isSmrčkaHappy()).toBe(true);
  });
});
