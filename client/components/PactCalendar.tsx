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
  const { token } = useAuth();

  useEffect(() => {
    if (!pact.start_date) return;
    if (!pact.end_date) return;

    const startDate = parseDate(pact.start_date);
    const endDate = parseDate(pact.end_date);

    const currentDate = new Date(startDate);
    const dateArray: string[] = [];

    while (currentDate <= endDate) {
      dateArray.push(
        currentDate.getFullYear() +
          '-' +
          currentDate.getMonth() +
          '-' +
          currentDate.getDate(),
      );
      currentDate.setDate(currentDate.getDate() + 1);
    }

    setDays(dateArray);

    async function getCheckIns() {
      if (!token) return;
      const result = await apiGetCheckIns(token, pact.id);
      const checkInArray: string[] = [];
      dateArray.forEach((date) => {
        const currentDateCheckIns = result.result.filter((checkIn) => {
          const parsedDate = parseDate(checkIn.date);
          const checkInDate =
            parsedDate.getFullYear() +
            '-' +
            parsedDate.getMonth() +
            '-' +
            parsedDate.getDate();
          return checkInDate === date;
        });
        const checkInObject = {
          [date]: currentDateCheckIns,
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
  }, [days, checkIns]);

  return <div>test</div>;
}

export default PactCalendar;
