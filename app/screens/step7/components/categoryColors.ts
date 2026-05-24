/**
 * 카테고리별 칩/뱃지 색상 매핑
 *   - 카페 → nightfall-purple
 *   - 맛집/식사 → star-yellow (yellow 위에는 night-navy 텍스트)
 *   - 관광 → sky-blue
 *   - 야경 → night-navy + 회색 배경
 *   - 비행/이동 → sky-blue-600
 *   - 숙소 → nightfall-purple-400
 */

export interface CategoryColor {
  bg: string;
  text: string;
}

export function getCategoryColor(category: string): CategoryColor {
  const c = category.replace(/\s/g, "");
  if (c === "카페")            return { bg: "#EAEAFF", text: "#4A4AA8" };
  if (c === "맛집" || c === "식사")
                                return { bg: "#FFF8B8", text: "#090738" };
  if (c === "관광" || c === "관광명소")
                                return { bg: "#C2F5FF", text: "#006B7A" };
  if (c === "야경")            return { bg: "#DDE5E8", text: "#090738" };
  if (c === "비행" || c === "이동")
                                return { bg: "#E5FBFF", text: "#00A8BF" };
  if (c === "숙소")            return { bg: "#F4F4FF", text: "#6F6FD9" };
  if (c === "쇼핑")            return { bg: "#FFF8B8", text: "#8F7F00" };
  // 기본 (알 수 없는 카테고리)
  return { bg: "#EEF2F4", text: "#555E63" };
}
