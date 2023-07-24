// To run this file directly:
// bun run src/bin/scramble.ts -- <program args>

import { eventInfo } from "../cubing/puzzles";
import { randomScrambleForEvent } from "../cubing/scramble";
import { setSearchDebug } from "../cubing/search";

const eventID = process.argv[2];

if (!eventID) {
  console.log(`Usage: scramble <event-id>

Example: scramble 333`);
  process.exit(0);
}

setSearchDebug({ logPerf: false }); // TODO: why doesn't this work?
const scramble = await randomScrambleForEvent(eventID);
console.log(scramble.toString());

const url = new URL("https://alpha.twizzle.net/edit/");
const puzzleID = eventInfo(eventID)?.puzzleID;
puzzleID && url.searchParams.set("puzzle", puzzleID);
url.searchParams.set("alg", scramble.toString());
console.log("\n🔗 " + url.toString());
