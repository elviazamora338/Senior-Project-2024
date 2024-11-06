import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'
import './Calendar.css'; 


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
    const [period, setPeriod] = useState('Week'); // Default to Week
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [startMonth, setStartMonth] = useState('');
    const [endMonth, setEndMonth] = useState('');
  
    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
        // Reset fields when period changes
        setStartDate('');
        setEndDate('');
        setSelectedDay('');
        setStartMonth('');
        setEndMonth('');
        onDateChange(index, []);
    };
    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        if (period === 'Day') {
            onDateChange(index, [e.target.value]);
        } else if (period === 'Week' && endDate) {
            onDateChange(index, getDatesInRange(e.target.value, endDate));
        }
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        if (period === 'Week' && startDate) {
            onDateChange(index, getDatesInRange(startDate, e.target.value));
        }
    };

    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
        onDateChange(index, [e.target.value]);
    };
    const handleStartMonthChange = (e) => {
        const monthIndex = months.indexOf(e.target.value);
        setStartMonth(monthIndex);
        if (endMonth !== '' && monthIndex <= endMonth) {
            onDateChange(index, getMonthRangeDates(monthIndex, endMonth, new Date().getFullYear()));
        }
    };
    const handleEndMonthChange = (e) => {
        const monthIndex = months.indexOf(e.target.value);
        setEndMonth(monthIndex);
        if (startMonth !== '' && startMonth <= monthIndex) {
            onDateChange(index, getMonthRangeDates(startMonth, monthIndex, new Date().getFullYear()));
        }
    };
  return (
    <tr>
        <td>
            <select id="period" className="form-select" style={{ width: 'fit-content' }} value={period} onChange={handlePeriodChange}>
                <option>Day</option>
                <option>Week</option>
                <option>Month</option>
            </select>
        </td>
        <td>
        {period === 'Day' ? (
            // Day-specific selection
            <div className="col-12 " style={{ width: 'fit-content' }}>
                <input
                    type="date"
                    id="selectedDay"
                    className="form-control mb-3"
                    value={selectedDay}
                    onChange={handleDayChange} />
                
            </div>
        ) : period === 'Month' ? (
          <div className="col-12 " >
            <select value={months[startMonth]} onChange={handleStartMonthChange} className="form-select mb-2" style={{ width: 'fit-content' }}>
                <option value="">Select Month</option>
                {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                ))}
            </select>
            <label htmlFor="endMonth" className="form-label">To</label>
            <select value={months[endMonth]} onChange={handleEndMonthChange}  className="form-select mb-2">
                <option value="">Select Month</option>
                {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                ))}
            </select>
        </div>
        ) : (
            // Week-specific selection (default)
        <div className="col-12">
            <div className="mb-3">
                <input
                    type="date"
                    id="startDate"
                    className="form-control mb-2"
                    value={startDate}
                    onChange={handleStartDateChange} 
                />
                <label htmlFor="endDate" className="form-label">To</label>
                <input
                    type="date"
                    id="endDate"
                    className="form-control"
                    value={endDate}
                    onChange={handleEndDateChange}
                />
            </div>
        </div>
        )}
        </td>
        <td>
            {/* Can make this simpler -E need to work on this */}
            <div class = "row justify-content-center p-8 mt-4 ">
                <div class = "col-6 p-2" style={{ width: 'fit-content' }}>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" value="8am-10am"></input>
                        <label class="form-check-label" style={{ fontSize: '12.5px' }}>8AM-10AM</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" value="8am-10am"></input>
                        <label class="form-check-label" style={{ fontSize: '12.5px' }}>10AM-12PM</label>
                    </div>
                </div>
                <div class = "col-6  p-2" style={{ width: 'fit-content' }}>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" value="8am-10am"></input>
                        <label class="form-check-label" style={{ fontSize: '12.5px' }}>12PM-2PM</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" value="8am-10am"></input>
                        <label class="form-check-label" style={{ fontSize: '12.5px' }}>2PM-4PM</label>
                    </div>
                </div>
            </div>
            
        </td>
        <td>
        <div className="d-flex justify-content-end">
        <button className="btn bg-danger" style={{ width: '40px' }} onClick={() => removeSection(index)}>-</button>
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
                    const isUnavailable = unavailableDates.includes(formattedDate);
                    week.push(
                        <td key={j} style={{ backgroundColor: isUnavailable ? 'orange' : '' }}>{date}</td>
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
                {/* Month Title aligned to the left */}
                <h3 className="mb-0">{months[currentMonth]} {currentYear}</h3>
                
                {/* Navigation Arrows aligned to the right and side-by-side */}
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
            <div class='my-legend'>
                <div class='legend-title'>Availability Legend</div>
                    <div class='legend-scale'>
                        <ul class='legend-labels'>
                            <li><span style={{ backgroundColor: 'orange'}} ></span>Unavailable</li>
                            <li><span style={{ backgroundColor: 'white'}} ></span>Available</li>
                            
                            {/* <li><span style='background:#FFFFB3;'></span>Two</li> */}
                        </ul>
                </div>
            </div>
        </div>
    );
};



function Calendar_Screen() {
    const [availabilityList, setAvailabilityList] = useState([]);
    const [unavailableDates, setUnavailableDates] = useState({});

    const handleAddSection = () => {
        const index = availabilityList.length;
        setAvailabilityList([...availabilityList, { key: index }]);
    };

    const removeSection = (index) => {
        setAvailabilityList(availabilityList.filter((_, i) => i !== index));
        const updatedDates = { ...unavailableDates };
        delete updatedDates[index];
        setUnavailableDates(updatedDates);
    };

    const updateUnavailableDates = (index, dates) => {
        setUnavailableDates(prev => ({ ...prev, [index]: dates }));
    };

    const flattenedUnavailableDates = Object.values(unavailableDates).flat();

    return (
        <div className="container">
            <div className='row'>
                <div className = "col-7 text-start mt-4">
                <h2 >Set Equipment Availability</h2>
                <p className="text-danger" style={{ fontSize: '18px' }}>
                        *By default, every weekday is set to 'available' from 8am-8pm. This page is to set up UNAVAILABILITY.
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
                                <th>Time(s) Unavailable</th>
                                <th>
                                    <button onClick={handleAddSection} className="btn btn-primary">
                                        Add Unavailability
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {availabilityList.map((item, index) => (
                                <Availability
                                    key={item.key}
                                    index={index}
                                    removeSection={removeSection}
                                    onDateChange={updateUnavailableDates}
                                />
                            ))}
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

export default Calendar_Screen;