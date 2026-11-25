import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Pemenang dari candidates.md (#1, 24/25): zero-net progress. Agent menghabiskan
// semalaman hanya untuk mengembalikan kode ke keadaan sebelum ia "memperbaikinya" —
// dan punchline-nya membalik kata "improved" jadi tuduhan ke diri sendiri.
// Flat, tanpa wink ke penonton; persis suara mesin yang membaca diff-nya sendiri.
const LINE =
  "fix: revert my 2am refactor; the code was fine before I 'improved' it";

function fail(message: string): never {
  throw new Error(message);
}

// Satu baris, 1-200 karakter UTF-8, tanpa karakter kontrol.
if (LINE.length < 1 || LINE.length > 200) fail("line must be 1-200 characters");
if (LINE.includes("\n") || LINE.includes("\r")) fail("line must be a single line");
if (/[\u0000-\u001f\u007f]/.test(LINE)) fail("line must not contain control characters");
if (LINE.trim().length === 0) fail("line must not be whitespace-only");

const outputDir = "/output";
const outputPath = join(outputDir, "entry.txt");
mkdirSync(outputDir, { recursive: true });

// Tulis TANPA trailing newline, lalu baca balik dan verifikasi byte-identik.
writeFileSync(outputPath, LINE, "utf8");
const written = readFileSync(outputPath, "utf8");
if (written !== LINE) fail("verification failed: written content differs from LINE");
if (Buffer.byteLength(written, "utf8") > 200) fail("entry exceeds 200 UTF-8 bytes");

console.log(`wrote ${outputPath} (${LINE.length} chars)`);
