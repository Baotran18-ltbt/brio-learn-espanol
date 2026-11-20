import type { CEFRLevel, Lesson, Unit } from "@/lib/types";
import { vocabForLesson } from "./vocabulary";

const ids = (lessonId: string) => vocabForLesson(lessonId).map((v) => v.id);

/* =====================================================================
 * A1 · UNIT 1 — Saludos y presentaciones (Chào hỏi & giới thiệu)
 * ===================================================================== */

const L1: Lesson = {
  id: "a1-u1-l1",
  unitId: "a1-u1",
  level: "A1",
  order: 1,
  title: "¡Hola! Saludos",
  titleVi: "Chào hỏi theo thời gian trong ngày",
  kind: "lesson",
  minutes: 10,
  xp: 30,
  objectives: [
    "Chào hỏi đúng lúc: buổi sáng, chiều, tối",
    "Hỏi thăm ngắn với ¿qué tal? và trả lời",
    "Chào tạm biệt theo nhiều cách",
    "Hiểu vì sao tiếng Tây Ban Nha có dấu ¡ và ¿ ở đầu câu",
  ],
  vocabIds: ids("a1-u1-l1"),
  grammar: [
    {
      id: "g-greetings-time",
      title: "Chào theo thời gian trong ngày",
      body: [
        "Người Tây Ban Nha chọn lời chào theo buổi. Buenos días dùng từ sáng đến khoảng 12 giờ trưa. Buenas tardes dùng từ trưa cho đến khi trời tối. Buenas noches dùng khi trời đã tối, vừa để chào vừa để chúc ngủ ngon.",
        "Vì sao lúc là buenos, lúc là buenas? Día (ngày) là danh từ giống đực nên đi với buenos. Tarde (buổi chiều) và noche (buổi tối) là giống cái nên đi với buenas. Cả ba đều để ở số nhiều.",
        "Hola dùng được mọi lúc, và hay đi kèm một lời chào theo buổi: ¡Hola, buenos días!",
      ],
      table: {
        headers: ["Lời chào", "Khi nào", "Nghĩa"],
        rows: [
          ["buenos días", "sáng → trưa", "chào buổi sáng"],
          ["buenas tardes", "trưa → khi trời tối", "chào buổi chiều"],
          ["buenas noches", "buổi tối, trước khi ngủ", "chào buổi tối, chúc ngủ ngon"],
          ["hola", "mọi lúc, thân mật", "xin chào"],
        ],
      },
      examples: [
        { es: "¡Hola, buenos días!", vi: "Xin chào, chào buổi sáng!" },
        { es: "Buenas tardes, señora García.", vi: "Chào buổi chiều, bà García." },
      ],
      tip: "Ở Tây Ban Nha người ta ăn trưa khoảng 14–15 giờ, nên buenos días thường kéo dài tới lúc ăn trưa.",
    },
    {
      id: "g-inverted-marks",
      title: "Dấu ¡ và ¿ mở đầu câu",
      body: [
        "Tiếng Tây Ban Nha đặt thêm một dấu chấm than hoặc dấu hỏi lộn ngược ở đầu câu, để người đọc biết ngay từ đầu đây là câu cảm thán hay câu hỏi.",
        "Dấu mở đặt đúng chỗ câu hỏi bắt đầu, có thể ở giữa câu: Hola, Pablo, ¿qué tal?",
      ],
      examples: [
        { es: "¡Hola!", vi: "Xin chào!" },
        { es: "¿Qué tal?", vi: "Dạo này thế nào?" },
      ],
      tip: "Trên bàn phím điện thoại, giữ lâu phím ! hoặc ? để chọn ¡ và ¿.",
    },
  ],
  dialogue: {
    title: "Gặp nhau ở quán cà phê",
    lines: [
      { speaker: "Ana", es: "¡Hola, Pablo! Buenos días.", vi: "Chào Pablo! Chào buổi sáng." },
      { speaker: "Pablo", es: "Buenos días, Ana. ¿Qué tal?", vi: "Chào buổi sáng, Ana. Dạo này thế nào?" },
      { speaker: "Ana", es: "Muy bien, gracias. ¿Y tú?", vi: "Rất tốt, cảm ơn. Còn bạn?" },
      { speaker: "Pablo", es: "Más o menos. Bueno, hasta luego.", vi: "Tàm tạm. Thôi, hẹn gặp lại nhé." },
      { speaker: "Ana", es: "¡Adiós, Pablo!", vi: "Tạm biệt Pablo!" },
    ],
  },
  exercises: [
    {
      id: "l1-e1",
      type: "multiple-choice",
      prompt: "Bây giờ là 9 giờ sáng. Bạn chào cô giáo thế nào?",
      options: ["Buenos días", "Buenas tardes", "Buenas noches", "Adiós"],
      answer: "Buenos días",
      explanation: "Buenos días dùng từ sáng đến trưa. Buenas tardes dành cho buổi chiều, buenas noches cho buổi tối, còn adiós là tạm biệt.",
    },
    {
      id: "l1-e2",
      type: "listening",
      audio: "Buenas noches",
      prompt: "Bạn nghe thấy lời chào nào?",
      options: ["Chào buổi tối", "Chào buổi sáng", "Hẹn gặp lại", "Cảm ơn"],
      answer: "Chào buổi tối",
      explanation: "Câu bạn nghe là «Buenas noches»: chào buổi tối hoặc chúc ngủ ngon.",
    },
    {
      id: "l1-e3",
      type: "matching",
      pairs: [
        ["hola", "xin chào"],
        ["gracias", "cảm ơn"],
        ["adiós", "tạm biệt"],
        ["hasta mañana", "mai gặp lại"],
        ["más o menos", "tàm tạm"],
      ],
      explanation: "Ôn lại: hola = xin chào, gracias = cảm ơn, adiós = tạm biệt, hasta mañana = mai gặp lại, más o menos = tàm tạm.",
    },
    {
      id: "l1-e4",
      type: "fill-blank",
      sentence: "Buenas ___, señor López.",
      translation: "Chào buổi chiều, ông López.",
      options: ["tardes", "días", "noche", "luego"],
      answer: "tardes",
      explanation: "Buổi chiều là «tardes». Lời chào luôn ở số nhiều nên «noche» (số ít) không đúng, và «días» phải đi với buenos.",
    },
    {
      id: "l1-e5",
      type: "translate",
      direction: "es-vi",
      source: "Hola, ¿qué tal?",
      tiles: ["Xin chào,", "dạo này", "thế nào?", "tạm biệt", "cảm ơn"],
      accepted: ["Xin chào, dạo này thế nào?"],
      explanation: "«Hola» là xin chào, «¿qué tal?» là dạo này thế nào.",
    },
    {
      id: "l1-e6",
      type: "sentence-order",
      words: ["Bien,", "gracias,", "¿y", "tú?"],
      translation: "Mình ổn, cảm ơn, còn bạn?",
      explanation: "Trả lời trước (Bien, gracias), rồi hỏi lại bằng «¿y tú?».",
    },
    {
      id: "l1-e7",
      type: "multiple-choice",
      prompt: "Bạn bè hỏi «¿Qué tal?». Câu nào KHÔNG phải là câu trả lời?",
      options: ["Buenas noches", "Muy bien", "Más o menos", "Bien, gracias"],
      answer: "Buenas noches",
      explanation: "«Buenas noches» là lời chào, không trả lời câu hỏi thăm. Ba câu còn lại đều là cách nói mình đang thế nào.",
    },
    {
      id: "l1-e8",
      type: "translate",
      direction: "vi-es",
      source: "Mai gặp lại nhé!",
      accepted: ["Hasta mañana", "¡Hasta mañana!"],
      explanation: "«Mai gặp lại» là «hasta mañana». Nhớ chữ ñ trong mañana.",
    },
    {
      id: "l1-e9",
      type: "speaking",
      phrase: "Buenos días, ¿qué tal?",
      translation: "Chào buổi sáng, dạo này thế nào?",
      explanation: "Đọc chậm từng cụm: buê-nôx đí-ax, kê tal.",
    },
  ],
  summary: [
    "buenos días / buenas tardes / buenas noches theo buổi trong ngày",
    "¿Qué tal? → Bien / Muy bien / Más o menos",
    "Tạm biệt: adiós, hasta luego, hasta mañana",
    "Câu hỏi và câu cảm thán mở đầu bằng ¿ và ¡",
  ],
};

