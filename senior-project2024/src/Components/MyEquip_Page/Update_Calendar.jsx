import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css';
import axios from 'axios';
import { useUser } from '../../UserContext';

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Helper function to get dates in a custom range
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

function Availability({ index, removeSection, onDateChange, existingEntry }) {
    const [period, setPeriod] = useState('Custom'); // Default to Custom
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDay, setSelectedDay] = useState('');
    const [timeSelection, setTimeSelection] = useState({
        "8am-10am": false,
        "10am-12pm": false,
        "12pm-2pm": false,
        "2pm-4pm": false
    });

    useEffect(() => {
        // Populate the time selection and date when editing an existing entry
        if (existingEntry) {
            const { date, time_range, period } = existingEntry;
            setPeriod(period);
            if (period === 'Day') {
                setSelectedDay(date);
            } else if (period === 'Custom') {
                const [start, end] = date.split(' to ');
                setStartDate(start);
                setEndDate(end);
            }

            const times = time_range.split(', ').reduce((acc, time) => {
                acc[time] = true;
                return acc;
            }, {});
            setTimeSelection({ ...timeSelection, ...times });
        }
    }, [existingEntry]);

    const handlePeriodChange = (e) => {
        setPeriod(e.target.value);
        // Reset fields when period changes
        setStartDate('');
        setEndDate('');
        setSelectedDay('');
        setTimeSelection({
            "8am-10am": false,
            "10am-12pm": false,
            "12pm-2pm": false,
            "2pm-4pm": false
        });
        onDateChange(index, []);
    };

    const isAllSelected = (times = timeSelection) => Object.values(times).every(selected => selected);
    const selectedTimes = (times = timeSelection) => Object.keys(times).filter(time => times[time]);

    const handleTimeSelection = (timeSlot) => {
        const updatedTimes = { ...timeSelection, [timeSlot]: !timeSelection[timeSlot] };
        setTimeSelection(updatedTimes);

        // Update unavailable dates for each selected/unselected slot immediately
        onDateChange(index, {
            dates: period === 'Day' ? [selectedDay] : getDatesInRange(startDate, endDate),
            period,
            allSelected: isAllSelected(updatedTimes),
            times: selectedTimes(updatedTimes)
        });
    };

    const handleStartDateChange = (e) => {
        const newStartDate = e.target.value;
        setStartDate(newStartDate);
        if (period === 'Custom' && endDate) {
            const newDates = getDatesInRange(newStartDate, endDate);
            onDateChange(index, {
                dates: newDates,
                period,
                allSelected: isAllSelected(),
                times: selectedTimes(),
            });
        }
    };
    
    const handleEndDateChange = (e) => {
        const newEndDate = e.target.value;
        setEndDate(newEndDate);
        if (period === 'Custom' && startDate) {
            const newDates = getDatesInRange(startDate, newEndDate);
            onDateChange(index, {
                dates: newDates,
                period,
                allSelected: isAllSelected(),
                times: selectedTimes(),
            });
        }
    };
    

    // const handleStartDateChange = (e) => {
    //     setStartDate(e.target.value);
    //     if (period === 'Custom' && endDate) {
    //         onDateChange(index, { dates: getDatesInRange(e.target.value, endDate), period, allSelected: isAllSelected(), times: selectedTimes() });
    //     }
    // };

    // const handleEndDateChange = (e) => {
    //     setEndDate(e.target.value);
    //     if (period === 'Custom' && startDate) {
    //         onDateChange(index, { dates: getDatesInRange(startDate, e.target.value), period, allSelected: isAllSelected(), times: selectedTimes() });
    //     }
    // };

    const handleDayChange = (e) => {
        setSelectedDay(e.target.value);
        onDateChange(index, { dates: [e.target.value], period, allSelected: isAllSelected(), times: selectedTimes() });
    };

    return (
        <tr>
            <td>
                <select
                    className="form-select"
                    value={period}
                    onChange={handlePeriodChange}
                >
                    <option value="Day">Day</option>
                    <option value="Custom">Custom Range</option>
                </select>
            </td>
            <td>
                {period === 'Day' && (
                    <input
                        type="date"
                        className="form-control"
                        value={selectedDay}
                        onChange={handleDayChange}
                    />
                )}
                {period === 'Custom' && (
                    <>
                        <input
                            type="date"
                            className="form-control mb-2"
                            value={startDate}
                            onChange={handleStartDateChange}
                        />
                        <input
                            type="date"
                            className="form-control"
                            value={endDate}
                            onChange={handleEndDateChange}
                        />
                    </>
                )}
            </td>
            <td>
                {Object.keys(timeSelection).map((time) => (
                    <div key={time} className="form-check form-check-inline">
                        <input
                            className="form-check-input"
                            type="checkbox"
                            checked={timeSelection[time]}
                            onChange={() => handleTimeSelection(time)}
                        />
                        <label className="form-check-label">{time}</label>
                    </div>
                ))}
            </td>
            <td>
                <button
                    className="btn btn-danger"
                    onClick={() => removeSection(index)}
                >
                    -
                </button>
            </td>
        </tr>
    );
}


