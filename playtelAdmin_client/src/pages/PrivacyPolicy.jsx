import React, { useEffect, useState } from "react"
import Header from "../components/Header"
import { Breadcrumb, Button, Col, Form, Input, Layout, Row } from "antd"
import Sidebar from "../components/Sidebar"
import { useNavigate } from "react-router-dom"
import { addDesclamerData } from "../api/Api"
import Swal from "sweetalert2"

const PrivacyPolicy = () => {

    const navigate = useNavigate()

    const [formData, setFormData] = useState({
        addDisclamer: '',
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

    const onFinish = async () => {
        try {
            console.log("formData", formData)
            const response = await addDesclamerData(formData)
            console.log("response", response)
            if(response.data.status === "success") {
                Swal.fire({
                    icon: "success",
                    title: "Success!",
                    text: response.data.msg,
                });
                // navigate("/touranaments/list");
            } else {
                Swal.fire({  
                    icon: "error",
                    title: "Error!",
                    text: response.data.msg,
                });
            }
        } catch (error) {
            console.log(error)
        }
        // navigate('/players/list')
    }

    const handleReset = () => {
        // Reset the form data when the reset button is clicked
        console.log("reset")
        setFormData({
            addDisclamer: '',
        });
    };

    
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
                                                title: <h3>Privacy Policy</h3>,
                                            },
                                            {
                                                title: <a href="/">Home</a>,
                                            },
                                            {
                                                title: <a >Privacy Policy</a>,
                                            },
                                        ]}
                                    />
                                </Row>
                                <hr />

                                <Form layout="vertical" onFinish={onFinish}>
                            
                                    <Form.Item label='Disclamer' name='addDisclamer'>
                                        <Input.TextArea
                                            name="addDisclamer"
                                            placeholder="Write Disclamer Here"
                                            value={formData?.addDisclamer} 
                                            onChange={handleChange}
                                            rows={4} // You can adjust the number of rows as needed
                                        />
                                    </Form.Item>
                                
                                    <Form.Item>
                                        <Button htmlType="submit" type="primary" style={{ marginRight: "1%" }}>Update</Button>
                                        <Button htmlType="button" type="primary" onClick={handleReset}>Reset</Button>
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

export default PrivacyPolicy

