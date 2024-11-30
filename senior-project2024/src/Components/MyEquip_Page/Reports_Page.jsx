import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import './Reports_Page.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";
import { useUser } from '../../UserContext';

const ReportsPage = () => {
    const { user } = useUser();
    const [reports, setReports] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedReport, setSelectedReport] = useState(null); // Store the selected report for the modal
    const [showModal, setShowModal] = useState(false); // Control the modal visibility

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://localhost:5001/reports', {
                    params: { owner_name: user.user_name },
                });
                setReports(response.data);
            } catch (err) {
                console.error('Error fetching reports:', err.message);
                setError('Failed to fetch reports. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        if (user.user_name) {
            fetchReports();
        }
    }, [user.user_name]);

    const handleViewClick = (report) => {
        setSelectedReport(report);
        setShowModal(true);
    };

    const handleStatusUpdate = async (status) => {
        if (!selectedReport) return;

        try {
            const response = await axios.patch(`http://localhost:5001/reports/${selectedReport.report_id}`, { status });
            alert(response.data.message || `Report status updated to ${status}.`);
            setShowModal(false); // Close the modal
            setReports((prevReports) =>
                prevReports.map((r) =>
                    r.report_id === selectedReport.report_id ? { ...r, status } : r
                )
            ); // Update the status in the local state
        } catch (error) {
            console.error('Error updating report status:', error.message);
            alert('Failed to update status. Please try again.');
        }
    };

    if (loading) {
        return <p>Loading reports...</p>;
    }

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <>
            {/* Requests and Inventory Buttons */}
            <div className="col text-center">
                <div className="btn-group">
                    <Link to="/requests">
                        <button type="button" className="bi bi-clock btn btn-outline-dark text-dark btn buttons-right"> Requests</button>
                    </Link>
                    <Link to="/reports">
                        <button type="button" className="bi bi-box btn text-dark btn btn-secondary middle-button"> Reports</button>
                    </Link>
                    <Link to="/inventory">
                        <button type="button" className="bi bi-clipboard-fill btn btn-outline-dark text-dark border-secondary buttons-left"> Inventory</button>
                    </Link>
                </div>
            </div>

            {/* Table displaying reports */}
            <div className="container">
                <div className="row">
                    <div className="col">
                        <div className="requests">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Device/Equipment</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report.report_id}>
                                            <td>{report.reporter_name}</td>
                                            <td>{report.reporter_email}</td>
                                            <td>{report.device_name}</td>
                                            <td>{report.status}</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-secondary btn-sm"
                                                    onClick={() => handleViewClick(report)}
                                                >
                                                    View
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Viewing Report */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Report Details</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="mb-3">
                        <label className="form-label">Equipment Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={selectedReport?.device_name || ''}
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Reporter Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={selectedReport?.reporter_name || ''}
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Reporter Email</label>
                        <input
                            type="email"
                            className="form-control"
                            value={selectedReport?.reporter_email || ''}
                            readOnly
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Issue Description</label>
                        <textarea
                            className="form-control"
                            rows="3"
                            value={selectedReport?.issue_description || 'No description available'}
                            readOnly
                        ></textarea>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="danger" onClick={() => handleStatusUpdate('Unresolved')}>
                    Unresolve
                </Button>
                <Button variant="warning" onClick={() => handleStatusUpdate('In Progress')}>
                    In Progress
                </Button>
                <Button variant="success" onClick={() => handleStatusUpdate('Resolved')}>
                    Resolve
                </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ReportsPage;
