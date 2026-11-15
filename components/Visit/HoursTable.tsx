'use client';

import { useSyncExternalStore } from 'react';
import { hours, timeZone } from '@/lib/business';

// Today is computed in America/New_York after mount (never during prerender).
const order = [2, 3, 4, 5, 6, 0, 1]; // Tue to Mon
const subscribe = () => () => {};
const todayNY = () => {
  const name = new Intl.DateTimeFormat('en-US', { timeZone, weekday: 'long' }).format(new Date());
  return hours.findIndex((h) => h.day === name);
};

export function HoursTable() {
  const today = useSyncExternalStore(subscribe, todayNY, () => -1);
  return (
    <table className="w-full text-left">
      <caption className="sr-only">Opening hours</caption>
      <tbody>
        {order.map((i) => {
          const h = hours[i];
          const isToday = i === today;
          return (
            <tr key={h.day} className={`border-b border-seam last:border-0 ${isToday ? 'font-semibold text-rose' : ''}`}>
              <th scope="row" className="py-2 pr-4 font-[inherit]">
                {h.day}
                {isToday ? <span className="ml-2 rounded-full bg-rose px-2 py-0.5 text-[0.75rem] font-semibold text-on-rose">Today</span> : null}
              </th>
              <td className={`py-2 text-right ${h.open ? '' : 'text-barnwood'}`}>{h.label}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
