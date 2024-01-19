// notification page
import React, { useEffect, useState } from "react"
import Header from "../../components/Header"
import { Breadcrumb, Button, Col, Form, Input, Layout, Row, Select, Upload, message } from "antd"
import Sidebar from "../../components/Sidebar"
import { useLocation, useNavigate } from "react-router-dom"
import { UploadOutlined } from "@ant-design/icons"
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import Swal from "sweetalert2"
import { addNotificationData, addPlayerData, getPlayerData } from "../../api/Api"

const NotificationAllPlayers = () => {
    const { Option } = Select;
    const navigate = useNavigate()
    const location = useLocation();
    const [players, setPlayers] = useState([]);
    const [playerId, setPlayerId] = useState(null);
    const [listId, setListId] = useState([]);

    // const [selectedPlayer, setSelectedPlayer] = useState(null);

    const [selectedPlayers, setSelectedPlayers] = useState([]);
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("token") !== null
    );
    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    // const playerName = new URLSearchParams(location.search).get("playerName");

    const [formData, setFormData] = useState({
        // player: playerName || '',
        notificationTitle: '',
        notificationMessage: '',
        notificationImg: '',   
    })

    const handleChange = (e) => {
        setFormData((pre)=>{ 
            return({
            ...pre,
            [e.target.name]: e.target.value 
        })})
    }

    const handlePlayerChange = (values) => {
        const selectedPlayers = values.includes("selectAll")
            ? players
            : players.filter((player) => values.includes(player.name));
    
        setSelectedPlayers(selectedPlayers);
    
        // Set notificationTitle and notificationMessage when players change
        const titles = selectedPlayers.map((player) => player.notificationTitle?.toString() || '');
        const messages = selectedPlayers.map((player) => player.notificationMessage?.toString() || '');
    
        const playerIds = selectedPlayers.map((player) => player._id);
    
        setFormData((prev) => ({
            ...prev,
            list_id: playerIds, // Update to use list_id as an array
            notificationTitle: titles.join(', '),
            notificationMessage: messages.join(', '),
        }));
    
        setListId(playerIds); // Update listId state
    };

    // const convertToBase64 = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const fileReader = new FileReader();
    //         fileReader.readAsDataURL(file);
    //         fileReader.onload = () => {
    //             const base64 = fileReader.result;
    //             console.log("Base64", base64); // Add this line to check the base64 value
    //             resolve(base64);
    //         };
    //         fileReader.onerror = (error) => {
    //             reject(error);
    //         };
    //     });
    // };
    
    // const handleFileUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if(!file) {
    //         return;
    //     }
    //     const base64 = await convertToBase64(file);
    //     setFormData((prev) => ({  
    //         ...prev,
    //         notificationImg: base64,
    //     }));
    //     console.log("base64", base64)
    // }

    // const handleFileUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) {
    //         return;
    //     }
    
    //     const formData = new FormData();
    //     formData.append('notificationImg', file);
    
    //     setFormData((prev) => ({
    //         ...prev,
    //         notificationImg: formData,
    //     }));
    
    //     console.log('File uploaded:', file);
    // };

    const handleFileUpload = (e) => {
        console.log( 'notificationimg', e.target.files[0]);
        const file = (e.target.files[0]);
        if(!file) {
            return;
        }  


        // Now you can use formData for further processing or set it in your component state
        setFormData((prev) => ({
            ...prev,
            notificationImg: file,
        }));
        console.log('File uploaded:', file);
        
    };

    const onFinish = async () => {
        console.log('formData', formData); 
        try {
            const formDataWithPlayerIds = selectedPlayers.map((player) => ({
                ...formData,
                list_id: [player._id], // Pass player ID as an array
            }));
            
    
            console.log("list_id", listId)
            console.log('formData', formData) 
            const responses = await Promise.all(
                formDataWithPlayerIds.map((data) => addNotificationData(data))
            );
    
            const isSuccess = responses.every((response) => response.data.status === 'success');
    
            if(isSuccess) {
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Notifications sent successfully.',
                });
    
                // Reset form data and selected players after successful submission
                setFormData({
                    list_id: [],
                    notificationTitle: '',
                    notificationMessage: '',
                    notificationImg: '',
                });
    
                setSelectedPlayers([]);
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Some notifications failed to send. Please try again.',
                });
            }
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    // const getNotification
    const getNotification = async () => {
        try {
            const response = await getPlayerData();
            setPlayers(response);  
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    };

    useEffect(() => {
        getNotification();  
    }, []);

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
                                                title: <h3>Notification</h3>,
                                            },
                                            {
                                                title: <a href="/">Home</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Player</a>,
                                            },
                                            {
                                                title: <a >Send Notification</a>,
                                            },
                                        ]}
                                    />
                                </Row>
                                <hr />

                                <Form layout="vertical" onFinish={onFinish}>
                                    <h4>Send Notification</h4>
                                    <p>All Player</p>

                                    <Form.Item label="Player:" name="email">
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Select
                                                    showSearch
                                                    mode="multiple"
                                                    placeholder="Select Player Name"
                                                    optionFilterProp="children"
                                                    onChange={handlePlayerChange}
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {/* Option for Select All */}
                                                    <Option value="selectAll">Select All</Option>

                                                    {/* Options for individual players */}
                                                    {players.map((player) => (
                                                        <Option 
                                                            key={player.first_name} 
                                                            value={player.first_name}
                                                        >
                                                            {player.first_name}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label='Notification Title:' name='notificationTitle'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Input
                                                    type="text" 
                                                    name='notificationTitle'
                                                    value={formData?.notificationTitle} 
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label='Notification Message:' name='notificationMessage'>
                                    
                                        <Input.TextArea
                                            name="notificationMessage"
                                            value={formData?.notificationMessage} 
                                            onChange={handleChange}
                                            rows={4} // You can adjust the number of rows as needed
                                        />
                                    </Form.Item>

                                    <Form.Item label="Send Image:" >
                                        <input 
                                            
                                            // value={formData?.notificationImg} 
                                            // onChange={handleChange}
                                            type="file"
                                            label="Image"
                                            name="notificationImg"
                                            accept=".jpeg, .png, .jpg"
                                            onChange={handleFileUpload}
                                        />
                                    </Form.Item>
                                
                                    <Form.Item>
                                        <Button htmlType="submit" type="primary" style={{ marginRight: "1%" }}>Submit</Button>
                                        <Button htmlType="submit" type="primary">Reset</Button>
                                    </Form.Item>

                                </Form>
                            </Col>
                        </Row>
                    </Layout>
                </Layout>
            </Layout>
        </>
    )
}

export default NotificationAllPlayers