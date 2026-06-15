// M_QuizOption — вариант ответа в квизе. ← чекбокс/радио-маркер + текст.
// Состояния приходят пропсом (вычисляет O_Quiz после проверки): это смысловые
// состояния квиза, а не CSS hover/pressed.
import styles from './M_QuizOption.module.css';

export type QuizOptionState =
  | 'default'
  | 'selected'
  | 'right' // правильный, но не выбран (подсветка после проверки)
  | 'right-selected' // правильный и выбран
  | 'error'; // выбран, но неправильный

interface Props {
  text: string;
  state: QuizOptionState;
  type?: 'checkbox' | 'radio';
  disabled?: boolean;
  onClick?: () => void;
}

export default function M_QuizOption({ text, state, type = 'radio', disabled, onClick }: Props) {
  const cls = [styles.option, styles[`s-${state}`]].filter(Boolean).join(' ');
  const selected = state === 'selected' || state === 'right-selected' || state === 'error';
  const verdict =
    state === 'right' || state === 'right-selected' ? 'Верно!' : state === 'error' ? 'Неверно' : null;
  return (
    <button type="button" className={cls} onClick={onClick} disabled={disabled} aria-pressed={selected}>
      <span
        className={`${styles.marker} ${type === 'checkbox' ? styles.checkbox : styles.radio}`}
        aria-hidden="true"
      />
      <span className={styles.text}>{text}</span>
      {verdict && <span className={styles.verdict}>{verdict}</span>}
    </button>
  );
}
