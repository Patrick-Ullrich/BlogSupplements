import React, { useState } from 'react';
import moment from 'moment'


const AppointmentCalendar = () => {
    const [selectedDay, setSelectedDay] = useState<moment.Moment>(moment())

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
        let slots = getDaysOfMonth();
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
        <tbody>
            {getRows().map((row, index) => (
                <tr key={index}>{row}</tr>
            ))}
        </tbody>
    </table>
}

export default AppointmentCalendar;