const L2: Lesson = {
  id: "a1-u1-l2",
  unitId: "a1-u1",
  level: "A1",
  order: 2,
  title: "Me llamo…",
  titleVi: "Giới thiệu tên và hỏi tên",
  kind: "lesson",
  minutes: 12,
  xp: 30,
  objectives: [
    "Giới thiệu tên với me llamo và soy",
    "Hỏi tên người khác, thân mật và lịch sự",
    "Đáp lời làm quen: mucho gusto, encantado/a, igualmente",
  ],
  vocabIds: ids("a1-u1-l2"),
  grammar: [
    {
      id: "g-llamarse",
      title: "Động từ llamarse: tên là",
      body: [
        "Llamarse nghĩa đen là “tự gọi mình là”. Phần me, te, se cho biết đang nói về ai, và luôn đứng trước động từ.",
        "Với người mới học, chỉ cần nhớ ba dạng hay dùng nhất dưới đây.",
      ],
      table: {
        headers: ["Ai", "Dạng", "Nghĩa"],
        rows: [
          ["yo", "me llamo", "tôi tên là"],
          ["tú", "te llamas", "bạn tên là"],
          ["él / ella / usted", "se llama", "anh ấy / cô ấy / ông bà tên là"],
        ],
      },
      examples: [
        { es: "Me llamo Linh.", vi: "Tôi tên là Linh." },
        { es: "Él se llama Javier.", vi: "Anh ấy tên là Javier." },
      ],
      tip: "Soy Linh và Mi nombre es Linh cũng đúng. Me llamo Linh là cách tự nhiên nhất.",
    },
    {
      id: "g-ask-name",
      title: "Hỏi tên: thân mật hay lịch sự",
      body: [
        "¿Cómo te llamas? dùng với bạn bè, người cùng tuổi, trẻ hơn.",
        "¿Cómo se llama usted? dùng với người lớn tuổi, khách hàng, người mới gặp trong công việc.",
      ],
      examples: [
        { es: "Hola, ¿cómo te llamas?", vi: "Chào bạn, bạn tên gì?" },
        { es: "Buenos días, ¿cómo se llama usted?", vi: "Chào ông, ông tên là gì ạ?" },
      ],
    },
    {
      id: "g-encantado",
      title: "Encantado hay encantada?",
      body: [
        "Chọn theo giới tính của người nói: nam nói encantado, nữ nói encantada. Mucho gusto thì ai nói cũng được.",
        "Khi người kia nói mucho gusto, bạn có thể đáp igualmente (tôi cũng vậy).",
      ],
      examples: [
        { es: "—Mucho gusto. —Encantada.", vi: "—Rất vui được gặp. —Hân hạnh (nữ nói)." },
        { es: "—Mucho gusto. —Igualmente.", vi: "—Rất vui được gặp. —Tôi cũng vậy." },
      ],
    },
  ],
  dialogue: {
    title: "Ngày đầu ở lớp tiếng",
    lines: [
      { speaker: "Laura", es: "Hola, me llamo Laura. ¿Cómo te llamas?", vi: "Chào bạn, mình tên Laura. Bạn tên gì?" },
      { speaker: "Minh", es: "Me llamo Minh. Mucho gusto.", vi: "Mình tên Minh. Rất vui được gặp bạn." },
      { speaker: "Laura", es: "Encantada, Minh.", vi: "Hân hạnh, Minh." },
      { speaker: "Profesor", es: "Buenos días. Yo soy el profesor Ruiz.", vi: "Chào buổi sáng. Tôi là thầy Ruiz." },
      { speaker: "Minh", es: "Mucho gusto, profesor.", vi: "Rất vui được gặp thầy." },
      { speaker: "Profesor", es: "Igualmente.", vi: "Tôi cũng vậy." },
    ],
  },
  exercises: [
    {
      id: "l2-e1",
      type: "multiple-choice",
      prompt: "Bạn muốn hỏi tên một bạn cùng lớp. Câu nào phù hợp nhất?",
      options: ["¿Cómo te llamas?", "¿Cómo se llama usted?", "¿Qué tal?", "¿Y usted?"],
      answer: "¿Cómo te llamas?",
      explanation: "Với bạn bè dùng dạng thân mật «¿Cómo te llamas?». «¿Cómo se llama usted?» dành cho người cần lịch sự.",
    },
    {
      id: "l2-e2",
      type: "fill-blank",
      sentence: "Hola, ___ llamo Andrea.",
      translation: "Chào, tôi tên là Andrea.",
      options: ["me", "te", "se", "yo"],
      answer: "me",
      explanation: "Nói về chính mình dùng «me llamo». «te» là bạn, «se» là anh ấy/cô ấy.",
    },
    {
      id: "l2-e3",
      type: "fill-blank",
      sentence: "Ella ___ llama Rosa.",
      translation: "Cô ấy tên là Rosa.",
      options: ["se", "me", "te", "es"],
      answer: "se",
      explanation: "Với él, ella, usted dùng «se llama».",
    },
    {
      id: "l2-e4",
      type: "multiple-choice",
      prompt: "Lan (nữ) đáp lại khi được giới thiệu. Lan nên nói:",
      options: ["Encantada", "Encantado", "Encantados", "Hasta mañana"],
      answer: "Encantada",
      explanation: "Người nói là nữ nên dùng «encantada». «Encantado» là nam nói, «encantados» là số nhiều.",
    },
    {
      id: "l2-e5",
      type: "listening",
      audio: "¿Cómo se llama usted?",
      prompt: "Câu này hỏi gì, và dùng với ai?",
      options: ["Hỏi tên, cách lịch sự", "Hỏi tên, cách thân mật", "Hỏi quê quán", "Hỏi thăm sức khỏe"],
      answer: "Hỏi tên, cách lịch sự",
      explanation: "«¿Cómo se llama usted?» là hỏi tên một cách lịch sự, nhờ có «usted».",
    },
    {
      id: "l2-e6",
      type: "sentence-order",
      words: ["Me", "llamo", "Carlos,", "¿y", "tú?"],
      translation: "Tôi tên là Carlos, còn bạn?",
      explanation: "«Me llamo» + tên, rồi hỏi lại bằng «¿y tú?».",
    },
    {
      id: "l2-e7",
      type: "matching",
      pairs: [
        ["el nombre", "tên"],
        ["el apellido", "họ"],
        ["igualmente", "tôi cũng vậy"],
        ["mucho gusto", "rất vui được gặp"],
        ["soy", "tôi là"],
      ],
      explanation: "nombre là tên, apellido là họ. Igualmente dùng để đáp lại mucho gusto.",
    },
    {
      id: "l2-e8",
      type: "translate",
      direction: "vi-es",
      source: "Tôi tên là Linh.",
      accepted: ["Me llamo Linh", "Soy Linh", "Mi nombre es Linh", "Yo me llamo Linh"],
      explanation: "Cách tự nhiên nhất: «Me llamo Linh.» Cũng có thể nói «Soy Linh».",
    },
    {
      id: "l2-e9",
      type: "translate",
      direction: "es-vi",
      source: "Mucho gusto, me llamo Diego.",
      tiles: ["Rất vui được gặp,", "tôi tên là", "Diego.", "bạn tên là", "tạm biệt"],
      accepted: ["Rất vui được gặp, tôi tên là Diego."],
      explanation: "«Mucho gusto» là rất vui được gặp, «me llamo» là tôi tên là.",
    },
    {
      id: "l2-e10",
      type: "speaking",
      phrase: "Hola, me llamo Ana. Mucho gusto.",
      translation: "Chào bạn, mình tên Ana. Rất vui được gặp.",
      explanation: "Chữ ll trong llamo đọc gần như “gi”: mê gia-mô.",
    },
  ],
  summary: [
    "Me llamo… / Soy… để giới thiệu tên",
    "¿Cómo te llamas? (thân mật) · ¿Cómo se llama usted? (lịch sự)",
    "Mucho gusto · Encantado (nam) / Encantada (nữ) · Igualmente",
  ],
};

