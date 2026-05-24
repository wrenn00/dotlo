import fs from "fs";
import path from "path";

// Lottie 색상은 0~1 RGB. from 색을 to 색으로 치환 (알파 보존)
const colorMap = [
  // success-check.json 실제 색상 (초록 계열)
  { name: "메인 초록 → sky-blue (#00E1FF)",      from: [0.172549, 0.854902, 0.580392], to: [0.0, 0.882353, 1.0] },
  { name: "연초록 링 → 옅은 sky-blue (#C2F5FF)", from: [0.783505, 0.945098, 0.880089], to: [0.760784, 0.960784, 1.0] },
  // 리브랜딩 잔여 민트 계열 (다른 파일 대비, 현재 매칭 없음)
  { name: "옅은 민트 → 옅은 sky-blue (#B3F5FF)",  from: [0.8, 0.984, 0.945],            to: [0.702, 0.961, 1.0] },
  { name: "중간 민트 → 중간 sky-blue (#80E5FF)",  from: [0.6, 0.965, 0.894],            to: [0.502, 0.898, 1.0] },
  { name: "진한 민트 → sky-blue (#00E1FF)",       from: [0.133, 0.827, 0.8],            to: [0.0, 0.882, 1.0] },
];

function isSimilarColor(a, b, tolerance = 0.04) {
  if (!Array.isArray(a) || !Array.isArray(b)) return false;
  if (a.length < 3 || b.length < 3) return false;
  // 0~1 범위 밖(좌표값 등)은 색상이 아님
  if (a[0] > 1.001 || a[1] > 1.001 || a[2] > 1.001) return false;
  return (
    Math.abs(a[0] - b[0]) < tolerance &&
    Math.abs(a[1] - b[1]) < tolerance &&
    Math.abs(a[2] - b[2]) < tolerance
  );
}

function replaceColors(obj, mapping, stats) {
  if (Array.isArray(obj)) {
    for (let i = 0; i < obj.length; i++) obj[i] = replaceColors(obj[i], mapping, stats);
    return obj;
  }
  if (obj && typeof obj === "object") {
    if ("k" in obj && Array.isArray(obj.k) && obj.k.length >= 3 && typeof obj.k[0] === "number") {
      for (const m of mapping) {
        if (isSimilarColor(obj.k, m.from)) {
          const alpha = obj.k.length > 3 ? obj.k[3] : 1;
          obj.k = [...m.to, alpha];
          stats[m.name] = (stats[m.name] || 0) + 1;
          break;
        }
      }
    }
    for (const key in obj) obj[key] = replaceColors(obj[key], mapping, stats);
  }
  return obj;
}

function processFile(filePath) {
  console.log(`\n📁 ${filePath}`);
  const content = fs.readFileSync(filePath, "utf8");
  let data;
  try {
    data = JSON.parse(content);
  } catch {
    console.log("  ⚠️  JSON parse 실패, 건너뜀");
    return;
  }

  const backupPath = filePath.replace(/\.json$/, ".backup.json");
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, content);
    console.log(`  💾 백업: ${path.basename(backupPath)}`);
  }

  const stats = {};
  replaceColors(data, colorMap, stats);

  if (Object.keys(stats).length === 0) {
    console.log("  ℹ️  변경된 색상 없음");
    return;
  }
  for (const [name, count] of Object.entries(stats)) console.log(`  ✅ ${name}: ${count}곳`);
  fs.writeFileSync(filePath, JSON.stringify(data));
}

const targets = ["public/lottie/success-check.json"];

console.log("🎨 Lottie 색상 일괄 교체 시작");
for (const t of targets) {
  if (fs.existsSync(t)) processFile(t);
  else console.log(`❌ 파일 없음: ${t}`);
}
console.log("\n✨ 완료");
