import React from "react";
import './LoginAuth_Screen.css'; 

const LoginAuth_Screen = () => {
    return (
        <div className="container-fluid h-100">
            <div className="row h-100">
                {/* Left side - Verification code */}
                <div className="col-md-6 login-section">
                    <div className="login-box">
                        <h1 className="text-center">Verify Your Identity</h1>
                    <p>Check your email for a one-time code</p>
                    <br /><br />
                    <form>
                        <div className="form-group login-auth">
                            <label htmlFor="code">Enter your code</label>
                            <input type="number"
                                className="form-control" id="code" placeholder="Code" required
                                />
                        </div>
                        <br />
                        <button type="submit"
                        className="btn btn-primary btn-block login-auth">Continue</button>
                    </form>
                    </div>
                </div>
                {/* Right side of the login screen */}
                <div className="col-md-6 welcome-image"></div>
            </div>
        </div>
    )
}

export default LoginAuth_Screen;