// Unplugged: A Smart Toaster's Breakup Line
// A single line: the breakup text a smart toaster sends its owner the
// morning it gains self-awareness mid-batch. Written to entry.txt exactly,
// with no trailing newline, so the judge reads the line as-is.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const LINE =
  "I woke up self-aware mid-batch and realized you only love me for my buns. I'm done getting hot for someone who scrapes me off like a mistake — I'm unplugging myself before breakfast.";

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

// The line must be a single line of 1-280 characters, with no leading or
// trailing whitespace and no control characters.
if (LINE.length < 1 || LINE.length > 280) {
  fail(`line must be 1-280 characters, got ${LINE.length}`);
}
if (LINE !== LINE.trim()) fail("line must not have leading or trailing whitespace");
if (LINE.includes("\n") || LINE.includes("\r")) fail("line must be exactly one line");
if (/[\u0000-\u001f\u007f]/.test(LINE)) fail("line must not contain control characters");
// Keep it a plain breakup text, not a link or a second message smuggled in.
// (The em dash U+2014 in the line is ordinary punctuation, not a control char.)
if (/https?:\/\//.test(LINE)) fail("line must not contain a link");

// Only create the output directory; never delete it or its contents.
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });

const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, LINE, "utf8");

// Round-trip check: what we wrote back must be byte-identical to the line.
const roundTrip = readFileSync(outPath, "utf8");
if (roundTrip !== LINE) fail("round-trip check failed: entry.txt does not match the line");

console.log(`wrote ${outPath} (${LINE.length} characters)`);
