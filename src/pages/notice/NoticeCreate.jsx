import React, { useState } from "react"
import Header from "../../components/Header"
import { Breadcrumb, Button, Col, Form, Input, Layout, Row } from "antd"
import Sidebar from "../../components/Sidebar"
import Swal from 'sweetalert2';
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { addNoticeData } from "../../api/Api";


const NoticeCreate = () => {

    const navigate = useNavigate()
    const [isSidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const [formData, setFormData] = useState({
        message: '', 
    })

    const handleChange = (e) => {
        setFormData((pre)=>{ 
            return({
            ...pre,
            [e.target.name]: e.target.value 
        })})
    }

    
    const onFinish = async () => {
        try {
            const response = await addNoticeData(formData);
            if(response.data.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: response.data.msg,
                });
                navigate("/notice/list");
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
    
    return (
        <>
            <Layout style={{ minHeight: "100vh" }}>
                <Header toggleSidebar={toggleSidebar} />
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
                                                title: <h3>Notice</h3>,
                                            },
                                            {
                                                title: <a href="/">Home</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Notice</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Create</a>,
                                            },
                                        ]}
                                    />
                                </Row>
                                <hr />

                                <Form layout="vertical" onFinish={onFinish}>
                                    <p>Create Notice</p>
                                    <Form.Item label='Message:' name='message'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Input
                                                    type="text" 
                                                    name='message'
                                                    value={formData?.message} 
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>
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
    )
}

export default NoticeCreate

