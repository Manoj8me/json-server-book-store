import axios from 'axios';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function UserLogin() {
    const [details, setDetails] = useState({
        id: "",
        password: "",
    })
    const navigate = useNavigate();
    const handleSetDetails = (e) => {
        const { name, value } = e.target;
        setDetails(prevState => ({
            ...prevState, [name]: value
        }))
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            axios.get(`http://localhost:3001/users/${details.id}`)
                .then(res => {
                    if (res.data.password === details.password) {
                        toast.success("Logged in successfully");
                        sessionStorage.setItem("username", details.id);
                        navigate("/home")
                    }
                    else {
                        toast.error("please enter correct password")
                    }
                })
                .catch(err => {
                    if (err.response && err.response.status === 404) {
                        toast.error("please enter correct username")
                    }
                    else {
                        toast.error("login failed due to" + err);
                    }
                })
        }
    }
    const validate = () => {
        let result = true;
        if (details.id === '' || details.id === null) {
            result = false;
            toast.warning("please enter username");
        }
        if (details.password === '' || details.password === null) {
            result = false;
            toast.warning("please enter password");
        }
        return result;
    }
    return (
        <div>
            <h2>User Login Form</h2>
            <form className='container width-50' onSubmit={handleSubmit}>
                <div className="form-group">
                    <label className='form-label'>Username <span className='star-symbol'>*</span></label>
                    <input type="text" className='form-control' value={details.id} name='id' onChange={handleSetDetails} />
                </div>
                <div className="form-group">
                    <label>password <span className='star-symbol'>*</span></label>
                    <input type="password" className='form-control' value={details.password} name='password' onChange={handleSetDetails} />
                </div>
                <button className='btn btn-primary'>Login</button>
                <Link to={"/registration"} className='btn btn-success'>New User</Link>
            </form>
        </div>
    )
}

export default UserLogin