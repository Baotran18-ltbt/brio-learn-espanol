import type { VocabItem } from "@/lib/types";

/**
 * Từ vựng A1 · Unit 1 — Saludos y presentaciones.
 * Mỗi mục có: từ/cụm từ, nghĩa tiếng Việt, câu ví dụ + bản dịch, gợi ý phát âm.
 */
type Row = Omit<VocabItem, "id" | "topic" | "lessonId">;

function group(lessonId: string, topic: string, prefix: string, rows: (Row & { key: string })[]): VocabItem[] {
  return rows.map(({ key, ...r }) => ({ id: `${prefix}-${key}`, topic, lessonId, ...r }));
}

const L1 = group("a1-u1-l1", "Chào hỏi", "a1u1", [
  { key: "hola", es: "hola", vi: "xin chào", kind: "thán từ", pron: "ô-la (chữ h câm)", example: { es: "¡Hola, Marta!", vi: "Chào Marta!" } },
  { key: "buenos-dias", es: "buenos días", vi: "chào buổi sáng", kind: "cụm từ", pron: "buê-nôx đí-ax", note: "Dùng từ sáng đến khoảng 12 giờ trưa.", example: { es: "¡Buenos días, profesora!", vi: "Chào buổi sáng cô giáo!" } },
  { key: "buenas-tardes", es: "buenas tardes", vi: "chào buổi chiều", kind: "cụm từ", pron: "buê-nax tác-đêx", note: "Từ trưa đến khi trời tối.", example: { es: "Buenas tardes, señor López.", vi: "Chào buổi chiều, ông López." } },
  { key: "buenas-noches", es: "buenas noches", vi: "chào buổi tối; chúc ngủ ngon", kind: "cụm từ", pron: "buê-nax nô-chêx", example: { es: "Buenas noches, hasta mañana.", vi: "Chúc ngủ ngon, mai gặp nhé." } },
  { key: "que-tal", es: "¿qué tal?", vi: "dạo này thế nào?", kind: "câu hỏi", pron: "kê tal", example: { es: "Hola, Pablo, ¿qué tal?", vi: "Chào Pablo, dạo này thế nào?" } },
  { key: "bien", es: "bien", vi: "khỏe, ổn", kind: "trạng từ", pron: "biên", example: { es: "Bien, gracias.", vi: "Mình ổn, cảm ơn." } },
  { key: "muy-bien", es: "muy bien", vi: "rất khỏe, rất tốt", kind: "cụm từ", pron: "mui biên", example: { es: "Muy bien, ¿y tú?", vi: "Rất tốt, còn bạn?" } },
  { key: "mas-o-menos", es: "más o menos", vi: "tàm tạm", kind: "cụm từ", pron: "max ô mê-nôx", example: { es: "Hoy estoy más o menos.", vi: "Hôm nay mình tàm tạm." } },
  { key: "gracias", es: "gracias", vi: "cảm ơn", kind: "thán từ", pron: "grá-thi-ax (Mỹ Latin: grá-xi-ax)", example: { es: "Muchas gracias, Ana.", vi: "Cảm ơn Ana nhiều." } },
  { key: "adios", es: "adiós", vi: "tạm biệt", kind: "thán từ", pron: "a-điốx", example: { es: "Adiós, hasta pronto.", vi: "Tạm biệt, sớm gặp lại nhé." } },
  { key: "hasta-luego", es: "hasta luego", vi: "hẹn gặp lại", kind: "cụm từ", pron: "ax-ta luê-gô", example: { es: "Hasta luego, chicos.", vi: "Hẹn gặp lại nhé các bạn." } },
  { key: "hasta-manana", es: "hasta mañana", vi: "mai gặp lại", kind: "cụm từ", pron: "ax-ta ma-nha-na", example: { es: "Hasta mañana, Lucía.", vi: "Mai gặp nhé, Lucía." } },
]);

