export type CourseId = "A" | "B" | "C";

export interface CourseMarker {
  number: number;
  lat: number;
  lng: number;
  name: string;
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

export const TOKYO_CENTER: [number, number] = [35.6762, 139.6503];

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
      { number: 1, lat: 35.7148, lng: 139.7967, name: "센소지" },
      { number: 2, lat: 35.71, lng: 139.8107, name: "스카이트리" },
      { number: 3, lat: 35.6852, lng: 139.7528, name: "간다 마츠야" },
      { number: 4, lat: 35.6586, lng: 139.7454, name: "긴자 큐베이" },
      { number: 5, lat: 35.6595, lng: 139.7004, name: "시부야 식당가" },
    ],
  },
  {
    id: "B",
    code: "B코스",
    label: "야경 코스",
    description: "야경 명소 중심",
    title: "불빛이 흐르는\n도쿄의 밤",
    subtitle: "야경 명소 위주 · 황혼부터 새벽까지",
    colorHex: "#A5A5FF",
    bgHex: "#D6D6FF",
    accentHex: "#6F6FD9",
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
      { number: 1, lat: 35.6938, lng: 139.7036, name: "신주쿠 이세탄" },
      { number: 2, lat: 35.6595, lng: 139.7004, name: "시부야 109" },
      { number: 3, lat: 35.6664, lng: 139.7298, name: "오모테산도" },
      { number: 4, lat: 35.6712, lng: 139.7029, name: "하라주쿠" },
      { number: 5, lat: 35.6586, lng: 139.7454, name: "긴자 식스" },
    ],
  },
];

export const getCourse = (id: string | null): Course =>
  courses.find((c) => c.id === id) ?? courses[1];
