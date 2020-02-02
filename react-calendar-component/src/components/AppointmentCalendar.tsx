import React, { useState } from 'react';
import moment from 'moment'


const AppointmentCalendar = () => {
    const [selectedDay, setSelectedDay] = useState<moment.Moment>(moment())

    const previousMonthDays = () => {
        let previousDays: JSX.Element[] = [];
        let firstOfMonth = selectedDay.startOf('month');

        // Check if Month starts with a Sunday
        if (firstOfMonth.day() !== 0) {
            let previousSunday = moment().subtract(1, 'months').endOf('month').day('Sunday');
            let dayDifference = firstOfMonth.diff(previousSunday, 'day') + 1;

            for (let i = 0; i < dayDifference; i++) {
                let date = moment(firstOfMonth);
                date.subtract((dayDifference - i), 'day');
                console.log('date', date)
                previousDays.push(
                    <td key={i}>
                        {date.format('D')}
                    </td>
                )
            }
        }
        return previousDays;
    }

    const getDaysOfMonth = () => {
        let daysOfMonth: JSX.Element[] = [];

        for (let i = 1; i <= selectedDay.daysInMonth(); i++) {
            daysOfMonth.push(
                <td key={i}>
                    {i}
                </td>
            )
        }

        return daysOfMonth;
    }

    const getRows = () => {
        let slots: JSX.Element[] = [...previousMonthDays(), ...getDaysOfMonth()];
        let cells: JSX.Element[];

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

    return <table>
        <thead>
            <tr>
                {moment.weekdaysShort().map(dow => (
                    <th key={dow}>
                        {dow}
                    </th>
                ))}
            </tr>
        </thead>
        <tbody>
            {getRows().map((row, index) => (
                <tr key={index}>{row}</tr>
            ))}
        </tbody>
    </table>
}

export default AppointmentCalendar;