const L2 = group("a1-u1-l2", "Giới thiệu bản thân", "a1u1", [
  { key: "me-llamo", es: "me llamo", vi: "tôi tên là", kind: "cụm động từ", pron: "mê gia-mô", example: { es: "Me llamo Linh.", vi: "Tôi tên là Linh." } },
  { key: "como-te-llamas", es: "¿cómo te llamas?", vi: "bạn tên là gì? (thân mật)", kind: "câu hỏi", pron: "cô-mô tê gia-max", example: { es: "Hola, ¿cómo te llamas?", vi: "Chào bạn, bạn tên gì?" } },
  { key: "como-se-llama-usted", es: "¿cómo se llama usted?", vi: "ông/bà tên là gì? (lịch sự)", kind: "câu hỏi", pron: "cô-mô xê gia-ma ux-tét", example: { es: "Perdón, ¿cómo se llama usted?", vi: "Xin lỗi, ông tên là gì ạ?" } },
  { key: "se-llama", es: "se llama", vi: "(anh ấy, cô ấy) tên là", kind: "cụm động từ", pron: "xê gia-ma", example: { es: "Mi amiga se llama Sofía.", vi: "Bạn tôi tên là Sofía." } },
  { key: "soy", es: "soy", vi: "tôi là", kind: "động từ ser", pron: "xoi", example: { es: "Soy Minh.", vi: "Tôi là Minh." } },
  { key: "mucho-gusto", es: "mucho gusto", vi: "rất vui được gặp", kind: "cụm từ", pron: "mu-chô gux-tô", example: { es: "Mucho gusto, Carlos.", vi: "Rất vui được gặp anh, Carlos." } },
  { key: "encantado", es: "encantado", vi: "hân hạnh (người nói là nam)", kind: "tính từ", pron: "en-can-ta-đô", example: { es: "Encantado, soy Diego.", vi: "Hân hạnh, tôi là Diego." } },
  { key: "encantada", es: "encantada", vi: "hân hạnh (người nói là nữ)", kind: "tính từ", pron: "en-can-ta-đa", example: { es: "Encantada, me llamo Laura.", vi: "Hân hạnh, tôi tên là Laura." } },
  { key: "igualmente", es: "igualmente", vi: "tôi cũng vậy (đáp lời chào)", kind: "trạng từ", pron: "i-gual-mên-tê", example: { es: "—Mucho gusto. —Igualmente.", vi: "—Rất vui được gặp. —Tôi cũng vậy." } },
  { key: "y-tu", es: "¿y tú?", vi: "còn bạn?", kind: "câu hỏi", pron: "i tu", example: { es: "Me llamo Ana, ¿y tú?", vi: "Mình tên Ana, còn bạn?" } },
  { key: "el-nombre", es: "el nombre", vi: "tên", kind: "danh từ giống đực", pron: "el nôm-brê", example: { es: "Mi nombre es Lan.", vi: "Tên tôi là Lan." } },
  { key: "el-apellido", es: "el apellido", vi: "họ", kind: "danh từ giống đực", pron: "el a-pê-gi-đô", example: { es: "Mi apellido es Nguyen.", vi: "Họ của tôi là Nguyễn." } },
]);

