import { useState } from "react";
import { downloadAsZip, filesToClipboardText } from "../../utils/zipDownload";

export default function CodePreview({ files, framework, zipName }) {
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!files || files.length === 0) return null;

  const copyToClipboard = async (text, setter) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setter(true);
    setTimeout(() => setter(false), 1500);
  };

  const handleCopyFile = () => {
    copyToClipboard(files[activeFile].content, setCopied);
  };

  const handleCopyAll = () => {
    copyToClipboard(filesToClipboardText(files), setCopiedAll);
  };

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await downloadAsZip(
        files,
        zipName ||
          `mock-server-${framework.toLowerCase().replace(/[^a-z]/g, "")}`,
      );
    } catch (err) {
      console.error("ZIP 다운로드 실패:", err);
    }
    setDownloading(false);
  };

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      {/* 탭 바 */}
      <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 px-1 flex-wrap">
        <div className="flex overflow-x-auto">
          {files.map((file, i) => (
            <button
              key={file.filename}
              onClick={() => setActiveFile(i)}
              className={`
                px-3 py-2 text-xs font-mono transition-colors cursor-pointer whitespace-nowrap
                ${
                  i === activeFile
                    ? "text-gray-100 border-b-2 border-indigo-500"
                    : "text-gray-500 hover:text-gray-300"
                }
              `}
            >
              {file.filename}
            </button>
          ))}
        </div>

        {/* 파일 단위 복사 */}
        <button
          onClick={handleCopyFile}
          className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-gray-200 transition-colors cursor-pointer shrink-0"
        >
          {copied ? "✅ 복사됨!" : "📋 복사"}
        </button>
      </div>

      {/* 코드 영역 */}
      <pre className="bg-gray-950 p-4 overflow-auto max-h-125 text-xs leading-relaxed">
        <code className="text-gray-300 font-mono whitespace-pre">
          {files[activeFile].content}
        </code>
      </pre>

      {/* 하단 액션 바 */}
      <div className="bg-gray-900 border-t border-gray-800 px-3 py-2 flex items-center justify-between flex-wrap gap-2">
        <span className="text-[10px] text-gray-600">
          {framework} · {files[activeFile].filename} ·{" "}
          {files[activeFile].content.split("\n").length} lines
        </span>

        <div className="flex items-center gap-2">
          {/* 전체 복사 */}
          <button
            onClick={handleCopyAll}
            className="
              inline-flex items-center gap-1
              px-2.5 py-1 rounded-md text-[11px]
              bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100
              transition-colors cursor-pointer
            "
          >
            {copiedAll ? "✅ 전체 복사됨!" : "📋 전체 복사"}
          </button>

          {/* ZIP 다운로드 */}
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="
              inline-flex items-center gap-1
              px-2.5 py-1 rounded-md text-[11px]
              bg-indigo-600 text-white hover:bg-indigo-500
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors cursor-pointer
            "
          >
            {downloading ? "⏳ 생성 중..." : "📦 .zip 다운로드"}
          </button>
        </div>
      </div>
    </div>
  );
}
