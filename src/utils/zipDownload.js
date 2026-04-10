import JSZip from "jszip";
import { saveAs } from "file-saver";

/**
 * 파일 배열을 .zip으로 묶어서 다운로드
 * @param {{ filename: string, content: string }[]} files
 * @param {string} zipName - 다운로드할 zip 파일명 (확장자 제외)
 */
export async function downloadAsZip(files, zipName = "mock-server") {
  const zip = new JSZip();

  files.forEach((file) => {
    zip.file(file.filename, file.content);
  });

  const blob = await zip.generateAsync({ type: "blob" });
  saveAs(blob, `${zipName}.zip`);
}

/**
 * 전체 파일 내용을 하나의 문자열로 합쳐서 복사
 * @param {{ filename: string, content: string }[]} files
 * @returns {string}
 */
export function filesToClipboardText(files) {
  return files
    .map((file) => {
      const separator = "─".repeat(40);
      return `// ${separator}\n// 📄 ${file.filename}\n// ${separator}\n\n${file.content}`;
    })
    .join("\n\n\n");
}
