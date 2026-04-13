/**
 * 國別配置檔案
 * 支持多個國家/地區的電話號碼格式轉換
 * 可輕鬆擴充新增國家
 */

export interface Country {
  id: string;
  name: string;
  code: string; // 國際電話代碼
  prefix: string; // 顯示前綴 (如 +886)
  pattern: RegExp; // 本地號碼格式驗證
  format: (number: string) => string; // 號碼格式化函數
}

/**
 * 號碼格式化函數
 * 移除所有非數字字符
 */
const cleanNumber = (num: string): string => {
  return num.replace(/\D/g, '');
};

/**
 * 台灣號碼格式化
 * 本地格式: 0987654321
 * 國際格式: +886987654321
 */
const formatTaiwan = (number: string): string => {
  const cleaned = cleanNumber(number);
  // 移除開頭的 0 (如果存在)
  const withoutLeadingZero = cleaned.startsWith('0') ? cleaned.slice(1) : cleaned;
  return `+886${withoutLeadingZero}`;
};

/**
 * 支持的國家列表
 * 未來可新增更多國家
 */
export const COUNTRIES: Country[] = [
  {
    id: 'tw',
    name: '台灣',
    code: '+886',
    prefix: '+886',
    pattern: /^(0|886|\+886)?9\d{8}$/, // 台灣手機號碼格式
    format: formatTaiwan,
  },
  // 未來可新增其他國家，例如：
  // {
  //   id: 'us',
  //   name: '美國',
  //   code: '+1',
  //   prefix: '+1',
  //   pattern: /^(\+1)?[2-9]\d{9}$/,
  //   format: (number) => `+1${cleanNumber(number)}`,
  // },
  // {
  //   id: 'jp',
  //   name: '日本',
  //   code: '+81',
  //   prefix: '+81',
  //   pattern: /^(0|\+81)?[1-9]\d{8,9}$/,
  //   format: (number) => `+81${cleanNumber(number).replace(/^0/, '')}`,
  // },
];

/**
 * 根據國家 ID 取得國家配置
 */
export const getCountry = (countryId: string): Country | undefined => {
  return COUNTRIES.find((c) => c.id === countryId);
};

/**
 * 格式化號碼列表
 * @param numbers - 逗號或換行分隔的號碼字符串
 * @param countryId - 國家 ID
 * @returns 格式化後的號碼數組
 */
export const formatPhoneNumbers = (
  numbers: string,
  countryId: string
): string[] => {
  const country = getCountry(countryId);
  if (!country) return [];

  // 支持逗號和換行符分隔
  return numbers
    .split(/[,\n]/)
    .map((num) => num.trim())
    .filter((num) => num.length > 0)
    .map((num) => country.format(num));
};

/**
 * 驗證號碼是否符合國家格式
 */
export const validatePhoneNumber = (number: string, countryId: string): boolean => {
  const country = getCountry(countryId);
  if (!country) return false;
  return country.pattern.test(number.trim());
};
