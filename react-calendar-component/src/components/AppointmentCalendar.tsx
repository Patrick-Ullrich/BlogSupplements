import React, { useState, useEffect } from "react";
import moment from "moment";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  max-width: 350px;
`;

const MonthSelector = styled.div`
  display: flex;
  margin: 10px 0;
  align-items: center;
  justify-content: space-between;
`;

const Month = styled.p`
  font-weight: 700;
  font-size: 14px;
  margin: 0 0 0 8px;
`;

const Year = styled.span`
  font-weight: 400;
  font-size: 14px;
  padding-left: 5px;
`;

const MonthButtons = styled.div``;

const MonthPickButton = styled.button`
  margin: 0 5px;
  border-radius: 6px;
  border: 1px solid #e2e2ea;
  padding: 0;
  color: #92929d;
  background-color: white;
  padding: 6px;

  &:hover {
    cursor: pointer;
  }

  &:focus {
    outline: none;
  }
`;

const WeekDay = styled.th`
  color: #92929d;
  text-transform: uppercase;
  font-size: 12px;
  width: 48px;
  margin: 0 5px;
  height: 39px;
`;

interface DayCellProps {
  readonly outOfRange?: boolean;
  readonly isSelected?: boolean;
}

const EventMarkerWrapper = styled.div`
    width: 100%;
  position: absolute;
  bottom: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const EventMarker = styled.div`
  height: 4px;
  width: 4px;
  margin: 0px 1px;
  border-radius: 50%;
  background-color: rgb(246, 121, 35);
`;

const Day = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90%;
  margin: 15%;
`;

const SelectedDayStyles = css`
  background-color: rgb(246, 121, 35);
  color: white;
  border-radius: 4px;
`;

const DayCell = styled.td<DayCellProps>`
    position: relative;
  height: 48px;
  text-align: center;
  color: ${props => (props.outOfRange ? "#cecece" : "black")};

  > ${Day} {
    ${props => props.isSelected && SelectedDayStyles};
  }

  ${EventMarker} {
    ${props => props.isSelected && "background-color: white"};
  }

  &:hover {
    cursor: pointer;

    > ${Day} {
      ${SelectedDayStyles};
      ${props =>
        !props.isSelected && "background-color: rgba(246, 121, 35, 0.3)"};
    }
  }
`;

interface IProps {
  onDaySelected: (selectedDay: moment.Moment) => void;
  eventDates: moment.Moment[];
  onMonthSelected: (selectedMonth: moment.Moment) => void;
}

const AppointmentCalendar = ({ onDaySelected, eventDates, onMonthSelected }: IProps) => {
  const [selectedDay, setSelectedDay] = useState<moment.Moment>(moment());
  const [selectedMonth, setSelectedMonth] = useState<moment.Moment>(moment());
  const [events, setEvents] = useState<number[]>([]);

  const previousMonthDays = () => {
    let previousDays: JSX.Element[] = [];
    let firstOfMonth = selectedMonth.startOf("month");

    // Check if Month starts with a Sunday
    if (firstOfMonth.day() !== 0) {
      let previousSunday = moment(selectedMonth)
        .subtract(1, "months")
        .endOf("month")
        .day("Sunday");
      let dayDifference = firstOfMonth.diff(previousSunday, "day") + 1;

      for (let i = 0; i < dayDifference; i++) {
        let date = moment(firstOfMonth);
        date.subtract(dayDifference - i, "day");
        previousDays.push(
          <DayCell
            isSelected={date.isSame(selectedDay, "day")}
            onClick={() => setSelectedDay(date)}
            outOfRange={true}
            key={i + 31}
          >
            <Day>{date.format("D")}</Day>
          </DayCell>
        );
      }
    }
    return previousDays;
  };

  const getDaysOfMonth = () => {
    let daysOfMonth: JSX.Element[] = [];

    for (let i = 1; i <= selectedMonth.daysInMonth(); i++) {
      let date = moment(selectedMonth);
      date.set("date", i);
      daysOfMonth.push(
        <DayCell
          isSelected={date.isSame(selectedDay, "day")}
          onClick={() => setSelectedDay(date)}
          key={i}
        >
          <Day>{i}</Day>
          <EventMarkerWrapper>
            {events.length > 0 &&
              [...new Array(events[i - 1])].map((x, index) => (
                <EventMarker key={index} />
              ))}
          </EventMarkerWrapper>
        </DayCell>
      );
    }

    return daysOfMonth;
  };

  const getRows = () => {
    let slots: JSX.Element[] = [...previousMonthDays(), ...getDaysOfMonth()];
    let cells: JSX.Element[] = [];

    return slots.reduce(
      (prev: JSX.Element[][], curr, index) => {
        if (index % 7 === 0) {
          // When we reach 7 days, push new Row
          prev.push(cells);
          // Clear Cells
          cells = [];
        }

        // Push current cell to cells
        cells.push(curr);

        // We reached the end, push last row
        if (index === slots.length - 1) {
          prev.push(cells);
        }
        return prev;
      },
      [[]]
    );
  };

  const onChangeMonth = (months: number) => {
    let newSelectedMonth = moment(selectedMonth);
    newSelectedMonth.add(months, "months");
    setSelectedMonth(newSelectedMonth);
  };

  useEffect(() => {
    if (!selectedDay.isSame(selectedMonth, "month")) {
      let newMonth = moment(selectedMonth);
      newMonth.set("month", selectedDay.get("month"));
      setSelectedMonth(newMonth);
    }

    onDaySelected(selectedDay);
  }, [selectedDay]);

  useEffect(() => {
    let eventArray = [...Array(31)].map(x => 0);
    eventDates.forEach(x => {

        if(moment(x).isSame(selectedMonth, 'month')) {
            let index = +x.format('D') - 1;
            eventArray[index] = eventArray[index] === 3 ? 3 : eventArray[index] + 1;
        }
    });
    setEvents(eventArray);
  }, [eventDates, selectedMonth])

  useEffect(() => {
    onMonthSelected(selectedMonth);
  }, [selectedMonth])

  return (
    <Wrapper>
      <MonthSelector>
        <Month>
          {selectedMonth.format("MMMM")}
          <Year>{selectedMonth.format("YYYY")}</Year>
        </Month>
        <MonthButtons>
          <MonthPickButton onClick={() => onChangeMonth(1)}>🔽</MonthPickButton>
          <MonthPickButton onClick={() => onChangeMonth(-1)}>
            🔼
          </MonthPickButton>
        </MonthButtons>
      </MonthSelector>
      <table>
        <thead>
          <tr>
            {moment.weekdaysShort().map(dow => (
              <WeekDay key={dow}>{dow}</WeekDay>
            ))}
          </tr>
        </thead>
        <tbody>
          {getRows().map((row, index) => (
            <tr key={index}>{row}</tr>
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
};

export default AppointmentCalendar;
