import { Question } from "../teeth-game/types";

export interface LessonNode {
  questions: Question[];
  id: string;
  type: "lesson" | "quiz" | "game" | "story" | "practice";
  title: string;
  titleMn: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  audioText: string;
}

export const teethLessons: LessonNode[] = [
  {
    id: "teeth-1",
    type: "lesson",
    title: "Introduction to Teeth",
    titleMn: "Шүдний танилцуулга",
    isUnlocked: true,
    isCompleted: false,
    question: "Хүн бүр өөрийн шүдтэй төрдөг үү?",
    options: [
      "Тийм, бүгд шүдтэй төрдөг",
      "Үгүй, шүд хожим ургадаг",
      "Зөвхөн зарим хүүхэд",
      "Өвөлдөр шүд ургадаг",
    ],
    correctAnswer: 1,
    explanation:
      "Хүүхдүүд шүдгүй төрдөг. Анхны шүд 6 сараас эхлэн ургаж, 3 нас хүртэл 20 сүүн шүд бүрэн ургадаг.",
    audioText:
      "Хүүхдүүд шүдгүй төрдөг. Анхны шүд зургаан сараас эхлэн ургаж, гурван нас хүртэл хорин сүүн шүд бүрэн ургадаг.",
    questions: [],
  },
  {
    id: "teeth-2",
    type: "lesson",
    title: "Types of Teeth - Incisors",
    titleMn: "Шүдний төрөл - Хадаас",
    isUnlocked: true,
    isCompleted: false,
    question: "Хадаас ямар ажил хийдэг вэ?",
    options: ["Хоол нунтаглах", "Хоол зүсэх, хазах", "Хоол урах", "Хоол барих"],
    correctAnswer: 1,
    explanation:
      "Хадаас бол урд талын хурц шүд юм. Тэд яблоко, морковь гэх мэт хоолыг зүсэх, хазахад ашигладаг.",
    audioText:
      "Хадаас бол урд талын хурц шүд юм. Тэд яблоко, морковь гэх мэт хоолыг зүсэх, хазахад ашигладаг.",
    questions: [],
  },
  {
    id: "teeth-3",
    type: "quiz",
    title: "Incisors Quiz",
    titleMn: "Хадаасны асуулт",
    isUnlocked: true,
    isCompleted: false,
    question: "Хэдэн хадаас шүдтэй вэ?",
    options: ["4 хадаас", "6 хадаас", "8 хадаас", "12 хадаас"],
    correctAnswer: 2,
    explanation:
      "Та 8 хадаас шүдтэй - дээд эрүүнд 4, доод эрүүнд 4. Тэд хамгийн урд талд байрладаг.",
    audioText:
      "Та найман хадаас шүдтэй - дээд эрүүнд дөрөв, доод эрүүнд дөрөв. Тэд хамгийн урд талд байрладаг.",
    questions: [],
  },
  {
    id: "teeth-4",
    type: "lesson",
    title: "Types of Teeth - Canines",
    titleMn: "Шүдний төрөл - Соёо шүд",
    isUnlocked: false,
    isCompleted: false,
    question: "Соёо шүд яагаад хурц байдаг вэ?",
    options: [
      "Гоо үзэсгэлэнтэй харагдахын тулд",
      "Хатуу хоол урах, таслахад",
      "Амны эрүүл мэндэд",
      "Зөвхөн хүүхдэд байдаг",
    ],
    correctAnswer: 1,
    explanation:
      "Соёо шүд нь хурц, шовх мэт хэлбэртэй. Тэд мах гэх мэт хатуу хоолыг урах, таслахад тусалдаг.",
    audioText:
      "Соёо шүд нь хурц, шовх мэт хэлбэртэй. Тэд мах гэх мэт хатуу хоолыг урах, таслахад тусалдаг.",
    questions: [],
  },
  {
    id: "teeth-5",
    type: "practice",
    title: "Canine Practice",
    titleMn: "Соёо шүдний дадлага",
    isUnlocked: false,
    isCompleted: false,

    question: "Хэдэн соёо шүдтэй вэ?",
    options: ["2 соёо", "4 соёо", "6 соёо", "8 соёо"],
    correctAnswer: 1,
    explanation:
      "Та 4 соёо шүдтэй - дээд эрүүнд 2, доод эрүүнд 2. Тэд хадаасны хажууд байрладаг.",
    audioText:
      "Та дөрвөн соёо шүдтэй - дээд эрүүнд хоёр, доод эрүүнд хоёр. Тэд хадаасны хажууд байрладаг.",
    questions: [],
  },
  {
    id: "teeth-6",
    type: "lesson",
    title: "Types of Teeth - Premolars",
    titleMn: "Шүдний төрөл - Өмнөх арааны шүд",
    isUnlocked: false,
    isCompleted: false,

    question: "Өмнөх арааны шүд ямар үүрэгтэй вэ?",
    options: [
      "Зөвхөн гоо үзэсгэлэн",
      "Хоол зүсэх, жижигрүүлэх",
      "Хоол бутлах, нунтаглах",
      "Ямар ч үүрэггүй",
    ],
    correctAnswer: 2,
    explanation:
      "Өмнөх арааны шүд нь хадаас болон арааны шүдний хооронд байдаг. Тэд хоолыг бутлаж, нунтаглахад тусалдаг.",
    audioText:
      "Өмнөх арааны шүд нь хадаас болон арааны шүдний хооронд байдаг. Тэд хоолыг бутлаж, нунтаглахад тусалдаг.",
    questions: [],
  },
  {
    id: "teeth-7",
    type: "lesson",
    title: "Types of Teeth - Molars",
    titleMn: "Шүдний төрөл - Арааны шүд",
    isUnlocked: false,
    isCompleted: false,

    question: "Арааны шүд хамгийн том шүд үү?",
    options: [
      "Үгүй, хадаас том",
      "Үгүй, соёо шүд том",
      "Тийм, хамгийн том",
      "Бүх шүд ижил хэмжээтэй",
    ],
    correctAnswer: 2,
    explanation:
      "Арааны шүд бол хамгийн том, хүчтэй шүд. Тэд амны хойд талд байрлаж, хоолыг нунтаглах үндсэн ажлыг хийдэг.",
    audioText:
      "Арааны шүд бол хамгийн том, хүчтэй шүд. Тэд амны хойд талд байрлаж, хоолыг нунтаглах үндсэн ажлыг хийдэг.",
    questions: [],
  },
  {
    id: "teeth-8",
    type: "quiz",
    title: "Molars Quiz",
    titleMn: "Арааны шүдний асуулт",
    isUnlocked: false,
    isCompleted: false,

    question: "Насанд хүрэгчид хэдэн арааны шүдтэй байдаг вэ?",
    options: ["4 арааны шүд", "8 арааны шүд", "12 арааны шүд", "16 арааны шүд"],
    correctAnswer: 2,
    explanation:
      "Насанд хүрэгчид ихэвчлэн 12 арааны шүдтэй - эрүү тус бүр дээр 6. Үүнд мэргэн шүд орно.",
    audioText:
      "Насанд хүрэгчид ихэвчлэн арван хоёр арааны шүдтэй - эрүү тус бүр дээр зургаа. Үүнд мэргэн шүд орно.",
    questions: [],
  },
  {
    id: "teeth-9",
    type: "lesson",
    title: "Tooth Structure - Enamel",
    titleMn: "Шүдний бүтэц - Паалан",
    isUnlocked: false,
    isCompleted: false,

    question: "Паалан яагаад чухал вэ?",
    options: [
      "Зөвхөн шүдийг цагаан болгодог",
      "Шүдийг хамгаалдаг",
      "Хоол амтлахад тусалдаг",
      "Ямар ч үүрэггүй",
    ],
    correctAnswer: 1,
    explanation:
      "Паалан бол шүдний хамгийн гаднах давхарга. Энэ нь биеийн хамгийн хатуу эд бөгөөд шүдийг хортой бактери, хүйтэн халуунаас хамгаалдаг.",
    audioText:
      "Паалан бол шүдний хамгийн гаднах давхарга. Энэ нь биеийн хамгийн хатуу эд бөгөөд шүдийг хортой бактери, хүйтэн халуунаас хамгаалдаг.",
    questions: [],
  },
  {
    id: "teeth-10",
    type: "lesson",
    title: "Tooth Structure - Dentin",
    titleMn: "Шүдний бүтэц - Дентин",
    isUnlocked: false,
    isCompleted: false,

    question: "Дентин хаана байрладаг вэ?",
    options: [
      "Шүдний хамгийн гадна",
      "Пааланы доор",
      "Шүдний үндэс дээр",
      "Буйлны доор",
    ],
    correctAnswer: 2,
    explanation:
      "Дентин нь пааланы доор байрладаг шар өнгөтэй давхарга юм. Энэ нь пааланаас зөөлөн боловч шүдний бүтцийг тогтоодог.",
    audioText:
      "Дентин нь пааланы доор байрладаг шар өнгөтэй давхарга юм. Энэ нь пааланаас зөөлөн боловч шүдний бүтцийг тогтоодог.",
    questions: [],
  },
  {
    id: "teeth-11",
    type: "story",
    title: "The Tooth Pulp",
    titleMn: "Шүдний целлюлоз",
    isUnlocked: false,
    isCompleted: false,

    question: "Шүдний целлюлоз юу агуулдаг вэ?",
    options: [
      "Зөвхөн цусны судас",
      "Мэдрэл ба цусны судас",
      "Зөвхөн ясны эд",
      "Хоосон орон зай",
    ],
    correctAnswer: 1,
    explanation:
      "Шүдний целлюлоз нь төв хэсэг бөгөөд мэдрэл, цусны судас агуулдаг. Энэ нь шүдийг амьд байлгаж, өвдөлт мэдрүүлэхэд тусалдаг.",
    audioText:
      "Шүдний целлюлоз нь төв хэсэг бөгөөд мэдрэл, цусны судас агуулдаг. Энэ нь шүдийг амьд байлгаж, өвдөлт мэдрүүлэхэд тусалдаг.",
    questions: [],
  },
  {
    id: "teeth-12",
    type: "lesson",
    title: "Baby Teeth vs Adult Teeth",
    titleMn: "Сүүн шүд ба насанд хүрэгчдийн шүд",
    isUnlocked: false,
    isCompleted: false,

    question: "Сүүн шүд хэзээ унадаг вэ?",
    options: ["1-2 нас", "3-4 нас", "6-12 нас", "15-18 нас"],
    correctAnswer: 2,
    explanation:
      "Сүүн шүд ихэвчлэн 6-12 насанд унаж эхэлдэг. Тэдгээрийг том, хүчтэй насанд хүрэгчдийн шүд солидог.",
    audioText:
      "Сүүн шүд ихэвчлэн зургаагаас арван хоёр насанд унаж эхэлдэг. Тэдгээрийг том, хүчтэй насанд хүрэгчдийн шүд солидог.",
    questions: [],
  },
  {
    id: "teeth-13",
    type: "quiz",
    title: "Tooth Count Quiz",
    titleMn: "Шүдний тооны асуулт",
    isUnlocked: false,
    isCompleted: false,

    question: "Насанд хүрэгчдэд нийт хэдэн шүд байдаг вэ?",
    options: ["20 шүд", "24 шүд", "28 шүд", "32 шүд"],
    correctAnswer: 3,
    explanation:
      "Насанд хүрэгчдэд нийт 32 шүд байдаг - үүнд 4 мэргэн шүд орно. Мэргэн шүд 17-25 насанд ургадаг.",
    audioText:
      "Насанд хүрэгчдэд нийт гучин хоёр шүд байдаг - үүнд дөрвөн мэргэн шүд орно. Мэргэн шүд арван долоогоос хорин таван насанд ургадаг.",
    questions: [],
  },
  {
    id: "teeth-14",
    type: "lesson",
    title: "Dental Hygiene - Brushing",
    titleMn: "Шүдний эрүүл ахуй - Угаах",
    isUnlocked: false,
    isCompleted: false,

    question: "Өдөрт хэдэн удаа шүдээ угаах ёстой вэ?",
    options: ["Нэг удаа", "Хоёр удаа", "Гурван удаа", "Хоол идэх бүрт"],
    correctAnswer: 1,
    explanation:
      "Өдөрт хоёр удаа - өглөө, орой унтахын өмнө шүдээ угаах хэрэгтэй. Энэ нь бактери, товруу арилгаж, шүд цоорохоос урьдчилан сэргийлдэг.",
    audioText:
      "Өдөрт хоёр удаа - өглөө, орой унтахын өмнө шүдээ угаах хэрэгтэй. Энэ нь бактери, товруу арилгаж, шүд цоорохоос урьдчилан сэргийлдэг.",
    questions: [],
  },
  {
    id: "teeth-15",
    type: "practice",
    title: "Brushing Technique",
    titleMn: "Угаах арга",
    isUnlocked: false,
    isCompleted: false,

    question: "Шүдээ хэр удаан угаах ёстой вэ?",
    options: ["30 секунд", "1 минут", "2 минут", "5 минут"],
    correctAnswer: 2,
    explanation:
      "Шүдээ 2 минутын турш угаах хэрэгтэй. Энэ нь бүх шүд, буйлыг сайтар цэвэрлэх хангалттай хугацаа юм.",
    audioText:
      "Шүдээ хоёр минутын турш угаах хэрэгтэй. Энэ нь бүх шүд, буйлыг сайтар цэвэрлэх хангалттай хугацаа юм.",
    questions: [],
  },
];
