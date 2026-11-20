import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { AVAILABLE_LESSONS, getLesson } from "@/data/curriculum";
import { LessonPlayer } from "@/components/lesson-player";

export function generateStaticParams() {
  return AVAILABLE_LESSONS.map((l) => ({ lessonId: l.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ lessonId: string }> }): Promise<Metadata> {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  return { title: lesson ? `${lesson.title} · ${lesson.titleVi}` : "Bài học" };
}

export default async function LessonPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  const lesson = getLesson(lessonId);
  if (!lesson) notFound();
  return <LessonPlayer lessonId={lesson.id} />;
}
