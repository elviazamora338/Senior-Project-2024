import React from 'react';
import './Header.css'
import banner from '../static/uni_banner/utrgv_banner.jpg';
import 'bootstrap/dist/css/bootstrap.min.css';
import "bootstrap-icons/font/bootstrap-icons.css";

const Header = () => {
    return (
        <>
            {/* Header Section */}
            <div className="card card-custom mb-0">
                <div className="card-body table-header">
                    <div className="row">
                        <div className="col-sm-8"></div>
                        <div className="col-sm-4">
                            <div className="d-flex justify-content-end text-over text-white">
                                <i>Change University</i>
                                <i className="text-black bi bi-paperclip mx-2"></i>
                                <i className="text-black bi bi-calendar4-event mx-2"></i>
                                <i className="text-black bi-three-dots-vertical mx-2"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* University Banner */}
            <div className="container container-banner mt-3">
                <div className="img-container">
                    <img src={banner} alt="UTRGV logo banner" />
                    <div className="text-overlay">
                        <h1>Equipment Scheduler</h1>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Header;
