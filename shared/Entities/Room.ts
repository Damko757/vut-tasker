import { smallerFirstSort } from "../Utils";
import type { User } from "./User";

export interface Room {
  task_id: string;
  room_name: string;
  range_start: string;
  range_end: string;
}

interface RoomLink {
  // room: Room;
  index: number;
  next: RoomLink | null;
}

/**
 * RoomLink DEBUG print
 * @param rooms
 * @param roomLink
 */
function printLink(rooms: Room[], roomLink: RoomLink | null) {
  let o: string[] = [];
  while (roomLink) {
    o.push(rooms[roomLink.index].room_name);
    roomLink = roomLink.next;
  }
  o.push("NULL");
}

/**
 * Finds, which indexes (after space splitting) are valid for sorting
 * It enables to differentiate between having Surname first or second
 * @param rooms
 * @returns Linked rooms in order (every available)
 */
export function createRoomSortLink(
  rooms: Room[]
): { list: RoomLink; partIndex: number }[] {
  /**
   *
   * @param startIndex
   * @param endIndex
   * @param valueIndex
   * @param indexPart
   * @returns false - invalid, true - continue, null - continue
   */
  function isBetween(
    startIndex: number | null,
    endIndex: number,
    valueIndex: number,
    indexPart: number
  ) {
    const second = [
      names[endIndex][0][indexPart],
      names[endIndex][1][indexPart],
    ];
    const value = [
      names[valueIndex][0][indexPart],
      names[valueIndex][1][indexPart],
    ];
    if (value[0] < second[0]) {
      if (value[1] < second[0]) return true; // XxxxX S-s
      return false; // XxxxxxSxX s ...
    }
    if (value[0] < second[1]) return false; // S Xxxs
    return null;
  }

  if (rooms.length == 0) return [];
  /**
   * It tries every index of value (["Name1Part1", "Name1Part2"])
   * to create linked map by sorted names
   */
  const names = rooms.map((room) =>
    [room.range_start, room.range_end].map((x) => x?.trim().split(" "))
  );
  const maxSize = names.reduce(
    (a, pair) =>
      Math.min(
        a,
        pair.reduce((a, b) => Math.min(a, b?.length), Number.MAX_SAFE_INTEGER)
      ),
    Number.MAX_SAFE_INTEGER
  );

  const lists: ReturnType<typeof createRoomSortLink> = [];
  for (let partIndex = 0; partIndex < maxSize; partIndex++) {
    const list: RoomLink = {
      index: 0,
      next: null,
    };
    if (
      names.every((roomPart, i) => {
        if (i == 0) return true;
        printLink(rooms, list);
        if (roomPart[0][partIndex] > roomPart[1][partIndex]) return false;

        // Looping and finding match
        let currentRoom: RoomLink | null = null; // Ability to insert first
        let nextRoom: RoomLink | null = list;
        while (nextRoom != null) {
          const res = isBetween(
            currentRoom?.index ?? null,
            nextRoom.index,
            i,
            partIndex
          );
          if (res === false) return false;
          if (res === true) break;
          currentRoom = nextRoom;
          nextRoom = nextRoom.next;
        }

        if (currentRoom == null) {
          list.next = {
            index: list.index,
            next: list.next,
          };
          list.index = i;
        } else currentRoom.next = { next: currentRoom.next, index: i };
        return true;
      })
    )
      lists.push({ partIndex: partIndex, list: list });
  }

  return lists;
}
export function toSortedRooms(rooms: Room[]): Room[] {
  if (rooms.length == 0) return [];
  const sortLink = createRoomSortLink(rooms);
  if (sortLink.length == 0)
    return rooms.sort((a, b) => smallerFirstSort(a.room_name, b.room_name));
  const sortedRooms = [];
  let currentRoom: RoomLink | null = sortLink.at(-1).list; // sort by first match
  while (currentRoom != null) {
    sortedRooms.push(rooms[currentRoom.index]);
    currentRoom = currentRoom.next;
  }
  return sortedRooms;
}
export function userInRoom(room: Room, user: User, partIndex: number): boolean {
  const start = room.range_start.split(" ");
  const end = room.range_end.split(" ");

  const toSearch: (keyof User)[] = ["forename", "surname", "xlogin"];
  return toSearch.some(
    (value) =>
      start[partIndex] <= user[value]! && user[value]! <= end[partIndex]
  );
}
