import fs from "fs";
import path from "path";

// 레이어가 흰색 배경 역할인지 판정
// - ty:1 (Solid) 이고 흰색 sc
// - ty:4 (Shape) 이고 흰색 rect fill 만 가진 배경 (보통 nm="BG")
function isWhiteBackgroundLayer(layer) {
  // Solid 레이어
  if (layer.ty === 1 && typeof layer.sc === "string") {
    const c = layer.sc.toLowerCase();
    return c === "#ffffff" || c === "#fff" || /^#f[ef]{5}$/.test(c);
  }
  // Shape 레이어 — 흰색 rect fill 포함 + 이름이 BG
  if (layer.ty === 4) {
    let hasRect = false;
    let hasWhiteFill = false;
    const walk = (o) => {
      if (Array.isArray(o)) return o.forEach(walk);
      if (o && typeof o === "object") {
        if (o.ty === "rc") hasRect = true;
        if (o.ty === "fl" && o.c?.k && Array.isArray(o.c.k)) {
          const [r, g, b] = o.c.k;
          if (r > 0.96 && g > 0.96 && b > 0.96) hasWhiteFill = true;
        }
        for (const k in o) walk(o[k]);
      }
    };
    walk(layer.shapes ?? []);
    const namedBg = (layer.nm ?? "").trim().toLowerCase() === "bg";
    return hasRect && hasWhiteFill && namedBg;
  }
  return false;
}

function cleanLottieBackground(filePath) {
  console.log(`\n📁 ${filePath}`);
  const content = fs.readFileSync(filePath, "utf8");
  const data = JSON.parse(content);

  const backupPath = filePath.replace(/\.json$/, ".bg-backup.json");
  if (!fs.existsSync(backupPath)) {
    fs.writeFileSync(backupPath, content);
    console.log(`  💾 백업: ${path.basename(backupPath)}`);
  }

  let changed = false;

  if (data.bg) {
    console.log(`  🗑️  최상위 bg 제거: ${data.bg}`);
    delete data.bg;
    changed = true;
  }

  if (Array.isArray(data.layers)) {
    const before = data.layers.length;
    data.layers = data.layers.filter((layer, idx) => {
      if (isWhiteBackgroundLayer(layer)) {
        console.log(`  🗑️  흰색 배경 레이어 제거 [${idx}] ty=${layer.ty} nm=${layer.nm ?? ""}`);
        changed = true;
        return false;
      }
      return true;
    });
    if (data.layers.length !== before) {
      console.log(`  📉 레이어 ${before} → ${data.layers.length}`);
    }
  }

  if (changed) {
    fs.writeFileSync(filePath, JSON.stringify(data));
    console.log("  ✅ 저장 완료");
  } else {
    console.log("  ℹ️  배경 레이어 없음 (정상)");
  }
}

const targets = ["public/lottie/success-check.json"];

console.log("🧹 Lottie 배경 정리 시작");
targets.forEach((t) => {
  if (fs.existsSync(t)) cleanLottieBackground(t);
  else console.log(`❌ 파일 없음: ${t}`);
});
console.log("\n✨ 완료");
