import importAll from '../utils/importAll.js';

export async function loadEvents(dir) {
  const events = await importAll(dir);
  return events;
}

export function attackAllEvent(hand, events) {
  events.forEach(({ name, event }) => {
    hand.on(name, event.bind(hand));
  });
}
