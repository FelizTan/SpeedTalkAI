export interface PronunciationWord {
  word: string;
  phonetic: string;
  type: string;
  meaning: string;
  tip: string;
}

export const PRONUNCIATION_CATEGORIES = {
  hard: {
    label: "Phát Âm Khó",
    words: [
      { word: "world",         phonetic: "/wɜːrld/",         type: "noun",      meaning: "thế giới",      tip: "Đầu lưỡi cong nhẹ khi phát âm /r/, môi tròn." },
      { word: "three",         phonetic: "/θriː/",           type: "number",    meaning: "ba",            tip: "Đặt đầu lưỡi giữa hai răng cho âm /θ/, không phải /tr/." },
      { word: "thirty",        phonetic: "/ˈθɜːrti/",        type: "number",    meaning: "ba mươi",       tip: "Bắt đầu bằng /θ/ (lưỡi giữa răng) chứ không phải /t/." },
      { word: "birthday",      phonetic: "/ˈbɜːrθdeɪ/",      type: "noun",      meaning: "sinh nhật",     tip: "Chú ý âm /θ/ ở giữa, không phát thành /d/." },
      { word: "clothes",       phonetic: "/kloʊðz/",         type: "noun",      meaning: "quần áo",       tip: "/ðz/ ở cuối — rung dây thanh, không phải /s/." },
      { word: "comfortable",   phonetic: "/ˈkʌmftərbl/",     type: "adjective", meaning: "thoải mái",     tip: "Chỉ 3 âm tiết: 'comf-tər-bl', bỏ âm 'or'." },
      { word: "vegetables",    phonetic: "/ˈvedʒtəblz/",     type: "noun",      meaning: "rau củ",        tip: "Bỏ âm 'e' ở giữa: 'vedge-tə-blz'." },
      { word: "interesting",   phonetic: "/ˈɪntrəstɪŋ/",     type: "adjective", meaning: "thú vị",        tip: "Chỉ 3 âm tiết, nhấn vào âm đầu." },
      { word: "particularly",  phonetic: "/pərˈtɪkjələrli/", type: "adverb",    meaning: "đặc biệt là",   tip: "Nhấn vào 'tic'. Đọc chậm từng âm tiết khi luyện." },
      { word: "specifically",  phonetic: "/spəˈsɪfɪkli/",    type: "adverb",    meaning: "cụ thể là",     tip: "Nhấn vào 'ci'. Bốn âm tiết: 'spə-si-fi-kli'." },
      { word: "entrepreneur",  phonetic: "/ˌɒntrəprəˈnɜːr/", type: "noun",      meaning: "doanh nhân",    tip: "Nhấn cuối 'nɜːr'. Bốn âm tiết, gốc Pháp." },
      { word: "pronunciation", phonetic: "/prəˌnʌnsiˈeɪʃn/", type: "noun",      meaning: "phát âm",       tip: "Lưu ý: 'nun' chứ không phải 'noun'. Nhấn vào 'a'." },
      { word: "unfortunately", phonetic: "/ʌnˈfɔːrtʃənətli/", type: "adverb",   meaning: "không may là",  tip: "Nhấn vào 'for'. Đọc lướt các âm sau." },
      { word: "photographer",  phonetic: "/fəˈtɒɡrəfər/",    type: "noun",      meaning: "thợ chụp ảnh",  tip: "Nhấn vào 'tog' chứ không phải 'photo'." },
      { word: "volunteer",     phonetic: "/ˌvɒlənˈtɪər/",    type: "noun",      meaning: "tình nguyện viên", tip: "Nhấn ở âm cuối 'tɪər'." },
    ],
  },
  numbers: {
    label: "Số & Ngày",
    words: [
      { word: "February",  phonetic: "/ˈfebruəri/",  type: "noun", meaning: "tháng Hai", tip: "Phát âm cả 2 chữ 'r': 'feb-ru-ə-ri'." },
      { word: "Wednesday", phonetic: "/ˈwenzdeɪ/",   type: "noun", meaning: "thứ Tư",    tip: "Bỏ âm 'd' giữa: 'wenz-day'." },
      { word: "library",   phonetic: "/ˈlaɪbreri/",  type: "noun", meaning: "thư viện",  tip: "Phát âm 'lai-bre-ri', không phải 'lai-be-ri'." },
      { word: "temperature", phonetic: "/ˈtemprətʃər/", type: "noun", meaning: "nhiệt độ", tip: "Chỉ 3 âm tiết: 'tem-prə-tʃər'." },
      { word: "thirty",    phonetic: "/ˈθɜːrti/",    type: "number", meaning: "ba mươi", tip: "Âm /θ/ đầu, đừng đọc thành 'tớ-ti'." },
      { word: "thirteen",  phonetic: "/ˌθɜːrˈtiːn/", type: "number", meaning: "mười ba", tip: "Nhấn vào âm cuối 'teen'." },
    ],
  },
  common: {
    label: "Thông Dụng",
    words: [
      { word: "schedule",  phonetic: "/ˈskedʒuːl/",  type: "noun", meaning: "lịch trình", tip: "Mỹ đọc là 'ske-jul', Anh đọc 'shed-yul'." },
      { word: "often",     phonetic: "/ˈɒfn/",       type: "adverb", meaning: "thường",    tip: "Có thể đọc cả 'of-ten' hoặc bỏ /t/: 'of-en'." },
      { word: "iron",      phonetic: "/ˈaɪərn/",     type: "noun", meaning: "sắt / bàn ủi", tip: "Đọc là 'ai-ərn', không phát âm chữ 'r' giữa." },
      { word: "almond",    phonetic: "/ˈɑːmənd/",    type: "noun", meaning: "hạnh nhân",  tip: "Bỏ âm /l/: 'ah-mənd'." },
      { word: "salmon",    phonetic: "/ˈsæmən/",     type: "noun", meaning: "cá hồi",     tip: "Bỏ âm /l/: 'sæ-mən'." },
      { word: "receipt",   phonetic: "/rɪˈsiːt/",    type: "noun", meaning: "hoá đơn",    tip: "Chữ 'p' không phát âm: 'ri-seet'." },
      { word: "island",    phonetic: "/ˈaɪlənd/",    type: "noun", meaning: "đảo",        tip: "Chữ 's' câm: 'ai-lənd'." },
    ],
  },
} as const;

export type PronunciationCategoryKey = keyof typeof PRONUNCIATION_CATEGORIES;