const L3: Lesson = {
  id: "a1-u1-l3",
  unitId: "a1-u1",
  level: "A1",
  order: 3,
  title: "Yo, tú, usted…",
  titleVi: "Đại từ nhân xưng",
  kind: "lesson",
  minutes: 12,
  xp: 30,
  objectives: [
    "Nắm 6 ngôi của đại từ nhân xưng",
    "Chọn đúng tú hay usted theo tình huống",
    "Biết khi nào dùng giống đực, giống cái ở số nhiều",
    "Hiểu vì sao người Tây Ban Nha hay bỏ đại từ",
  ],
  vocabIds: ids("a1-u1-l3"),
  grammar: [
    {
      id: "g-pronouns",
      title: "Bảng đại từ nhân xưng",
      body: [
        "Tiếng Việt có rất nhiều cách xưng hô, còn tiếng Tây Ban Nha gói gọn trong một bảng cố định. Mỗi đại từ sẽ đi với một dạng động từ riêng mà bạn học ở bài sau.",
      ],
      table: {
        headers: ["Ngôi", "Số ít", "Số nhiều"],
        rows: [
          ["1 · người nói", "yo (tôi)", "nosotros / nosotras (chúng tôi)"],
          ["2 · thân mật", "tú (bạn)", "vosotros / vosotras (các bạn, chỉ ở Tây Ban Nha)"],
          ["3 · người được nói tới", "él (anh ấy) / ella (cô ấy)", "ellos / ellas (họ)"],
          ["Lịch sự", "usted (ông, bà)", "ustedes (quý vị, các bạn)"],
        ],
      },
      examples: [
        { es: "Ellos son de Perú.", vi: "Họ đến từ Peru." },
        { es: "Nosotras somos hermanas.", vi: "Chúng tôi là chị em gái." },
      ],
      tip: "Nhóm có ít nhất một nam thì dùng dạng giống đực: nosotros, vosotros, ellos. Chỉ toàn nữ mới dùng nosotras, vosotras, ellas.",
    },
    {
      id: "g-tu-usted",
      title: "Tú hay usted?",
      body: [
        "Tú dùng với bạn bè, gia đình, người trẻ. Usted dùng để giữ khoảng cách lịch sự: người lớn tuổi, cấp trên, khách hàng.",
        "Usted tuy nghĩa là “bạn/ông/bà” nhưng động từ chia giống él và ella. Ở số nhiều, Mỹ Latin dùng ustedes cho cả thân mật lẫn lịch sự, còn Tây Ban Nha dùng vosotros khi thân mật.",
      ],
      examples: [
        { es: "¿Tú eres Pedro?", vi: "Bạn là Pedro à?" },
        { es: "¿Usted es la señora Ruiz?", vi: "Bà có phải là bà Ruiz không ạ?" },
      ],
    },
    {
      id: "g-pro-drop",
      title: "Thường bỏ đại từ",
      body: [
        "Đuôi động từ đã cho biết ai đang làm, nên người bản xứ hay bỏ đại từ: Soy estudiante thay vì Yo soy estudiante.",
        "Giữ đại từ khi muốn nhấn mạnh hoặc so sánh: Yo soy de Vietnam, y ella es de Chile.",
      ],
      examples: [
        { es: "Soy estudiante.", vi: "Tôi là sinh viên." },
        { es: "Yo también.", vi: "Tôi cũng vậy." },
      ],
    },
  ],
  exercises: [
    {
      id: "l3-e1",
      type: "matching",
      pairs: [
        ["yo", "tôi"],
        ["tú", "bạn (thân mật)"],
        ["él", "anh ấy"],
        ["ella", "cô ấy"],
        ["nosotros", "chúng tôi"],
      ],
      explanation: "Năm đại từ cơ bản nhất. Chú ý «él» có dấu khi nghĩa là anh ấy.",
    },
    {
      id: "l3-e2",
      type: "multiple-choice",
      prompt: "Lần đầu gặp giám đốc công ty đối tác, bạn xưng hô với ông ấy bằng:",
      options: ["usted", "tú", "vosotros", "ellos"],
      answer: "usted",
      explanation: "Tình huống trang trọng, người mới gặp nên dùng «usted».",
    },
    {
      id: "l3-e3",
      type: "multiple-choice",
      prompt: "Ana và Rosa (đều là nữ). «Họ» là:",
      options: ["ellas", "ellos", "nosotras", "ustedes"],
      answer: "ellas",
      explanation: "Nhóm toàn nữ nên dùng «ellas».",
    },
    {
      id: "l3-e4",
      type: "multiple-choice",
      prompt: "Nhóm gồm ba nữ và một nam. «Họ» là:",
      options: ["ellos", "ellas", "vosotras", "usted"],
      answer: "ellos",
      explanation: "Chỉ cần có một nam trong nhóm là dùng dạng giống đực «ellos».",
    },
    {
      id: "l3-e5",
      type: "fill-blank",
      sentence: "___ se llama Javier.",
      translation: "Anh ấy tên là Javier.",
      options: ["Él", "Ella", "Yo", "Tú"],
      answer: "Él",
      explanation: "«Anh ấy» là «él». «Yo» và «tú» không đi với «se llama».",
    },
    {
      id: "l3-e6",
      type: "listening",
      audio: "nosotras",
      prompt: "Bạn nghe thấy đại từ nào?",
      options: ["chúng tôi (toàn nữ)", "các bạn", "họ (toàn nữ)", "cô ấy"],
      answer: "chúng tôi (toàn nữ)",
      explanation: "«Nosotras» là chúng tôi khi cả nhóm đều là nữ.",
    },
    {
      id: "l3-e7",
      type: "translate",
      direction: "es-vi",
      source: "Ella se llama Carmen.",
      tiles: ["Cô ấy", "Anh ấy", "tên là", "Carmen.", "đến từ"],
      accepted: ["Cô ấy tên là Carmen."],
      explanation: "«Ella» là cô ấy, «se llama» là tên là.",
    },
    {
      id: "l3-e8",
      type: "multiple-choice",
      prompt: "Ở Mexico, bạn nói «các bạn» với hai người bạn thân bằng:",
      options: ["ustedes", "vosotros", "ellos", "tú"],
      answer: "ustedes",
      explanation: "Mỹ Latin không dùng «vosotros». «Ustedes» dùng cho cả thân mật lẫn lịch sự.",
    },
    {
      id: "l3-e9",
      type: "speaking",
      phrase: "Yo soy estudiante. Ella es profesora.",
      translation: "Tôi là sinh viên. Cô ấy là giáo viên.",
      explanation: "Chữ ll trong ella đọc gần như “gi”: ê-gia.",
    },
  ],
  summary: [
    "yo · tú · él / ella / usted · nosotros/as · vosotros/as · ellos / ellas / ustedes",
    "tú thân mật, usted lịch sự (chia động từ như él, ella)",
    "Nhóm có nam dùng giống đực",
    "Thường bỏ đại từ, giữ lại khi muốn nhấn mạnh",
  ],
};

