import type { SupabaseClient } from "@supabase/supabase-js";
import type { ProgressState } from "../types";
import { normalizeState } from "./defaults";

/**
 * Lớp lưu trữ tiến độ. UI chỉ làm việc với interface này,
 * nên đổi từ localStorage sang Supabase không phải sửa component nào.
 */
export interface ProgressRepository {
  readonly kind: "local" | "supabase";
  load(): Promise<ProgressState | null>;
  save(state: ProgressState): Promise<void>;
  clear(): Promise<void>;
}

const KEY = "hola-progress-v1";

export class LocalRepository implements ProgressRepository {
  readonly kind = "local" as const;
  async load() {
    try {
      const raw = window.localStorage.getItem(KEY);
      return raw ? normalizeState(JSON.parse(raw)) : null;
    } catch {
      return null;
    }
  }
  async save(state: ProgressState) {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* hết dung lượng hoặc chế độ riêng tư — bỏ qua */
    }
  }
  async clear() {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* noop */
    }
  }
}

/** Bảng `user_progress` (xem supabase/migrations). RLS: mỗi user chỉ đọc/ghi dòng của mình. */
export class SupabaseRepository implements ProgressRepository {
  readonly kind = "supabase" as const;
  constructor(private client: SupabaseClient, private userId: string) {}

  async load() {
    const { data, error } = await this.client
      .from("user_progress")
      .select("state")
      .eq("user_id", this.userId)
      .maybeSingle();
    if (error) throw error;
    return data?.state ? normalizeState(data.state) : null;
  }
  async save(state: ProgressState) {
    const { error } = await this.client
      .from("user_progress")
      .upsert({ user_id: this.userId, state, updated_at: new Date().toISOString() }, { onConflict: "user_id" });
    if (error) throw error;
  }
  async clear() {
    const { error } = await this.client.from("user_progress").delete().eq("user_id", this.userId);
    if (error) throw error;
  }
}
