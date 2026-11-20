# ¡Hola! — Learn Spanish

Web học tiếng Tây Ban Nha cho người Việt, đi từ A1 trở lên theo khung CEFR. Bản phát hành đầu có đầy đủ **A1 · Unit 1: Saludos y presentaciones** gồm 5 bài học và 1 bài kiểm tra, 58 từ vựng, 14 điểm ngữ pháp giải thích bằng tiếng Việt, 60 bài tập.

Stack: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, các component theo kiểu shadcn/ui (Radix + CVA), Lucide, Framer Motion, Recharts, Supabase.

---

## 1. Chạy thử trên máy

Cần Node.js 20 trở lên.

```bash
npm install
npm run dev        # http://localhost:3000
```

Không cần cấu hình gì thêm: khi chưa có biến môi trường, tiến độ lưu trong `localStorage` và AI Tutor chạy ở **chế độ demo**, có ghi rõ trên giao diện.

Các lệnh khác:

```bash
npm run build && npm start   # bản production
npm run typecheck            # kiểm tra kiểu
npm run lint
```

## 2. Biến môi trường

Sao chép `.env.example` thành `.env.local`.

| Biến | Bắt buộc? | Dùng cho |
|---|---|---|
| `ANTHROPIC_API_KEY` | Không | Bật AI Tutor thật. Chỉ đọc ở server (`src/app/api/tutor/route.ts`), không bao giờ gửi xuống trình duyệt. |
| `ANTHROPIC_MODEL` | Không | Mô hình Claude, mặc định `claude-sonnet-5-5`. |
| `NEXT_PUBLIC_SUPABASE_URL` | Không | Bật đăng nhập và đồng bộ tiến độ. |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Không | Khoá công khai của Supabase. Dữ liệu được bảo vệ bằng Row Level Security. |

## 3. Cài Supabase (tuỳ chọn)

