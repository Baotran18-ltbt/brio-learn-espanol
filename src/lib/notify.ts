export interface Notice {
  id: number;
  title: string;
  body?: string;
  tone?: "success" | "info" | "achievement" | "error";
}

type Listener = (n: Notice) => void;
const listeners = new Set<Listener>();
let seq = 0;

export function notify(n: Omit<Notice, "id">) {
  const notice = { ...n, id: ++seq };
  listeners.forEach((l) => l(notice));
}

export function subscribe(l: Listener) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}
