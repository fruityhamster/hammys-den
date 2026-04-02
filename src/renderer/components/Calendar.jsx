import { useState } from "react";
import Calendar from "react-calendar";
import 'react-calendar/dist/Calendar.css';

function MyCalendar() {
  const [date, setDate] = useState(new Date());

  return (
    <div>
      <h2>Calendário</h2>
      <Calendar value={date} onChange={setDate} />
    </div>
  );
}

export default MyCalendar;