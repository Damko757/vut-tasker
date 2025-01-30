import { describe, test, expect } from "bun:test";
import {
  createRoomSortLink,
  toSortedRooms,
  type Room,
} from "../../../shared/Entities/Room";
import { permutations } from "../../../shared/Utils";

describe("Room linking", () => {
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
  test("Same in, same out", () => {
    expect(createRoomSortLink(rooms)).toEqual({
      index: 0,
      next: {
        index: 1,
        next: {
          index: 2,
          next: null,
        },
      },
    });
  });
  test("Reversed", () => {
    expect(
      createRoomSortLink([rooms.at(-1)!, rooms.at(-2)!, rooms.at(-3)!])
    ).toEqual({
      index: 2,
      next: {
        index: 1,
        next: {
          index: 0,
          next: null,
        },
      },
    });
  });

  test("Invalid", () => {
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
        range_end: "Mitejovičová Anna",
      },
      {
        task_id: "",
        room_name: "C",
        range_start: "Mamný Dominik",
        range_end: "Rojná Alžbeta",
      },
    ];

    permutations(rooms).forEach((permutedRoom) =>
      expect(createRoomSortLink(permutedRoom)).toBeNull()
    );
  });

  test("Permutations", () => {
    permutations(rooms).forEach((permutedRoom) => {
      expect(createRoomSortLink(permutedRoom)).toEqual({
        index: permutedRoom.indexOf(rooms[0]),
        next: {
          index: permutedRoom.indexOf(rooms[1]),
          next: {
            index: permutedRoom.indexOf(rooms[2]),
            next: null,
          },
        },
      });
    });
  });
  test("xLogin", () => {
    const rooms: Room[] = [
      {
        task_id: "",
        room_name: "Z",
        range_start: "xblazkm05",
        range_end: "xferusj05",
      },
      {
        task_id: "",
        room_name: "Y",
        range_start: "xgralp05",
        range_end: "xmiteja05",
      },
      {
        task_id: "",
        room_name: "X",
        range_start: "xnimnyd05",
        range_end: "xrojnaa05",
      },
    ];
    permutations(rooms).forEach((permutedRoom) => {
      expect(createRoomSortLink(permutedRoom)).toEqual({
        index: permutedRoom.indexOf(rooms[0]),
        next: {
          index: permutedRoom.indexOf(rooms[1]),
          next: {
            index: permutedRoom.indexOf(rooms[2]),
            next: null,
          },
        },
      });
    });
  });
});
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
  test("Forename first", () => {
    const rooms: Room[] = [
      {
        task_id: "",
        room_name: "A",
        range_start: "Martin Blažko",
        range_end: "Ján Feruš",
      },
      {
        task_id: "",
        room_name: "B",
        range_start: "Peter Grál",
        range_end: "Anna Matejovičová",
      },
      {
        task_id: "",
        room_name: "C",
        range_start: "Dominik Nimný",
        range_end: "Alžbeta Rojná",
      },
    ];

    permutations(rooms).forEach((roomsPermutation) => {
      expect(toSortedRooms(roomsPermutation)).toEqual(rooms);
    });
  });
  test("Invalid", () => {
    const rooms: Room[] = [
      {
        task_id: "",
        room_name: "Z",
        range_start: "Blažko Martin",
        range_end: "Feruš Ján",
      },
      {
        task_id: "",
        room_name: "Y",
        range_start: "Grál Peter",
        range_end: "Mitejovičová Anna",
      },
      {
        task_id: "",
        room_name: "X",
        range_start: "Mamný Dominik",
        range_end: "Rojná Alžbeta",
      },
    ];
    permutations(rooms).forEach((roomsPermutation) => {
      expect(toSortedRooms(roomsPermutation)).toEqual(rooms.toReversed());
    });
  });
  test("xlogin", () => {
    const rooms: Room[] = [
      {
        task_id: "",
        room_name: "Z",
        range_start: "xblazkm05",
        range_end: "xferusj05",
      },
      {
        task_id: "",
        room_name: "Y",
        range_start: "xgralp05",
        range_end: "xmiteja05",
      },
      {
        task_id: "",
        room_name: "X",
        range_start: "xnimnyd05",
        range_end: "xrojnaa05",
      },
    ];
    permutations(rooms).forEach((roomsPermutation) => {
      expect(toSortedRooms(roomsPermutation)).toEqual(rooms);
    });
  });
});
