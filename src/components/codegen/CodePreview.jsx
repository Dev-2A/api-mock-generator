import { useState } from "react";

export default function CodePreview({ files, framework }) {
  const [activeFile, setActiveFile] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!files || files.length === 0) {
    return null;
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(files[activeFile].content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // fallback
      const textarea = document.createElement("textarea");
      textarea.value = files[activeFile].content;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      {/* 탭 바 */}
      <div className="flex items-center justify-between bg-gray-900 border-b border-gray-800 px-1">
        <div className="flex">
          {files.map((file, i) => (
            <button
              key={file.filename}
              onClick={() => setActiveFile(i)}
              className={`
                px-3 py-2 text-xs font-mono transition-colors cursor-pointer
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

        <button
          onClick={handleCopy}
          className="px-2.5 py-1 text-[10px] text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
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

      {/* 하단 정보 */}
      <div className="bg-gray-900 border-t border-gray-800 px-3 py-1.5 flex items-center justify-between">
        <span className="text-[10px] text-gray-600">
          {framework} · {files[activeFile].filename}
        </span>
        <span className="text-[10px] text-gray-600">
          {files[activeFile].content.split("\n").length} lines
        </span>
      </div>
    </div>
  );
}
