import { describe, test, expect } from "bun:test";
import { toSortedRooms, type Room } from "../../../shared/Entities/Room";
import { permutations } from "../../src/Utils";
describe("Room sorting", () => {
  test("Surname first", () => {
    const rooms: Room[] = [
      {
        task_id: "",
        room_name: "A",
        range_start: "Blažko Martin",
        range_end: "Feruš Ján",
      },
      {
        task_id: "",
        room_name: "B",
        range_start: "Grál Peter",
        range_end: "Matejovičová Anna",
      },
      {
        task_id: "",
        room_name: "C",
        range_start: "Nimný Dominik",
        range_end: "Rojná Alžbeta",
      },
    ];

    permutations(rooms).forEach((roomsPermutation) => {
      expect(toSortedRooms(roomsPermutation)).toEqual(rooms);
    });
  });
  test.todo("Forename first", () => {});
  test.todo("xlogin", () => {});
});
