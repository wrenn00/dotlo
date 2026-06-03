export type CourseId = "A" | "B" | "C";

export interface CourseMarker {
  number: number;
  lat: number;
  lng: number;
  name: string;
}

export interface Course {
  id: CourseId;
  categoryKey: string; // 사용자가 step4에서 선택한 카테고리 라벨 (예: "미식")
  code: string;
  label: string;
  description: string;
  title: string;
  subtitle: string;
  colorHex: string;
  bgHex: string;
  accentHex: string;
  chipBgHex: string; // 타임라인 우상단 태그 칩 + 시간 마커 박스 배경
  backgroundImage: string;
  aiNote: string;
  markers: CourseMarker[];
}

export const TOKYO_CENTER: [number, number] = [35.6762, 139.6503];

export interface CategoryTemplate {
  label: string;
  description: string;
  title: string;
  subtitle: string;
  backgroundImage: string;
  aiNote: string;
  markers: CourseMarker[];
}

// 카테고리별 코스 템플릿 — step4에서 사용자가 선택한 카테고리에 대응
export const CATEGORY_TEMPLATES: Record<string, CategoryTemplate> = {
  미식: {
    label: "미식 코스",
    description: "현지 맛집 중심",
    title: "든든한 도쿄 미식 투어",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/a.png",
    aiNote: "현지인 맛집 동선으로\n점심·저녁 모두 최고의 미식 코스를 짰어요",
    markers: [
      { number: 1, lat: 35.7148, lng: 139.7967, name: "센소지" },
      { number: 2, lat: 35.71, lng: 139.8107, name: "스카이트리" },
      { number: 3, lat: 35.6852, lng: 139.7528, name: "간다 마츠야" },
      { number: 4, lat: 35.6586, lng: 139.7454, name: "긴자 큐베이" },
      { number: 5, lat: 35.6595, lng: 139.7004, name: "시부야 식당가" },
    ],
  },
  야경: {
    label: "야경 코스",
    description: "야경 명소 중심",
    title: "아름다운 도쿄의 야경",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/b.png",
    aiNote: "해질녘 전망대부터 새벽 거리까지\n도쿄의 밤을 빠짐없이 담아냈어요",
    markers: [
      { number: 1, lat: 35.6586, lng: 139.7454, name: "도쿄타워" },
      { number: 2, lat: 35.6694, lng: 139.7, name: "롯폰기 힐스" },
      { number: 3, lat: 35.6595, lng: 139.7004, name: "시부야 스카이" },
      { number: 4, lat: 35.6938, lng: 139.7036, name: "신주쿠 전망대" },
      { number: 5, lat: 35.71, lng: 139.8107, name: "스카이트리" },
      { number: 6, lat: 35.6284, lng: 139.7387, name: "오다이바" },
      { number: 7, lat: 35.6329, lng: 139.78, name: "레인보우 브릿지" },
    ],
  },
  쇼핑: {
    label: "쇼핑 코스",
    description: "쇼핑 스팟 중심",
    title: "도쿄에서 플렉스 쇼핑하기",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/c.png",
    aiNote: "주요 쇼핑 거리를 효율적으로 도는\n동선으로 시간 낭비 없이 짰어요",
    markers: [
      { number: 1, lat: 35.6938, lng: 139.7036, name: "신주쿠 이세탄" },
      { number: 2, lat: 35.6595, lng: 139.7004, name: "시부야 109" },
      { number: 3, lat: 35.6664, lng: 139.7298, name: "오모테산도" },
      { number: 4, lat: 35.6712, lng: 139.7029, name: "하라주쿠" },
      { number: 5, lat: 35.6586, lng: 139.7454, name: "긴자 식스" },
    ],
  },
  관광: {
    label: "관광 코스",
    description: "명소·랜드마크 중심",
    title: "도쿄 핵심 명소 일주",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/b.png",
    aiNote: "랜드마크와 골목 명소를 균형 있게 묶어\n걷는 시간을 최소화했어요",
    markers: [
      { number: 1, lat: 35.6586, lng: 139.7454, name: "도쿄타워" },
      { number: 2, lat: 35.7148, lng: 139.7967, name: "센소지" },
      { number: 3, lat: 35.71, lng: 139.8107, name: "스카이트리" },
      { number: 4, lat: 35.6938, lng: 139.7036, name: "신주쿠 교엔" },
    ],
  },
  휴식: {
    label: "휴식 코스",
    description: "공원·온천 중심",
    title: "여유로운 도쿄 산책",
    subtitle: "하루 평균 3곳 · 휴식 시간 충분",
    backgroundImage: "/images/b.png",
    aiNote: "걷는 거리 최소화 + 공원/온천 위주로\n에너지 회복 동선을 짰어요",
    markers: [
      { number: 1, lat: 35.6938, lng: 139.7036, name: "신주쿠 교엔" },
      { number: 2, lat: 35.7148, lng: 139.7720, name: "우에노 공원" },
      { number: 3, lat: 35.6284, lng: 139.7387, name: "오다이바 해변공원" },
    ],
  },
  카페: {
    label: "카페 코스",
    description: "분위기 좋은 카페 중심",
    title: "도쿄 카페 호핑",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/a.png",
    aiNote: "유명 카페 + 숨은 로컬 카페를\n동선 따라 빈틈없이 묶었어요",
    markers: [
      { number: 1, lat: 35.6664, lng: 139.7298, name: "블루보틀 아오야마" },
      { number: 2, lat: 35.6488, lng: 139.6986, name: "카페 르 카페" },
      { number: 3, lat: 35.6429, lng: 139.6993, name: "스타벅스 리저브" },
      { number: 4, lat: 35.6595, lng: 139.7004, name: "오니버스 시부야" },
    ],
  },
  디저트: {
    label: "디저트 코스",
    description: "디저트·페이스트리 중심",
    title: "달콤한 도쿄 디저트 투어",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/c.png",
    aiNote: "인기 디저트와 한정 메뉴를\n시간대 따라 가장 신선하게 즐길 수 있게 짰어요",
    markers: [
      { number: 1, lat: 35.6712, lng: 139.7641, name: "긴자 웨스트" },
      { number: 2, lat: 35.6665, lng: 139.7124, name: "하브스 오모테산도" },
      { number: 3, lat: 35.6660, lng: 139.7136, name: "빌즈 오모테산도" },
      { number: 4, lat: 35.6896, lng: 139.7006, name: "에그슬럿 신주쿠" },
    ],
  },
  박물관: {
    label: "박물관 코스",
    description: "박물관·미술관 중심",
    title: "도쿄 박물관 깊이있게",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/b.png",
    aiNote: "혼잡을 피해 오전 박물관 → 오후 미술관 순으로\n관람 동선을 최적화했어요",
    markers: [
      { number: 1, lat: 35.7188, lng: 139.7765, name: "도쿄국립박물관" },
      { number: 2, lat: 35.7156, lng: 139.7757, name: "국립서양미술관" },
      { number: 3, lat: 35.6960, lng: 139.7956, name: "에도도쿄박물관" },
      { number: 4, lat: 35.6606, lng: 139.7299, name: "모리 미술관" },
    ],
  },
  역사: {
    label: "역사 코스",
    description: "신사·사찰·유적 중심",
    title: "도쿄 역사 산책",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/b.png",
    aiNote: "에도 시대부터 근대까지\n도쿄의 시간 흐름을 따라가는 동선이에요",
    markers: [
      { number: 1, lat: 35.7148, lng: 139.7967, name: "센소지" },
      { number: 2, lat: 35.6764, lng: 139.6993, name: "메이지 신궁" },
      { number: 3, lat: 35.6852, lng: 139.7528, name: "고쿄 히가시교엔" },
      { number: 4, lat: 35.6586, lng: 139.7454, name: "조조지" },
    ],
  },
  바다: {
    label: "바다 코스",
    description: "도쿄만·해변공원 중심",
    title: "도쿄만 바다 여행",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/b.png",
    aiNote: "도쿄만 일대 해변공원을 동선 따라 묶고\n저녁 야경 포인트까지 자연스럽게 이어요",
    markers: [
      { number: 1, lat: 35.6286, lng: 139.7795, name: "오다이바 해변공원" },
      { number: 2, lat: 35.6383, lng: 139.8503, name: "카사이 임해공원" },
      { number: 3, lat: 35.6190, lng: 139.7407, name: "시나가와 해변공원" },
      { number: 4, lat: 35.6235, lng: 139.8198, name: "도쿄 게이트 브리지" },
    ],
  },
  강변: {
    label: "강변 코스",
    description: "스미다강·메구로강 중심",
    title: "도쿄 강변 산책",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/a.png",
    aiNote: "스미다강·메구로강을 따라 흐르는 동선으로\n도쿄의 물길을 천천히 거닐 수 있어요",
    markers: [
      { number: 1, lat: 35.7106, lng: 139.7960, name: "스미다강 테라스" },
      { number: 2, lat: 35.7148, lng: 139.7984, name: "스미다 공원" },
      { number: 3, lat: 35.6432, lng: 139.6986, name: "메구로강 산책길" },
      { number: 4, lat: 35.6435, lng: 139.7002, name: "나카메구로 강변거리" },
    ],
  },
  "공연·전시": {
    label: "공연·전시 코스",
    description: "공연·전시 중심",
    title: "도쿄 컬처 한바퀴",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/b.png",
    aiNote: "낮 전시 → 저녁 공연으로 자연스럽게 이어지는\n도쿄 컬처 동선을 짰어요",
    markers: [
      { number: 1, lat: 35.6260, lng: 139.7920, name: "팀랩 플래닛 도쿄" },
      { number: 2, lat: 35.6650, lng: 139.7314, name: "국립신미술관" },
      { number: 3, lat: 35.6657, lng: 139.7290, name: "21_21 디자인 사이트" },
      { number: 4, lat: 35.6798, lng: 139.7644, name: "도쿄 국제포럼" },
    ],
  },
};

