import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { flattenLessons, lessonHref, nextLesson, previousLesson } from './path';
import type { LearnCourse, LearnLesson, LearnLevel } from './types';

/*
 * Server-rendered text for screen readers and crawlers. The path map and the
 * lesson player only draw after progress loads in the browser, so the HTML had
 * no lesson links and each lesson page showed a "locked" card (Oct 2026: 308
 * pages "discovered, not indexed"). Nothing here is new content: it is what the
 * map and the player show once they load. Paid lessons get their title and
 * summary only, never the lesson text.
 */

export function CourseLessonIndex({ course }: { course: LearnCourse }) {
  return (
    <nav aria-label={`${course.title}: all lessons`} className="sr-only">
      <h2>{course.title}: all lessons</h2>
      {course.levels
        .filter((level) => level.lessons.some((lesson) => lesson.playable))
        .map((level) => (
          <section key={level.slug}>
            <h3>
              Level {level.number}: {level.name}
              {level.free ? ' (free)' : ''}
            </h3>
            <p>{level.leaveWith}</p>
            <ul>
              {level.lessons
                .filter((lesson) => lesson.playable)
                .map((lesson) => (
                  <li key={lesson.id}>
                    <Link href={lessonHref(level, lesson, course.basePath)}>{lesson.title}</Link>
                  </li>
                ))}
            </ul>
          </section>
        ))}
    </nav>
  );
}

export function LessonOutline({
  course,
  level,
  lesson,
}: {
  course: LearnCourse;
  level: LearnLevel;
  lesson: LearnLesson;
}) {
  const prev = previousLesson(course, lesson.id);
  const next = nextLesson(course, lesson.id);
  const siblings = flattenLessons(course).filter(
    (item) => item.level.slug === level.slug && item.lesson.playable && item.lesson.id !== lesson.id,
  );

  return (
    <section aria-label={`About this lesson: ${lesson.title}`} className="sr-only">
      <h2>{lesson.title}</h2>
      <p>
        Level {level.number}: {level.name}. {lesson.why}
      </p>
      {level.free && lesson.body && <ReactMarkdown remarkPlugins={[remarkGfm]}>{lesson.body}</ReactMarkdown>}
      {siblings.length > 0 && (
        <nav aria-label={`Other lessons in level ${level.number}`}>
          <h3>Other lessons in level {level.number}</h3>
          <ul>
            {siblings.map((item) => (
              <li key={item.lesson.id}>
                <Link href={lessonHref(item.level, item.lesson, course.basePath)}>{item.lesson.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
      <ul>
        {prev?.lesson.playable && (
          <li>
            Previous: <Link href={lessonHref(prev.level, prev.lesson, course.basePath)}>{prev.lesson.title}</Link>
          </li>
        )}
        {next?.lesson.playable && (
          <li>
            Next: <Link href={lessonHref(next.level, next.lesson, course.basePath)}>{next.lesson.title}</Link>
          </li>
        )}
        <li>
          <Link href={course.basePath}>{course.title}</Link>
        </li>
      </ul>
    </section>
  );
}