const L3 = group("a1-u1-l3", "Đại từ nhân xưng", "a1u1", [
  { key: "yo", es: "yo", vi: "tôi", kind: "đại từ", pron: "dô", example: { es: "Yo soy estudiante.", vi: "Tôi là sinh viên." } },
  { key: "tu", es: "tú", vi: "bạn (thân mật)", kind: "đại từ", pron: "tu", note: "Có dấu: tú = bạn; tu (không dấu) = của bạn.", example: { es: "¿Tú eres Pedro?", vi: "Bạn là Pedro à?" } },
  { key: "usted", es: "usted", vi: "ông, bà, anh, chị (lịch sự)", kind: "đại từ", pron: "ux-tét", example: { es: "¿Usted es la señora Ruiz?", vi: "Bà có phải là bà Ruiz không ạ?" } },
  { key: "el", es: "él", vi: "anh ấy, ông ấy", kind: "đại từ", pron: "el", note: "Có dấu: él = anh ấy; el (không dấu) là mạo từ.", example: { es: "Él se llama Javier.", vi: "Anh ấy tên là Javier." } },
  { key: "ella", es: "ella", vi: "cô ấy, bà ấy", kind: "đại từ", pron: "ê-gia", example: { es: "Ella se llama Carmen.", vi: "Cô ấy tên là Carmen." } },
  { key: "nosotros", es: "nosotros", vi: "chúng tôi, chúng ta (có nam)", kind: "đại từ", pron: "nô-xô-trôx", example: { es: "Nosotros somos amigos.", vi: "Chúng tôi là bạn." } },
  { key: "nosotras", es: "nosotras", vi: "chúng tôi (toàn nữ)", kind: "đại từ", pron: "nô-xô-trax", example: { es: "Nosotras somos hermanas.", vi: "Chúng tôi là chị em gái." } },
  { key: "vosotros", es: "vosotros", vi: "các bạn (thân mật, ở Tây Ban Nha)", kind: "đại từ", pron: "bô-xô-trôx", example: { es: "¿Vosotros sois de Madrid?", vi: "Các bạn là người Madrid à?" } },
  { key: "ustedes", es: "ustedes", vi: "các bạn; quý vị", kind: "đại từ", pron: "ux-tê-đêx", example: { es: "Ustedes son muy amables.", vi: "Các bạn thật tử tế." } },
  { key: "ellos", es: "ellos", vi: "họ (có nam)", kind: "đại từ", pron: "ê-giôx", example: { es: "Ellos son de Perú.", vi: "Họ đến từ Peru." } },
  { key: "ellas", es: "ellas", vi: "họ (toàn nữ)", kind: "đại từ", pron: "ê-giax", example: { es: "Ellas se llaman Ana y Rosa.", vi: "Họ tên là Ana và Rosa." } },
]);

const L4 = group("a1-u1-l4", "Ser, quê quán, nghề nghiệp", "a1u1", [
  { key: "ser", es: "ser", vi: "là (bản chất, quốc tịch, nghề)", kind: "động từ bất quy tắc", pron: "xer", example: { es: "Quiero ser profesora.", vi: "Tôi muốn trở thành giáo viên." } },
  { key: "soy-de", es: "soy de", vi: "tôi đến từ", kind: "cụm từ", pron: "xoi đê", example: { es: "Soy de Vietnam.", vi: "Tôi đến từ Việt Nam." } },
  { key: "de-donde-eres", es: "¿de dónde eres?", vi: "bạn đến từ đâu?", kind: "câu hỏi", pron: "đê đôn-đê ê-rêx", example: { es: "Hola, Marco, ¿de dónde eres?", vi: "Chào Marco, bạn đến từ đâu?" } },
  { key: "vietnamita", es: "vietnamita", vi: "người Việt Nam (cả nam và nữ)", kind: "quốc tịch", pron: "biết-na-mi-ta", example: { es: "Soy vietnamita.", vi: "Tôi là người Việt Nam." } },
  { key: "espanol", es: "español / española", vi: "người Tây Ban Nha (nam / nữ); tiếng Tây Ban Nha", kind: "quốc tịch", pron: "ex-pa-nhôn / ex-pa-nhô-la", example: { es: "Elena es española.", vi: "Elena là người Tây Ban Nha." } },
  { key: "mexicano", es: "mexicano / mexicana", vi: "người Mexico (nam / nữ)", kind: "quốc tịch", pron: "mê-khi-ca-nô", note: "Chữ x trong México đọc như j: âm “kh”.", example: { es: "Él es mexicano.", vi: "Anh ấy là người Mexico." } },
  { key: "estudiante", es: "estudiante", vi: "học sinh, sinh viên, học viên", kind: "danh từ", pron: "ex-tu-điên-tê", example: { es: "Soy estudiante de español.", vi: "Tôi là học viên tiếng Tây Ban Nha." } },
  { key: "profesor", es: "profesor / profesora", vi: "giáo viên (nam / nữ)", kind: "danh từ", pron: "prô-phê-xor / prô-phê-xô-ra", example: { es: "Ella es profesora.", vi: "Cô ấy là giáo viên." } },
  { key: "la-ciudad", es: "la ciudad", vi: "thành phố", kind: "danh từ giống cái", pron: "la thiu-đát (Mỹ Latin: xiu-đát)", example: { es: "Soy de Ho Chi Minh, una ciudad muy grande.", vi: "Tôi đến từ TP.HCM, một thành phố rất lớn." } },
  { key: "el-pais", es: "el país", vi: "đất nước", kind: "danh từ giống đực", pron: "el pa-íx", example: { es: "Vietnam es un país bonito.", vi: "Việt Nam là một đất nước đẹp." } },
  { key: "tambien", es: "también", vi: "cũng", kind: "trạng từ", pron: "tam-biên", example: { es: "Yo también soy de Vietnam.", vi: "Tôi cũng đến từ Việt Nam." } },
]);

