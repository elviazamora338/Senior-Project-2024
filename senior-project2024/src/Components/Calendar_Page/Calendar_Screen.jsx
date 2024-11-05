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
  
  
function Availability({ removeSection }) {
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
            <div className="col-12">
                <input
                    type="date"
                    id="selectedDay"
                    className="form-control mb-3"
                    value={selectedDay}
                    onChange={(e) => setSelectedDay(e.target.value)}
                />
            </div>
        ) : period === 'Month' ? (
          <div className="col-12">
            <select value={startMonth} onChange={(e) => setStartMonth(e.target.value)} className="form-select mb-2">
                <option value="">Select Month</option>
                {months.map((month, index) => (
                    <option key={index} value={month}>{month}</option>
                ))}
            </select>
            <label htmlFor="endMonth" className="form-label">To</label>
            <select value={endMonth} onChange={(e) => setEndMonth(e.target.value)} className="form-select mb-2">
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
                    onChange={(e) => setStartDate(e.target.value)}
                />
                <label htmlFor="endDate" className="form-label">To</label>
                <input
                    type="date"
                    id="endDate"
                    className="form-control"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
            </div>
        </div>
        )}
        </td>
        <td>
            {/* Can make this simpler -E need to work on this */}
            <div class = "row d-flex justify-content-center p-8 mt-4">
                <div class = "col-6 p-2" style={{ width: 'fit-content' }}>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" value="8am-10am"></input>
                        <label class="form-check-label" style={{ fontSize: '12.5px' }}>8M-10AM</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" value="8am-10am"></input>
                        <label class="form-check-label" style={{ fontSize: '12.5px' }}>8AM-10AM</label>
                    </div>
                </div>
                <div class = "col-6  p-2" style={{ width: 'fit-content' }}>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" value="8am-10am"></input>
                        <label class="form-check-label" style={{ fontSize: '12.5px' }}>8M-10AM</label>
                    </div>
                    <div class="form-check form-check-inline">
                        <input class="form-check-input" type="checkbox" value="8am-10am"></input>
                        <label class="form-check-label" style={{ fontSize: '12.5px' }}>8AM-10AM</label>
                    </div>
                </div>
            </div>
            
        </td>
        <td>
        <div className="d-flex justify-content-end">
        <button className="btn bg-danger" style={{ width: '40px' }}onClick={removeSection}>-</button>
            </div>
        </td>
    </tr>
  );
}

function GenerateCalender() {
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

        // Create rows for the calendar
        for (let i = 0; i < 6; i++) {
            const week = [];
            for (let j = 0; j < 7; j++) {
                if (i === 0 && j < firstDay) {
                    week.push(<td key={j} />);
                } else if (date > daysCount) {
                    break;
                } else {
                    week.push(<td key={j}>{date}</td>);
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
        <div class=" mt-4 col-md-5">
             <div class="text-center mb-4 d-flex justify-content-between align-items-center">
                <h3 className = "mb-0" style={{ marginRight: '100px'}}>{months[currentMonth]} {currentYear}</h3>
                <div class="d-flex">
                    <button class="btn btn-warning bi bi-chevron-left"  style={{ marginRight: '20px' }}onClick={previousMonth}></button>
                    <button class="btn btn-warning bi bi-chevron-right"  onClick={nextMonth}></button>
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
        </div>
    );
};



function Calendar_Screen () {
     // State to keep track of the availability sections
  const [availabilityList, setAvailabilityList] = useState([<Availability key={0} removeSection={() => removeSection(0)} />]);

  // Handle the form submit (adding new availability section)
  const handleAddSection = (e) => {
    e.preventDefault();
    setAvailabilityList([...availabilityList, <Availability key={availabilityList.length} removeSection={() => removeSection(availabilityList.length)} />]);
  };
  const removeSection = (index) => {
    setAvailabilityList(availabilityList.filter((_, i) => i !== index));
};
  

  return (
    <div className="container">
      <h2 className="mt-5">Set Equipment Availability</h2>
      <p className="text-danger">
        *By default, every weekday is set to 'available' from 8am-8pm. This page
        is to set up UNAVAILABILITY.
      </p>
      <div class="row">
          <div class="mt-4 col-md-7 card d-flex justify-content-between p-2">
                <table class ="table justify-content-between">
                    <thead class = "p-6">
                        <tr>
                            <th>Period</th>
                            <th>Date(s)</th>
                            <th>Time(s) Unavailable</th>
                            <th>
                                <button onClick={handleAddSection} className="btn btn-primary" id="button-addon2">
                                    Add Unavailability
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {availabilityList}
                    </tbody>
                </table>
            </div>
            
            {/* <!-- Calendar section --> */}
          
                <GenerateCalender/>
             {/* <!-- Calendar end --> */}
         </div>
    </div>
  );
};

export default Calendar_Screen;