function GenerateCalender({ unavailableDates }) {
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    const daysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();

    const showCalendar = (month, year) => {
        const firstDay = new Date(year, month, 1).getDay();
        const daysCount = daysInMonth(month, year);
        const calendar = [];
        let date = 1;
    
        for (let i = 0; i < 6; i++) {
            const row = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    row.push(<td key={j} />);
                } else if (date > daysCount) {
                    break;
                } else {
                    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(date).padStart(2, '0')}`;
    
                    // Check if this date is part of any unavailable entry
                    const dateInfo = unavailableDates.find((entry) => entry.dates.includes(formattedDate));
    
                    let backgroundColor = 'white'; // Default is available
                    if (dateInfo) {
                        const timesSelected = dateInfo.times.length;
                        const allTimesSelected = timesSelected === 4; // Adjust if there are more time slots
                        const someTimesSelected = timesSelected > 0 && timesSelected < 4;
    
                        if (allTimesSelected) {
                            backgroundColor = 'red'; // Fully unavailable
                        } else if (someTimesSelected) {
                            backgroundColor = 'orange'; // Partially unavailable
                        }
                    }
    
                    row.push(
                        <td
                            key={j}
                            style={{
                                backgroundColor,
                                color: backgroundColor === 'white' ? 'black' : 'white',
                            }}
                        >
                            {date}
                        </td>
                    );
                    date++;
                }
            }
            calendar.push(<tr key={i}>{row}</tr>);
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

    return (
        <div>
            <div className="row justify-content-between align-items-center">
                <h3 className="mb-0">{new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' })} {currentYear}</h3>
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
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <th key={day}>{day}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>{showCalendar(currentMonth, currentYear)}</tbody>
            </table>
            <div className="my-legend">
                <div className="legend-title">Availability Legend</div>
                <div className="legend-scale">
                    <ul className="legend-labels text-start">
                        <li><span style={{ backgroundColor: 'red' }}></span>Unavailable</li>
                        <li><span style={{ backgroundColor: 'orange' }}></span>Partially available</li>
                        <li><span style={{ backgroundColor: 'white', border: '1px solid black' }}></span>Available</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}


function Update_Calendar({ device_id }) {
    const { user } = useUser();
    const [availabilityList, setAvailabilityList] = useState([]);
    const [unavailableDates, setUnavailableDates] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUnavailableTimes = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/unavailable/by-device/${device_id}`);
                console.log('API response:', response.data);
        
                const unavailableData = response.data;
        
                if (!Array.isArray(unavailableData)) {
                    throw new Error('Invalid response format. Expected an array.');
                }
        
                const initialList = unavailableData.map((entry, index) => {
                    const { period, date, time_range } = entry;
        
                    // Parse the date for Custom periods
                    const dates =
                        period === 'Custom'
                            ? getDatesInRange(...date.split(' to ')) // Calculate all dates in the range
                            : [date]; // Single date for Day
        
                    return {
                        key: entry.unavailability_id || index,
                        period: period || 'Day',
                        dates,
                        times: time_range ? time_range.split(', ') : [],
                    };
                });
        
                setAvailabilityList(initialList);
        
                const initialDates = unavailableData.reduce((acc, entry) => {
                    const { period, date, time_range } = entry;
        
                    // Parse the date for Custom periods and calculate full range
                    const dates =
                        period === 'Custom'
                            ? getDatesInRange(...date.split(' to '))
                            : [date]; // Single date for Day
        
                    dates.forEach((d) => {
                        acc[d] = {
                            dates,
                            times: time_range ? time_range.split(', ') : [],
                            period,
                            allSelected: true,
                        };
                    });
                    return acc;
                }, {});
        
                setUnavailableDates(initialDates);
            } catch (error) {
                console.error('Error fetching unavailable times:', error.message);
                setError('Failed to load unavailable times.');
            } finally {
                setIsLoading(false);
            }
        };

            fetchUnavailableTimes();
        }, [device_id]);


    const handleAddSection = () => {
        setAvailabilityList([
            ...availabilityList,
            { key: Date.now(), period: 'Day', dates: [''], times: [], existingEntry: null },
        ]);
    };

    const removeSection = (index) => {
        setAvailabilityList(availabilityList.filter((_, i) => i !== index));
    };
    

    const updateUnavailableDates = (index, field, value) => {
        setAvailabilityList((prev) =>
            prev.map((item, i) =>
                i === index ? { ...item, [field]: value } : item
            )
        );
    };

    const saveUnavailableDates = async () => {
        if (availabilityList.length === 0) {
            alert('Please add at least one unavailable date.');
            return;
        }

        try {
            // Step 1: Delete existing unavailable entries for the device
            await axios.delete(`http://localhost:5001/unavailable/device/${device_id}`);

            // Step 2: Prepare the data for saving
            const entriesToSave = availabilityList.map((item) => {
                const { period, dates, times } = item;

                // Convert Custom ranges into a single string
                const date =
                    period === 'Custom'
                        ? `${dates[0]} to ${dates[1]}` // Store the date range as a single string
                        : dates[0]; // Single date for Day

                return {
                    date,
                    time_range: times.join(', '),
                    period,
                    device_id,
                    owner_id: user.user_id,
                };
            });

            console.log('Entries to save:', entriesToSave); // Debug log for payload

            // Step 3: Post the new unavailable entries to the backend
            const response = await axios.post('http://localhost:5001/unavailable', entriesToSave, {
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.status === 201) {
                alert('Unavailable dates saved successfully!');
            } else {
                throw new Error('Failed to save unavailable dates.');
            }
        } catch (error) {
            console.error('Error saving unavailable dates:', error.message);
            alert('An error occurred while saving unavailable dates.');
        }
    };

    if (isLoading) return <p>Loading unavailable times...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="container">
            <div className="row">
                <div className="col-7">
                    <h2>Set Equipment Availability</h2>
                    <p>*By default, every day is available from 8am-8pm. Configure unavailability here.</p>
                </div>
            </div>
            <div className="row">
                <div className="col-md-7">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Period</th>
                                <th>Date(s)</th>
                                <th>Time(s) Unavailable</th>
                                <th>
                                    <button onClick={handleAddSection} className="btn btn-primary">
                                        Add
                                    </button>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {availabilityList.map((item, index) => (
                                <tr key={item.key}>
                                    <td>
                                        <select
                                            value={item.period}
                                            onChange={(e) =>
                                                updateUnavailableDates(index, 'period', e.target.value)
                                            }
                                            className="form-select"
                                        >
                                            <option value="Day">Day</option>
                                            <option value="Custom">Custom Range</option>
                                        </select>
                                    </td>
                                    <td>
                                        {item.period === 'Day' && (
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={item.dates[0]}
                                                onChange={(e) =>
                                                    updateUnavailableDates(index, 'dates', [e.target.value])
                                                }
                                            />
                                        )}
                                        {item.period === 'Custom' && (
                                            <>
                                                <input
                                                    type="date"
                                                    className="form-control mb-2"
                                                    value={item.dates[0]}
                                                    onChange={(e) =>
                                                        updateUnavailableDates(index, 'dates', [
                                                            e.target.value,
                                                            item.dates[1],
                                                        ])
                                                    }
                                                />
                                                <input
                                                    type="date"
                                                    className="form-control"
                                                    value={item.dates[1]}
                                                    onChange={(e) =>
                                                        updateUnavailableDates(index, 'dates', [
                                                            item.dates[0],
                                                            e.target.value,
                                                        ])
                                                    }
                                                />
                                            </>
                                        )}
                                    </td>
                                    <td>
                                        <div>
                                            {['8am-10am', '10am-12pm', '12pm-2pm', '2pm-4pm'].map(
                                                (timeRange) => (
                                                    <label key={timeRange} className="d-block">
                                                        <input
                                                            type="checkbox"
                                                            checked={item.times.includes(timeRange)}
                                                            onChange={(e) => {
                                                                const newTimes = e.target.checked
                                                                    ? [...item.times, timeRange]
                                                                    : item.times.filter(
                                                                          (time) => time !== timeRange
                                                                      );
                                                                updateUnavailableDates(index, 'times', newTimes);
                                                            }}
                                                        />{' '}
                                                        {timeRange}
                                                    </label>
                                                )
                                            )}
                                        </div>
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => removeSection(index)}
                                            className="btn btn-danger"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="col-md-5">
                    <GenerateCalender unavailableDates={availabilityList} />
                </div>
            </div>
            <div className="row mt-3">
                <div className="col-md-12 text-end">
                    <button onClick={saveUnavailableDates} className="btn btn-success">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Update_Calendar;