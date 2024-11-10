import axios from 'axios';
import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

function UserRegistration() {
    const [details, setDetails] = useState({
        id: "",
        firstName: "",
        lastName: "",
        password: "",
        email: "",
        address: "",
        city: "",
        state: "",
        country: "",
        dob: "",
    })
    const handleSetDetails = (e) => {
        const { name, value } = e.target;
        setDetails(prevstate => ({
            ...prevstate, [name]: value
        }))
    }

    const isValidate = () => {
        let isProceed = true;
        let errorMessage = "please enter the value in "
        if (details.id === "" || details.id === null) {
            isProceed = false;
            errorMessage += "Username";
        }
        if (details.firstName === "" || details.firstName === null) {
            isProceed = false;
            errorMessage += " Firstname";
        }
        if (details.lastName === "" || details.lastName === null) {
            isProceed = false;
            errorMessage += " Lastname";
        }
        if (details.password === "" || details.password === null) {
            isProceed = false;
            errorMessage += " Password";
        }
        if (details.email === "" || details.email === null) {
            isProceed = false;
            errorMessage += " Email";
        }
        if (details.phone === "" || details.phone === null) {
            isProceed = false;
            errorMessage += " Phone Number";
        }
        if (details.address === "" || details.address === null) {
            isProceed = false;
            errorMessage += " Address";
        }
        if (details.city === "" || details.city === null) {
            isProceed = false;
            errorMessage += " City";
        }
        if (details.state === "" || details.state === null) {
            isProceed = false;
            errorMessage += " State";
        }
        if (details.country === "" || details.country === null) {
            isProceed = false;
            errorMessage += " Country";
        }
        if (!isProceed) {
            toast.warning(errorMessage);
        }
        return isProceed;
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isValidate()) {
            axios.post("http://localhost:3001/users", details)
                .then(res => toast.success("Registered successfuly"))
                .catch(err => console.log(err));
        }
    }
    return (
        <div>
            <form className='container w-50' onSubmit={handleSubmit}>
                <h2>User Registration Form</h2>
                <div className="form-group">
                    <label>UserName <span className='star-symbol'>*</span></label>
                    <input type="text" className='form-control' value={details.id} name='id' onChange={handleSetDetails} />
                </div>
                <div className="form-group">
                    <label>First Name <span className='star-symbol'>*</span></label>
                    <input type="text" className='form-control' value={details.firstName} name='firstName' onChange={handleSetDetails} />
                </div>
                <div className="form-group">
                    <label>Last Name <span className='star-symbol'>*</span></label>
                    <input type="text" className='form-control' value={details.lastName} name='lastName' onChange={handleSetDetails} />
                </div>
                <div className="form-group">
                    <label>Password <span className='star-symbol'>*</span></label>
                    <input type="password" className='form-control' value={details.password} name='password' onChange={handleSetDetails} />
                </div>
                <div className="form-group">
                    <label>Email <span className='star-symbol'>*</span></label>
                    <input type="text" className='form-control' value={details.email} name='email' onChange={handleSetDetails} />
                </div>
                <div className="form-group">
                    <label>shipping Address <span className='star-symbol'>*</span></label>
                    <textarea className='form-control' value={details.address} name='address' onChange={handleSetDetails} />
                </div>
                <div className="form-group">
                    <label>City <span className='star-symbol'>*</span></label>
                    <input type="text" className='form-control' value={details.city} name='city' onChange={handleSetDetails} />
                </div>
                <div className="form-group">
                    <label>State <span className='star-symbol'>*</span></label>
                    <input type="text" className='form-control' value={details.state} name='state' onChange={handleSetDetails} />
                </div>
                <div className="form-group">
                    <label>Country <span className='star-symbol'>*</span></label>
                    <input type="text" className='form-control' value={details.country} name='country' onChange={handleSetDetails} />
                </div>
                <div className="form-group">
                    <label>Date of Birth</label>
                    <input type="date" className='form-control' value={details.dob} name='dob' onChange={handleSetDetails} />
                </div>
                <button type="submit" className='btn btn-success'>Register</button>
                <Link to={"/"} className='btn btn-danger'>Back</Link>
            </form>
        </div>
    )
}

export default UserRegistration