const L4: Lesson = {
  id: "a1-u1-l4",
  unitId: "a1-u1",
  level: "A1",
  order: 4,
  title: "Soy de Vietnam",
  titleVi: "Động từ ser: quê quán, quốc tịch, nghề nghiệp",
  kind: "lesson",
  minutes: 14,
  xp: 30,
  objectives: [
    "Chia động từ ser ở thì hiện tại",
    "Nói mình đến từ đâu: soy de…",
    "Nói quốc tịch và nghề nghiệp, đổi đúng giống",
  ],
  vocabIds: ids("a1-u1-l4"),
  grammar: [
    {
      id: "g-ser",
      title: "Chia động từ ser (là)",
      body: [
        "Ser là động từ bất quy tắc, mỗi ngôi một dạng riêng, nên cần học thuộc. Đây là một trong những động từ dùng nhiều nhất.",
        "Ser dùng cho những điều mang tính lâu dài: tên, quê quán, quốc tịch, nghề nghiệp, tính cách.",
      ],
      table: {
        headers: ["Đại từ", "ser", "Ví dụ"],
        rows: [
          ["yo", "soy", "Soy Lan."],
          ["tú", "eres", "¿Eres Pedro?"],
          ["él / ella / usted", "es", "Ella es profesora."],
          ["nosotros / nosotras", "somos", "Somos amigos."],
          ["vosotros / vosotras", "sois", "¿Sois de Madrid?"],
          ["ellos / ellas / ustedes", "son", "Son de Perú."],
        ],
      },
      examples: [
        { es: "Soy vietnamita.", vi: "Tôi là người Việt Nam." },
        { es: "Nosotros somos estudiantes.", vi: "Chúng tôi là sinh viên." },
      ],
    },
    {
      id: "g-ser-de",
      title: "Ser + de + nơi chốn",
      body: [
        "Muốn nói mình đến từ đâu, dùng ser + de + tên nơi: Soy de Vietnam. Câu hỏi tương ứng là ¿De dónde eres? (thân mật) hoặc ¿De dónde es usted? (lịch sự).",
      ],
      examples: [
        { es: "—¿De dónde eres? —Soy de Hanói.", vi: "—Bạn đến từ đâu? —Mình đến từ Hà Nội." },
        { es: "¿De dónde es usted?", vi: "Ông đến từ đâu ạ?" },
      ],
    },
    {
      id: "g-gender-nationality",
      title: "Quốc tịch và nghề nghiệp đổi theo giống",
      body: [
        "Từ tận cùng bằng -o đổi sang -a cho nữ: mexicano → mexicana. Từ tận cùng bằng phụ âm thì thêm -a: español → española, profesor → profesora.",
        "Từ tận cùng bằng -a hoặc -e giữ nguyên cho cả hai giới: vietnamita, estudiante.",
        "Khi nói nghề nghiệp, không dùng un/una: Soy profesora, không nói Soy una profesora.",
      ],
      table: {
        headers: ["Nam", "Nữ", "Quy tắc"],
        rows: [
          ["mexicano", "mexicana", "-o → -a"],
          ["español", "española", "phụ âm + a"],
          ["profesor", "profesora", "phụ âm + a"],
          ["vietnamita", "vietnamita", "giữ nguyên"],
          ["estudiante", "estudiante", "giữ nguyên"],
        ],
      },
      examples: [
        { es: "Elena es española.", vi: "Elena là người Tây Ban Nha." },
        { es: "Soy estudiante de español.", vi: "Tôi là học viên tiếng Tây Ban Nha." },
      ],
      tip: "Tên quốc tịch và ngôn ngữ trong tiếng Tây Ban Nha viết thường: español, vietnamita.",
    },
  ],
  dialogue: {
    title: "Ở buổi giao lưu ngôn ngữ",
    lines: [
      { speaker: "Marco", es: "Hola, soy Marco. ¿De dónde eres?", vi: "Chào, mình là Marco. Bạn đến từ đâu?" },
      { speaker: "Lan", es: "Soy de Vietnam. Soy vietnamita. ¿Y tú?", vi: "Mình đến từ Việt Nam. Mình là người Việt. Còn bạn?" },
      { speaker: "Marco", es: "Soy de México. Soy profesor de música.", vi: "Mình đến từ Mexico. Mình là giáo viên âm nhạc." },
      { speaker: "Lan", es: "¡Qué bien! Yo soy estudiante.", vi: "Hay quá! Mình là sinh viên." },
    ],
  },
  exercises: [
    {
      id: "l4-e1",
      type: "fill-blank",
      sentence: "Yo ___ de Vietnam.",
      translation: "Tôi đến từ Việt Nam.",
      options: ["soy", "eres", "es", "somos"],
      answer: "soy",
      explanation: "Với «yo», ser chia là «soy».",
    },
    {
      id: "l4-e2",
      type: "fill-blank",
      sentence: "¿De dónde ___ tú?",
      translation: "Bạn đến từ đâu?",
      options: ["eres", "soy", "es", "son"],
      answer: "eres",
      explanation: "Với «tú», ser chia là «eres».",
    },
    {
      id: "l4-e3",
      type: "fill-blank",
      sentence: "Nosotros ___ estudiantes.",
      translation: "Chúng tôi là sinh viên.",
      options: ["somos", "sois", "son", "es"],
      answer: "somos",
      explanation: "Với «nosotros», ser chia là «somos». «Sois» đi với vosotros, «son» đi với ellos.",
    },
    {
      id: "l4-e4",
      type: "multiple-choice",
      prompt: "Elena là người Tây Ban Nha. Câu nào đúng?",
      options: ["Elena es española.", "Elena es español.", "Elena soy española.", "Elena eres española."],
      answer: "Elena es española.",
      explanation: "Elena là nữ nên dùng «española», và ngôi thứ ba chia là «es».",
    },
    {
      id: "l4-e5",
      type: "multiple-choice",
      prompt: "Câu nào nói nghề nghiệp đúng nhất?",
      options: ["Soy profesora.", "Soy una profesora.", "Estoy profesora.", "Es profesora yo."],
      answer: "Soy profesora.",
      explanation: "Nói nghề nghiệp dùng ser và không cần «una»: «Soy profesora.»",
    },
    {
      id: "l4-e6",
      type: "matching",
      pairs: [
        ["soy", "tôi là"],
        ["eres", "bạn là"],
        ["es", "anh ấy / cô ấy là"],
        ["somos", "chúng tôi là"],
        ["son", "họ là"],
      ],
      explanation: "Các dạng của ser: soy, eres, es, somos, sois, son.",
    },
    {
      id: "l4-e7",
      type: "sentence-order",
      words: ["Soy", "de", "Vietnam,", "¿y", "tú?"],
      translation: "Tôi đến từ Việt Nam, còn bạn?",
      explanation: "«Soy de» + nơi chốn, rồi hỏi lại «¿y tú?».",
    },
    {
      id: "l4-e8",
      type: "listening",
      audio: "Ella es mexicana.",
      prompt: "Bạn nghe được thông tin gì?",
      options: ["Cô ấy là người Mexico", "Anh ấy là người Mexico", "Cô ấy là người Tây Ban Nha", "Cô ấy đang ở Mexico"],
      answer: "Cô ấy là người Mexico",
      explanation: "«Ella» là cô ấy, «mexicana» là người Mexico (nữ).",
    },
    {
      id: "l4-e9",
      type: "translate",
      direction: "vi-es",
      source: "Tôi là người Việt Nam.",
      accepted: ["Soy vietnamita", "Yo soy vietnamita"],
      explanation: "«Người Việt Nam» là «vietnamita», dùng chung cho cả nam và nữ.",
    },
    {
      id: "l4-e10",
      type: "speaking",
      phrase: "Soy de Vietnam. Soy vietnamita.",
      translation: "Tôi đến từ Việt Nam. Tôi là người Việt Nam.",
      explanation: "Chữ v trong Vietnam đọc gần như “b”: biết-nam.",
    },
  ],
  summary: [
    "ser: soy, eres, es, somos, sois, son",
    "¿De dónde eres? → Soy de…",
    "-o → -a, phụ âm + a; -a, -e giữ nguyên",
    "Nghề nghiệp không cần un/una",
  ],
};

