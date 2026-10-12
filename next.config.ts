import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GitHub Pages용 정적 사이트로 빌드 (out/ 폴더)
  output: "export",
  // https://<user>.github.io/<repo> 로 배포할 때 /<repo> 를 지정 (로컬에서는 비워둠)
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || undefined,
  trailingSlash: true,
  images: { unoptimized: true }, // 사진은 npm run images 로 미리 최적화
  turbopack: { root: __dirname },
};

export default nextConfig;
