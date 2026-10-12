/** GitHub Pages 하위 경로(/wedding) 배포를 위해 public/ 파일 경로 앞에 basePath를 붙입니다. */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export const asset = (path: string) => `${basePath}${path}`;
