// update Tournament form
import { Button, Form, Modal, Input, Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from 'sweetalert2';
import { base_url, update_tournament } from "../api/Constants";

const TournamentForm = ({ showTournamentForm, setShowTournmentForm, getTournamentData, editData }) => {
    const { Option } = Select;
    const [formData, setFormData] = useState({
        tournamentName: '',

        // betAmount: '', 
        // noPlayers: '', 

        betAmount: '0', // Match the default value from the schema
        noPlayers: '0', // Match the default value from the schema

        winnerCount: '0', // Match the default value from the schema

        winningAmount: '0', // Match the default value from the schema
        winningAmount1: '0', // Match the default value from the schema
        winningAmount2: '0', // Match the default value from the schema
        winningAmount3: '0', // Match the default value from the schema

        // winnerCount: '',

        // winningAmount: '',
        // winningAmount1: '', 
        // winningAmount2: '', 
        // winningAmount3: '',

        // betAmount: '',
        // noPlayers: '',
        // winnerCount: '',
        // winningAmount: '',
        // winningAmount1: '',
        // winningAmount2: '',
        // winningAmount3: '',
        tournamentInterval: '',
        tournamenttype: '',
        tournamentStatus: true,
    });

    useEffect(() => {
        if (editData) {
            setFormData(editData);
        }
    }, [editData]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    // Its client side code to set winnerCount 1 or 3 acoording to noPlayers
    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     let updatedFormData = { ...formData, [name]: value };
    
    //     // Reset winnerCount and winningAmount fields when noPlayers changes
    //     if (name === 'noPlayers') {
    //         const updatedWinnerCount = value === '4' ? '3' : '1';
    //         updatedFormData = {
    //             ...updatedFormData,
    //             winnerCount: updatedWinnerCount,
    //             winningAmount: '0',
    //             winningAmount1: '0',
    //             winningAmount2: '0',
    //             winningAmount3: '0',
    //         };
    //     }
    
    //     setFormData(updatedFormData);
    // };
    
    

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     let updatedFormData = { ...formData, [name]: value };
    
    //     // Reset winnerCount when noPlayers changes
    //     if (name === 'noPlayers') {
    //         updatedFormData = { ...updatedFormData, winnerCount: '' };
    //     }
    
    //     setFormData(updatedFormData);
    // };
    

    const onFinish = async () => {
        try {
            if (formData._id) {
                const dataToSend = { ...formData, tournamentId: formData._id };
                const response = await axios.post(`${base_url}${update_tournament}`, dataToSend);
                if (response.data.status === "success") {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success!',
                        text: response.data.msg,
                    });
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Error!',
                        text: response.data.msg,
                    });
                }
                setShowTournmentForm(false);
                getTournamentData();
            }
        } catch (error) {
            console.log('Error:', error.response.data);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: error.response.data,
            });
        }
    };

    return (
        <>
            <p>Tournaments form</p>
            <Modal
                width={800}
                title='Update Tournament'
                visible={showTournamentForm}
                onCancel={() => setShowTournmentForm(false)}
                footer={false}
            >
                <Form layout="vertical" onFinish={onFinish}>
                    <Form.Item label='Tournament Name:' name='tournamentName'>
                        <Input
                            type="text"
                            name='tournamentName'
                            value={formData?.tournamentName}
                            onChange={handleChange}
                        />
                    </Form.Item>
                    <Form.Item label='Bet Amount:' name='betAmount'>
                        <Input
                            type="text"
                            name='betAmount'
                            value={formData?.betAmount}
                            onChange={handleChange}
                        />  
                    </Form.Item>
                    <Form.Item label='Number of Players:' name='noPlayers'>
                        <Input
                            type="text"
                            name='noPlayers'
                            value={formData.noPlayers}
                            onChange={handleChange}
                        />
                    </Form.Item>

                    {(formData.noPlayers === "2" || formData.noPlayers === "3") && (
                        <Form.Item label="Winning Amount:" name="winningAmount">
                            <Input
                                type="text"
                                name="winningAmount"
                                placeholder="Winning Amount"
                                value={formData?.winningAmount}
                                onChange={handleChange}
                            />
                        </Form.Item>
                    )}

                    {formData.noPlayers === "4" && (
                        <Form.Item label='Winners Count:' name='winnerCount'>
                            <Select
                                name="winnerCount"
                                placeholder="Select Winners Count"
                                value={formData.winnerCount}
                                onChange={(value) => handleChange({ target: { name: 'winnerCount', value } })}
                            >
                                <Select.Option value="1">1st Winner</Select.Option>
                                <Select.Option value="2">2nd Winner</Select.Option>
                                <Select.Option value="3">3rd Winner</Select.Option>
                            </Select>
                        </Form.Item>
                    )}

                    {(formData.noPlayers === "4" && formData.winnerCount) && (
                        <>
                            <Form.Item label="1st Winner Amount:" name="winningAmount1">
                                <Input
                                    type="text"
                                    name="winningAmount1"
                                    placeholder="1st Winner Amount"
                                    value={formData?.winningAmount1}
                                    onChange={handleChange}
                                />
                            </Form.Item>
                            {(formData.winnerCount === "2") && (
                                <Form.Item label="2nd Winner Amount:" name="winningAmount2">
                                    <Input
                                    type="text"
                                    name="winningAmount2"
                                    placeholder="2st Winner Amount"
                                    value={formData?.winningAmount2}
                                    onChange={handleChange}
                                    />
                                </Form.Item>
                            )}
                            {(formData.winnerCount === "3") && (
                                <>
                                    <Form.Item label="2nd Winner Amount:" name="winningAmount2">
                                        <Input
                                            type="text"
                                            name="winningAmount2"
                                            placeholder="2st Winner Amount"
                                            value={formData?.winningAmount2}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                    <Form.Item label="3rd Winner Amount:" name="winningAmount3">
                                        <Input
                                            type="text"
                                            name="winningAmount3"
                                            placeholder="3st Winner Amount"
                                            value={formData?.winningAmount3}
                                            onChange={handleChange}
                                        />
                                    </Form.Item>
                                </>
                            )}
                        </>
                    )}


                    <Form.Item label='Tournament Interval:' name='tournamentInterval'>
                        <Input
                            type="text"
                            name='tournamentInterval'
                            placeholder='Tournament Interval'
                            value={formData.tournamentInterval}
                            onChange={handleChange}
                        />
                    </Form.Item>

                    <Form.Item label='Tournament Type:' name='tournamenttype'>
                        <Select
                            name="tournamenttype"
                            placeholder="Tournament Type"
                            value={formData.tournamenttype}
                            onChange={(value) => handleChange({ target: { name: 'tournamenttype', value } })}
                        >
                            {/* Add your Option tags here */}
                            <Option value="30">30 Moves</Option>
                        </Select>
                    </Form.Item>

                    


                    {/* <Form.Item label='Tournament Status:' name='tournamentStatus'>
                        <Input
                            type="checkbox"
                            name='tournamentStatus'
                            checked={formData.tournamentStatus}
                            onChange={(e) => handleChange({ target: { name: 'tournamentStatus', value: e.target.checked } })}
                        />
                    </Form.Item> */}

                    <div>
                        <Form.Item>
                            <Button htmlType="submit" type="primary">Save</Button>
                        </Form.Item>
                    </div>
                </Form>
            </Modal>
        </>
    )
}

export default TournamentForm;
