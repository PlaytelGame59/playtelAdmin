import { Breadcrumb, Button, Checkbox, Col, Form, Input, Layout, Row, Select, Table } from "antd"
import axios from "axios"
import React, { useEffect, useState } from "react"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { addTournamentData } from "../../api/Api"

const CreateTournament = () => {
    const { Option } = Select;
    const navigate = useNavigate()

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

        tournamentInterval: '',
        tournamenttype: '',
        tournamentStatus: false
    })
    const [timer, setTimer] = useState(0);
    const [isSidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("token") !== null
    );

    const handleChange = (e) => {
        setFormData((pre)=>{ 
            return({
            ...pre,
            [e.target.name]: e.target.value 
        })})
    }

    const onFinish = async () => {
        try {
            console.log(formData);
            const response = await addTournamentData(formData);
            if(response.data.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: response.data.msg,
                });
                navigate("/touranaments/list");
            } else {
                Swal.fire({  
                    icon: "error",
                    title: "Error!",
                    text: response.data.msg,
                });
            }
        } catch(error) {
            console.error('Error submitting form:', error);
        }
    }

    useEffect(() => {
        // Update the timer every second
        const intervalId = setInterval(() => {
            if(formData.tournamenttype === '30') {
                // Assuming '30' represents 30 seconds, update the timer
                setTimer((prevTimer) => prevTimer + 1);
            }
        }, 1000);

        // Cleanup the interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [formData.tournamenttype]);

    return (
        <>
            <Layout style={{ minHeight: "100vh" }}>
                <Header 
                    toggleSidebar={toggleSidebar} 
                    isAuthenticated={isAuthenticated}
                />
                <Layout>
                    {isSidebarVisible && <Sidebar />}
                    <Layout
                        style={{ 
                            padding: "24px", 
                            minHeight: "280px", 
                            cursor: "pointer"
                        }} 
                    >
                        <Row>
                            <Col
                                xs={24} 
                                sm={24}
                                md={24} 
                                lg={24} 
                                xl={24} 
                            >
                                <Row>
                                    <Breadcrumb
                                        items={[
                                            {
                                                title: <h3>Tournament</h3>,
                                            },
                                            {
                                                title: <a href="/">Home</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Tournament</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Create</a>,
                                            },
                                        ]}
                                    />
                                </Row>
                                <hr />
                                <p>Create Tournament</p>
                                <Form layout="vertical" onFinish={onFinish}>
                                    <Form.Item label='Tournament Name:' name='tournamentName'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Input
                                                    type="text"
                                                    name="tournamentName"
                                                    placeholder="Tournament Name"
                                                    value={formData?.tournamentName}
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label='BetAmount:' name='betAmount'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Input
                                                    type="text"
                                                    name="betAmount"
                                                    placeholder="betAmount"
                                                    value={formData?.betAmount}
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label="Players:" name="noPlayers">
                                        <Select
                                            name="noPlayers"
                                            placeholder="Select No of Players"
                                            value={formData.noPlayers}
                                            onChange={(value) => handleChange({ target: { name: 'noPlayers', value } })}
                                        >
                                            <Option value="2">2 Player</Option>
                                            <Option value="3">3 Player</Option>
                                            <Option value="4">4 Player</Option>
                                        </Select>
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

                                    {(formData.noPlayers === "4") && (
                                        <Form.Item label="Winners Count:" name="winnerCount">
                                            <Select
                                                name="winnerCount"
                                                placeholder="Select Winners Count"
                                                value={formData?.winnerCount}
                                                onChange={(value) => handleChange({ target: { name: 'winnerCount', value } })}
                                            >
                                            <Option value="1">1st Winner</Option>
                                            <Option value="2">2nd Winner</Option>
                                            <Option value="3">3rd Winner</Option>
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


                                    <Form.Item label='Tournament Time:' name='tournamentInterval'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Input
                                                    type="String"
                                                    name="tournamentInterval"
                                                    placeholder="Tournament Time"
                                                    value={formData?.tournamentInterval}
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label='Tournament Type:' name='tournamenttype'>
                                        <Select
                                            name="tournamenttype"
                                            placeholder="Timer"
                                            value={formData?.tournamenttype}
                                            onChange={(value) => handleChange({ target: { name: 'tournamenttype', value } })}
                                        >
                                            <Option value="30">30 Moves</Option>
                                        </Select>
                                    </Form.Item>

                                    {formData.tournamenttype === '30' && (
                                        <Form.Item label='Timer:'>
                                            <Input value={`${timer} seconds`} readOnly />
                                        </Form.Item>
                                    )}

                                    <Form.Item label='Tournament Status:' name='tournamentStatus'>
                                        <Checkbox
                                            name="tournamentStatus"
                                            checked={formData?.tournamentStatus}
                                            onChange={(e) => handleChange({ target: { name: 'tournamentStatus', value: e.target.checked } })}
                                        />
                                    </Form.Item>   
                                
                                    <div>
                                        <Form.Item>
                                            <Button htmlType="submit" type="primary" style={{ marginRight: "1%" }} >Submit</Button>
                                            <Button htmlType="submit" type="primary" >Reset</Button>
                                        </Form.Item>
                                    </div>

                                </Form>
                            </Col>
                        </Row>
                    </Layout>
                </Layout>
            </Layout>
        </>
    )
}

export default CreateTournament

