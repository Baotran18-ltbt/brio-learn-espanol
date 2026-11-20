/** Kiểu dữ liệu dùng chung giữa API route /api/tutor và giao diện AI Tutor. */
export interface TutorCorrection {
  original: string;
  corrected: string;
  explanation_vi: string;
}
export interface TutorReply {
  reply_es: string;
  reply_vi: string;
  corrections: TutorCorrection[];
  alternatives: { es: string; vi: string }[];
  vocabulary: { es: string; vi: string }[];
}
export interface TutorStatus {
  live: boolean;
  model?: string;
}
