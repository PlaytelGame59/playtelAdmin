// ForgotPassword.js
import React, { useState } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import axios from 'axios';
import { base_url, reset_password } from "../api/Constants";

const ForgotPassword = ({ onCancel }) => {
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: '',
    });

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleResetPassword = async () => {
        console.log('Attempting to reset password');
        try {
            const response = await axios.post(`${base_url}${reset_password}`, {
                userId: localStorage.getItem('userId'), // Pass the userId for the logged-in user
                newPassword: formData.newPassword,
                confirmPassword: formData.confirmPassword,
            });

            console.log('Response from server:', response.data);

            if(response.data.success) {
                console.log('Password reset successfully');
                message.success('Password reset successfully');
                onCancel(); // Close the modal
            } else {
                console.log('Password reset failed');
                message.error('Password reset failed');
            }
        } catch (error) {
            console.error('An error occurred during password reset:', error);
            message.error('An error occurred during password reset');
        }
    };

    return (
        <Modal
            title="Forgot Password"
            visible={true}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel}>
                    Cancel
                </Button>,
                <Button key="reset" type="primary" onClick={handleResetPassword}>
                    Reset Password
                </Button>,
            ]}
        >
            <Form>
                <Form.Item label="New Password" name="newPassword">
                    <Input.Password
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                    />
                </Form.Item>
                <Form.Item label="Confirm Password" name="confirmPassword">
                    <Input.Password
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ForgotPassword;
