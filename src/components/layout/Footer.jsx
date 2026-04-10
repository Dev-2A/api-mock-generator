export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>
            Made with 🥤 and 💙 by{" "}
            <a
              href="https://github.com/Dev-2A"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-400 hover:text-indigo-400 transition-colors"
            >
              Dev-2A
            </a>
          </p>
          <p className="text-gray-600 text-center text-[11px]">
            프론트엔드 개발 시 백엔드 대기 없이 목 서버를 즉시 만들어 쓰세요
          </p>
        </div>
      </div>
    </footer>
  );
}
