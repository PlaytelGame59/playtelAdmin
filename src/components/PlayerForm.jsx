
import { Button, Form, Modal } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import Swal from 'sweetalert2';
import { base_url } from "../api/Constants";
import { update_player } from "../api/Constants";

const PlayerForm = ({ showPlayerForm, setShowPlayerForm, userId, getPlayerData, onEdit, editData }) => {

    const [formData, setFormData] = useState({
        // sNo: '', 
        // playId: '', 
        name: '', 
        email: '', 
        aadhar: '', 
        mobileNo: 0

        // userId:userId,
    })

    useEffect(() => {
        // debugger
        if(editData) {
            setFormData(editData)
        }
    }, [editData])

    const handleChange = (e) => {
        setFormData((pre)=>{ 
            return({
            ...pre,
            [e.target.name]: e.target.value 
        })})
    }

    const onFinish = async () => {
        try {
            // debugger;
            if(formData._id) {
                // debugger
                const dataToSend = { ...formData, playerId: formData._id }
                const response = await axios.post(`${base_url}${update_player}`, dataToSend, {});
                if(response) {
                    if(response.data.status === "success") {
                        Swal.fire({
                            icon: 'success',
                            title: 'Success!',
                            text: response.data.msg,
                        });
                    } else {    
                        Swal.fire({
                            icon: 'Error',
                            title: 'Error!',
                            text: response.data.msg,
                        });
                    }
                }
                setShowPlayerForm(false);
                getPlayerData();
            }     
        } catch (error) {
            console.log('Error:', error.response.data)
            Swal.fire({
                icon: 'Error',
                title: 'Error!',
                text: error,
            });
        }
    }

    return (
        <>
            <p>Player form</p>
            <Modal 
                width={800}
                title='create Players' 
                visible={showPlayerForm}
                onCancel={() => setShowPlayerForm(false)}
                footer={false}
            >
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label='name:' name='name'>
                        <input 
                            type="text"
                            name='name'
                            value={formData.name} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='email:' name='email'>
                        <input 
                            type="text"
                            name='email'
                            value={formData.email} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='aadhar:' name='aadhar'>
                        <input 
                            type="text"
                            name='aadhar'
                            value={formData.aadhar} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='mobileNo:' name='mobileNo'>
                        <input 
                            type="text"
                            name='mobileNo'
                            value={formData.mobileNo} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    
                    <div>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">save</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default PlayerForm