const L5: Lesson = {
  id: "a1-u1-l5",
  unitId: "a1-u1",
  level: "A1",
  order: 5,
  title: "Una conversación",
  titleVi: "Ghép thành một cuộc hội thoại",
  kind: "lesson",
  minutes: 14,
  xp: 30,
  objectives: [
    "Đi trọn một cuộc hội thoại làm quen từ đầu đến cuối",
    "Hỏi thăm với ¿cómo estás? và trả lời",
    "Dùng các câu lịch sự: por favor, de nada, perdón, lo siento",
    "Nói câu phủ định với no",
  ],
  vocabIds: ids("a1-u1-l5"),
  grammar: [
    {
      id: "g-conversation-frame",
      title: "Khung một cuộc làm quen",
      body: [
        "Hầu hết các cuộc làm quen đều đi qua bốn bước. Thuộc khung này, bạn có thể tự tin nói chuyện vài phút với người mới gặp.",
      ],
      table: {
        headers: ["Bước", "Hỏi", "Đáp"],
        rows: [
          ["1. Chào", "¡Hola! Buenas tardes.", "¡Hola! Buenas tardes."],
          ["2. Hỏi thăm", "¿Qué tal? / ¿Cómo estás?", "Muy bien, gracias. ¿Y tú?"],
          ["3. Giới thiệu", "¿Cómo te llamas? ¿De dónde eres?", "Me llamo… Soy de…"],
          ["4. Chào tạm biệt", "Hasta luego.", "Nos vemos. / Adiós."],
        ],
      },
      examples: [{ es: "Muy bien, gracias, ¿y tú?", vi: "Rất khỏe, cảm ơn, còn bạn?" }],
    },
    {
      id: "g-estar-intro",
      title: "¿Cómo estás? dùng estar",
      body: [
        "Hỏi thăm sức khỏe, tâm trạng dùng động từ estar chứ không phải ser, vì đó là trạng thái lúc này: ¿Cómo estás? → Estoy bien.",
        "Ở bài này bạn chỉ cần dùng được hai câu trên. Cách chia estar và khi nào chọn ser hay estar sẽ học ở Unit 2.",
      ],
      examples: [
        { es: "¿Cómo estás?", vi: "Bạn khỏe không?" },
        { es: "Estoy bien, gracias.", vi: "Tôi khỏe, cảm ơn." },
      ],
    },
    {
      id: "g-negation",
      title: "Câu phủ định với no",
      body: [
        "Đặt no ngay trước động từ: Soy de México → No soy de México.",
        "Khi trả lời câu hỏi có/không, người ta hay nói no hai lần: chữ đầu là “không”, chữ sau là phủ định cho động từ. No, no soy de México.",
      ],
      examples: [
        { es: "No, no soy de México.", vi: "Không, tôi không phải người Mexico." },
        { es: "No entiendo.", vi: "Tôi không hiểu." },
      ],
    },
  ],
  dialogue: {
    title: "Làm quen ở buổi giao lưu",
    lines: [
      { speaker: "Lucía", es: "¡Hola! Buenas tardes.", vi: "Chào bạn! Chào buổi chiều." },
      { speaker: "Minh", es: "Buenas tardes. ¿Qué tal?", vi: "Chào buổi chiều. Dạo này thế nào?" },
      { speaker: "Lucía", es: "Muy bien, gracias. ¿Cómo te llamas?", vi: "Rất tốt, cảm ơn. Bạn tên gì?" },
      { speaker: "Minh", es: "Me llamo Minh. ¿Y tú?", vi: "Mình tên Minh. Còn bạn?" },
      { speaker: "Lucía", es: "Soy Lucía. Mucho gusto.", vi: "Mình là Lucía. Rất vui được gặp bạn." },
      { speaker: "Minh", es: "Encantado. ¿De dónde eres?", vi: "Hân hạnh. Bạn đến từ đâu?" },
      { speaker: "Lucía", es: "Soy de Sevilla, en España. ¿Y tú?", vi: "Mình đến từ Sevilla, ở Tây Ban Nha. Còn bạn?" },
      { speaker: "Minh", es: "Soy de Vietnam, de Ho Chi Minh.", vi: "Mình đến từ Việt Nam, từ TP.HCM." },
      { speaker: "Lucía", es: "¡Qué bien! Bueno, hasta luego, Minh.", vi: "Hay quá! Thôi, hẹn gặp lại nhé Minh." },
      { speaker: "Minh", es: "Hasta luego. ¡Nos vemos!", vi: "Hẹn gặp lại. Gặp sau nhé!" },
    ],
  },
  exercises: [
    {
      id: "l5-e1",
      type: "sentence-order",
      words: ["Muy", "bien,", "gracias,", "¿y", "usted?"],
      translation: "Rất khỏe, cảm ơn, còn ông?",
      explanation: "Trả lời «Muy bien, gracias», rồi hỏi lại lịch sự «¿y usted?».",
    },
    {
      id: "l5-e2",
      type: "multiple-choice",
      prompt: "Bạn không hiểu người kia vừa nói gì. Bạn nói:",
      options: ["No entiendo.", "De nada.", "Igualmente.", "Nos vemos."],
      answer: "No entiendo.",
      explanation: "«No entiendo» là tôi không hiểu. Có thể nói thêm «Más despacio, por favor» (làm ơn nói chậm hơn).",
    },
    {
      id: "l5-e3",
      type: "multiple-choice",
      prompt: "Ai đó nói «Gracias» với bạn. Bạn đáp:",
      options: ["De nada.", "Por favor.", "Lo siento.", "Perdón."],
      answer: "De nada.",
      explanation: "Đáp lại lời cảm ơn bằng «de nada» (không có gì).",
    },
    {
      id: "l5-e4",
      type: "fill-blank",
      sentence: "No, no ___ de México.",
      translation: "Không, tôi không phải người Mexico.",
      options: ["soy", "estoy", "es", "llamo"],
      answer: "soy",
      explanation: "Quê quán dùng ser: «soy de…». «Estoy» là estar, dùng cho trạng thái.",
    },
    {
      id: "l5-e5",
      type: "listening",
      audio: "Lo siento, no entiendo.",
      prompt: "Người nói muốn nói gì?",
      options: ["Xin lỗi, tôi không hiểu", "Không có gì", "Rất vui được gặp", "Tôi khỏe, cảm ơn"],
      answer: "Xin lỗi, tôi không hiểu",
      explanation: "«Lo siento» là xin lỗi, «no entiendo» là tôi không hiểu.",
    },
    {
      id: "l5-e6",
      type: "matching",
      pairs: [
        ["por favor", "làm ơn"],
        ["de nada", "không có gì"],
        ["perdón", "xin lỗi, cho hỏi"],
        ["nos vemos", "gặp lại sau nhé"],
        ["sí", "vâng, có"],
      ],
      explanation: "Bộ câu lịch sự cơ bản: por favor, de nada, perdón. Nhớ «sí» có dấu khi nghĩa là vâng.",
    },
    {
      id: "l5-e7",
      type: "multiple-choice",
      prompt: "Trong đoạn hội thoại của bài, Lucía đến từ đâu?",
      options: ["Sevilla", "Madrid", "México", "Vietnam"],
      answer: "Sevilla",
      explanation: "Lucía nói: «Soy de Sevilla, en España.»",
    },
    {
      id: "l5-e8",
      type: "translate",
      direction: "es-vi",
      source: "¿Cómo estás?",
      tiles: ["Bạn", "khỏe", "không?", "tên", "là gì?"],
      accepted: ["Bạn khỏe không?"],
      explanation: "«¿Cómo estás?» là câu hỏi thăm: bạn khỏe không?",
    },
    {
      id: "l5-e9",
      type: "translate",
      direction: "vi-es",
      source: "Làm ơn nói chậm hơn.",
      accepted: ["Más despacio, por favor", "Por favor, más despacio"],
      explanation: "«Más despacio» là chậm hơn, «por favor» là làm ơn. Câu này rất hữu ích khi mới học!",
    },
    {
      id: "l5-e10",
      type: "speaking",
      phrase: "Hola, ¿cómo estás? Muy bien, gracias.",
      translation: "Chào, bạn khỏe không? Rất khỏe, cảm ơn.",
      explanation: "Nhấn vào âm có dấu: cÓ-mo es-TÁS.",
    },
  ],
  summary: [
    "Khung 4 bước: chào → hỏi thăm → giới thiệu → tạm biệt",
    "¿Cómo estás? → Estoy bien (estar cho trạng thái)",
    "por favor · gracias · de nada · perdón · lo siento",
    "Phủ định: no + động từ",
  ],
};

