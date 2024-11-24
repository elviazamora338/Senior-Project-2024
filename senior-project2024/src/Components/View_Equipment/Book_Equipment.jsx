import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'
import './Book_Equipment.css'; 


let months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper functions
const getDatesInRange = (startDate, endDate) => {
    const dates = [];
    let currentDate = new Date(startDate);
    const finalDate = new Date(endDate);
    
    while (currentDate <= finalDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
};

const getMonthRangeDates = (startMonth, endMonth, year) => {
    const dates = [];
    for (let month = startMonth; month <= endMonth; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            dates.push(date.toISOString().split('T')[0]);
        }
    }
    return dates;
};
  
  
function Availability({ index, removeSection, onDateChange }) {
    const [period, setPeriod] = useState('Day'); // Default to Day
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
    const [timeSelection, setTimeSelection] = useState({
        "8am-10am": false,
        "10am-12pm": false,
        "12pm-2pm": false,
        "2pm-4pm": false
    });
    
    const isAllSelected = (times = timeSelection) => Object.values(times).every(selected => selected);
    const selectedTimes = (times = timeSelection) => Object.keys(times).filter(time => times[time]);

     // times chosen
     const handleTimeSelection = (timeSlot) => {
        const updatedTimes = { ...timeSelection, [timeSlot]: !timeSelection[timeSlot] };
        setTimeSelection(updatedTimes);
    
        // Calculate unavailable dates and propagate changes
        onDateChange(index, {
            dates: [selectedDay],
            allSelected: isAllSelected(updatedTimes),
            times: selectedTimes(updatedTimes)
        });
    };
    
    
//     // this is for week
//     const handleStartDateChange = (e) => {
//         setStartDate(e.target.value);
//         if (period === 'Week' && endDate) {
//             onDateChange(index, { dates: getDatesInRange(e.target.value, endDate), allSelected: isAllSelected(), times: selectedTimes() });
//         }
//     };

// //    this is for the week change
//     const handleEndDateChange = (e) => {
//         setEndDate(e.target.value);
//         if (period === 'Week' && startDate) {
//             onDateChange(index, { dates: getDatesInRange(startDate, e.target.value), allSelected: isAllSelected(), times: selectedTimes() });
//         }
//     };

    // Day-specific handler
    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
        onDateChange(index, { dates: [e.target.value], allSelected: isAllSelected(), times: selectedTimes() });
    };
    
    // // Month-specific handlers for start and end months
    // const handleStartMonthChange = (e) => {
    //     const monthIndex = months.indexOf(e.target.value);
    //     setStartMonth(monthIndex);
    //     if (monthIndex !== '' && endMonth !== '') {
    //         const dates = getMonthRangeDates(monthIndex, endMonth, new Date().getFullYear());
    //         onDateChange(index, {
    //             dates,
    //             allSelected: isAllSelected(),
    //             times: selectedTimes()
    //         });
    //     }
    // };
    
    const handleEndMonthChange = (e) => {
        const monthIndex = months.indexOf(e.target.value);
        setEndMonth(monthIndex);
        if (startMonth !== '' && monthIndex !== '' && startMonth <= monthIndex) {
            const dates = getMonthRangeDates(startMonth, monthIndex, new Date().getFullYear());
            onDateChange(index, {
                dates,
                allSelected: isAllSelected(),
                times: selectedTimes()
            });
        }
    };

  return (
    <tr>
        <td>
        <input
            type="text"
            id="model"
            name="model"
            className="form-control deviceDetails"
            value="Day"
        />
        </td>
        <td>
            <div className="col-12 " style={{ width: 'fit-content' }}>
                <input
                    type="date"
                    id="selectedDay"
                    className="form-control mb-3"
                    value={selectedDay}
                    onChange={handleDayChange} />
                
            </div>
        </td>
        <td>
            {/* Can make this simpler -E need to work on this */}
            <div class = "row justify-content-center">
            {Object.keys(timeSelection).map(time => (
                <div class = "col-6 p-2" style={{ width: 'fit-content' }}>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" checked={timeSelection[time]} onChange={() => handleTimeSelection(time)} />
                        <label class="form-check-label" style={{ fontSize: '12.5px' }}>{time}</label>
                    </div>
                </div>
                 ))}
                {/* <div class = "col-6  p-2" style={{ width: 'fit-content' }}>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" value="8am-10am"></input>
                        <label class="form-check-label" style={{ fontSize: '12.5px' }}>12PM-2PM</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" value="8am-10am"></input>
                        <label class="form-check-label" style={{ fontSize: '12.5px' }}>2PM-4PM</label>
                    </div>f
                </div> */}
            </div>
            
        </td>
        <td>
        <div className="d-flex justify-content-end">
            </div>
        </td>
    </tr>
  );
}

