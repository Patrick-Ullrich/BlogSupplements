import React, { useState } from "react";
import AppointmentCalendar from "./components/AppointmentCalendar";
import moment from "moment";

const App = () => {
  const [selectedMonth, setSelectedMonth] = useState<moment.Moment>(moment());

  const randomDay = (max: number) => {
    return 1 + Math.floor((max - 1) * Math.random());
  };

  const generateRandomDays = (currentMonth: moment.Moment) => {
    let events = [];
    let maxDay = +currentMonth.endOf("month").format("D");
    for (let i = 0; i < 40; i++) {
      let newDate = moment(currentMonth);
      newDate.set("date", randomDay(maxDay));
      events.push(newDate);
    }
    return events;
  };

  return (
    <div className="App">
      <AppointmentCalendar
        eventDates={generateRandomDays(selectedMonth)}
        onMonthSelected={setSelectedMonth}
        onDaySelected={selected => {
          console.log("date", selected);
        }}
      />
    </div>
  );
};

export default App;