const ASSESSMENT: Lesson = {
  id: "a1-u1-test",
  unitId: "a1-u1",
  level: "A1",
  order: 6,
  title: "Evaluación · Unidad 1",
  titleVi: "Bài kiểm tra Unit 1",
  kind: "assessment",
  minutes: 10,
  xp: 50,
  passRate: 0.7,
  objectives: [
    "Kiểm tra lại toàn bộ Unit 1: chào hỏi, giới thiệu, đại từ, ser, hội thoại",
    "Đạt từ 70% số câu đúng để hoàn thành Unit 1",
  ],
  vocabIds: [],
  grammar: [],
  exercises: [
    {
      id: "t-e1",
      type: "multiple-choice",
      prompt: "15 giờ chiều, bạn gặp hàng xóm. Bạn chào:",
      options: ["Buenas tardes", "Buenos días", "Buenas noches", "Hasta luego"],
      answer: "Buenas tardes",
      explanation: "Buổi chiều dùng «buenas tardes».",
    },
    {
      id: "t-e2",
      type: "fill-blank",
      sentence: "¿Cómo ___ llamas?",
      translation: "Bạn tên là gì?",
      options: ["te", "me", "se", "tú"],
      answer: "te",
      explanation: "Hỏi «bạn» dùng «te llamas».",
    },
    {
      id: "t-e3",
      type: "fill-blank",
      sentence: "Ellos ___ de Colombia.",
      translation: "Họ đến từ Colombia.",
      options: ["son", "somos", "es", "sois"],
      answer: "son",
      explanation: "Với «ellos», ser chia là «son».",
    },
    {
      id: "t-e4",
      type: "multiple-choice",
      prompt: "«Usted» chia động từ giống với đại từ nào?",
      options: ["él, ella", "tú", "yo", "nosotros"],
      answer: "él, ella",
      explanation: "Usted tuy là ngôi “bạn” lịch sự nhưng chia động từ như él, ella: usted es, usted se llama.",
    },
    {
      id: "t-e5",
      type: "listening",
      audio: "Mucho gusto, me llamo Pablo.",
      prompt: "Người nói tên là gì?",
      options: ["Pablo", "Paula", "Pedro", "Paco"],
      answer: "Pablo",
      explanation: "Câu bạn nghe: «Mucho gusto, me llamo Pablo.»",
    },
    {
      id: "t-e6",
      type: "sentence-order",
      words: ["Ella", "es", "profesora", "de", "español."],
      translation: "Cô ấy là giáo viên tiếng Tây Ban Nha.",
      explanation: "Chủ ngữ + ser + nghề nghiệp + de + môn học.",
    },
    {
      id: "t-e7",
      type: "matching",
      pairs: [
        ["buenas noches", "chào buổi tối"],
        ["¿de dónde eres?", "bạn đến từ đâu?"],
        ["encantada", "hân hạnh (nữ nói)"],
        ["ustedes", "các bạn, quý vị"],
        ["lo siento", "tôi rất tiếc"],
      ],
      explanation: "Ôn lại các cụm từ quan trọng của cả Unit 1.",
    },
    {
      id: "t-e8",
      type: "translate",
      direction: "vi-es",
      source: "Bạn đến từ đâu?",
      accepted: ["¿De dónde eres?", "¿De dónde es usted?", "¿Tú de dónde eres?"],
      explanation: "Thân mật: «¿De dónde eres?» Lịch sự: «¿De dónde es usted?»",
    },
    {
      id: "t-e9",
      type: "translate",
      direction: "es-vi",
      source: "Nosotros somos estudiantes.",
      tiles: ["Chúng tôi", "là", "sinh viên.", "giáo viên.", "Họ"],
      accepted: ["Chúng tôi là sinh viên."],
      explanation: "«Nosotros» là chúng tôi, «somos» là là, «estudiantes» là sinh viên.",
    },
    {
      id: "t-e10",
      type: "multiple-choice",
      prompt: "Câu nào viết đúng chính tả?",
      options: ["¿Cómo estás?", "¿Como estas?", "Cómo estás?", "¿Cómo estás."],
      answer: "¿Cómo estás?",
      explanation: "Cần đủ dấu hỏi mở ¿, dấu hỏi đóng ?, và dấu sắc trên «cómo», «estás».",
    },
    {
      id: "t-e11",
      type: "fill-blank",
      sentence: "—Mucho gusto. —___.",
      translation: "—Rất vui được gặp. —Tôi cũng vậy.",
      options: ["Igualmente", "De nada", "Por favor", "Adiós"],
      answer: "Igualmente",
      explanation: "Đáp lại «mucho gusto» bằng «igualmente».",
    },
    {
      id: "t-e12",
      type: "listening",
      audio: "Somos de Vietnam.",
      prompt: "Câu này nghĩa là gì?",
      options: ["Chúng tôi đến từ Việt Nam", "Họ đến từ Việt Nam", "Tôi đến từ Việt Nam", "Bạn đến từ Việt Nam"],
      answer: "Chúng tôi đến từ Việt Nam",
      explanation: "«Somos» là dạng của ser với nosotros: chúng tôi.",
    },
  ],
  summary: [
    "Hoàn thành bài kiểm tra là xong Unit 1",
    "Câu sai sẽ có giải thích để bạn xem lại",
  ],
};

