// O_Quiz — интерактивный блок «Проверь себя». React-ОСТРОВ (useState).
// Логика повторяет поток одногруппника: выбор → проверка → подсветка → сброс.
// mode='single' — один правильный (radio), 'multiple' — несколько (checkbox).
// Примечание: A_Button — это .astro (нельзя внутри React-острова), поэтому
// кнопка проверки здесь нативная, но стилизована теми же button-токенами.
import { useMemo, useState } from 'react';
import M_QuizOption, { type QuizOptionState } from '../../molecules/M_QuizOption/M_QuizOption';
import styles from './O_Quiz.module.css';

interface Option {
  id: number;
  text: string;
  correct: boolean;
}
interface Props {
  question: string;
  options: Option[];
  mode?: 'single' | 'multiple';
  number?: number;
  explain?: string;
}

export default function O_Quiz({ question, options, mode = 'single', number = 1, explain }: Props) {
  const [selected, setSelected] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const opts = useMemo(() => options.map((o, i) => ({ ...o, key: o.id ?? i })), [options]);

  const toggle = (id: number) => {
    if (submitted) return;
    if (mode === 'single') {
      setSelected([id]);
    } else {
      setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
    }
  };

  const stateFor = (o: Option & { key: number }): QuizOptionState => {
    const isSel = selected.includes(o.key);
    if (!submitted) return isSel ? 'selected' : 'default';
    if (o.correct && isSel) return 'right-selected';
    if (!o.correct && isSel) return 'error';
    if (o.correct && !isSel) return 'right';
    return 'default';
  };

  return (
    <div className={styles.quiz}>
      <div className={styles.header}>
        <span className={styles.pill}>Проверь себя</span>
        <p className={styles.question}>{question}</p>
      </div>

      <div className={styles.options}>
        {opts.map((o) => (
          <M_QuizOption
            key={o.key}
            text={o.text}
            type={mode === 'multiple' ? 'checkbox' : 'radio'}
            state={stateFor(o)}
            disabled={submitted}
            onClick={() => toggle(o.key)}
          />
        ))}
      </div>

      {submitted && explain && <p className={styles.explain}>{explain}</p>}

      {!submitted ? (
        <button
          type="button"
          className={styles.submit}
          disabled={selected.length === 0}
          onClick={() => setSubmitted(true)}
        >
          Проверить
        </button>
      ) : (
        <button
          type="button"
          className={styles.submit}
          onClick={() => {
            setSelected([]);
            setSubmitted(false);
          }}
        >
          Пройти заново
        </button>
      )}
    </div>
  );
}
