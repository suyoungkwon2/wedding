# 모바일 청첩장

```bash
npm install
npm run dev   # http://localhost:3000
```

## 수정 위치

| 무엇 | 파일 |
| --- | --- |
| 이름·날짜·장소·인사말·계좌·안내사항·공유 문구·갤러리 순서 | `src/data/wedding.ts` |
| 색상·폰트·여백 (디자인 토큰) | `src/app/globals.css` 상단 `:root` |
| 섹션 마크업 | `src/components/*.tsx` |

## 사진

원본은 `photos/`에 넣습니다 (git에 올라가지 않음). `npm run images`를 실행하면 웹용으로 줄인 사진이 만들어집니다.

- `photos/gallery/*` → 갤러리. 순서는 `wedding.ts`의 `gallery` 배열 순서를 따릅니다. 메인 사진도 이 중에서 `wedding.ts`의 `hero`로 고릅니다.
- `photos/og.jpg` → 카카오톡 공유 이미지 (1200×630으로 자동 크롭)

## 배포 (GitHub Pages)

`main`에 push하면 `.github/workflows/deploy.yml`이 빌드해서 https://suyoungkwon2.github.io/wedding/ 에 배포합니다.

최초 1회:
1. 저장소 Settings → Pages → Source를 **GitHub Actions**로 설정
2. (지도 사용 시) Settings → Secrets and variables → Actions → **Variables**에 `NAVER_MAP_KEY` 등록

## 네이버 지도

1. [네이버 클라우드 플랫폼](https://www.ncloud.com) 콘솔 → Maps → Application 등록 (Dynamic Map 선택)
2. Web 서비스 URL에 `https://suyoungkwon2.github.io`와 `http://localhost:3000` 등록
3. 발급된 Client ID를 로컬은 `.env.local`의 `NEXT_PUBLIC_NAVER_MAP_KEY`에, 배포용은 위 GitHub Variables에 등록

키가 없으면 지도 없이 길찾기 링크만 표시됩니다.

## 카카오톡 공유 시

카카오톡은 미리보기를 캐시합니다. OG 정보를 바꾼 뒤에는
[카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 URL 캐시를 초기화하세요.
