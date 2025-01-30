import type { User } from "./User";
import { smallerFirstSort } from "../../web/src/Utils.ts";

export interface Room {
  task_id: string;
  room_name: string;
  range_start: string;
  range_end: string;
}

/**
 * Finds, which indexes (after space splitting) are valid for sorting
 * It enables to differentiate between having Surname first or second
 * @param rooms
 * @returns
 */
function getRoomsSortIndexes(rooms: Room[]): number[] {
  const names = rooms.map((room) =>
    [room.range_start, room.range_end].map((x) => x?.trim().split(" "))
  );
  const indexes: number[] = [];
  const maxSize = names.reduce(
    (a, pair) =>
      Math.min(
        a,
        pair.reduce((a, b) => Math.min(a, b?.length), Number.MAX_SAFE_INTEGER)
      ),
    Number.MAX_SAFE_INTEGER
  );
  for (let i = 0; i < maxSize; i++) {
    if (
      names.every((room) => {
        return room[0][i] < room[1][i];
      })
    )
      indexes.push(i);
  }

  return indexes;
}
export function toSortedRooms(rooms: Room[]): Room[] {
  const sortIndex = getRoomsSortIndexes(rooms)[0] ?? null;
  if (sortIndex === null)
    return rooms.sort((a, b) => smallerFirstSort(a.room_name, b.room_name));

  return rooms.sort((a, b) =>
    smallerFirstSort(
      a.range_start.split(" ")[sortIndex],
      b.range_start.split(" ")[sortIndex]
    )
  );
}
export function userInRoom(room: Room, user: User): boolean {}
