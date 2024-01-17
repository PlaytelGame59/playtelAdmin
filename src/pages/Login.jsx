// login.js page
import React, { useState } from "react";
import { Row, Col, Form, Input, Button, Modal, message } from 'antd';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import { base_url, admin_login } from "../api/Constants"
import ForgotPassword from "../components/ForgotPassword";


const Login = ({ onLogin }) => {    
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData((pre) => {
            return {
                ...pre,
                [e.target.name]: e.target.value,
            };
        });
    };

    const handleLogin = async (formData) => {
        try {
            const response = await axios.post(`${base_url}${admin_login}`, {
            email: formData.email, // Assuming email is the username
            password: formData.password,
        });
    
            console.log('Login successful:', response.data);
            const { token, userId } = response.data;
    
            // Store the token in local storage (you can use session storage as well)
            localStorage.setItem('token', token);
            localStorage.setItem('userId', userId);

            message.success("Login successful")
            // Display success message
            Swal.fire({
                icon: "success",
                title: "Success!",
                text: response.data.msg,
            });
            // Update the authentication state
            onLogin();
            navigate('/');
        } catch (error) {
            console.error('Login failed:', error.response.data);
            message.error('Invalid credentials!')
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Invalid credentials",
            });
        }
    };

    const handleResetPassword = () => {
        navigate('/forgot-password');
    }  

    const handleForgotPassword = () => {
        setShowForgotPassword(true);
    };

    const onFinish = () => {
        handleLogin(formData);
    };

    return (
        <div 
            style={{ 
                backgroundImage: 'url("https://dfstudio-d420.kxcdn.com/wordpress/wp-content/uploads/2019/06/digital_camera_photo-1080x675.jpg")', 
                backgroundSize: 'cover',
                height: '100vh', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
            }}>
                <Row 
                    gutter={[16, 16]}
                    style={{ 
                        width: "40rem", 
                        height: "60%",
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                        padding: '20px', 
                        borderRadius: '8px' 
                    }}
                >
                    
                        <Col
                            xs={12} 
                            sm={12}
                            md={12} 
                            lg={12} 
                            xl={12} 
                            // style={{ 
                            //     backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            //     padding: '20px', 
                            //     borderRadius: '8px' 
                            // }}
                        >
                            <img 
                                src={"https://w7.pngwing.com/pngs/587/672/png-transparent-ludo-dice-dice-game-dice-online-casino-thumbnail.png"}
                                alt="Image" 
                                style={{ width: "16rem",height: "22.5rem" }}
                            />
                        </Col>
                        <Col 
                            xs={12} 
                            sm={12}
                            md={12} 
                            lg={12} 
                            xl={12} 
                            // style={{ 
                            //     backgroundColor: 'rgba(255, 255, 255, 0.8)', 
                            //     padding: '20px', 
                            //     borderRadius: '8px' 
                            // }}
                        >
                            <img 
                                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTarYj7XzAlkDFsWxG7WCv9KVfrUF2kQaPd8w&usqp=CAU" 
                                alt="" 
                                srcset="" 
                                style={{ width: "10rem"}}
                            />
                            <h1>Login page</h1>
                            <hr />
                            <Form onFinish={onFinish}>
                                <Form.Item name="email">
                                    <Input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        placeholder="Enter Your Email"
                                        onChange={handleChange}
                                        // required
                                    />
                                </Form.Item>
                                <Form.Item name="password">
                                    <Input.Password
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        placeholder="Enter your password"
                                        onChange={handleChange}
                                        // required
                                    />
                                </Form.Item>
                                <Row justify="space-between">
                                    <Col>
                                        {/* <p style={{ cursor: "pointer" }}
                                        onClick={handleResetPassword}
                                        style={{ cursor: 'pointer' }} 
                                        onClick={handleForgotPassword}
                                        >Forgot Password? </p> */}
                                        <p style={{ cursor: 'pointer' }} onClick={handleForgotPassword}>
                                            Forgot Password?
                                        </p>
                                    </Col>
                                    <Col>
                                        <Button htmlType="submit" type="primary">
                                            Login
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Col>                
                </Row>
                {showForgotPassword && <ForgotPassword onCancel={() => setShowForgotPassword(false)} />}
        </div>
    );
};

export default Login;

