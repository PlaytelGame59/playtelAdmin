
import { Button, Form, Modal } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import Swal from 'sweetalert2';
import { base_url } from "../api/Constants";

const PlayerReportForm = ({ showPlayerForm, setShowPlayerForm, userId, getPlayerData, onEdit, editData }) => {

    const [formData, setFormData] = useState({
    
        name: '', 
        referCode: '',
        participate: '',
        joinCode: '',
        swins: '',
        fwins: '',
        totalWin: '',
        totalLose: '',
        loadedAmount: '',
        withdrawAmount: '',
        walletBalance: '',
        bonusWallet: '',
        noLoad: '',
        nowithdraw: ''

        // walletAmount: '',
        // requestAmount: '',
        
        // type: '',
        // accNo: '',	
        // ifsc: '',
        // PaytmNo: ''
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
                const response = await axios.post(`${base_url}/player/update-players`, dataToSend, {
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
            <p>Player Report form</p>
            <Modal 
                width={800}
                title='Players Report' 
                visible={showPlayerForm}
                onCancel={() => setShowPlayerForm(false)}
                footer={false}
            >
                <Form layout="vertical" onFinish={onFinish}>
                
                    <Form.Item label='name:' name='name'>
                        <input 
                            type="text"
                            name='name'
                            value={formData?.name} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Refer Code:' name='referCode'>
                        <input 
                            type="text"
                            name='referCode'
                            value={formData?.referCode} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Participate:' name='participate'>
                        <input 
                            type="text"
                            name='participate'
                            value={formData?.participate} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Join Code:' name='joinCode'>
                        <input 
                            type="text"
                            name='joinCode'
                            value={formData?.joinCode} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='2 Wins:' name='swins'>
                        <input 
                            type="text"
                            name='swins'
                            value={formData?.swins} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='4 Wins:' name='fwins'>
                        <input 
                            type="text"
                            name='fwins'
                            value={formData?.fwins} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Total Win:' name='totalWin'>
                        <input 
                            type="text"
                            name='totalWin'
                            value={formData?.totalWin} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Total Lose:' name='totalLose'>
                        <input 
                            type="text"
                            name='totalLose'
                            value={formData?.totalLose} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Loaded Amount:' name='loadedAmount'>
                        <input 
                            type="text"
                            name='loadedAmount'
                            value={formData?.loadedAmount} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Withdraw Amount:' name='withdrawAmount'>
                        <input 
                            type="text"
                            name='withdrawAmount'
                            value={formData?.withdrawAmount} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Wallet Balance:' name='walletBalance'>
                        <input 
                            type="text"
                            name='walletBalance'
                            value={formData?.walletBalance} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Bonus Wallet:' name='bonusWallet'>
                        <input 
                            type="text"
                            name='bonusWallet'
                            value={formData?.bonusWallet} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='No Load:' name='noLoad'>
                        <input 
                            type="text"
                            name='noLoad'
                            value={formData?.noLoad} 
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='No Withdraw:' name='nowithdraw'>
                        <input 
                            type="text"
                            name='nowithdraw'
                            value={formData?.nowithdraw} 
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

export default PlayerReportForm




