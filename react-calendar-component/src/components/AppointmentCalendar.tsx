import React, { useState } from 'react';
import moment from 'moment'
import styled from 'styled-components'

const Wrapper = styled.div`
    max-width: 350px;
`

const MonthSelector = styled.div`
    display: flex;
    margin: 10px 0;
    align-items: center;
    justify-content: space-between;
`

const Month = styled.p`
    font-weight: 700;
    font-size: 14px;
    margin: 0 0 0 8px;
`

const Year = styled.span`
    font-weight: 400;
    font-size: 14px;
    padding-left: 5px;
`

const MonthButtons = styled.div`

`

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
`

const WeekDay = styled.th`
    color: #92929d;
    text-transform: uppercase;
    font-size: 12px;
    width: 48px;
    margin: 0 5px;
    height: 39px;
`

const DayCell = styled.td`
    height: 48px;
    text-align: center;

    &:hover {
        cursor: pointer;
    }
`

const AppointmentCalendar = () => {
    const [selectedDay, setSelectedDay] = useState<moment.Moment>(moment())
    const [selectedMonth, setSelectedMonth] = useState<moment.Moment>(moment());

    const previousMonthDays = () => {
        let previousDays: JSX.Element[] = [];
        let firstOfMonth = selectedMonth.startOf('month');

        // Check if Month starts with a Sunday
        if (firstOfMonth.day() !== 0) {
            let previousSunday = moment(selectedMonth).subtract(1, 'months').endOf('month').day('Sunday');
            let dayDifference = firstOfMonth.diff(previousSunday, 'day') + 1;

            for (let i = 0; i < dayDifference; i++) {
                let date = moment(firstOfMonth);
                date.subtract((dayDifference - i), 'day');
                previousDays.push(
                    <DayCell key={i + 31}>
                        {date.format('D')}
                    </DayCell>
                )
            }
        }
        console.log('previousDays', previousDays)
        return previousDays;
    }

    const getDaysOfMonth = () => {
        let daysOfMonth: JSX.Element[] = [];

        for (let i = 1; i <= selectedMonth.daysInMonth(); i++) {
            daysOfMonth.push(
                <DayCell key={i}>
                    {i}
                </DayCell>
            )
        }

        return daysOfMonth;
    }

    const getRows = () => {
        let slots: JSX.Element[] = [...previousMonthDays(), ...getDaysOfMonth()];
        console.log('slots', slots)
        let cells: JSX.Element[] = [];

        return slots.reduce((prev: JSX.Element[][], curr, index) => {
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
        }, [[]])
    }

    const onChangeMonth = (months: number) => {
        let newSelectedMonth = moment(selectedMonth);
        newSelectedMonth.add(months, 'months');
        setSelectedMonth(newSelectedMonth);
    }

    return (
        <Wrapper>
            <MonthSelector>
                <Month>
                    {selectedMonth.format('MMMM')}
                    <Year>{selectedMonth.format('YYYY')}</Year>
                </Month>
                <MonthButtons>
                    <MonthPickButton onClick={() => onChangeMonth(1)}>
                        🔽
                    </MonthPickButton>
                    <MonthPickButton onClick={() => onChangeMonth(-1)}>
                        🔼
                    </MonthPickButton>
                </MonthButtons>
            </MonthSelector>
            <table>
                <thead>
                    <tr>
                        {moment.weekdaysShort().map(dow => (
                            <WeekDay key={dow}>
                                {dow}
                            </WeekDay>
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
    )
}

export default AppointmentCalendar;