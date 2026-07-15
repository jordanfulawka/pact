import { useAuth } from '@/contexts/AuthProvider';
import { getCheckIns as apiGetCheckIns } from '@/lib/api';
import { Pact } from '@/lib/types';
import { useEffect, useState } from 'react';

function parseDate(date: string) {
  const parsedDate = date.split('-');
  return new Date(
    Number(parsedDate[0]),
    Number(parsedDate[1]) - 1,
    Number(parsedDate[2]),
  );
}

function PactCalendar({ pact }: { pact: Pact }) {
  const [days, setDays] = useState<number | null>(null);
  const [checkIns, setCheckIns] = useState<any[]>([]);
  const { token, user } = useAuth();

  useEffect(() => {
    if (!pact.start_date) return;
    if (!pact.end_date) return;

    const startDate = parseDate(pact.start_date);
    const endDate = parseDate(pact.end_date);

    const currentDate = new Date(startDate);
    const dateArray: { dateStr: string; dateObj: Date }[] = [];

    while (currentDate <= endDate) {
      // dateArray.push(
      //   currentDate.getFullYear() +
      //     '-' +
      //     (currentDate.getMonth() + 1) +
      //     '-' +
      //     currentDate.getDate(),
      // );
      dateArray.push({
        dateStr:
          currentDate.getFullYear() +
          '-' +
          (currentDate.getMonth() + 1) +
          '-' +
          currentDate.getDate(),
        dateObj: new Date(currentDate),
      });
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDays(dateArray);

    async function getCheckIns() {
      if (!token) return;
      const result = await apiGetCheckIns(token, pact.id);
      const checkInArray: any[] = [];
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      dateArray.forEach((day, index) => {
        const currentDateCheckIns = result.result.filter((checkIn) => {
          const parsedDate = parseDate(checkIn.date);
          const checkInDate =
            parsedDate.getFullYear() +
            '-' +
            (parsedDate.getMonth() + 1) +
            '-' +
            parsedDate.getDate();
          return checkInDate === day.dateStr;
        });
        let status: 'past' | 'today' | 'future';
        if (day.dateObj.getTime() === today.getTime()) {
          status = 'today';
        } else if (day.dateObj < today) {
          status = 'past';
        } else {
          status = 'future';
        }
        const checkInObject = {
          day: index + 1,
          date: day.dateStr,
          checkIns: currentDateCheckIns,
          status,
        };
        checkInArray.push(checkInObject);
      });
      setCheckIns(checkInArray);
    }
    getCheckIns();
  }, [pact]);

  useEffect(() => {
    console.log(days);
    console.log(checkIns);
    console.log(pact);
  }, [days, checkIns, pact]);

  // ${checkIn.status === 'today' ? 'bg-primary-accent/15 border border-primary-accent' : checkIn.status === 'future' ? 'bg-background-modal border border-text-secondary border-dashed' : }
  return (
    <div>
      <div className='flex gap-5 mb-3'>
        {checkIns.map((checkIn) => {
          return (
            <div
              key={checkIn.day}
              className={`w-8 h-8 flex justify-center items-center rounded-full ${checkIn.status === 'today' ? 'bg-primary-accent/15 border border-primary-accent' : checkIn.status === 'future' ? 'bg-background-modal border border-text-secondary border-dashed' : checkIn.checkIns.length === 0 ? 'bg-[#af2c23]/30' : checkIn.checkIns.length < 2 ? 'bg-[#F5b944]/50' : 'bg-primary-accent'}`}
            >
              {checkIn.day}
            </div>
          );
        })}
      </div>
      <div className='flex gap-5 text-sm font-light text-text-secondary/50'>
        <div className='flex gap-2'>
          <div className='w-5 h-5 rounded-full bg-primary-accent' />
          Both checked in
        </div>
        <div className='flex gap-2'>
          <div className='w-5 h-5 rounded-full bg-[#F5b944]/50' />
          One checked in
        </div>
        <div className='flex gap-2'>
          <div className='w-5 h-5 rounded-full bg-[#af2c23]/30' />
          Missed
        </div>
        <div className='flex gap-2'>
          <div className='w-5 h-5 rounded-full bg-primary-accent/15 border border-primary-accent' />
          Today
        </div>
        <div className='flex gap-2'>
          <div className='w-5 h-5 rounded-full bg-background-modal border border-text-secondary border-dashed' />
          Future
        </div>
      </div>
    </div>
  );
}

export default PactCalendar;
