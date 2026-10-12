// 청첩장의 모든 내용은 이 파일에서 수정합니다.

export type Person = {
  name: string;
  /** 영문 이름 (히어로 등 장식용) */
  nameEn: string;
  /** 서열 표기: 장남, 차녀, 아들, 딸 등 */
  relation: string;
  father: string;
  mother: string;
  /** 고인인 경우 이름 앞에 故 표기 */
  fatherDeceased?: boolean;
  motherDeceased?: boolean;
};

export type Account = {
  role: string; // 신랑, 신랑 아버지 ...
  name: string;
  bank: string;
  number: string;
};

export const wedding = {
  groom: {
    name: "윤석후",
    nameEn: "Seokhoo",
    relation: "아들",
    father: "윤영민",
    mother: "위재희",
  } as Person,
  bride: {
    name: "권수영",
    nameEn: "Suyoung",
    relation: "딸",
    father: "권광",
    mother: "구선주",
  } as Person,

  /** 예식 일시 (한국 시간) */
  date: "2026-12-20T14:30:00+09:00",

  venue: {
    name: "더채플앳청담",
    hall: "6층 채플홀",
    address: "서울 강남구 선릉로 757",
    tel: "",
    /** 지도 좌표 (네이버 플레이스 기준) */
    lat: 37.5223262,
    lng: 127.0390205,
    naverPlaceUrl: "https://naver.me/5ne4oSX1",
    // TODO: 예식장에 확인 후 수정하세요
    transport: [
      { label: "지하철", lines: ["수인분당선·7호선 강남구청역 ○번 출구 도보 ○분", "수인분당선 압구정로데오역 ○번 출구 도보 ○분"] },
      { label: "버스", lines: ["○○○ 정류장 하차"] },
      { label: "주차", lines: ["건물 내 주차 ○시간 무료"] },
    ],
  },

  greeting: {
    title: "초대합니다",
    body: [
      "서로가 마주보며 다져온 사랑을",
      "이제 함께 한 곳을 바라보며",
      "걸어갈 수 있는 큰 사랑으로 키우고자 합니다.",
      "",
      "저희 두 사람이 사랑의 이름으로",
      "지켜나갈 수 있도록",
      "앞날을 축복해 주시면 감사하겠습니다.",
    ],
  },

  /** public/images/hero.jpg (원본은 photos/hero.jpg → npm run images) */
  hero: {
    image: "/images/gallery/Studio_20260528_KSY28287.jpg",
  },

  /**
   * 갤러리 순서 = 이 배열 순서. 파일은 public/images/gallery/ 에 있습니다.
   * (원본은 photos/gallery/ 에 넣고 npm run images 실행)
   */
  gallery: [
    "Self_DSC00966.jpg",
    "Self_DSC01441.jpg",
    "Self_DSC01469.jpg",
    "Self_DSC01665.jpg",
    "Self_DSC01673.jpg",
    "Self_DSC01695.jpg",
    "Self_DSC01711.jpg",
    "Self_DSC02226.jpg",
    "Self_DSC02587.jpg",
    "Self_DSC02602.jpg",
    "Self_DSC02634.jpg",
    "Self_DSC02727.jpg",
    "Self_DSC03310.jpg",
    "Self_DSC03423.jpg",
    "Studio_20260528_KSY27363.jpg",
    "Studio_20260528_KSY27459.jpg",
    "Studio_20260528_KSY27517.jpg",
    "Studio_20260528_KSY27584.jpg",
    "Studio_20260528_KSY27618.jpg",
    "Studio_20260528_KSY27774.jpg",
    "Studio_20260528_KSY27808.jpg",
    "Studio_20260528_KSY27846.jpg",
    "Studio_20260528_KSY27857.jpg",
    "Studio_20260528_KSY28033.jpg",
    "Studio_20260528_KSY28048.jpg",
    "Studio_20260528_KSY28190.jpg",
    "Studio_20260528_KSY28234.jpg",
    "Studio_20260528_KSY28287.jpg",
    "Studio_20260528_KSY28309.jpg",
    "Studio_20260528_KSY28332.jpg",
    "Studio_20260528_KSY28346.jpg",
    "Studio_20260528_KSY28414.jpg",
  ],

  // TODO: 실제 계좌번호로 수정하세요
  accounts: {
    groom: [
      { role: "신랑", name: "윤석후", bank: "○○은행", number: "000-0000-0000" },
      { role: "아버지", name: "윤영민", bank: "○○은행", number: "000-0000-0000" },
      { role: "어머니", name: "위재희", bank: "○○은행", number: "000-0000-0000" },
    ] as Account[],
    bride: [
      { role: "신부", name: "권수영", bank: "토스뱅크", number: "1000-1642-7943" },
      { role: "부모님", name: "권광 · 구선주", bank: "신한은행", number: "110-639-995374" },
    ] as Account[],
  },

  // TODO: 안내 문구를 예식장 정보에 맞게 수정하세요
  notices: [
    {
      title: "식사 안내",
      body: "예식 후 2층 연회장에서 뷔페 식사가 준비되어 있습니다.",
    },
    {
      title: "화환 안내",
      body: "마음만 감사히 받겠습니다. 화환은 정중히 사양합니다.",
    },
    {
      title: "포토부스",
      body: "로비에 포토부스가 마련되어 있습니다. 소중한 순간을 남겨주세요.",
    },
  ],

  /** 공유(OG) 정보 */
  share: {
    title: "윤석후 ♥ 권수영 결혼합니다",
    description: "2026년 12월 20일 일요일 오후 2시 30분 · 더채플앳청담 6층 채플홀",
  },
};
