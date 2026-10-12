// 청첩장의 모든 내용은 이 파일에서 수정합니다.

export type Person = {
  name: string;
  /** 영문 이름 (페이지 맨 아래 문구) */
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
    nameEn: "Sirkhoo Kai Yun",
    relation: "아들",
    father: "윤영민",
    mother: "위재희",
  } as Person,
  bride: {
    name: "권수영",
    nameEn: "Suyoung Mel Kwon",
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
    transport: [
      { label: "지하철", lines: ["수인분당선·7호선 강남구청역 3-1번 출구 도보 8분", "수인분당선 압구정로데오역 5번 출구 도보 9분"], sentence: false },
      { label: "셔틀버스", lines: ["강남구청역 3번 출구 앞에서 셔틀버스가 운행됩니다."], sentence: true },
      { label: "주차", lines: ["주차는 1시간 30분 무료입니다."], sentence: true },
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
    /** 처음 보이는 사진. 스크롤하면 image 로 바뀝니다 */
    before: "/images/gallery/Self_DSC01441.jpg",
  },

  /** 배경음악 (public/ 기준 경로). 비우면 음악 버튼이 사라집니다 */
  bgm: "/music/Wedding Invitation - Jason Farnham.mp3",

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

  notices: [
    {
      title: "식사 안내",
      body: "예식 후 한 층 아래 5층 연회홀에 식사가 준비되어 있습니다.\n오후 2시부터 4시까지 편하게 이용해 주세요.",
    },
    {
      title: "주차 안내",
      body: "예식 당일 주변 교통이 혼잡하여\n주차가 다소 어려울 수 있습니다.\n가급적 대중교통을 이용해 주시면 감사하겠습니다.",
    },
  ],


  /** 공유(OG) 정보 */
  share: {
    title: "윤석후 ♥ 권수영 결혼합니다",
    description: "2026년 12월 20일 일요일 오후 2시 30분 · 더채플앳청담 6층 채플홀",
  },
};