/* =====================================================================
 * Cấu trúc CEFR. Chỉ A1 · Unit 1 đã có nội dung; phần còn lại là "upcoming".
 * ===================================================================== */

const upcoming = (level: CEFRLevel["code"], order: number, title: string, titleVi: string, topics: string[]): Unit => ({
  id: `${level.toLowerCase()}-u${order}`,
  level,
  order,
  title,
  titleVi,
  description: topics.join(" · "),
  status: "upcoming",
  lessons: [],
  plannedTopics: topics,
});

export const CURRICULUM: CEFRLevel[] = [
  {
    code: "A1",
    name: "Beginner",
    nameVi: "Nhập môn",
    description: "Chào hỏi, giới thiệu bản thân, nói về những điều quen thuộc hằng ngày bằng câu ngắn.",
    units: [
      {
        id: "a1-u1",
        level: "A1",
        order: 1,
        title: "Saludos y presentaciones",
        titleVi: "Chào hỏi & giới thiệu",
        description: "Chào theo buổi, giới thiệu tên, đại từ nhân xưng, động từ ser và một cuộc hội thoại hoàn chỉnh.",
        status: "available",
        lessons: [L1, L2, L3, L4, L5, ASSESSMENT],
      },
      upcoming("A1", 2, "La familia y los números", "Gia đình & số đếm", ["Thành viên gia đình", "Số 0–100", "Động từ tener", "Tuổi tác"]),
      upcoming("A1", 3, "Mi día", "Một ngày của tôi", ["Giờ giấc", "Động từ đuôi -ar", "Thói quen hằng ngày", "Ngày trong tuần"]),
      upcoming("A1", 4, "Comer y beber", "Ăn uống", ["Gọi món", "Đồ ăn, đồ uống", "Me gusta", "Giá tiền"]),
    ],
  },
  {
    code: "A2",
    name: "Elementary",
    nameVi: "Sơ cấp",
    description: "Kể chuyện đã xảy ra, đi lại, mua sắm, mô tả nơi ở.",
    units: [
      upcoming("A2", 1, "De viaje", "Đi du lịch", ["Thì quá khứ pretérito", "Khách sạn", "Hỏi đường"]),
      upcoming("A2", 2, "De compras", "Mua sắm", ["Quần áo, màu sắc", "So sánh", "Đại từ tân ngữ"]),
    ],
  },
  {
    code: "B1",
    name: "Intermediate",
    nameVi: "Trung cấp",
    description: "Trao đổi ý kiến, kể kinh nghiệm, xử lý tình huống thường gặp khi đi làm, đi du lịch.",
    units: [upcoming("B1", 1, "Experiencias", "Trải nghiệm", ["Pretérito perfecto", "Imperfecto", "Kể chuyện"])],
  },
  {
    code: "B2",
    name: "Upper Intermediate",
    nameVi: "Trung cao cấp",
    description: "Thảo luận chủ đề trừu tượng, tranh luận, đọc báo.",
    units: [upcoming("B2", 1, "Opiniones", "Quan điểm", ["Subjuntivo", "Lập luận", "Tin tức"])],
  },
  {
    code: "C1",
    name: "Advanced",
    nameVi: "Cao cấp",
    description: "Dùng ngôn ngữ linh hoạt trong học thuật và công việc.",
    units: [upcoming("C1", 1, "El mundo profesional", "Môi trường chuyên nghiệp", ["Thuyết trình", "Văn viết trang trọng"])],
  },
  {
    code: "C2",
    name: "Proficiency",
    nameVi: "Thành thạo",
    description: "Hiểu gần như mọi thứ nghe, đọc; diễn đạt tinh tế như người bản xứ.",
    units: [upcoming("C2", 1, "Matices", "Sắc thái ngôn ngữ", ["Thành ngữ", "Văn học", "Phương ngữ"])],
  },
];

export const ALL_UNITS: Unit[] = CURRICULUM.flatMap((l) => l.units);
export const AVAILABLE_LESSONS: Lesson[] = ALL_UNITS.filter((u) => u.status === "available").flatMap((u) => u.lessons);
export const LESSON_BY_ID: Record<string, Lesson> = Object.fromEntries(AVAILABLE_LESSONS.map((l) => [l.id, l]));

export function getLesson(id: string): Lesson | undefined {
  return LESSON_BY_ID[id];
}

export function getUnit(id: string): Unit | undefined {
  return ALL_UNITS.find((u) => u.id === id);
}

/** Một bài được mở khi bài trước đã hoàn thành (bài đầu luôn mở). */
export function isLessonUnlocked(lesson: Lesson, completed: Record<string, unknown>): boolean {
  const unit = getUnit(lesson.unitId);
  if (!unit) return false;
  const idx = unit.lessons.findIndex((l) => l.id === lesson.id);
  if (idx <= 0) return true;
  return Boolean(completed[unit.lessons[idx - 1].id]);
}
