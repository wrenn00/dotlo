import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const IN  = path.join(__dirname, "figma-home-v2.json");
const OUT = path.join(__dirname, "figma-home-v2-slim.json");

if (!fs.existsSync(IN)) {
  console.error("❌  figma-home-v2.json이 없습니다. 먼저 fetch-figma.mjs를 실행하세요.");
  process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(IN, "utf8"));

// Figma nodes API 응답: { nodes: { [id]: { document: {...} } } }
const firstNode = Object.values(raw.nodes ?? {})[0]?.document ?? raw;

function slim(node) {
  const out = {};

  // name / type
  if (node.name !== undefined) out.name = node.name;
  if (node.type !== undefined) out.type = node.type;

  // box — absoluteBoundingBox
  if (node.absoluteBoundingBox) out.box = node.absoluteBoundingBox;

  // layout
  const layoutKeys = ["layoutMode", "itemSpacing", "paddingLeft", "paddingRight", "paddingTop", "paddingBottom", "primaryAxisAlignItems", "counterAxisAlignItems"];
  const layout = {};
  for (const k of layoutKeys) if (node[k] !== undefined) layout[k] = node[k];
  if (Object.keys(layout).length) out.layout = layout;

  // fill
  if (node.fills?.length) out.fill = node.fills;

  // text (characters)
  if (node.characters !== undefined) out.text = node.characters;

  // font — style 객체에서 폰트 관련 키만 추출
  const fontKeys = ["fontFamily", "fontWeight", "fontSize", "lineHeightPx", "letterSpacing", "textAlignHorizontal"];
  const font = {};
  for (const k of fontKeys) if (node.style?.[k] !== undefined) font[k] = node.style[k];
  if (Object.keys(font).length) out.font = font;

  // radius
  if (node.cornerRadius !== undefined) out.radius = node.cornerRadius;
  if (node.rectangleCornerRadii) out.radius = node.rectangleCornerRadii;

  // children (재귀)
  if (Array.isArray(node.children)) {
    out.children = node.children.map(slim);
  }

  return out;
}

const result = slim(firstNode);
fs.writeFileSync(OUT, JSON.stringify(result, null, 2));
console.log(`✅  슬림화 완료 → ${OUT}`);
