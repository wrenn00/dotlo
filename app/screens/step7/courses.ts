export type CourseId = "A" | "B" | "C";

export interface CourseMarker {
  number: number;
  x: string;
  y: string;
}

export interface Course {
  id: CourseId;
  code: string;
  label: string;
  description: string;
  title: string;
  subtitle: string;
  colorHex: string;
  bgHex: string;
  accentHex: string;
  aiNote: string;
  markers: CourseMarker[];
}

export const courses: Course[] = [
  {
    id: "A",
    code: "A코스",
    label: "미식 코스",
    description: "현지 맛집 중심",
    title: "맛있는 도쿄 일주",
    subtitle: "하루 평균 5곳 · 미식 위주",
    colorHex: "#00E1FF",
    bgHex: "#99EEFF",
    accentHex: "#00A8BF",
    aiNote: "현지인 맛집 동선으로\n점심·저녁 모두 최고의 미식 코스를 짰어요",
    markers: [
      { number: 1, x: "20%", y: "50%" },
      { number: 2, x: "25%", y: "55%" },
      { number: 3, x: "30%", y: "55%" },
      { number: 4, x: "40%", y: "70%" },
      { number: 5, x: "45%", y: "80%" },
    ],
  },
  {
    id: "B",
    code: "B코스",
    label: "야경 코스",
    description: "야경 명소 중심",
    title: "여유로운 도쿄 한바퀴",
    subtitle: "하루 평균 4곳 · 휴식 시간 충분",
    colorHex: "#A5A5FF",
    bgHex: "#D6D6FF",
    accentHex: "#6F6FD9",
    aiNote: "야경 시간대를 마지막에 배치했고\n숙소를 기준으로 가까운 최적의 코스를 생성했어요",
    markers: [
      { number: 1, x: "35%", y: "40%" },
      { number: 2, x: "40%", y: "50%" },
      { number: 3, x: "45%", y: "60%" },
      { number: 4, x: "50%", y: "70%" },
      { number: 5, x: "60%", y: "75%" },
      { number: 6, x: "65%", y: "78%" },
      { number: 7, x: "70%", y: "80%" },
    ],
  },
  {
    id: "C",
    code: "C코스",
    label: "쇼핑 코스",
    description: "쇼핑 스팟 중심",
    title: "쇼핑러버의 도쿄",
    subtitle: "하루 평균 6곳 · 쇼핑 거리 위주",
    colorHex: "#FFE400",
    bgHex: "#FFF080",
    accentHex: "#8F7F00",
    aiNote: "주요 쇼핑 거리를 효율적으로 도는\n동선으로 시간 낭비 없이 짰어요",
    markers: [
      { number: 1, x: "30%", y: "30%" },
      { number: 2, x: "40%", y: "35%" },
      { number: 3, x: "55%", y: "45%" },
      { number: 4, x: "60%", y: "60%" },
      { number: 5, x: "55%", y: "75%" },
    ],
  },
];

export const getCourse = (id: string | null): Course =>
  courses.find((c) => c.id === id) ?? courses[1];
