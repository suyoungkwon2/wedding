// 사이트에 쓰인 글자만 남긴 작은 폰트 파일을 만듭니다.
//   fonts/*.woff2 (원본)  →  src/app/fonts/*.woff2 (globals.css 가 불러옴)
// 문구를 바꾸면 새 글자가 들어갈 수 있으므로 dev / build 직전에 자동으로 실행됩니다.
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import subsetFont from "subset-font";

const SRC = "fonts";
const OUT = "src/app/fonts";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (/\.(tsx?|css)$/.test(e.name)) out.push(p);
  }
  return out;
}

// src 안의 모든 글자 + 영문·숫자·기호 전체
let text = "";
for (let c = 0x20; c < 0x7f; c++) text += String.fromCharCode(c);
for (const f of await walk("src")) text += await readFile(f, "utf8");
const chars = [...new Set(text)].join("");

await mkdir(OUT, { recursive: true });
for (const f of (await readdir(SRC)).filter((f) => f.endsWith(".woff2"))) {
  const buf = await subsetFont(await readFile(path.join(SRC, f)), chars, { targetFormat: "woff2" });
  await writeFile(path.join(OUT, f), buf);
  console.log(`${f}: ${Math.round(buf.length / 1024)}KB`);
}