// 탭 위치별 컬러 팔레트 — sky → purple → yellow
const TAB_PALETTES: { colorHex: string; bgHex: string; accentHex: string; chipBgHex: string }[] = [
  { colorHex: "#00E1FF", bgHex: "#C2F5FF", accentHex: "#0099B8", chipBgHex: "#F2FDFF" }, // A sky
  { colorHex: "#A5A5FF", bgHex: "#D6D6FF", accentHex: "#4F4FAA", chipBgHex: "#EFEFFF" }, // B purple
  { colorHex: "#FFE400", bgHex: "#FFF080", accentHex: "#8F7F00", chipBgHex: "#FFFCE2" }, // C yellow
];

const COURSE_IDS: CourseId[] = ["A", "B", "C"];

// 알 수 없는 카테고리(직접 추가한 키워드 등)에 대한 기본 템플릿
function genericTemplate(label: string): CategoryTemplate {
  return {
    label: `${label} 코스`,
    description: `${label} 중심`,
    title: `${label} 위주의 도쿄 여행`,
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    backgroundImage: "/images/a.png",
    aiNote: `'${label}' 우선순위를 가장 잘 살리도록\n동선과 시간대를 맞춰 짰어요`,
    markers: [
      { number: 1, lat: 35.6586, lng: 139.7454, name: `${label} 명소 1` },
      { number: 2, lat: 35.6595, lng: 139.7004, name: `${label} 명소 2` },
      { number: 3, lat: 35.6938, lng: 139.7036, name: `${label} 명소 3` },
    ],
  };
}

