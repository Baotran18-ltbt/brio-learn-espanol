export type TutorLevel = "A1" | "A2" | "B1";

export interface Scenario {
  id: string;
  title: string;
  titleVi: string;
  description: string;
  role: string; // vai AI đóng
  opener: { es: string; vi: string };
  /** Kịch bản chế độ demo — câu soạn sẵn, KHÔNG phải AI */
  demo: { es: string; vi: string }[];
  tone: "rose" | "peach" | "butter" | "sage" | "sky" | "lilac";
}

export const SCENARIOS: Scenario[] = [
  {
    id: "introductions",
    title: "Presentarse",
    titleVi: "Giới thiệu bản thân",
    description: "Làm quen với một bạn mới ở buổi giao lưu ngôn ngữ.",
    role: "Lucía, một sinh viên 25 tuổi đến từ Sevilla, thân thiện, đang học tiếng Việt",
    opener: { es: "¡Hola! Me llamo Lucía. ¿Cómo te llamas?", vi: "Chào bạn! Mình tên Lucía. Bạn tên gì?" },
    demo: [
      { es: "¡Mucho gusto! ¿De dónde eres?", vi: "Rất vui được gặp bạn! Bạn đến từ đâu?" },
      { es: "¡Qué bien! Yo soy de Sevilla, en España. ¿Eres estudiante?", vi: "Hay quá! Mình đến từ Sevilla, Tây Ban Nha. Bạn là sinh viên à?" },
      { es: "Genial. Bueno, ¡hasta luego! Nos vemos.", vi: "Tuyệt. Thôi, hẹn gặp lại nhé!" },
    ],
    tone: "rose",
  },
  {
    id: "restaurant",
    title: "En el restaurante",
    titleVi: "Gọi món ở nhà hàng",
    description: "Gọi đồ ăn, đồ uống và xin hoá đơn.",
    role: "Javier, phục vụ lịch sự ở một nhà hàng tapas tại Madrid",
    opener: { es: "Buenas noches. ¿Qué desea tomar?", vi: "Chào buổi tối. Quý khách muốn dùng gì ạ?" },
    demo: [
      { es: "Muy bien. ¿Y para beber?", vi: "Vâng. Còn đồ uống thì sao ạ?" },
      { es: "Perfecto. ¿Algo más?", vi: "Hoàn hảo. Quý khách cần gì thêm không?" },
      { es: "Aquí tiene la cuenta. ¡Gracias!", vi: "Hoá đơn của quý khách đây. Cảm ơn!" },
    ],
    tone: "peach",
  },
  {
    id: "shopping",
    title: "De compras",
    titleVi: "Mua sắm",
    description: "Hỏi giá, chọn cỡ và màu ở một cửa hàng quần áo.",
    role: "Carmen, nhân viên bán hàng nhiệt tình ở cửa hàng quần áo tại Barcelona",
    opener: { es: "¡Hola! ¿Puedo ayudarle?", vi: "Xin chào! Tôi giúp gì được cho bạn?" },
    demo: [
      { es: "Claro. ¿Qué talla usa?", vi: "Tất nhiên. Bạn mặc cỡ nào?" },
      { es: "Cuesta veinte euros.", vi: "Giá hai mươi euro." },
      { es: "¡Muchas gracias! Que tenga un buen día.", vi: "Cảm ơn nhiều! Chúc bạn một ngày tốt lành." },
    ],
    tone: "butter",
  },
  {
    id: "travel",
    title: "De viaje",
    titleVi: "Đi du lịch",
    description: "Nhận phòng khách sạn và hỏi về thành phố.",
    role: "Marta, lễ tân khách sạn ở Valencia",
    opener: { es: "Buenas tardes, bienvenido al hotel. ¿Tiene una reserva?", vi: "Chào buổi chiều, chào mừng đến khách sạn. Quý khách có đặt phòng trước không?" },
    demo: [
      { es: "Perfecto. ¿Me deja su pasaporte, por favor?", vi: "Tốt quá. Cho tôi xin hộ chiếu của quý khách." },
      { es: "Su habitación es la 204. El desayuno es a las ocho.", vi: "Phòng của quý khách là 204. Bữa sáng lúc tám giờ." },
      { es: "¡Disfrute de Valencia!", vi: "Chúc quý khách tận hưởng Valencia!" },
    ],
    tone: "sky",
  },
  {
    id: "directions",
    title: "Pedir direcciones",
    titleVi: "Hỏi đường",
    description: "Hỏi đường đến ga tàu, bảo tàng, quán cà phê.",
    role: "Don Ramón, một người dân địa phương lớn tuổi, tốt bụng ở Ciudad de México",
    opener: { es: "Buenos días. ¿Está perdido? ¿Adónde va?", vi: "Chào buổi sáng. Cậu bị lạc à? Cậu đi đâu?" },
    demo: [
      { es: "Está cerca. Siga todo recto y gire a la derecha.", vi: "Gần thôi. Cứ đi thẳng rồi rẽ phải." },
      { es: "Unos cinco minutos a pie.", vi: "Đi bộ khoảng năm phút." },
      { es: "De nada. ¡Buen viaje!", vi: "Không có gì. Chúc đi vui!" },
    ],
    tone: "sage",
  },
  {
    id: "everyday",
    title: "Conversación diaria",
    titleVi: "Trò chuyện hằng ngày",
    description: "Nói về một ngày của bạn, sở thích, cuối tuần.",
    role: "Diego, bạn trao đổi ngôn ngữ người Argentina, hay hỏi han",
    opener: { es: "¡Hola! ¿Qué tal tu día?", vi: "Chào! Hôm nay của bạn thế nào?" },
    demo: [
      { es: "¡Qué bien! ¿Qué te gusta hacer los fines de semana?", vi: "Hay quá! Cuối tuần bạn thích làm gì?" },
      { es: "A mí también me gusta. ¿Y trabajas o estudias?", vi: "Mình cũng thích. Bạn đi làm hay đi học?" },
      { es: "Interesante. ¡Hablamos pronto!", vi: "Thú vị đấy. Sớm nói chuyện tiếp nhé!" },
    ],
    tone: "lilac",
  },
];

export const TUTOR_LEVELS: { id: TutorLevel; label: string; hint: string }[] = [
  { id: "A1", label: "A1 · Nhập môn", hint: "Câu rất ngắn, thì hiện tại, nhiều giải thích tiếng Việt" },
  { id: "A2", label: "A2 · Sơ cấp", hint: "Câu ngắn, có quá khứ đơn giản" },
  { id: "B1", label: "B1 · Trung cấp", hint: "Hội thoại tự nhiên hơn, ít giải thích" },
];

export function getScenario(id: string): Scenario | undefined {
  return SCENARIOS.find((s) => s.id === id);
}
