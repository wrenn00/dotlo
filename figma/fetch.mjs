#!/usr/bin/env node
/**
 * Usage:
 *   node figma/fetch.mjs                     → 최상위 Frame 목록 출력
 *   node figma/fetch.mjs <frameId>            → JSON 정제 + PNG 저장
 *
 * Env:
 *   FIGMA_TOKEN    — Figma Personal Access Token
 *   FIGMA_FILE_KEY — Figma 파일 URL의 key 값
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const TOKEN = process.env.FIGMA_TOKEN;
const FILE_KEY = process.env.FIGMA_FILE_KEY;

if (!TOKEN || !FILE_KEY) {
  console.error("❌  FIGMA_TOKEN 또는 FIGMA_FILE_KEY 환경변수가 없습니다.");
  process.exit(1);
}

const BASE = "https://api.figma.com/v1";
const HEADERS = { "X-Figma-Token": TOKEN };

// ─── Figma API helpers ────────────────────────────────────────────────────────

async function apiFetch(url) {
  const res = await fetch(url, { headers: HEADERS });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Figma API ${res.status}: ${text}`);
  }
  return res.json();
}

async function getFile() {
  return apiFetch(`${BASE}/files/${FILE_KEY}`);
}

async function getImageUrl(nodeId) {
  const encoded = encodeURIComponent(nodeId);
  const data = await apiFetch(
    `${BASE}/images/${FILE_KEY}?ids=${encoded}&format=png&scale=2`
  );
  return data.images?.[nodeId] ?? null;
}

// ─── JSON 정제 ────────────────────────────────────────────────────────────────

const KEEP_FIELDS = new Set([
  "name",
  "type",
  "absoluteBoundingBox",
  "fills",
  "characters",
  "style",
  "layoutMode",
  "itemSpacing",
  "paddingLeft",
  "paddingRight",
  "paddingTop",
  "paddingBottom",
  "children",
]);

function cleanNode(node) {
  const result = {};
  for (const key of KEEP_FIELDS) {
    if (!(key in node)) continue;
    if (key === "children" && Array.isArray(node.children)) {
      result.children = node.children.map(cleanNode);
    } else {
      result[key] = node[key];
    }
  }
  return result;
}

// ─── 최상위 Frame 목록 ────────────────────────────────────────────────────────

function listTopFrames(document) {
  const frames = [];
  for (const page of document.children ?? []) {
    for (const child of page.children ?? []) {
      if (child.type === "FRAME" || child.type === "COMPONENT") {
        frames.push({ page: page.name, name: child.name, id: child.id });
      }
    }
  }
  return frames;
}

// ─── 특정 Frame 탐색 ─────────────────────────────────────────────────────────

function findNode(node, targetId) {
  if (node.id === targetId) return node;
  for (const child of node.children ?? []) {
    const found = findNode(child, targetId);
    if (found) return found;
  }
  return null;
}

// ─── PNG 다운로드 ─────────────────────────────────────────────────────────────

async function downloadPng(imageUrl, destPath) {
  const res = await fetch(imageUrl);
  if (!res.ok) throw new Error(`PNG 다운로드 실패: ${res.status}`);
  const buffer = Buffer.from(await res.arrayBuffer());
  fs.writeFileSync(destPath, buffer);
}

// ─── 파일명 안전 변환 ─────────────────────────────────────────────────────────

function safeName(str) {
  return str.replace(/[^a-zA-Z0-9가-힣_-]/g, "_").slice(0, 80);
}

// ─── main ─────────────────────────────────────────────────────────────────────

async function main() {
  const targetId = process.argv[2] ?? null;

  console.log("📡  Figma 파일 가져오는 중...");
  const file = await getFile();
  const { document } = file;

  // 저장 경로
  const rawDir = path.join(__dirname, "raw");
  const cleanedDir = path.join(__dirname, "cleaned");
  const imagesDir = path.join(__dirname, "images");

  // 전체 raw JSON 저장 (항상)
  const rawPath = path.join(rawDir, "file.json");
  fs.writeFileSync(rawPath, JSON.stringify(file, null, 2));
  console.log(`✅  raw JSON 저장 → ${rawPath}`);

  // ── 목록만 출력 ────────────────────────────────────────────────────────────
  if (!targetId) {
    const frames = listTopFrames(document);
    if (frames.length === 0) {
      console.log("⚠️  최상위 Frame이 없습니다.");
      return;
    }
    console.log(`\n📋  최상위 Frame 목록 (${frames.length}개)\n`);
    const maxName = Math.max(...frames.map((f) => f.name.length), 4);
    const maxPage = Math.max(...frames.map((f) => f.page.length), 4);
    console.log(
      "  " +
        "Page".padEnd(maxPage + 2) +
        "Name".padEnd(maxName + 2) +
        "Node ID"
    );
    console.log("  " + "─".repeat(maxPage + maxName + 26));
    for (const f of frames) {
      console.log(
        "  " +
          f.page.padEnd(maxPage + 2) +
          f.name.padEnd(maxName + 2) +
          f.id
      );
    }
    console.log("\n💡  사용법: node figma/fetch.mjs <nodeId>");
    return;
  }

  // ── 특정 Frame 처리 ────────────────────────────────────────────────────────
  const node = findNode(document, targetId);
  if (!node) {
    console.error(`❌  ID "${targetId}"인 노드를 찾을 수 없습니다.`);
    process.exit(1);
  }

  const base = safeName(node.name);

  // 정제 JSON 저장
  const cleaned = cleanNode(node);
  const cleanedPath = path.join(cleanedDir, `${base}.json`);
  fs.writeFileSync(cleanedPath, JSON.stringify(cleaned, null, 2));
  console.log(`✅  정제 JSON 저장 → ${cleanedPath}`);

  // PNG 렌더링 + 저장
  console.log("🖼️   PNG 렌더링 요청 중...");
  const imageUrl = await getImageUrl(targetId);
  if (!imageUrl) {
    console.warn("⚠️  이미지 URL을 가져오지 못했습니다.");
    return;
  }
  const pngPath = path.join(imagesDir, `${base}.png`);
  await downloadPng(imageUrl, pngPath);
  console.log(`✅  PNG 저장 → ${pngPath}`);
}

main().catch((err) => {
  console.error("❌ ", err.message);
  process.exit(1);
});
