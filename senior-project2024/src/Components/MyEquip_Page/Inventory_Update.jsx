import React, {useState, useEffect} from 'react';
import { Form, isRouteErrorResponse, Link, useParams, useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import Calendar from './Update_Calendar.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import axios from 'axios';
import { useUser } from '../../UserContext.js';

const InventoryUpdate = () => {
    const { user } = useUser();
    const { device_id } = useParams();
    const navigate = useNavigate();
    const [image, setImage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showCalendar, setShowCalendar] = useState(false);
    const handleCalendarClose = () => setShowCalendar(false);
    const handleCalendarShow = () => setShowCalendar(true);
    const [unavailableDates, setUnavailableDates] = useState([]);

    const [formData, setFormData] = useState({
        campus: "",
        department: "",
        building: "",
        room_number: "",
        person_in_charge: user.user_name,
        device_name: "",
        description: "",
        application: "",
        manual_link: "",
        category: "",
        model: "",
        brand: "",
        keywords: "",
        available: 1,
        owner_id: user.user_id
    });

    useEffect(() => {
        const fetchDeviceData = async () => {
            try {
                const response = await axios.get('http://localhost:5001/inventory/details', {
                    params: { device_id },
                });                

                const data = response.data;

                setFormData({
                    campus: data.campus || "",
                    department: data.department || "",
                    building: data.building || "",
                    room_number: data.room_number || "",
                    person_in_charge: data.person_in_charge || user.user_name,
                    device_name: data.device_name || "",
                    description: data.description || "",
                    application: data.application || "",
                    manual_link: data.manual_link || "",
                    category: data.category || "",
                    model: data.model || "",
                    brand: data.brand || "",
                    keywords: data.keywords || "",
                    available: data.available || 1,
                    image_path: data.image_path || "",
                    owner_id: data.owner_id || user.user_id
                });

                if (data.image_path) {
                    setImage(`http://localhost:5001/static/equipment_photos/${data.image_path}`);
                }
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching device data:", error);
                alert("Failed to load equipment data.");
                setIsLoading(false);
            }
        };

        fetchDeviceData();
    }, [device_id, user.user_name]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImage = (e) => {
        const selectedImage = e.target.files[0];
        if (selectedImage) {
            const maxSize = 5 * 1024 * 1024; // 5MB in bytes
            if (selectedImage.size > maxSize) {
                alert('The image file is too large. Please upload an image smaller than 5MB.');
                setImage('');
            } else {
                setImage(selectedImage);
            }
        }
    };

    const handleSaveUnavailableDates = (dates) => {
        setUnavailableDates(dates);
    };

    const handleSave = async (e) => {
        e.preventDefault();

        const missingFields = [];
        if (!formData.campus) missingFields.push("Campus");
        if (!formData.department) missingFields.push("Department");
        if (!formData.device_name) missingFields.push("Equipment Name");
        if (!formData.category) missingFields.push("Category");
        if (!formData.building) missingFields.push("Building");
        if (!formData.application) missingFields.push("Application");
        if (!formData.description) missingFields.push("Description");

        if (missingFields.length > 0) {
            alert(`Please fill out the following required fields: ${missingFields.join(", ")}`);
            return;
        }

        try {
            let imagePath = formData.image_path || ""; // Retain the existing image path
    
            if (image && typeof image !== "string") {
                // Upload a new image only if one is selected
                const fd = new FormData();
                fd.append("image", image);
                fd.append("device_id", device_id);
                const uploadResponse = await axios.post("http://localhost:5001/upload", fd);
                imagePath = uploadResponse.data.path; // Get the new image path
            }
    
            // Add the updated image path to the form data
            const updatedFormData = { ...formData, image_path: imagePath };
            const response = await axios.put(`http://localhost:5001/inventory/${device_id}`, updatedFormData);
    
            alert(response.data.message || "Device updated successfully!");
            setShowCalendar(true);
        } catch (error) {
            console.error("Error updating device:", error);
            alert("Failed to update the device.");
        }
    };

    const handleSaveCalendarChanges = () => {
        // Logic to save calendar changes, if any
        setShowCalendar(false);
        navigate("/inventory"); // Navigate back to the inventory page
    };

    useEffect(() => {
        const fetchUnavailableDates = async () => {
            try {
                const response = await axios.get(`http://localhost:5001/unavailable/device/${device_id}`);
                setUnavailableDates(response.data.unavailableDates || []);
            } catch (error) {
                console.error("Error fetching unavailable dates:", error);
            }
        };
        if (device_id) {
            fetchUnavailableDates();
        }
    }, [device_id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
                <div className="container-fluid">
                    <h1 className="page-header">
                        <button
                            type="button"
                            className='btn btn-link p-0 me-2'
                            onClick={() => navigate("/inventory")}
                            style={{ textDecoration: "none", fontSize: "1.5rem" }}
                            >
                            <i className="bi bi-arrow-left"></i> 
                        </button>
                        Update Equipment
                    </h1>

                    <div className="row">
                        <div className="col-md-4">
                            <div className="row">

                                <div className="container-fluid uploadImage">
                                    <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImage}
                                    className='form-control'
                                /> 
                                {image && (
                                        <img
                                            src={typeof image === 'string' ? image : URL.createObjectURL(image)}
                                            alt="Preview"
                                            className="img-thumbnail mt-2"
                                        />
                                    )}
                                </div>


                                <div className="col-md-6">
                                    <h5>Campus</h5>
                                    <select id="campusSelect" className={`form-select form-select-sm ${!formData.campus ? "is-invalid" : ""}`}
                                    value={formData.campus} onChange={(e) => setFormData({...formData, campus: e.target.value})}>
                                        <optgroup label="Campus">
                                            <option value="" disabled selected>Select Campus</option>
                                            <option value="Edinburg">Edinburg</option>
                                            <option value="Brownsville">Brownsville</option>
                                        </optgroup>
                                </select>
                                {!formData.campus && <div className='invalid-feedback'>Campus is Required</div>}
                                </div>
                                <div className="col-md-6">
                                    <h5>Department</h5>
                                    <select id="departmentSelect" class= {`form-select form-select-sm ${!formData.department && 'is-invalid'}`} 
                                    value={formData.department} onChange={(e) => setFormData({...formData, department: e.target.value})}>
                                        <optgroup label="Department">
                                            <option value="" disabled selected>Select Department</option>
                                            <option value="Biology">Biology</option>
                                            <option value="Physics">Physics</option>
                                            <option value="School of Medicine">School of Medicine</option>
                                        </optgroup>
                                </select>
                                {!formData.department && <div className='invalid-feedback'>Department is Required</div>}
                                </div>
                            </div>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <h5>Building</h5>
                                    <select id="buildingSelect" class={`form-select form-select-sm ${!formData.building && 'is-invalid'}`}
                                    value={formData.building} onChange={(e) => setFormData({ ...formData, building: e.target.value})}>
                                        <optgroup label="Building">
                                            <option value="" disabled selected>Select Building</option>
                                            <option value="EPOB4">EPOB4 - Engineering Portable</option>
                                            <option value="EENGR">EENGR - Engineering</option>
                                            <option value="EACSB">EACSB- Academic Services</option>
                                            <option value="ESCNE">ESCNE - Science</option>
                                        </optgroup>
                                </select>
                                {!formData.building && <div className='invalid-feedback'>Building is Required</div>}
                                </div>
                                <div className="col-md-6">
                                    <h5>Room #</h5>
                                    <input type="text" id="room_number" name="room_number"
                                    className={`form-control ${!formData.room_number && 'is-invalid'}`} step="any" 
                                    value={formData.room_number} onChange={(e) => setFormData({...formData, room_number: e.target.value})}
                                />
                                {!formData.room_number && <div className='invalid-feedback'>Room is Required</div>}
                                </div>
                            </div>

                        <h5>Person in Charge</h5>

                            <input type="text" id="person_in_charge" name="person_in_charge" className="form-control"
                            value={user.user_name || ''}
                            disabled
                            />
                            <br></br>
                        </div>

                        <div class="col-md-4">
                            <h5>Equipment Name</h5>
                            <input type="text" id="device_name" name="device_name" className="form-control" value={formData.device_name} onChange={handleChange}/>

                            <h5>Description</h5>
                            <textarea id="description" name="description" className="form-control resize-text" rows="4" value={formData.description} onChange={handleChange}></textarea>

                            <h5>Application</h5>
                            <textarea id="application" name="application" className="form-control resize-text" rows="4" value={formData.application} onChange={handleChange}></textarea>

                            <h5>Link to Manual</h5>
                            <input type="text" id="manual_link" name="manual_link" className="form-control" value={formData.manual_link} onChange={handleChange} />
                        </div>

                        <div className="col-md-4">
                            <h5>Category</h5>
                            <select id="category_select" className="form-select" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})}>
                                <optgroup label="Category">
                                    <option value="" disabled selected>Select Category</option>
                                    <option value="FFT_Spectrum">FFT Spectrum Analyzer</option>
                                    <option value="Current_Source">Current Source</option>
                                    <option value="Function_Generator">Function Generator</option>
                                    <option value="Amplifier">Amplifier</option>
                                    <option value="Preamplifier">Preamplifier</option>
                                    <option value="Power_Supply">Power Supply</option>
                                </optgroup>
                            </select>

                            <h5>Model</h5>
                            <input type="text" id="model" name="model" className="form-control" value={formData.model} onChange={handleChange} />

                            <h5>Brand</h5>
                            <select id="brand_select" className="form-select" value={formData.brand} onChange={(e) => setFormData({...formData, brand: e.target.value})}>
                                <optgroup label="Brand">
                                    <option value="" disabled selected>Select Brand</option>
                                    <option value="Stanford_Research">Stanford Research Systems</option>
                                    <option value="VICI">VICI</option>
                                    <option value="BandK_Precision">B&K Precision</option>
                                    <option value="Global_Specialties">Global Specialties</option>
                                    <option value="BSIDE">BSIDE</option>
                                    <option value="PASCO">PASCO</option>
                                </optgroup>
                            </select>

                            <h5>Keywords</h5>
                            <input type="text" id="keywords" name="keywords" className="form-control" value={formData.keywords} onChange={handleChange}></input>

                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <h5>Number Available</h5>
                                    <input type="number" id="available" name="available" className="form-control" value={formData.available} onChange={handleChange} min="1" placeholder="1"></input>
                                </div>
                                {/* Checkbox and label */}
                                <div className="col-md-6 align-items-center">
                                    <div className="form-check availability d-flex align-items-center me-2">
                                        {/* <input type="checkbox" name="availability" value="availability" className="form-check-input"></input> */}
                                        {/* <label for="availability" className="form-check-label ms-2">Available</label> */}
                                    </div>
                                    {/* Calendar Button */}
                                    {/* <button type="button" className="bi bi-calendar4 btn-light btn-sm cal-button d-flex" onClick={handleCalendarShow}></button> */}
                                </div>
                            </div>

                            <div class="text-center mt-3">
                                <button type="button" className="btn btn-secondary update-button" onClick={handleSave}>Update & View Calendar</button>
                            </div>


                           {/* Calendar Modal */}
                           <Modal
                                show={showCalendar}
                                onHide={() => setShowCalendar(false)}
                                centered
                                dialogClassName="custom-wide-modal"
                                size="xl"
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Select Dates</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {device_id && <Calendar device_id={device_id} unavailableDates={unavailableDates} />}
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button variant="secondary" onClick={() => setShowCalendar(false)}>
                                        Close
                                    </Button>
                                    <Button variant="primary" onClick={handleSaveCalendarChanges}>
                                    Save Changes
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </div>
                    </div>
                </div>
        </>
    );
};

export default InventoryUpdate;