const L5 = group("a1-u1-l5", "Hội thoại cơ bản", "a1u1", [
  { key: "como-estas", es: "¿cómo estás?", vi: "bạn khỏe không?", kind: "câu hỏi", pron: "cô-mô ex-tax", example: { es: "Hola, Luis, ¿cómo estás?", vi: "Chào Luis, bạn khỏe không?" } },
  { key: "estoy-bien", es: "estoy bien", vi: "tôi khỏe", kind: "cụm từ", pron: "ex-toi biên", example: { es: "Estoy bien, gracias.", vi: "Tôi khỏe, cảm ơn." } },
  { key: "y-usted", es: "¿y usted?", vi: "còn ông / bà?", kind: "câu hỏi", pron: "i ux-tét", example: { es: "Muy bien, gracias, ¿y usted?", vi: "Rất khỏe, cảm ơn, còn ông?" } },
  { key: "por-favor", es: "por favor", vi: "làm ơn, xin vui lòng", kind: "cụm từ", pron: "por pha-bor", example: { es: "Más despacio, por favor.", vi: "Làm ơn nói chậm hơn." } },
  { key: "de-nada", es: "de nada", vi: "không có gì", kind: "cụm từ", pron: "đê na-đa", example: { es: "—Gracias. —De nada.", vi: "—Cảm ơn. —Không có gì." } },
  { key: "perdon", es: "perdón", vi: "xin lỗi, cho hỏi", kind: "thán từ", pron: "per-đôn", example: { es: "Perdón, ¿eres Marta?", vi: "Xin lỗi, bạn là Marta phải không?" } },
  { key: "lo-siento", es: "lo siento", vi: "tôi rất tiếc, xin lỗi", kind: "cụm từ", pron: "lô xiên-tô", example: { es: "Lo siento, llego tarde.", vi: "Xin lỗi, tôi đến trễ." } },
  { key: "no-entiendo", es: "no entiendo", vi: "tôi không hiểu", kind: "cụm từ", pron: "nô en-tiên-đô", example: { es: "No entiendo, ¿puedes repetir?", vi: "Tôi không hiểu, bạn nhắc lại được không?" } },
  { key: "si", es: "sí", vi: "vâng, có", kind: "trạng từ", pron: "xi", note: "Có dấu: sí = vâng; si (không dấu) = nếu.", example: { es: "Sí, soy Marta.", vi: "Vâng, tôi là Marta." } },
  { key: "no", es: "no", vi: "không", kind: "trạng từ", pron: "nô", example: { es: "No, no soy de México.", vi: "Không, tôi không phải người Mexico." } },
  { key: "nos-vemos", es: "nos vemos", vi: "gặp lại sau nhé", kind: "cụm từ", pron: "nôx bê-môx", example: { es: "Nos vemos el lunes.", vi: "Hẹn thứ Hai gặp lại." } },
  { key: "bienvenido", es: "¡bienvenido!", vi: "chào mừng! (bienvenida khi nói với nữ)", kind: "thán từ", pron: "biên-bê-ni-đô", example: { es: "¡Bienvenido a la clase!", vi: "Chào mừng đến với lớp học!" } },
]);

export const VOCABULARY: VocabItem[] = [...L1, ...L2, ...L3, ...L4, ...L5];

export const VOCAB_BY_ID: Record<string, VocabItem> = Object.fromEntries(VOCABULARY.map((v) => [v.id, v]));

export const VOCAB_TOPICS: string[] = Array.from(new Set(VOCABULARY.map((v) => v.topic)));

export function vocabForLesson(lessonId: string): VocabItem[] {
  return VOCABULARY.filter((v) => v.lessonId === lessonId);
}
