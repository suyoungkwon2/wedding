// 원본 사진(photos/)을 웹용으로 줄여 public/images/ 에 저장합니다.
//   photos/gallery/*.jpg     → public/images/gallery/*.jpg       (크게 보기용)
//                            → public/images/gallery/thumb/*.jpg (그리드 썸네일)
//   photos/og.jpg (선택)     → src/app/opengraph-image.jpg       (카카오톡 공유 이미지, 1200x630)
// 실행: npm run images
import { mkdir, readdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const SRC = "photos";
const OUT = "public/images";
const isPhoto = (f) => /\.(jpe?g|png|heic|webp)$/i.test(f);
const outName = (f) => f.replace(/\.[^.]+$/, ".jpg");

// rotate(): EXIF 회전 반영 / 메타데이터(GPS 등)는 기본으로 제거됨
// position: 잘라낼 때 기준. 갤러리 썸네일은 항상 가운데("centre")
const resize = (input, width, height, output, fit = "inside", position = "centre") =>
  sharp(input).rotate().resize({ width, height, fit, position, withoutEnlargement: true }).jpeg({ quality: 80, mozjpeg: true }).toFile(output);

await rm(`${OUT}/gallery`, { recursive: true, force: true });
await mkdir(`${OUT}/gallery/thumb`, { recursive: true });

if (existsSync(`${SRC}/og.jpg`)) {
  await resize(`${SRC}/og.jpg`, 1200, 630, "src/app/opengraph-image.jpg", "cover", "north");
  console.log("og.jpg → src/app/opengraph-image.jpg");
}

const files = (await readdir(`${SRC}/gallery`)).filter(isPhoto).sort();
await Promise.all(
  files.map(async (f) => {
    const input = path.join(SRC, "gallery", f);
    await resize(input, 1600, 1600, `${OUT}/gallery/${outName(f)}`);
    await resize(input, 480, 480, `${OUT}/gallery/thumb/${outName(f)}`, "cover");
  }),
);
console.log(`gallery: ${files.length}장`);
console.log("\nwedding.ts 의 gallery 에 붙여넣을 목록:\n" + files.map((f) => `    "${outName(f)}",`).join("\n"));
