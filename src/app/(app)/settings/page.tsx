"use client";

import * as React from "react";
import { z } from "zod";
import { Cloud, CloudOff, Download, HardDrive, LogOut, Mail, Trash2, Upload, Volume2 } from "lucide-react";
import { useProgress } from "@/lib/progress/store";
import { normalizeState } from "@/lib/progress/defaults";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import { canSpeak, getRecognitionCtor, hasSpanishVoice, speak } from "@/lib/speech";
import { notify } from "@/lib/notify";
import { PageHeader } from "@/components/page-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PageSkeleton } from "@/components/states";
import { cn } from "@/lib/utils";

const nameSchema = z.string().trim().max(30, "Tên tối đa 30 ký tự");
const emailSchema = z.string().trim().email("Email chưa đúng định dạng");

export default function SettingsPage() {
  const { state, hydrated, updateSettings, resetProgress, replaceState, sync, userEmail, signOut } = useProgress();
  const [name, setName] = React.useState("");
  const [nameErr, setNameErr] = React.useState<string | null>(null);
  const [support, setSupport] = React.useState({ tts: false, voice: false, stt: false });
  const fileRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (hydrated) setName(state.settings.displayName);
  }, [hydrated, state.settings.displayName]);

  React.useEffect(() => {
    const check = () => setSupport({ tts: canSpeak(), voice: hasSpanishVoice(), stt: Boolean(getRecognitionCtor()) });
    check();
    const t = setTimeout(check, 800); // danh sách giọng có thể nạp chậm
    return () => clearTimeout(t);
  }, []);

  if (!hydrated) return <PageSkeleton />;
  const s = state.settings;

  const saveName = (e: React.FormEvent) => {
    e.preventDefault();
    const r = nameSchema.safeParse(name);
    if (!r.success) return setNameErr(r.error.issues[0].message);
    setNameErr(null);
    updateSettings({ displayName: r.data });
    notify({ title: "Đã lưu tên hiển thị", tone: "success" });
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hola-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const importData = async (file: File) => {
    try {
      const raw = JSON.parse(await file.text());
      if (!raw || raw.version !== 1 || typeof raw.xp !== "number") throw new Error();
      replaceState(normalizeState(raw));
      notify({ title: "Đã nhập tiến độ", body: "Dữ liệu từ tệp đã thay cho dữ liệu hiện tại.", tone: "success" });
    } catch {
      notify({ title: "Tệp không hợp lệ", body: "Hãy chọn tệp .json được xuất từ trang này.", tone: "error" });
    }
  };

  return (
    <div className="max-w-3xl">
      <PageHeader pill="Ajustes" pillText="Cài đặt" title="Học theo" highlight="cách của bạn." />

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Hồ sơ & mục tiêu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <form onSubmit={saveName} className="space-y-2" noValidate>
              <Label htmlFor="display-name">Tên hiển thị</Label>
              <div className="flex gap-2">
                <Input id="display-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ví dụ: Linh" aria-invalid={Boolean(nameErr)} aria-describedby="name-err" />
                <Button type="submit" variant="outline">
                  Lưu
                </Button>
              </div>
              {nameErr && (
                <p id="name-err" className="text-sm font-semibold text-danger-dark">
                  {nameErr}
                </p>
              )}
            </form>

            <fieldset>
              <legend className="text-sm font-bold">Mục tiêu XP mỗi ngày</legend>
              <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  [10, "Nhẹ nhàng", "~5 phút"],
                  [20, "Đều đặn", "~10 phút"],
                  [30, "Nghiêm túc", "~15 phút"],
                  [50, "Tăng tốc", "~25 phút"],
                ].map(([xp, label, time]) => (
                  <button
                    key={xp}
                    type="button"
                    aria-pressed={s.dailyGoalXp === xp}
                    onClick={() => updateSettings({ dailyGoalXp: xp as number })}
                    className={cn(
                      "rounded-2xl border-2 border-b-[4px] px-3 py-2.5 text-left transition",
                      s.dailyGoalXp === xp ? "border-accent border-b-accent-dark bg-accent-soft" : "border-line-strong bg-white hover:border-accent-tint",
                    )}
                  >
                    <span className="block font-display text-lg font-black tnum">{xp} XP</span>
                    <span className="block text-xs text-ink-muted">
                      {label} · {time}
                    </span>
                  </button>
                ))}
              </div>
            </fieldset>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Âm thanh & phát âm</CardTitle>
            <CardDescription>Dùng giọng đọc có sẵn trong trình duyệt và hệ điều hành của bạn.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Badge variant={support.tts ? "success" : "danger"}>{support.tts ? "Đọc to: hỗ trợ" : "Đọc to: không hỗ trợ"}</Badge>
              <Badge variant={support.voice ? "success" : "accent"}>{support.voice ? "Có giọng tiếng Tây Ban Nha" : "Chưa thấy giọng tiếng Tây Ban Nha"}</Badge>
              <Badge variant={support.stt ? "success" : "accent"}>{support.stt ? "Nhận diện giọng nói: hỗ trợ" : "Nhận diện giọng nói: không hỗ trợ"}</Badge>
            </div>
            {!support.voice && support.tts && (
              <p className="text-sm text-ink-muted">Nếu giọng đọc nghe như tiếng Anh, hãy cài giọng Español trong phần Ngôn ngữ / Giọng nói của hệ điều hành.</p>
            )}

            <fieldset>
              <legend className="text-sm font-bold">Giọng</legend>
              <div className="mt-2 flex gap-2">
                {(
                  [
                    ["es-ES", "Tây Ban Nha"],
                    ["es-MX", "Mỹ Latin (Mexico)"],
                  ] as const
                ).map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    aria-pressed={s.accent === id}
                    onClick={() => updateSettings({ accent: id })}
                    className={cn("rounded-2xl border-2 border-b-[4px] px-4 py-2 font-bold transition", s.accent === id ? "border-brand border-b-brand-dark bg-brand text-white" : "border-line-strong bg-white")}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </fieldset>

            <div>
              <Label htmlFor="rate">Tốc độ đọc: {s.speechRate.toFixed(1)}×</Label>
              <div className="mt-2 flex items-center gap-3">
                <input
                  id="rate"
                  type="range"
                  min={0.5}
                  max={1.2}
                  step={0.1}
                  value={s.speechRate}
                  onChange={(e) => updateSettings({ speechRate: Number(e.target.value) })}
                  className="h-2 flex-1 cursor-pointer accent-[#B52B38]"
                />
                <Button variant="outline" size="sm" onClick={() => speak("Hola, ¿cómo estás? Me llamo Lucía.", { rate: s.speechRate, accent: s.accent })}>
                  <Volume2 /> Nghe thử
                </Button>
              </div>
            </div>

            <Toggle id="sfx" label="Âm báo đúng / sai" desc="Tiếng chuông ngắn khi kiểm tra đáp án." checked={s.soundEffects} onChange={(v) => updateSettings({ soundEffects: v })} />
            <Toggle id="hints" label="Luôn hiện giải thích" desc="Hiện lời giải thích cả khi bạn trả lời đúng." checked={s.showHints} onChange={(v) => updateSettings({ showHints: v })} />
          </CardContent>
        </Card>

        <AccountCard sync={sync} userEmail={userEmail} onSignOut={signOut} />

        <Card>
          <CardHeader>
            <CardTitle>Dữ liệu</CardTitle>
            <CardDescription>Sao lưu hoặc chuyển tiến độ sang trình duyệt khác.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={exportData}>
              <Download /> Xuất tiến độ (.json)
            </Button>
            <Button variant="outline" onClick={() => fileRef.current?.click()}>
              <Upload /> Nhập từ tệp
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importData(f);
                e.target.value = "";
              }}
            />
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" className="text-danger-dark hover:bg-danger-soft">
                  <Trash2 /> Xoá toàn bộ tiến độ
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogTitle>Xoá toàn bộ tiến độ?</DialogTitle>
                <DialogDescription>XP, bài đã học, lịch ôn và huy hiệu sẽ bị xoá{userEmail ? " trên cả tài khoản" : ""}. Cài đặt được giữ lại. Không thể hoàn tác.</DialogDescription>
                <div className="mt-6 flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button variant="outline">Huỷ</Button>
                  </DialogClose>
                  <DialogClose asChild>
                    <Button
                      variant="danger"
                      onClick={async () => {
                        await resetProgress();
                        notify({ title: "Đã xoá tiến độ", tone: "info" });
                      }}
                    >
                      Xoá
                    </Button>
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Toggle({ id, label, desc, checked, onChange }: { id: string; label: string; desc: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <Label htmlFor={id}>{label}</Label>
        <p className="text-sm text-ink-muted">{desc}</p>
      </div>
      <Switch id={id} checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function AccountCard({ sync, userEmail, onSignOut }: { sync: string; userEmail: string | null; onSignOut: () => Promise<void> }) {
  const [email, setEmail] = React.useState("");
  const [err, setErr] = React.useState<string | null>(null);
  const [sent, setSent] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = emailSchema.safeParse(email);
    if (!r.success) return setErr(r.error.issues[0].message);
    setErr(null);
    setBusy(true);
    const supabase = getSupabase();
    const { error } = await supabase!.auth.signInWithOtp({ email: r.data, options: { emailRedirectTo: `${window.location.origin}/settings` } });
    setBusy(false);
    if (error) setErr(error.message);
    else setSent(true);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tài khoản & đồng bộ</CardTitle>
        <CardDescription>
          {isSupabaseConfigured ? "Đăng nhập để lưu tiến độ lên Supabase và dùng trên nhiều thiết bị." : "Supabase chưa được cấu hình, tiến độ đang lưu trong trình duyệt này (localStorage)."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!isSupabaseConfigured ? (
          <p className="flex items-center gap-2 rounded-2xl bg-ink/[0.04] p-4 text-sm">
            <HardDrive className="size-4 shrink-0" /> Chế độ demo cục bộ. Thêm NEXT_PUBLIC_SUPABASE_URL và NEXT_PUBLIC_SUPABASE_ANON_KEY để bật đăng nhập (xem README).
          </p>
        ) : userEmail ? (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="flex items-center gap-2 text-sm">
              {sync === "error" ? <CloudOff className="size-4 text-danger" /> : <Cloud className="size-4 text-success" />}
              <span>
                <b>{userEmail}</b> ·{" "}
                {sync === "synced" ? "đã đồng bộ" : sync === "syncing" ? "đang đồng bộ…" : sync === "error" ? "lỗi đồng bộ, dữ liệu vẫn giữ trên máy" : "đã kết nối"}
              </span>
            </p>
            <Button variant="outline" size="sm" onClick={onSignOut}>
              <LogOut /> Đăng xuất
            </Button>
          </div>
        ) : sent ? (
          <p className="rounded-2xl bg-success-soft p-4 text-sm font-semibold text-success-dark">Đã gửi liên kết đăng nhập tới {email}. Mở email trên thiết bị này để hoàn tất.</p>
        ) : (
          <form onSubmit={submit} className="space-y-2" noValidate>
            <Label htmlFor="email">Email</Label>
            <div className="flex gap-2">
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="ban@vidu.com" aria-invalid={Boolean(err)} />
              <Button type="submit" disabled={busy}>
                <Mail /> {busy ? "Đang gửi…" : "Gửi link"}
              </Button>
            </div>
            {err && <p className="text-sm font-semibold text-danger-dark">{err}</p>}
          </form>
        )}
      </CardContent>
    </Card>
  );
}
