import { describe, test, expect } from "bun:test";
import { RawRoomInputParser } from "../../../src/components/Form/RoomInputs/RawRoomInputParser";

test("Smrčka 2 room", () => {
  const parser = new RawRoomInputParser(`
    Ambrušová - Podolskyi ----> D105
    Pokorný - Žluč ----> D0206
  `);
});
