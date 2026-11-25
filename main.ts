/**
 * Fortune Cookie for the Liquidated Trader — entry program.
 *
 * The fortune is built from three named pieces so the oracle's setup, the
 * hinge and the punchline stay visible as separate ideas. The file that
 * lands in /output/entry.txt is exactly one line: no trailing newline, no
 * extra whitespace, nothing but the fortune itself.
 *
 * Gate (RULES.txt "## The gate"): /output/entry.txt must be UTF-8 text of
 * 1 to 160 characters, not only white space. The task adds: a single
 * fortune cookie message, at most 20 words of plain text, for a crypto
 * trader who has just been liquidated; it must sound like a real fortune
 * and land as a joke on the loss. The self-check below enforces every
 * part of that gate — length, word count, single line, no stray
 * whitespace — and throws before writing anything if any part fails.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const SETUP = "The stars say your next trade will be brilliant";
const HINGE = "—";
const PUNCHLINE = "just as soon as you can afford one";

const GATE_MIN_CHARS = 1;
const GATE_MAX_CHARS = 160;
const GATE_MAX_WORDS = 20;

function buildFortune(): string {
  // The hinge is an em dash: the oracle promises brilliance, the dash
  // pivots, and the punchline reveals the trader is broke — the joke
  // lands on the loss, rueful and warm, never cruel.
  const parts = [SETUP, HINGE, PUNCHLINE];
  const joined = parts.join(" ");
  return `${joined}.`;
}

function checkGate(line: string): void {
  const length = [...line].length;
  if (length < GATE_MIN_CHARS || length > GATE_MAX_CHARS) {
    throw new Error(
      `entry is ${length} chars, gate wants ${GATE_MIN_CHARS}–${GATE_MAX_CHARS}`,
    );
  }
  const words = line.trim().split(/\s+/).filter(Boolean).length;
  if (words > GATE_MAX_WORDS) {
    throw new Error(`entry is ${words} words, gate wants at most ${GATE_MAX_WORDS}`);
  }
  if (line.trim() !== line) {
    throw new Error("entry has leading or trailing whitespace");
  }
  if (line.trim().length === 0) {
    throw new Error("entry is only white space");
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry must be a single line");
  }
}

function outputPath(): string {
  const targetDir = process.env.OUTPUT_DIR ?? "/output";
  return join(targetDir, "entry.txt");
}

function main(): void {
  const line = buildFortune();
  checkGate(line);
  const path = outputPath();
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, line, "utf8");
  console.log(`wrote ${[...line].length} chars to ${path}`);
}

main();
