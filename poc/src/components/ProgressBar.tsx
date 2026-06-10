import { useDemoStore } from '../state/store';

export function ProgressBar() {
  const processing = useDemoStore((s) => s.processing);
  return (
    <div className={`progress-bar${processing ? ' active' : ''}`}>
      <div className="progress-bar-fill" />
    </div>
  );
}
