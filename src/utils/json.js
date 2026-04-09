/**
 * JSON 문자열 유효성 검사
 * @param {string} str
 * @returns {{ valid: boolean, error: string | null, parsed: any }}
 */
export function validateJSON(str) {
  try {
    const parsed = JSON.parse(str);
    return { valid: true, error: null, parsed };
  } catch (e) {
    return { valid: false, error: e.message, parsed: null };
  }
}

/**
 * JSON을 보기 좋게 포맷팅
 * @param {string} str
 * @returns {string}
 */
export function formatJSON(str) {
  try {
    return JSON.stringify(JSON.parse(str), null, 2);
  } catch {
    return str;
  }
}
