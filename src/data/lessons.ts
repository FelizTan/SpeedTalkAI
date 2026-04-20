export type Difficulty = "beginner" | "elementary" | "pre_intermediate";

export interface DialogueLine {
  speaker: string;
  isUser: boolean;
  en: string;
  vi: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  phonetic: string;
  meaning: string;
  type: "noun" | "verb" | "phrase" | "adjective" | "adverb";
  example: string;
  exampleVi: string;
}

export interface QuizItem {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Lesson {
  id: number;
  day: number;
  title: string;
  titleVi: string;
  icon: string;
  difficulty: Difficulty;
  estimatedTime: number;
  xpReward: number;
  color: string; // tailwind gradient classes
  dialogue: {
    situation: string;
    lines: DialogueLine[];
  };
  vocabulary: VocabularyItem[];
  quiz: QuizItem[];
}

export const LESSONS: Lesson[] = [
  {
    id: 1, day: 1,
    title: "Greetings & Introductions",
    titleVi: "Chào Hỏi & Giới Thiệu",
    icon: "👋",
    difficulty: "beginner",
    estimatedTime: 12,
    xpReward: 100,
    color: "from-blue-500 to-indigo-600",
    dialogue: {
      situation: "Bạn vừa đến văn phòng mới ngày đầu tiên và gặp đồng nghiệp tên Alex.",
      lines: [
        { speaker: "Alex", isUser: false, en: "Hi there! You must be the new hire. I'm Alex.", vi: "Chào bạn! Chắc bạn là người mới. Mình là Alex." },
        { speaker: "You",  isUser: true,  en: "Hi Alex! Nice to meet you. I'm Minh, today is my first day.", vi: "Chào Alex! Rất vui được gặp bạn. Mình là Minh, hôm nay là ngày đầu của mình." },
        { speaker: "Alex", isUser: false, en: "Welcome to the team! Let me introduce you to the others.", vi: "Chào mừng đến với nhóm! Để mình giới thiệu bạn với mọi người." },
        { speaker: "You",  isUser: true,  en: "That would be great. Thank you so much.", vi: "Vậy thì tốt quá. Cảm ơn bạn rất nhiều." },
        { speaker: "Alex", isUser: false, en: "No problem. If you need anything, just ask me.", vi: "Không có gì. Nếu cần gì cứ hỏi mình nhé." },
      ],
    },
    vocabulary: [
      { id: "1-1", word: "nice to meet you", phonetic: "/naɪs tə miːt juː/", meaning: "rất vui được gặp bạn", type: "phrase", example: "Nice to meet you, Sarah.", exampleVi: "Rất vui được gặp bạn, Sarah." },
      { id: "1-2", word: "introduce", phonetic: "/ˌɪntrəˈdjuːs/", meaning: "giới thiệu", type: "verb", example: "Let me introduce my friend.", exampleVi: "Để tôi giới thiệu bạn của tôi." },
      { id: "1-3", word: "colleague", phonetic: "/ˈkɒliːɡ/", meaning: "đồng nghiệp", type: "noun", example: "She is my colleague.", exampleVi: "Cô ấy là đồng nghiệp của tôi." },
      { id: "1-4", word: "welcome", phonetic: "/ˈwelkəm/", meaning: "chào mừng", type: "verb", example: "Welcome to our company.", exampleVi: "Chào mừng đến với công ty chúng tôi." },
      { id: "1-5", word: "first day", phonetic: "/fɜːst deɪ/", meaning: "ngày đầu tiên", type: "phrase", example: "Today is my first day at work.", exampleVi: "Hôm nay là ngày đầu đi làm của tôi." },
    ],
    quiz: [
      { id: "1q1", question: "Khi gặp ai đó lần đầu, câu nào lịch sự nhất?", options: ["Hello!", "Nice to meet you.", "Bye!", "Sorry."], correct: 1, explanation: "'Nice to meet you' là cách chào lịch sự khi gặp lần đầu." },
      { id: "1q2", question: "'Colleague' nghĩa là gì?", options: ["Bạn thân", "Đồng nghiệp", "Sếp", "Khách hàng"], correct: 1, explanation: "Colleague = người làm cùng công ty/đồng nghiệp." },
      { id: "1q3", question: "Câu nào phù hợp khi ai đó cảm ơn bạn?", options: ["Yes please.", "Sorry.", "No problem.", "Goodbye."], correct: 2, explanation: "'No problem' = 'Không có gì', thân mật và phổ biến." },
    ],
  },
  {
    id: 2, day: 2,
    title: "Ordering at a Coffee Shop",
    titleVi: "Gọi Đồ Tại Quán Cà Phê",
    icon: "☕",
    difficulty: "beginner",
    estimatedTime: 12,
    xpReward: 100,
    color: "from-amber-500 to-orange-600",
    dialogue: {
      situation: "Bạn vào Starbucks vào buổi sáng để gọi đồ uống.",
      lines: [
        { speaker: "Sarah", isUser: false, en: "Good morning! What can I get for you today?", vi: "Chào buổi sáng! Hôm nay bạn dùng gì ạ?" },
        { speaker: "You",   isUser: true,  en: "Can I have a medium latte, please?", vi: "Cho tôi một ly latte cỡ vừa nhé." },
        { speaker: "Sarah", isUser: false, en: "Sure. Would you like anything else?", vi: "Được ạ. Bạn dùng gì khác nữa không?" },
        { speaker: "You",   isUser: true,  en: "Yes, an extra shot of espresso, please.", vi: "Có, thêm một shot espresso nữa giúp tôi." },
        { speaker: "Sarah", isUser: false, en: "Got it. That'll be five dollars. Enjoy!", vi: "Vâng. Tổng là 5 đô. Chúc ngon miệng!" },
      ],
    },
    vocabulary: [
      { id: "2-1", word: "latte", phonetic: "/ˈlɑːteɪ/", meaning: "cà phê sữa kiểu Ý", type: "noun", example: "I'd like a vanilla latte.", exampleVi: "Cho tôi một latte vị vani." },
      { id: "2-2", word: "medium", phonetic: "/ˈmiːdiəm/", meaning: "cỡ vừa", type: "adjective", example: "A medium coffee, please.", exampleVi: "Một ly cà phê cỡ vừa." },
      { id: "2-3", word: "extra", phonetic: "/ˈekstrə/", meaning: "thêm, phụ", type: "adjective", example: "Extra sugar, please.", exampleVi: "Cho thêm đường nhé." },
      { id: "2-4", word: "that'll be", phonetic: "/ðætl bi/", meaning: "tổng cộng là", type: "phrase", example: "That'll be ten dollars.", exampleVi: "Tổng là 10 đô." },
      { id: "2-5", word: "enjoy", phonetic: "/ɪnˈdʒɔɪ/", meaning: "thưởng thức", type: "verb", example: "Enjoy your meal!", exampleVi: "Chúc ngon miệng!" },
    ],
    quiz: [
      { id: "2q1", question: "Cách gọi đồ lịch sự nhất là?", options: ["Coffee!", "Give me coffee.", "Can I have a coffee, please?", "I want coffee!"], correct: 2, explanation: "'Can I have ... please?' là mẫu câu lịch sự chuẩn." },
      { id: "2q2", question: "'Medium' nghĩa là?", options: ["Nhỏ", "Vừa", "Lớn", "Cực lớn"], correct: 1, explanation: "Medium = cỡ vừa." },
      { id: "2q3", question: "Khi nhân viên nói 'That'll be 5 dollars', họ đang...", options: ["Hỏi tên bạn", "Chúc bạn ngon miệng", "Báo giá tiền", "Hỏi bạn ăn gì"], correct: 2, explanation: "'That'll be...' dùng để báo tổng tiền cần trả." },
    ],
  },
  {
    id: 3, day: 3,
    title: "Shopping for Clothes",
    titleVi: "Mua Sắm Quần Áo",
    icon: "🛍️",
    difficulty: "beginner",
    estimatedTime: 14,
    xpReward: 100,
    color: "from-pink-500 to-rose-600",
    dialogue: {
      situation: "Bạn vào một cửa hàng quần áo, hỏi giá và muốn thử áo.",
      lines: [
        { speaker: "Assistant", isUser: false, en: "Hi! Can I help you with anything?", vi: "Chào! Tôi giúp gì được cho bạn ạ?" },
        { speaker: "You",       isUser: true,  en: "Yes, do you have this shirt in size M?", vi: "Có, cửa hàng có chiếc áo này size M không ạ?" },
        { speaker: "Assistant", isUser: false, en: "Yes, here you go. The fitting room is over there.", vi: "Có ạ, đây bạn. Phòng thử ở phía kia." },
        { speaker: "You",       isUser: true,  en: "Thanks. It fits well. Is there a discount today?", vi: "Cảm ơn. Áo vừa lắm. Hôm nay có giảm giá không nhỉ?" },
        { speaker: "Assistant", isUser: false, en: "Yes, ten percent off. Here is your receipt.", vi: "Có, giảm 10%. Đây là hoá đơn của bạn." },
      ],
    },
    vocabulary: [
      { id: "3-1", word: "size", phonetic: "/saɪz/", meaning: "kích cỡ", type: "noun", example: "What size are you?", exampleVi: "Bạn mặc size mấy?" },
      { id: "3-2", word: "try on", phonetic: "/traɪ ɒn/", meaning: "thử (đồ)", type: "phrase", example: "Can I try this on?", exampleVi: "Tôi thử cái này được không?" },
      { id: "3-3", word: "fits", phonetic: "/fɪts/", meaning: "vừa vặn", type: "verb", example: "It fits me perfectly.", exampleVi: "Nó vừa với tôi hoàn hảo." },
      { id: "3-4", word: "receipt", phonetic: "/rɪˈsiːt/", meaning: "hoá đơn", type: "noun", example: "Keep your receipt, please.", exampleVi: "Vui lòng giữ hoá đơn." },
      { id: "3-5", word: "discount", phonetic: "/ˈdɪskaʊnt/", meaning: "giảm giá", type: "noun", example: "Is there a discount?", exampleVi: "Có giảm giá không?" },
    ],
    quiz: [
      { id: "3q1", question: "'Try on' nghĩa là gì?", options: ["Mua", "Thử", "Trả lại", "Đổi"], correct: 1, explanation: "Try on = thử quần áo trước khi mua." },
      { id: "3q2", question: "Hỏi về giảm giá, câu nào đúng?", options: ["Discount me!", "Is there a discount?", "Cheap please.", "Less money."], correct: 1, explanation: "'Is there a discount?' là câu hỏi lịch sự, đúng ngữ pháp." },
      { id: "3q3", question: "'Receipt' là gì?", options: ["Hoá đơn", "Giấy gói", "Túi xách", "Thẻ tín dụng"], correct: 0, explanation: "Receipt = hoá đơn." },
    ],
  },
  {
    id: 4, day: 4,
    title: "Asking for Directions",
    titleVi: "Hỏi Đường",
    icon: "🗺️",
    difficulty: "beginner",
    estimatedTime: 12,
    xpReward: 100,
    color: "from-emerald-500 to-teal-600",
    dialogue: {
      situation: "Bạn lạc đường ở thành phố và muốn hỏi đường đến ga tàu điện ngầm.",
      lines: [
        { speaker: "You",      isUser: true,  en: "Excuse me, how do I get to the subway station?", vi: "Xin lỗi, tôi đi đến ga tàu điện ngầm thế nào?" },
        { speaker: "Stranger", isUser: false, en: "Go straight ahead for two blocks, then turn left.", vi: "Đi thẳng hai khu nhà rồi rẽ trái." },
        { speaker: "You",      isUser: true,  en: "Is it far from here?", vi: "Có xa không ạ?" },
        { speaker: "Stranger", isUser: false, en: "No, just five minutes on foot. You can't miss it.", vi: "Không, chỉ 5 phút đi bộ. Không thể lạc được." },
        { speaker: "You",      isUser: true,  en: "Great, thank you so much!", vi: "Tuyệt, cảm ơn bạn rất nhiều!" },
      ],
    },
    vocabulary: [
      { id: "4-1", word: "straight ahead", phonetic: "/streɪt əˈhed/", meaning: "đi thẳng", type: "phrase", example: "Go straight ahead.", exampleVi: "Đi thẳng phía trước." },
      { id: "4-2", word: "turn left", phonetic: "/tɜːn left/", meaning: "rẽ trái", type: "phrase", example: "Turn left at the corner.", exampleVi: "Rẽ trái ở ngã rẽ." },
      { id: "4-3", word: "block", phonetic: "/blɒk/", meaning: "khu nhà / dãy phố", type: "noun", example: "Walk two blocks.", exampleVi: "Đi bộ hai dãy phố." },
      { id: "4-4", word: "landmark", phonetic: "/ˈlændmɑːk/", meaning: "địa danh nổi bật", type: "noun", example: "The tower is a famous landmark.", exampleVi: "Toà tháp là một địa danh nổi tiếng." },
      { id: "4-5", word: "miss", phonetic: "/mɪs/", meaning: "bỏ lỡ, không thấy", type: "verb", example: "You can't miss it.", exampleVi: "Bạn không thể bỏ lỡ đâu." },
    ],
    quiz: [
      { id: "4q1", question: "'Turn right' nghĩa là?", options: ["Rẽ trái", "Rẽ phải", "Đi thẳng", "Quay lại"], correct: 1, explanation: "Turn right = rẽ phải." },
      { id: "4q2", question: "Hỏi đường lịch sự bắt đầu bằng?", options: ["Hey!", "Excuse me,", "Listen!", "You there!"], correct: 1, explanation: "'Excuse me' là cách lịch sự để bắt chuyện." },
      { id: "4q3", question: "'You can't miss it' nghĩa là?", options: ["Bạn sẽ bị lạc", "Bạn không thể bỏ lỡ / dễ thấy lắm", "Bạn đi sai rồi", "Bạn quay lại đi"], correct: 1, explanation: "Câu này nghĩa là chỗ đó dễ thấy, khó mà bỏ qua." },
    ],
  },
  {
    id: 5, day: 5,
    title: "Checking into a Hotel",
    titleVi: "Nhận Phòng Khách Sạn",
    icon: "🏨",
    difficulty: "elementary",
    estimatedTime: 13,
    xpReward: 100,
    color: "from-purple-500 to-violet-600",
    dialogue: {
      situation: "Bạn đến khách sạn để nhận phòng đã đặt trước.",
      lines: [
        { speaker: "Emily", isUser: false, en: "Good evening! Welcome. Do you have a reservation?", vi: "Chào buổi tối! Bạn có đặt phòng trước không?" },
        { speaker: "You",   isUser: true,  en: "Yes, I have a reservation under the name Minh.", vi: "Có, tôi đặt phòng dưới tên Minh." },
        { speaker: "Emily", isUser: false, en: "Found it. You're on the fifth floor. Here is your room key.", vi: "Tìm thấy rồi. Bạn ở tầng 5. Đây là chìa khoá phòng." },
        { speaker: "You",   isUser: true,  en: "Thanks. Is breakfast included?", vi: "Cảm ơn. Có bữa sáng kèm theo không?" },
        { speaker: "Emily", isUser: false, en: "Yes, complimentary breakfast from 6 to 10 a.m.", vi: "Có ạ, bữa sáng miễn phí từ 6 đến 10 giờ sáng." },
      ],
    },
    vocabulary: [
      { id: "5-1", word: "reservation", phonetic: "/ˌrezəˈveɪʃn/", meaning: "đặt chỗ trước", type: "noun", example: "I have a reservation.", exampleVi: "Tôi có đặt chỗ trước." },
      { id: "5-2", word: "check-in", phonetic: "/ˈtʃek ɪn/", meaning: "làm thủ tục nhận phòng", type: "noun", example: "Check-in is at 2 p.m.", exampleVi: "Nhận phòng lúc 2 giờ chiều." },
      { id: "5-3", word: "room key", phonetic: "/ruːm kiː/", meaning: "chìa khoá phòng", type: "noun", example: "Here is your room key.", exampleVi: "Đây là chìa khoá phòng của bạn." },
      { id: "5-4", word: "floor", phonetic: "/flɔː/", meaning: "tầng", type: "noun", example: "I'm on the third floor.", exampleVi: "Tôi ở tầng 3." },
      { id: "5-5", word: "complimentary", phonetic: "/ˌkɒmplɪˈmentri/", meaning: "miễn phí (kèm theo dịch vụ)", type: "adjective", example: "Complimentary Wi-Fi.", exampleVi: "Wi-Fi miễn phí." },
    ],
    quiz: [
      { id: "5q1", question: "'Reservation' nghĩa là?", options: ["Phòng trống", "Đặt chỗ trước", "Hủy phòng", "Đổi phòng"], correct: 1, explanation: "Reservation = đặt trước (phòng, bàn...)." },
      { id: "5q2", question: "'Complimentary breakfast' nghĩa là?", options: ["Bữa sáng tự chọn", "Bữa sáng miễn phí", "Bữa sáng phải trả thêm", "Bữa sáng ngon"], correct: 1, explanation: "Complimentary = miễn phí, đi kèm dịch vụ." },
      { id: "5q3", question: "Hỏi về tầng phòng?", options: ["Which floor?", "Which time?", "Which room?", "Which day?"], correct: 0, explanation: "Floor = tầng. 'Which floor?' để hỏi tầng nào." },
    ],
  },
  {
    id: 6, day: 6,
    title: "At the Doctor's",
    titleVi: "Tại Phòng Khám",
    icon: "🏥",
    difficulty: "elementary",
    estimatedTime: 14,
    xpReward: 100,
    color: "from-red-500 to-rose-600",
    dialogue: {
      situation: "Bạn đến phòng khám vì cảm thấy không khoẻ và mô tả triệu chứng cho bác sĩ.",
      lines: [
        { speaker: "Dr. Smith", isUser: false, en: "What seems to be the problem today?", vi: "Hôm nay bạn bị làm sao vậy?" },
        { speaker: "You",       isUser: true,  en: "I have a sore throat and a slight fever.", vi: "Tôi bị đau họng và sốt nhẹ." },
        { speaker: "Dr. Smith", isUser: false, en: "How long have you had these symptoms?", vi: "Bạn có triệu chứng này bao lâu rồi?" },
        { speaker: "You",       isUser: true,  en: "About two days. Are you allergic to any medicine?", vi: "Khoảng hai ngày. Bạn có dị ứng với thuốc nào không?" },
        { speaker: "Dr. Smith", isUser: false, en: "I'll write you a prescription. Take it twice a day.", vi: "Tôi sẽ kê đơn. Uống hai lần một ngày nhé." },
      ],
    },
    vocabulary: [
      { id: "6-1", word: "symptom", phonetic: "/ˈsɪmptəm/", meaning: "triệu chứng", type: "noun", example: "What are your symptoms?", exampleVi: "Triệu chứng của bạn là gì?" },
      { id: "6-2", word: "prescription", phonetic: "/prɪˈskrɪpʃn/", meaning: "đơn thuốc", type: "noun", example: "Here is your prescription.", exampleVi: "Đây là đơn thuốc của bạn." },
      { id: "6-3", word: "allergic", phonetic: "/əˈlɜːdʒɪk/", meaning: "bị dị ứng", type: "adjective", example: "I'm allergic to peanuts.", exampleVi: "Tôi bị dị ứng đậu phộng." },
      { id: "6-4", word: "dosage", phonetic: "/ˈdəʊsɪdʒ/", meaning: "liều dùng", type: "noun", example: "Follow the dosage carefully.", exampleVi: "Tuân theo liều dùng cẩn thận." },
      { id: "6-5", word: "follow-up", phonetic: "/ˈfɒləʊ ʌp/", meaning: "tái khám", type: "noun", example: "Come back for a follow-up.", exampleVi: "Quay lại tái khám nhé." },
    ],
    quiz: [
      { id: "6q1", question: "'Symptom' nghĩa là?", options: ["Bệnh", "Triệu chứng", "Thuốc", "Bác sĩ"], correct: 1, explanation: "Symptom = triệu chứng (sốt, ho,...)." },
      { id: "6q2", question: "Bác sĩ kê thuốc gọi là?", options: ["receipt", "prescription", "permission", "subscription"], correct: 1, explanation: "Prescription = đơn thuốc bác sĩ kê." },
      { id: "6q3", question: "'I'm allergic to ...' nghĩa là?", options: ["Tôi thích...", "Tôi ghét...", "Tôi bị dị ứng với...", "Tôi cần..."], correct: 2, explanation: "Allergic = dị ứng." },
    ],
  },
  {
    id: 7, day: 7,
    title: "Job Interview",
    titleVi: "Phỏng Vấn Xin Việc",
    icon: "💼",
    difficulty: "elementary",
    estimatedTime: 15,
    xpReward: 100,
    color: "from-slate-600 to-slate-800",
    dialogue: {
      situation: "Bạn đang phỏng vấn cho vị trí nhân viên marketing.",
      lines: [
        { speaker: "Interviewer", isUser: false, en: "Tell me about your work experience.", vi: "Hãy nói về kinh nghiệm làm việc của bạn." },
        { speaker: "You",         isUser: true,  en: "I have three years of experience in digital marketing.", vi: "Tôi có ba năm kinh nghiệm trong digital marketing." },
        { speaker: "Interviewer", isUser: false, en: "What is your greatest strength?", vi: "Điểm mạnh nhất của bạn là gì?" },
        { speaker: "You",         isUser: true,  en: "I'm a fast learner and a good team player.", vi: "Tôi học nhanh và làm việc nhóm tốt." },
        { speaker: "Interviewer", isUser: false, en: "Great. What salary are you expecting?", vi: "Tốt. Bạn mong mức lương bao nhiêu?" },
      ],
    },
    vocabulary: [
      { id: "7-1", word: "experience", phonetic: "/ɪkˈspɪəriəns/", meaning: "kinh nghiệm", type: "noun", example: "I have five years of experience.", exampleVi: "Tôi có 5 năm kinh nghiệm." },
      { id: "7-2", word: "strength", phonetic: "/streŋθ/", meaning: "điểm mạnh", type: "noun", example: "My strength is teamwork.", exampleVi: "Điểm mạnh của tôi là làm việc nhóm." },
      { id: "7-3", word: "weakness", phonetic: "/ˈwiːknəs/", meaning: "điểm yếu", type: "noun", example: "Everyone has weaknesses.", exampleVi: "Ai cũng có điểm yếu." },
      { id: "7-4", word: "opportunity", phonetic: "/ˌɒpəˈtjuːnəti/", meaning: "cơ hội", type: "noun", example: "This is a great opportunity.", exampleVi: "Đây là một cơ hội tuyệt vời." },
      { id: "7-5", word: "salary", phonetic: "/ˈsæləri/", meaning: "lương", type: "noun", example: "What is the starting salary?", exampleVi: "Mức lương khởi điểm là bao nhiêu?" },
    ],
    quiz: [
      { id: "7q1", question: "'Strength' nghĩa là?", options: ["Điểm yếu", "Điểm mạnh", "Kinh nghiệm", "Lương"], correct: 1, explanation: "Strength = điểm mạnh." },
      { id: "7q2", question: "Câu nào hỏi về lương?", options: ["What's your name?", "What's your salary expectation?", "Where are you from?", "When can you start?"], correct: 1, explanation: "Salary expectation = mức lương kỳ vọng." },
      { id: "7q3", question: "'I'm a fast learner' nghĩa là?", options: ["Tôi đi nhanh", "Tôi học nhanh", "Tôi làm nhanh", "Tôi nói nhanh"], correct: 1, explanation: "Fast learner = người học nhanh." },
    ],
  },
  {
    id: 8, day: 8,
    title: "Making a Phone Call",
    titleVi: "Gọi Điện Thoại",
    icon: "📞",
    difficulty: "elementary",
    estimatedTime: 12,
    xpReward: 100,
    color: "from-cyan-500 to-blue-600",
    dialogue: {
      situation: "Bạn gọi điện đến nhà hàng để đặt bàn cho buổi tối.",
      lines: [
        { speaker: "Staff", isUser: false, en: "Good afternoon, Bella Restaurant. How can I help?", vi: "Chào buổi chiều, nhà hàng Bella đây. Tôi giúp gì được ạ?" },
        { speaker: "You",   isUser: true,  en: "I'd like to make a reservation for tonight.", vi: "Tôi muốn đặt bàn cho tối nay." },
        { speaker: "Staff", isUser: false, en: "Sure. For how many people and what time?", vi: "Vâng. Cho mấy người và lúc mấy giờ ạ?" },
        { speaker: "You",   isUser: true,  en: "A party of four at 7 p.m., please.", vi: "Bốn người, lúc 7 giờ tối nhé." },
        { speaker: "Staff", isUser: false, en: "Confirmed. See you at seven. Thank you!", vi: "Xác nhận rồi ạ. Hẹn gặp lúc 7 giờ. Cảm ơn!" },
      ],
    },
    vocabulary: [
      { id: "8-1", word: "reservation", phonetic: "/ˌrezəˈveɪʃn/", meaning: "đặt chỗ", type: "noun", example: "Make a reservation for two.", exampleVi: "Đặt bàn cho hai người." },
      { id: "8-2", word: "available", phonetic: "/əˈveɪləbl/", meaning: "có sẵn / còn trống", type: "adjective", example: "Is the table available?", exampleVi: "Bàn còn trống không?" },
      { id: "8-3", word: "party of", phonetic: "/ˈpɑːti əv/", meaning: "nhóm gồm... người", type: "phrase", example: "A party of six.", exampleVi: "Một nhóm 6 người." },
      { id: "8-4", word: "confirm", phonetic: "/kənˈfɜːm/", meaning: "xác nhận", type: "verb", example: "Please confirm your booking.", exampleVi: "Vui lòng xác nhận đặt chỗ." },
      { id: "8-5", word: "cancel", phonetic: "/ˈkænsl/", meaning: "huỷ", type: "verb", example: "I need to cancel my order.", exampleVi: "Tôi cần huỷ đơn hàng." },
    ],
    quiz: [
      { id: "8q1", question: "'Make a reservation' nghĩa là?", options: ["Huỷ chỗ", "Đặt chỗ", "Đổi chỗ", "Trả tiền"], correct: 1, explanation: "Make a reservation = đặt chỗ trước." },
      { id: "8q2", question: "'A party of four' nghĩa là?", options: ["Bốn bữa tiệc", "Một nhóm 4 người", "Bốn nhà hàng", "Bốn món ăn"], correct: 1, explanation: "Party of N = nhóm gồm N người." },
      { id: "8q3", question: "'Confirm' đối lập với?", options: ["accept", "cancel", "book", "call"], correct: 1, explanation: "Confirm (xác nhận) ↔ cancel (huỷ)." },
    ],
  },
  {
    id: 9, day: 9,
    title: "At the Airport",
    titleVi: "Tại Sân Bay",
    icon: "✈️",
    difficulty: "pre_intermediate",
    estimatedTime: 14,
    xpReward: 100,
    color: "from-sky-500 to-indigo-600",
    dialogue: {
      situation: "Bạn check-in tại quầy hàng không trước chuyến bay quốc tế.",
      lines: [
        { speaker: "Agent", isUser: false, en: "Good morning. May I see your passport, please?", vi: "Chào buổi sáng. Cho tôi xem hộ chiếu nhé." },
        { speaker: "You",   isUser: true,  en: "Sure. Here is my passport and booking.", vi: "Vâng. Đây là hộ chiếu và mã đặt vé của tôi." },
        { speaker: "Agent", isUser: false, en: "Window or aisle seat?", vi: "Bạn muốn ghế cạnh cửa sổ hay lối đi?" },
        { speaker: "You",   isUser: true,  en: "Aisle, please. Any carry-on limit?", vi: "Cho tôi ghế lối đi. Hành lý xách tay có giới hạn gì không ạ?" },
        { speaker: "Agent", isUser: false, en: "One bag, 7 kg. Your boarding pass is here. Gate 12.", vi: "Một túi, 7 kg. Đây là thẻ lên máy bay. Cửa số 12." },
      ],
    },
    vocabulary: [
      { id: "9-1", word: "boarding pass", phonetic: "/ˈbɔːdɪŋ pɑːs/", meaning: "thẻ lên máy bay", type: "noun", example: "Show your boarding pass.", exampleVi: "Đưa thẻ lên máy bay ra." },
      { id: "9-2", word: "carry-on", phonetic: "/ˈkæri ɒn/", meaning: "hành lý xách tay", type: "noun", example: "Only one carry-on allowed.", exampleVi: "Chỉ cho phép một hành lý xách tay." },
      { id: "9-3", word: "aisle", phonetic: "/aɪl/", meaning: "lối đi giữa", type: "noun", example: "I prefer an aisle seat.", exampleVi: "Tôi thích ghế lối đi." },
      { id: "9-4", word: "departure gate", phonetic: "/dɪˈpɑːtʃə ɡeɪt/", meaning: "cửa khởi hành", type: "noun", example: "Go to departure gate 5.", exampleVi: "Đến cửa khởi hành số 5." },
      { id: "9-5", word: "delay", phonetic: "/dɪˈleɪ/", meaning: "trì hoãn", type: "noun", example: "The flight has a delay.", exampleVi: "Chuyến bay bị trì hoãn." },
    ],
    quiz: [
      { id: "9q1", question: "'Boarding pass' là gì?", options: ["Hộ chiếu", "Thẻ lên máy bay", "Vé tàu", "Vé xe"], correct: 1, explanation: "Boarding pass = thẻ lên máy bay." },
      { id: "9q2", question: "Bạn muốn ngồi lối đi, nói?", options: ["Window seat", "Aisle seat", "Middle seat", "Front seat"], correct: 1, explanation: "Aisle = lối đi." },
      { id: "9q3", question: "'The flight is delayed' nghĩa là?", options: ["Chuyến bay đã hạ cánh", "Chuyến bay bị trì hoãn", "Chuyến bay đúng giờ", "Chuyến bay bị huỷ"], correct: 1, explanation: "Delayed = trì hoãn." },
    ],
  },
  {
    id: 10, day: 10,
    title: "Socializing with Friends",
    titleVi: "Giao Lưu Bạn Bè",
    icon: "🎉",
    difficulty: "pre_intermediate",
    estimatedTime: 13,
    xpReward: 100,
    color: "from-fuchsia-500 to-pink-600",
    dialogue: {
      situation: "Bạn gặp lại nhóm bạn quốc tế tại một bữa tiệc cuối tuần.",
      lines: [
        { speaker: "Anna",  isUser: false, en: "Hey, long time no see! How have you been?", vi: "Lâu quá không gặp! Dạo này thế nào rồi?" },
        { speaker: "You",   isUser: true,  en: "Pretty good, thanks. We should hang out more often.", vi: "Khá ổn, cảm ơn. Mình nên đi chơi thường xuyên hơn." },
        { speaker: "Anna",  isUser: false, en: "Totally! Let's catch up over dinner next week.", vi: "Đồng ý! Tuần sau ăn tối hàn huyên nhé." },
        { speaker: "You",   isUser: true,  en: "Sounds great. By the way, how is your new job?", vi: "Hay đó. À mà, công việc mới của cậu thế nào?" },
        { speaker: "Anna",  isUser: false, en: "Going well! Anyway, take care and see you soon.", vi: "Đang ổn! Thôi, giữ sức khoẻ và hẹn gặp lại sớm nhé." },
      ],
    },
    vocabulary: [
      { id: "10-1", word: "hang out", phonetic: "/hæŋ aʊt/", meaning: "đi chơi", type: "phrase", example: "Let's hang out this weekend.", exampleVi: "Cuối tuần này đi chơi nhé." },
      { id: "10-2", word: "catch up", phonetic: "/kætʃ ʌp/", meaning: "hàn huyên / cập nhật tin tức", type: "phrase", example: "We need to catch up.", exampleVi: "Chúng ta cần hàn huyên với nhau." },
      { id: "10-3", word: "by the way", phonetic: "/baɪ ðə weɪ/", meaning: "tiện thể", type: "phrase", example: "By the way, where do you live?", exampleVi: "Tiện thể, bạn sống ở đâu?" },
      { id: "10-4", word: "anyway", phonetic: "/ˈeniweɪ/", meaning: "dù sao thì / thôi", type: "adverb", example: "Anyway, I have to go.", exampleVi: "Thôi mình phải đi đây." },
      { id: "10-5", word: "take care", phonetic: "/teɪk keə/", meaning: "giữ gìn sức khoẻ", type: "phrase", example: "Take care, my friend.", exampleVi: "Giữ gìn sức khoẻ nhé." },
    ],
    quiz: [
      { id: "10q1", question: "'Hang out' nghĩa là?", options: ["Treo lên", "Đi chơi", "Nghỉ ngơi", "Chia tay"], correct: 1, explanation: "Hang out = đi chơi cùng nhau." },
      { id: "10q2", question: "'By the way' dùng khi?", options: ["Bắt đầu chủ đề mới / nói thêm điều gì đó", "Chào tạm biệt", "Cảm ơn", "Xin lỗi"], correct: 0, explanation: "By the way = tiện thể, chuyển sang ý mới." },
      { id: "10q3", question: "Câu nào để chia tay thân mật?", options: ["Goodbye, sir.", "Take care!", "Hello!", "Sorry."], correct: 1, explanation: "'Take care!' là câu chia tay thân mật phổ biến." },
    ],
  },
];

export const getLessonById = (id: number) => LESSONS.find((l) => l.id === id);

export const getNextLesson = (completedLessons: number[]) => {
  return LESSONS.find((l) => !completedLessons.includes(l.id)) ?? null;
};
