import { Breadcrumb, Button, Col, Form, Input, Layout, Row, Upload, message } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { UploadOutlined } from "@ant-design/icons";
import { addPlayerData } from "../../api/Api";

const PlayerCreate = () => {
    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        // playId: '', 
        name: '', 
        email: '',
        player_image: '',   
        // player_image: {bytes: ""}, 
        mobileNo: ''
    })

    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("token") !== null
    );
    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const handleChange = (e) => {
        setFormData((pre)=>{ 
            return({
            ...pre,
            [e.target.name]: e.target.value 
        })})
    }

    // const handleFileUpload = (e) => {
    //     const file = e.target.files[0];
    //     if (!file) {
    //         return;
    //     }
    //     const fileUrl = URL.createObjectURL(file);
    //     setFormData((prev) => ({
    //         ...prev,
    //         player_image: { url: fileUrl },
    //     }));
    //     console.log("File URL", fileUrl);
    // }
    

    // const convertToBase64 = (file) => {
    //     return new Promise((resolve, reject) => {
    //         const fileReader = new FileReader();
    //         fileReader.readAsDataURL(file);
    //         fileReader.onload = () => {
    //             resolve(fileReader.result);
    //         };
    //         fileReader.onerror = (error) => {
    //             reject(error);
    //         };
    //     });
    // }

    // const handleFileUpload = async (e) => {
    //     const file = e.target.files[0];
    //     if(!file) {
    //         return;
    //     }
    //     const base64 = await convertToBase64(file);
    //     setFormData((prev) => ({
    //         ...prev,
    //         player_image: base64,
    //     }));
    //     console.log("base64", base64)
    // }

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
        try {
            console.log("Form Data:", formData);
            // if(!formData.player_image) {
            //     // Handle the case where 'player_image' is required but not provided
            //     Swal.fire({
            //         icon: 'error',
            //         title: 'Error!',
            //         text: 'Please upload an image (player_image)',
            //     });
            //     return;
            // }

            // Call the convertBase64Url function to handle the image conversion
            // const base64 = await convertBase64Url(formData.player_image);
            // const base64 = await convertBase64Url(formData.player_image.originFileObj);

            // console.log("Base64 Image:", base64);

            if(!formData || !formData.player_image) {
                console.error('formData or formData.player_image is undefined or null');
                return;
            }    

            // const response = await addPlayerData({ ...formData});
            // const response = await addPlayerData({ ...formData, player_image: base64 });
            const response = await addPlayerData({ ...formData, player_image: formData.player_image });
            
            if(response.data.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: response.data.msg,
                });
                navigate("/players/list");  
            } else {
                Swal.fire({  
                    icon: "error",
                    title: "Error!",
                    text: response.data.msg,
                });
            }
        } catch(error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'An error occurred while submitting the form. Please try again.',
            });
        }
    }


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
                                                title: <h3>Player</h3>,
                                            },
                                            {
                                                title: <a href="/">Home</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Player</a>,
                                            },
                                            {
                                                title: <a >create</a>,
                                            },
                                        ]}
                                    />
                                </Row>
                                <hr />

                                <Form layout="vertical" onFinish={onFinish}>
                                    <h4>Create Player</h4>
                                    
                                    {/* <Form.Item label='PlayId:' name='playId'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Input
                                                    type="text" 
                                                    name='playId'
                                                    value={formData?.playId} 
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item> */}

                                    <Form.Item label='Player Name:' name='name'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Input
                                                    type="text" 
                                                    name='name'
                                                    value={formData?.name} 
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label='Player Email:' name='email'>
                                    
                                        <Input
                                            type="text" 
                                            name="email"
                                            value={formData?.email} 
                                            onChange={handleChange}
                                            rows={4} // You can adjust the number of rows as needed
                                        />
                                    </Form.Item>

                                    <Form.Item label='Player Mobile No:' name='mobileNo'>
                                    
                                        <Input
                                            type="number"
                                            name="mobileNo"
                                            value={formData?.mobileNo} 
                                            onChange={handleChange}
                                            rows={4} // You can adjust the number of rows as needed
                                        />
                                    </Form.Item>

                                    {/* <Form.Item label='Send Image:' name="player_image"  rules={[{ required: true, message: 'Please upload an image (player_image)' }]}>
                                        <Upload {...props}>
                                            <Button icon={<UploadOutlined />}>Click to Upload</Button>
                                        </Upload>
                                    
                                    </Form.Item> */}

                                    <Form.Item label="Send Image:" >
                                        <input 
                                            
                                            // value={formData?.player_image} 
                                            // onChange={handleChange}
                                            type="file"
                                            label="Image"
                                            name="player_image"
                                            accept=".jpeg, .png, .jpg"
                                            onChange={handleFileUpload}
                                        />
                                    </Form.Item>
                                
                                    <div>
                                        <Form.Item>
                                            <Button htmlType="submit" type="primary" style={{ marginRight: "1%" }}>Submit</Button>
                                            <Button htmlType="submit" type="primary">Reset</Button>
                                        </Form.Item>
                                    </div>
                                </Form>
                            
                        
                            </Col>
                        </Row>
                    </Layout>
                </Layout>
            </Layout>
        </>
    );
}

export default PlayerCreate;