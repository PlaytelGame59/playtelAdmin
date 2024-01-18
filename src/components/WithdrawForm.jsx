
import { Button, Form, Modal } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import Swal from 'sweetalert2';


const WithdrawForm = ({ showPlayerForm, setShowPlayerForm, userId, getPlayerData, onEdit, editData }) => {

    const [formData, setFormData] = useState({
        // sNo: '', 
        // playId: '', 
        name: '', 
        walletAmount: '',
        requestAmount: '',
        // email: '', 
        // aadhar: '', 
        // mobileNo: '',  
        type: '',
        accNo: '',	
        ifsc: '',
        PaytmNo: ''
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
                // const token = localStorage.getItem('token');
                const response = await axios.post(`http://localhost:2000/player/update-players`, dataToSend, {
                    // headers: {
                    //     Authorization: `Bearer ${token}`,     
                    // },
                });
                // console.log('Response from backend:', response.data);
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
                    <Form.Item label='Wallet Amount:' name='walletAmount'>
                        <input 
                            type="text"
                            name='walletAmount'
                            value={formData?.walletAmount} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Request Amount:' name='requestAmount'>
                        <input 
                            type="text"
                            name='requestAmount'
                            value={formData?.requestAmount} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='type:' name='type'>
                        <input 
                            type="text"
                            name='type'
                            value={formData.type} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='accNo:' name='accNo'>
                        <input 
                            type="text"
                            name='accNo'
                            value={formData.accNo} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='ifsc:' name='ifsc'>
                        <input 
                            type="text"
                            name='ifsc'
                            value={formData.ifsc} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='PaytmNo:' name='PaytmNo'>
                        <input 
                            type="text"
                            name='PaytmNo'
                            value={formData.PaytmNo} 
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

export default WithdrawForm