1. Tạo project trên [supabase.com](https://supabase.com).
2. Mở **SQL Editor**, dán và chạy `supabase/migrations/0001_init.sql`. Nếu dùng Supabase CLI thì chạy `supabase db push`.
3. **Authentication → Providers**: bật Email (magic link).
4. **Authentication → URL Configuration**: thêm `http://localhost:3000/settings` và domain thật vào Redirect URLs.
5. Điền `NEXT_PUBLIC_SUPABASE_URL` và `NEXT_PUBLIC_SUPABASE_ANON_KEY` vào `.env.local`, rồi khởi động lại.

Đăng nhập ở trang **Cài đặt**. Khi đăng nhập, app so sánh `updatedAt` giữa localStorage và Supabase rồi giữ bản mới hơn, nên tiến độ đã học khi chưa đăng nhập không bị mất.

**Đường chuyển từ localStorage sang DB:** toàn bộ UI chỉ gọi interface `ProgressRepository` (`src/lib/progress/repository.ts`). `LocalRepository` và `SupabaseRepository` cùng lưu một đối tượng `ProgressState`. Khi cần phân tích sâu hơn, có thể tách bảng `user_progress.state` thành các bảng chuẩn hoá (lesson_completions, srs_cards, daily_activity) mà không phải sửa component.

## 4. Deploy lên Vercel

1. Đẩy mã nguồn lên GitHub.
2. Vào [vercel.com/new](https://vercel.com/new), import repo. Vercel tự nhận Next.js.
3. Thêm các biến môi trường ở mục 2 (Settings → Environment Variables).
4. Deploy. Nếu dùng Supabase, nhớ thêm domain Vercel vào Redirect URLs.

## 5. Cấu trúc dự án

```
src/
  app/
    page.tsx                  # Landing  (/)
    (app)/                    # Các trang có sidebar
      dashboard/              # /dashboard
      learn/                  # /learn  — lộ trình CEFR
      learn/[lessonId]/       # /learn/a1-u1-l1 … — bài học
      practice/               # /practice
      vocabulary/             # /vocabulary
      review/                 # /review  — ôn tập SM-2
      ai-tutor/               # /ai-tutor
      progress/               # /progress
      settings/               # /settings
      template.tsx            # hiệu ứng chuyển trang
    api/tutor/route.ts        # backend AI Tutor (giữ khoá API)
  components/
    ui/                       # button, card, badge, progress, switch, input, dialog (kiểu shadcn)
    exercises/                # 7 loại bài tập + ExerciseRunner chấm điểm
    lesson-player.tsx         # trình phát bài học nhiều bước
    flashcard.tsx, activity-chart.tsx, app-shell.tsx, …
  data/
    curriculum.ts             # CEFR → unit → bài học, ngữ pháp, hội thoại, bài tập
    vocabulary.ts             # từ vựng: nghĩa, ví dụ, bản dịch, gợi ý phát âm
    scenarios.ts              # tình huống AI Tutor + kịch bản demo
  lib/
    types.ts                  # data model có kiểu
    srs.ts                    # thuật toán ôn tập theo SM-2
    gamification.ts           # XP, cột mốc, streak, huy hiệu
    practice.ts               # sinh bài luyện tập ngẫu nhiên
    speech.ts                 # SpeechSynthesis + SpeechRecognition
    progress/                 # store (React context), repository local/Supabase
supabase/migrations/0001_init.sql
```

## 6. Thêm nội dung mới

Nội dung không viết cứng trong component. Để thêm Unit 2:

1. Thêm từ vào `src/data/vocabulary.ts` bằng `group("a1-u2-l1", "Chủ đề", "a1u2", [...])`.
2. Thêm các `Lesson` vào `src/data/curriculum.ts` và đổi unit `a1-u2` từ `status: "upcoming"` sang `"available"`.
3. Bài tập dùng một trong các kiểu đã có trong `Exercise` (`src/lib/types.ts`). TypeScript sẽ báo lỗi nếu thiếu trường.

Trang lộ trình, dashboard, luyện tập và tiến độ tự cập nhật theo dữ liệu mới.

## 7. Đã làm và kế hoạch

### Đã làm, chạy được

- **10 route** trong bảng yêu cầu. Mục nào trên menu cũng dẫn tới trang dùng được.
- **Dashboard:** lời chào theo buổi, trình độ, mục tiêu XP hôm nay, streak, số bài đã xong, số từ đã thuộc, thời gian học, bài nên học tiếp, biểu đồ 7 ngày, số thẻ đến hạn, huy hiệu gần đây. Mọi số liệu tính từ hoạt động thật.
- **Lộ trình CEFR A1–C2:** bản đồ bài học zig-zag cho Unit 1 (đã xong / đang học / chưa mở). Các unit và cấp chưa có nội dung được ghi rõ là «Sắp ra mắt» và không bấm vào được.
- **Bài học:** mục tiêu → từ vựng có loa đọc → ngữ pháp tiếng Việt kèm bảng và mẹo → hội thoại mẫu → bài tập → tổng kết. Có thanh tiến độ, nút Quay lại/Tiếp, đổi tốc độ đọc, xem lại câu sai và pháo giấy khi xong bài. Bài kiểm tra cần đạt 70%.
- **7 loại bài tập:** trắc nghiệm, điền chỗ trống, dịch Tây Ban Nha → Việt (ghép thẻ), dịch Việt → Tây Ban Nha (gõ tay, chấp nhận thiếu dấu nhưng có nhắc), sắp xếp câu, nghe hiểu (có nút nghe chậm), nối từ. Phản hồi đúng/sai ngay, sai thì có giải thích. Phương án luôn được xáo.
- **Luyện tập:** mỗi lượt 10 câu sinh mới từ những từ đã học, không lặp câu trong cùng lượt.
- **Từ vựng:** lọc theo chủ đề và trạng thái, tìm kiếm không cần dấu, lưu từ, nút Đã biết/Chưa biết, chế độ flashcard lật.
- **Ôn tập SM-2:** hàng đợi thẻ đến hạn mỗi ngày (tối đa 30 thẻ), 4 mức chấm, hiện trước lần ôn tiếp theo, thẻ «Quên» quay lại ngay trong lượt.
- **Nghe & nói:** SpeechSynthesis với giọng es-ES hoặc es-MX và chỉnh tốc độ; SpeechRecognition có xử lý quyền micro, hiển thị bản ghi chữ, và phương án thay thế khi trình duyệt không hỗ trợ. **Không chấm điểm phát âm**, chỉ so các từ trình duyệt nhận ra.
- **AI Tutor:** 6 tình huống, 3 trình độ, trả lời bằng tiếng Tây Ban Nha có bản dịch, sửa lỗi bằng tiếng Việt, gợi ý cách nói tự nhiên hơn, lưu từ vào thư viện và lịch ôn, nhập bằng giọng nói. Gọi Claude qua API route ở server, có kiểm tra dữ liệu (zod), giới hạn tần suất và timeout. Khi chưa có khoá API, giao diện ghi rõ chế độ demo với câu soạn sẵn.
- **Gamification:** XP, mục tiêu ngày, streak hiện tại và dài nhất, lịch 5 tuần, 7 cột mốc XP, 12 huy hiệu, tiến độ theo từng cấp CEFR.
- **Lưu tiến độ:** localStorage, giữ nguyên sau khi tải lại trang. Có thể đồng bộ Supabase, xuất/nhập JSON, xoá tiến độ có hộp xác nhận.
- Responsive cho máy tính và điện thoại (sidebar, menu trượt, thanh điều hướng dưới), có trạng thái đang tải, trạng thái trống, trang lỗi, điều khiển bằng bàn phím và tôn trọng `prefers-reduced-motion`.

### Kế hoạch (chưa làm)

- Nội dung A1 Unit 2–4 và các cấp A2–C2.
- Chấm điểm phát âm thật, cần dịch vụ đánh giá phát âm riêng.
- Lưu lịch sử hội thoại AI Tutor (hiện chỉ giữ trong phiên).
- Bảng xếp hạng, giải đấu tuần giữa bạn bè.
- Tách bảng chuẩn hoá trên Supabase để phân tích, thêm đăng nhập Google.
- Giới hạn tần suất AI Tutor bằng kho lưu chung (Redis/Upstash). Bản hiện tại đếm trong bộ nhớ của từng server.

## 8. Ghi chú kỹ thuật

- **shadcn/ui:** các component trong `src/components/ui` được viết theo đúng cấu trúc shadcn (Radix primitives + `class-variance-authority` + `cn`), kèm `components.json`, nên có thể chạy `npx shadcn@latest add <component>` để thêm component khác.
- **Font:** Plus Jakarta Sans cho chữ giao diện, Nunito cho tiêu đề, cả hai có bộ chữ tiếng Việt. Font được nạp từ Google Fonts lúc chạy, nên build không cần mạng.
- **Giọng đọc** phụ thuộc giọng cài sẵn trên máy. Nếu nghe ra giọng tiếng Anh, hãy cài giọng Español trong phần cài đặt ngôn ngữ của hệ điều hành. Trang Cài đặt cho biết trình duyệt có hỗ trợ hay không.
- **Thời gian học** chỉ được cộng khi tab đang mở và người dùng có thao tác trong 60 giây gần nhất, mỗi lần cộng 15 giây.