/** 사용자 우선순위 라벨 → Course 배열 (최대 3개). 첫 항목이 A, 두 번째가 B, 세 번째가 C. */
export function buildCourses(labels: string[]): Course[] {
  const picked = labels.slice(0, 3);
  return picked.map((label, idx) => {
    const tmpl = CATEGORY_TEMPLATES[label] ?? genericTemplate(label);
    const palette = TAB_PALETTES[idx];
    const id = COURSE_IDS[idx];
    return {
      id,
      categoryKey: label,
      code: `${id}코스`,
      label: tmpl.label,
      description: tmpl.description,
      title: tmpl.title,
      subtitle: tmpl.subtitle,
      colorHex: palette.colorHex,
      bgHex: palette.bgHex,
      accentHex: palette.accentHex,
      chipBgHex: palette.chipBgHex,
      backgroundImage: tmpl.backgroundImage,
      aiNote: tmpl.aiNote,
      markers: tmpl.markers,
    };
  });
}

// 기본값: 미식/야경/쇼핑 3개 (step4를 거치지 않고 직접 진입할 때)
export const courses: Course[] = buildCourses(["미식", "야경", "쇼핑"]);

export const getCourse = (id: string | null, list: Course[] = courses): Course =>
  list.find((c) => c.id === id) ?? list[0];
