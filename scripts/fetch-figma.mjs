import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// ── 여기에 값을 채우세요 ──────────────────────────────────────────────────────
const FILE_KEY = "lqMgKwK8OamOaLIpiR2mEW";
const NODE_ID  = "3152:653";
// ─────────────────────────────────────────────────────────────────────────────

const TOKEN = process.env.FIGMA_TOKEN;
if (!TOKEN)  { console.error("❌  FIGMA_TOKEN이 .env에 없습니다."); process.exit(1); }
if (!FILE_KEY) { console.error("❌  FILE_KEY를 스크립트 상단에 입력하세요."); process.exit(1); }
if (!NODE_ID)  { console.error("❌  NODE_ID를 스크립트 상단에 입력하세요."); process.exit(1); }

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "figma-home-v2.json");

const encoded = encodeURIComponent(NODE_ID);
const url = `https://api.figma.com/v1/files/${FILE_KEY}/nodes?ids=${encoded}`;

console.log(`📡  Fetching node ${NODE_ID} from file ${FILE_KEY} …`);

const res = await fetch(url, { headers: { "X-Figma-Token": TOKEN } });
if (!res.ok) {
  const txt = await res.text();
  console.error(`❌  Figma API ${res.status}: ${txt}`);
  process.exit(1);
}

const data = await res.json();
fs.writeFileSync(OUT, JSON.stringify(data, null, 2));
console.log(`✅  저장 완료 → ${OUT}`);
