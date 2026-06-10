import { useDemoStore } from '../state/store';
import type { ActorId } from '../types';

const ACTOR_LABEL: Record<ActorId, string> = {
  user: 'USER',
  isp: 'ISP ',
  bca: 'BCA ',
  platform: 'PLAT'
};

type Props = { actorFilter?: ActorId };

export function EventLog({ actorFilter }: Props) {
  const log = useDemoStore((s) => s.log);
  const rows = actorFilter ? log.filter((e) => e.actor === actorFilter) : log;
  if (rows.length === 0) {
    return <div className="event-log faint">No events yet.</div>;
  }
  return (
    <div className="event-log">
      {rows
        .slice()
        .reverse()
        .map((e, i) => (
          <div key={i} className="event-row">
            <span className="event-time">{e.ts}</span>
            <span className="faint">[{ACTOR_LABEL[e.actor]}]</span> {e.message}
          </div>
        ))}
    </div>
  );
}