function GenerateCalender({ unavailableDates }) {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [selectedYear, setSelectedYear] = useState(currentYear);

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
    
    const showCalendar = (month, year) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysCount = daysInMonth(month, year);
        const calendar = [];
        let date = 1;

        for (let i = 0; i < 6; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    week.push(<td key={j} />);
                } else if (date > daysCount) {
                    break;
                } else {
                    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    const dateInfo = unavailableDates[formattedDate];

                    // Determine the background color based on time slots
                    const backgroundColor = dateInfo
                        ? dateInfo.allSelected
                            ? 'red'  // Completely unavailable
                            : dateInfo.times && dateInfo.times.length > 0
                                ? 'orange'  // Partially available (some time slots are selected)
                                : 'white'  // Available (no time slots selected)
                        : 'white';  // Default to white if no data

                    week.push(
                        <td key={j} style={{ backgroundColor }}>
                            {date}
                        </td>
                    );
                    date++;
                }
            }
            calendar.push(<tr key={i}>{week}</tr>);
        }
        return calendar;
    };

    const nextMonth = () => {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear(currentYear + 1);
        } else {
            setCurrentMonth(currentMonth + 1);
        }
    };

    const previousMonth = () => {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear(currentYear - 1);
        } else {
            setCurrentMonth(currentMonth - 1);
        }
    };

    const handleMonthChange = (e) => {
        const monthIndex = months.indexOf(e.target.value);
        setSelectedMonth(monthIndex);
        setCurrentMonth(monthIndex);
    };

    const handleYearChange = (e) => {
        setSelectedYear(Number(e.target.value));
        setCurrentYear(Number(e.target.value));
    };

    const yearOptions = [];
    for (let year = currentYear - 5; year <= currentYear + 5; year++) {
        yearOptions.push(year);
    }

    return (
        <div>
            <div className="row justify-content-between align-items-center">
                <h3 className="mb-0">{months[currentMonth]} {currentYear}</h3>
                <div className="d-flex justify-content-end">
                    <button
                        className="btn btn-warning bi bi-chevron-left me-2"
                        onClick={previousMonth}
                        aria-label="Previous Month"
                    ></button>
                    <button
                        className="btn btn-warning bi bi-chevron-right"
                        onClick={nextMonth}
                        aria-label="Next Month"
                    ></button>
                </div>
            </div>

            <table className="table table-bordered text-center mt-3">
                <thead>
                    <tr>
                        {days.map(day => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {showCalendar(currentMonth, currentYear)}
                </tbody>
            </table>

            <div className="d-flex justify-content-center mb-3">
                <select value={months[selectedMonth]} onChange={handleMonthChange} className="form-select me-2" style={{ width: '150px' }}>
                    <option value="">Select Month</option>
                    {months.map((month, index) => (
                        <option key={index} value={month}>{month}</option>
                    ))}
                </select>
                <select value={selectedYear} onChange={handleYearChange} className="form-select" style={{ width: '100px' }}>
                    <option value="">Select Year</option>
                    {yearOptions.map((year, index) => (
                        <option key={index} value={year}>{year}</option>
                    ))}
                </select>
            </div>

            <div className="my-legend">
                <div className="legend-title">Availability Legend</div>
                <div className="legend-scale">
                    <ul className="legend-labels text-start">
                        <li><span style={{ backgroundColor: 'red' }}></span>Unavailable</li>
                        <li><span style={{ backgroundColor: 'orange' }} ></span>Partially available</li>
                        <li><span style={{ backgroundColor: 'white' }} ></span>Available</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}




function Book_Equipment() {
    const [unavailableDates, setUnavailableDates] = useState({});

    const updateUnavailableDates = (index, dates) => {
        console.log("Index1:", ([index]))
        setUnavailableDates(prev => ({ ...prev, [index]: dates }));
        console.log("Index2:", dates)
    };
    

    const flattenedUnavailableDates = Object.values(unavailableDates).reduce((acc, dateInfo) => {
        const dates = dateInfo.dates || []; // Default to an empty array if dates is undefined
        dates.forEach(date => {
            acc[date] = { allSelected: dateInfo.allSelected, times: dateInfo.times };
            console.log(acc[date]);
        });
        return acc;
    }, {});
    

    return (
        <div className="container">
            <div className='row'>
                <div className = "col-7 text-start">
                <h2>Book Equipment</h2>
                <p className="text-danger" style={{ fontSize: '18px' }}>
                        *Select a day and a 2-hour increment time slot to book the selected device
                </p>
                </div>
            </div>
            <div className="row">
                <div className=" card col-md-7">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Date(s)</th>
                                <th>Time(s) Available</th>
                            </tr>
                        </thead>
                        <tbody>
                        <Availability
                            key={0}
                            index={0}
                            onDateChange={updateUnavailableDates}
                        />
                        </tbody>
                    </table>
                </div>
                <div className="col-md-5">
                    <GenerateCalender unavailableDates={flattenedUnavailableDates} />
                </div>
            </div>

            
            </div>
    );
}

export default Book_Equipment;