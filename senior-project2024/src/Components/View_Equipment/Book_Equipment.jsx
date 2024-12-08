import React, { useEffect, useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import 'bootstrap-icons/font/bootstrap-icons.css'
import './Book_Equipment.css'; 
import { useUser } from '../../UserContext'; // Imports the custom hook
import axios from 'axios';


let months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Helper functions
// const getMonthRangeDates = (startMonth, endMonth, year) => {
//     const dates = [];
//     for (let month = startMonth; month <= endMonth; month++) {
//         const daysInMonth = new Date(year, month + 1, 0).getDate();
//         for (let day = 1; day <= daysInMonth; day++) {
//             const date = new Date(year, month, day);
//             dates.push(date.toISOString().split('T')[0]);
//         }
//     }
//     return dates;
// };
  
  
const Availability = ({ index, onDateChange, unavailableDates }) => {
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
    
    const isUnavailable = (timeSlot) => unavailableDates[selectedDay]?.times?.includes(timeSlot) || false;    

    const isAllSelected = (times = timeSelection) => Object.values(times).every(selected => selected);
    const selectedTimes = (times = timeSelection) => Object.keys(times).filter(time => times[time]);

    // Time selection handler (select only one time slot)
     const handleTimeSelection = (timeSlot) => {
        const updatedTimes = {
            "8am-10am": false,
            "10am-12pm": false,
            "12pm-2pm": false,
            "2pm-4pm": false,
            [timeSlot]: !timeSelection[timeSlot],
        };
    
        setTimeSelection(updatedTimes);
    
        // Propagate changes
        onDateChange(index, {
            dates: [selectedDay],
            allSelected: false, // Only one slot is selected
            times: selectedTimes(updatedTimes),
        });
    };

    const handleDayChange = (e) => {
        const newSelectedDay = e.target.value;
        setSelectedDay(newSelectedDay);
        onDateChange(index, {
            dates: [newSelectedDay],
            allSelected: Object.values(timeSelection).every(selected => selected),
            times: selectedTimes()
        });
    };
    
    const dateInfo = unavailableDates[selectedDay]; 


  return (
    <tr>
        <td>
        <input
            type="text"
            id="model"
            name="model"
            className="form-control deviceDetails"
            value="Day"
            readOnly
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
            <div className="row justify-content-center">
            {Object.keys(timeSelection).map((time) => {
                const isDisabled = isUnavailable(time);  // Check if time is unavailable
                const labelStyle = {
                textDecoration: isDisabled ? 'line-through' : 'none',  // Only strike through if unavailable
                color: isDisabled ? 'red' : 'black',  // Change color if unavailable
                fontSize: '12.5px',
                };

                return (
                <div key={time} className="col-6 p-2" style={{ width: 'fit-content' }}>
                    <div className="form-check form-check-inline">
                    <input
                        className="form-check-input"
                        type="checkbox"
                        checked={timeSelection[time]}
                        onChange={() => handleTimeSelection(time)}
                        disabled={isDisabled}  // Disable checkbox if time is unavailable
                    />
                    <label className="form-check-label" style={labelStyle}>
                        {time}
                    </label>
                    </div>
                </div>
                );
            })}
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

const Book_Equipment = ( {device, ownerId} ) => {
    const { user } = useUser(); // Access user from context
    const [selectedDay, setSelectedDay] = useState(null);  // Initialize selectedDay
    const [selectedTimes, setSelectedTimes] = useState([]);  // Initialize selectedTimes
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [errorMessage, setErrorMessage] = useState(''); // State for the error message
    const [unavailableDates, setUnavailableDates] = useState({});
    const [showConfirmationModal, setShowConfirmationModal] = useState(false);
    const [bookingDetails, setBookingDetails] = useState({});
    const handleShowConfirmationModal = () => setShowConfirmationModal(true);

    // Fetch unavailable dates
    useEffect(() => {
        const fetchUnavailableDates = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/api/unavailableDates/${device.device_id}`);
                console.log('API Response:', response.data); // Add this line
                const unavailableData = response.data.reduce((acc, { date, time_range }) => {
                    if (!acc[date]) acc[date] = { times: [] };
                    acc[date].times.push(time_range);
                    return acc;
                }, {});
                setUnavailableDates(unavailableData);
            } catch (error) {
                console.error('Error fetching unavailable dates:', error);
            }
        };
    
        fetchUnavailableDates();
    }, [device.device_id]);
    
    // Refresh calendar after booking confirmation
    const refreshUnavailableDates = async () => {
        try {
            const response = await axios.get(`http://localhost:5001/api/unavailableDates/${device.device_id}`);
            const updatedData = response.data.reduce((acc, { date, time_range }) => {
                if (!acc[date]) acc[date] = { times: [] };
                acc[date].times.push(time_range);
                return acc;
            }, {});
            setUnavailableDates(updatedData);
        } catch (error) {
            console.error('Error refreshing unavailable dates:', error);
        }
    };
    
    // Call this after confirmation
    refreshUnavailableDates();
    
    const handleSubmitBookingRequest = async () => {
        try {
            const { dates, reason, times } = bookingDetails;
            if (!dates || !reason || !times) {
                alert('Please fill in all booking details before submitting.');
                return;
            }            

            const payload = {
                device_id: device.device_id,
                user_id: user.user_id,
                requested_date: dates[0],
                requested_time: times[0], // Ensure this is properly selected
                reason: reason, // State `reason` should already have a value
                owner_id: ownerId, 
            };
    
            const response = await axios.post('http://localhost:5001/submitBookingRequest', payload);
    
            if (response.data.message) {
                console.log("Booking request submitted successfully:", response.data);
                alert('Booking request submitted successfully!');
                handleCloseConfirmationModal();
            } else {
                console.error('Error from server:', response.data);
                alert(`Error: ${response.data.error || 'Failed to submit booking request.'}`);
            }
        } catch (error) {
            console.error('Error submitting booking request:', error.message);
            alert('An unexpected error occurred while submitting your booking request.');
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Flatten the unavailable dates with times
            const flattenedDates = Object.keys(flattenedUnavailableDates || {})
                .map((key) => ({
                    date: key,
                    ...flattenedUnavailableDates[key],
                }))
                .filter(
                    (dateInfo) =>
                        dateInfo.times &&
                        Array.isArray(dateInfo.times) &&
                        dateInfo.times.length > 0
                );
            console.log('Flattened Dates:', flattenedDates);
    
            // Prepare booking details
            const newBookingDetails = {
                dates: flattenedDates.map((d) => d.date),
                times: flattenedDates.flatMap((d) => d.times),
                reason: reason || 'No reason provided',
            };
    
            console.log('New Booking Details:', newBookingDetails);
    
            // Validate the booking details
            if (
                newBookingDetails.dates.length > 0 && // Check dates are selected
                newBookingDetails.times.length > 0 && // Check times are selected
                newBookingDetails.reason !== 'No reason provided' // Ensure reason is provided
            ) {
                setBookingDetails(newBookingDetails); // Update state with valid booking details
                setErrorMessage(''); // Clear any error messages
                setShowConfirmationModal(true); // Show the modal
            } else {
                setErrorMessage('All fields are required. Please fill them out.');
            }
        } catch (err) {
            setErrorMessage(`An unexpected error occurred: ${err.message}`);
            console.error('Error details:', err);
        } finally {
            setLoading(false);
        }
    };
    

    // Close modal
    const handleCloseConfirmationModal = () => {
        setShowConfirmationModal(false);
    };

    const updateUnavailableDates = (index, { dates, allSelected, times }) => {
        setUnavailableDates(prev => ({
            ...prev,
            [index]: { dates, allSelected, times }
        }));
    };
    
    

    // Help ensure the calendar knows which dates are unavailable
    const flattenedUnavailableDates = Object.keys(unavailableDates).reduce((acc, date) => {
        acc[date] = unavailableDates[date];
        return acc;
    }, {});
    

    return (
        <div className="container">
            <div className='row'>
                <div className = "col-7 text-start">
                <h2>Book Equipment</h2>
                <p className="text-danger" style={{ fontSize: '18px' }}>
                        *Select a day and a 2-hour increment time slot to book the selected device. Complete the request by adding your reason for booking.
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
                            unavailableDates={unavailableDates}
                        />
                        </tbody>
                    </table>
                    <h5>Project Description</h5>
                    <textarea
                        id="booking"
                        name="booking"
                        className="form-control resize-text"
                        rows="4"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </div>
                <div className="col-md-5">
                    <GenerateCalender unavailableDates={flattenedUnavailableDates} />
                </div>
                <div className="text-end">
                {errorMessage && <p className="error-message">{errorMessage}</p>}
                <button
                    type="button"
                    className="btn btn-primary mt-3"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Submit'}
                </button>
            </div>
        </div>

         {/* Confirmation Modal */}
         <Modal 
         show={showConfirmationModal} 
         onHide={handleCloseConfirmationModal}
         backdrop="static" // Prevent closing on backdrop click
         keyboard={false} // Prevent closing with Escape key
         >
                <Modal.Header>
                    <Modal.Title>Confirm Booking</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to book <strong>{device.device_name}</strong>?</p>
                    <p>
                        Date: <strong>{bookingDetails.dates?.join(', ') || 'No dates selected'}</strong>
                    </p>
                    <p>
                        Time(s): <strong>{bookingDetails.times?.join(', ') || 'No time slots selected'}</strong>
                    </p>
                    <p>
                        Reason: <strong>{bookingDetails.reason}</strong>
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={handleCloseConfirmationModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSubmitBookingRequest}>
                        Confirm Booking
                    </Button>
                </Modal.Footer>
            </Modal>

        </div>
        
    );
}

export default Book_Equipment;