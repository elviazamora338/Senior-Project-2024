import React from 'react';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'
import './Calendar.css'; 
import axios from 'axios';
import { useUser } from '../../UserContext';


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
    const [period, setPeriod] = useState('Custom'); // Default to Custom Range
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

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
        // Reset fields when period changes
        setStartDate('');
        setEndDate('');
        setSelectedDay('');
        setStartMonth('');
        setEndMonth('');
        setTimeSelection({
            "8am-10am": false,
            "10am-12pm": false,
            "12pm-2pm": false,
            "2pm-4pm": false
        });
        onDateChange(index, null); // Reset the parent data as well
    };

    const selectedTimes = () => Object.keys(timeSelection).filter(time => timeSelection[time]).join(', ');

    const handleTimeSelection = (timeSlot) => {
        const updatedTimes = { ...timeSelection, [timeSlot]: !timeSelection[timeSlot] };
        setTimeSelection(updatedTimes);

        if (period === 'Custom' && startDate && endDate) {
            // Combine into a single row for Custom Range
            const data = {
                period,
                date: `${startDate} to ${endDate}`,
                time_range: Object.keys(updatedTimes)
                    .filter(time => updatedTimes[time])
                    .join(', ')
            };
            onDateChange(index, data);
        } else if (period === 'Day' && selectedDay) {
            // Handle Day-specific data
            const data = {
                period,
                date: selectedDay,
                time_range: Object.keys(updatedTimes)
                    .filter(time => updatedTimes[time])
                    .join(', ')
            };
            onDateChange(index, data);
        }
    };

    const handleStartDateChange = (e) => {
        setStartDate(e.target.value);
        if (period === 'Custom' && endDate) {
            // Combine into a single row for Custom Range
            const data = {
                period,
                date: `${e.target.value} to ${endDate}`,
                time_range: selectedTimes()
            };
            onDateChange(index, data);
        }
    };

    const handleEndDateChange = (e) => {
        setEndDate(e.target.value);
        if (period === 'Custom' && startDate) {
            // Combine into a single row for Custom Range
            const data = {
                period,
                date: `${startDate} to ${e.target.value}`,
                time_range: selectedTimes()
            };
            onDateChange(index, data);
        }
    };

    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
        if (period === 'Day' && e.target.value) {
            const data = {
                period,
                date: e.target.value,
                time_range: selectedTimes()
            };
            onDateChange(index, data);
        } else {
            onDateChange(index, null); // Clear the parent data if no date is selected
        }
    };

    return (
        <tr>
            <td>
                <select
                    id="period"
                    className="form-select"
                    style={{ width: 'fit-content' }}
                    value={period}
                    onChange={handlePeriodChange}
                >
                    <option>Day</option>
                    <option>Custom</option>
                    {/* <option>Month</option> */}
                </select>
            </td>
            <td>
                {period === 'Day' ? (
                    <div className="col-12" style={{ width: 'fit-content' }}>
                        <input
                            type="date"
                            id="selectedDay"
                            className="form-control mb-3"
                            value={selectedDay}
                            onChange={handleDayChange}
                        />
                    </div>
                ) : period === 'Month' ? (
                    <div className="col-12">
                        <select
                            value={months[startMonth]}
                            onChange={(e) => {
                                const monthIndex = months.indexOf(e.target.value);
                                setStartMonth(monthIndex);
                            }}
                            className="form-select mb-2"
                            style={{ width: 'fit-content' }}
                        >
                            <option value="">Select Month</option>
                            {months.map((month, index) => (
                                <option key={index} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="endMonth" className="form-label">To</label>
                        <select
                            value={months[endMonth]}
                            onChange={(e) => {
                                const monthIndex = months.indexOf(e.target.value);
                                setEndMonth(monthIndex);
                            }}
                            className="form-select mb-2"
                        >
                            <option value="">Select Month</option>
                            {months.map((month, index) => (
                                <option key={index} value={month}>
                                    {month}
                                </option>
                            ))}
                        </select>
                    </div>
                ) : (
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
                <div className="row justify-content-center p-8 mt-4">
                    {Object.keys(timeSelection).map((time) => (
                        <div className="col-6 p-2" style={{ width: 'fit-content' }} key={time}>
                            <div className="form-check form-check-inline">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={timeSelection[time]}
                                    onChange={() => handleTimeSelection(time)}
                                />
                                <label className="form-check-label" style={{ fontSize: '12.5px' }}>
                                    {time}
                                </label>
                            </div>
                        </div>
                    ))}
                </div>
            </td>
            <td>
                <div className="d-flex justify-content-end">
                    <button
                        className="btn bg-danger"
                        style={{ width: '40px' }}
                        onClick={() => removeSection(index)}
                    >
                        -
                    </button>
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

    // Helper function to check if a date is within a range
    const isDateInRange = (date, range) => {
        const [start, end] = range.split(" to ");
        const startDate = new Date(start);
        const endDate = new Date(end);
        const checkDate = new Date(date);
        return checkDate >= startDate && checkDate <= endDate;
    };

    const showCalendar = (month, year) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysCount = daysInMonth(month, year);
        const calendar = [];
        let date = 1;
    
        for (let i = 0; i < 6; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    week.push(<td key={`${i}-${j}`} />);
                } else if (date > daysCount) {
                    break;
                } else {
                    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
                    
                    let dateInfo = unavailableDates[formattedDate];
                    let backgroundColor = 'white'; // Default color
                    
                    // Check for Custom Range entries
                    if (!dateInfo) {
                        for (const [key, value] of Object.entries(unavailableDates)) {
                            if (key.includes(" to ") && isDateInRange(formattedDate, key)) {
                                dateInfo = value; // Use the matching range's info
                                break;
                            }
                        }
                    }
    
                    // Safeguard and normalize `times` property
                    const times = Array.isArray(dateInfo?.times)
                        ? dateInfo.times
                        : typeof dateInfo?.times === 'string'
                            ? dateInfo.times.split(', ')
                            : [];
    
                    // Determine if all time slots are selected
                    const allTimeSlots = ["8am-10am", "10am-12pm", "12pm-2pm", "2pm-4pm"];
                    const allSelected = allTimeSlots.every(slot => times.includes(slot));
    
                    // Determine background color
                    if (dateInfo) {
                        backgroundColor = allSelected
                            ? 'red' // Fully unavailable
                            : times.length > 0
                                ? 'orange' // Partially available
                                : 'white';
                    }
    
                    week.push(
                        <td
                            key={`${i}-${j}`}
                            style={{ backgroundColor, cursor: 'pointer' }}
                            title={times.join(', ') || 'Available'}
                        >
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
                <select
                    value={months[selectedMonth]}
                    onChange={handleMonthChange}
                    className="form-select me-2"
                    style={{ width: '150px' }}
                >
                    {months.map((month, index) => (
                        <option key={index} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
                <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="form-select"
                    style={{ width: '100px' }}
                >
                    {yearOptions.map((year, index) => (
                        <option key={index} value={year}>
                            {year}
                        </option>
                    ))}
                </select>
            </div>
            <div className="my-legend">
                <div className="legend-title">Availability Legend</div>
                <div className="legend-scale">
                    <ul className="legend-labels text-start">
                        <li><span style={{ backgroundColor: 'red' }}></span>Unavailable</li>
                        <li><span style={{ backgroundColor: 'orange' }}></span>Partially available</li>
                        <li><span style={{ backgroundColor: 'white' }}></span>Available</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}


function Calendar_Screen({ device_id }) {
    const { user } = useUser(); // Access user from context
    const [availabilityList, setAvailabilityList] = useState([]);
    const [unavailableDates, setUnavailableDates] = useState({});

    const handleAddSection = () => setAvailabilityList([...availabilityList, { key: availabilityList.length }]);

    const removeSection = (index) => {
        setAvailabilityList(availabilityList.filter((_, i) => i !== index));
        const updatedDates = { ...unavailableDates };
        delete updatedDates[index];
        setUnavailableDates(updatedDates);
    };

    const updateUnavailableDates = (index, dates) => {
        if (!dates) {
            // Clear data for the specific index when it's null or undefined
            setUnavailableDates(prev => {
                const updated = { ...prev };
                delete updated[index];
                return updated;
            });
        } else {
            // Update the data normally when valid dates are provided
            setUnavailableDates(prev => ({ ...prev, [index]: dates }));
        }
    };

    const flattenedUnavailableDates = Object.values(unavailableDates).reduce((acc, dateInfo) => {
        if (!dateInfo || !dateInfo.date) return acc; // Skip invalid or null entries

        // Handle 'Custom Range' as a single entry
        if (dateInfo.date.includes(" to ")) {
            acc[dateInfo.date] = {
                period: dateInfo.period,
                allSelected: dateInfo.allSelected || false,
                times: dateInfo.time_range || [],
            };
        } else {
            // Handle 'Day' or other entries as individual dates
            const dates = Array.isArray(dateInfo.dates) ? dateInfo.dates : [dateInfo.date];
            dates.forEach(date => {
                acc[date] = {
                    period: dateInfo.period,
                    allSelected: dateInfo.allSelected || false,
                    times: dateInfo.time_range || [],
                };
            });
        }

        return acc;
    }, {});

    const saveUnavailableDates = async () => {
        if (Object.keys(flattenedUnavailableDates).length === 0) {
            alert("Please select at least one unavailable date and time.");
            return; // Exit early if no unavailable dates are selected
        }

        // Transform flattenedUnavailableDates into the required format for the backend
        const unavailableEntries = Object.entries(flattenedUnavailableDates).map(([date, info]) => ({
            date, // Directly use the `date` (includes ranges like "2024-12-20 to 2024-12-23")
            period: info.period,
            time_range: info.times, // Already formatted as a string
            device_id: device_id, // Use passed device_id
            owner_id: user.user_id, // Use current user's ID
        }));

        try {
            console.log("Saving unavailable dates:", unavailableEntries); // Debug log
            const response = await axios.post('http://localhost:5001/unavailable', unavailableEntries, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (response.status === 201) {
                alert("Unavailable dates saved successfully!");
            } else {
                console.error("Failed to save unavailable dates:", response.statusText);
                alert("Error saving unavailable dates.");
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while saving unavailable dates.");
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-7 text-start mt-4">
                    <h2>Set Equipment Availability</h2>
                    <p className="text-danger" style={{ fontSize: '18px' }}>
                        *By default, every weekday is set to 'available' from 8am-8pm. This page is to set up UNAVAILABILITY.
                    </p>
                </div>
            </div>
            <div className="row">
                <div className="card col-md-7">
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
            <div className="row mt-3">
                <div className="col-md-12 text-end">
                    <button onClick={saveUnavailableDates} className="btn btn-success">
                        Save Unavailable Dates
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Calendar_Screen;