import React, { useState } from "react"
import Header from "../../components/Header"
import { Breadcrumb, Col, Layout, Modal, Row, Space, Table, message } from "antd"
import Sidebar from "../../components/Sidebar"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined } from "@ant-design/icons"


const ContactUser = () => {
    const [contactUserData, setcontactUserData] = useState([]) 
    const [isSidebarVisible, setSidebarVisible] = useState(true);

    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const columns = [
        {
            title: "S.No",
            dataIndex: "sNo",
            key: "sno",
            render: (text, record, index) => index + 1,
            // render: (text, record, index) => ((currentPage - 1) * pageSize) + index + 1,
            // ...getColumnSearchProps("sno")
        },
        // {
        //     title: "Player ID",
        //     dataIndex: "_id",
        //     key: "playerId" ,
        //     render: (text) => text.toUpperCase(),
        //     // render: (text, record, index) => `pt${((currentPage - 1) * pageSize) + index + 1}`,
        // },
        {
            title: "Name",
            dataIndex: "name",
            key: "name" ,
            // ...getColumnSearchProps("message")
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email" ,
            // ...getColumnSearchProps("message")
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message" ,
            // ...getColumnSearchProps("message")
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    {/* <EditOutlined
                        onClick={() => handleEdit(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    /> */}
                    <MessageOutlined 
                        onClick={() => handleDelete(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    />
                    <DeleteOutlined
                        onClick={() => handleDelete(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    />
                    
                </Space>
            ),
        },
    ]

    const handleDelete = (record) => {
        // console.log('Delete:', record);
        Modal.confirm({
            title: 'Confirm Deletion',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete notices data ${record.sNo} ${record.message} ?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            // onOk: async () => {
            //     try {
            //         // const token = localStorage.getItem('token');
            //         const response = await axios.post(`http://localhost:2000/notice/delete-notices-data`, {
            //             noticeId: record._id,
            //         });
            //         console.log('Response from backend:', response.data);
            //         if(response.data.status === "success") {
            //             message.success('notice data deleted successfully');
            //             getNoticeData(); // Refresh the notice data  after deletion
            //         } else {
            //             message.error('Failed to delete notice data');
            //         }
            //     } catch (error) {
            //         console.error(error);
            //         message.error('An error occurred while deleting the notice data');
            //     }
            // },
        });
    };
    
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
                                                title: <h3>Contact User</h3>,
                                            },
                                            {
                                                title: <a href="/">Home</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Contact User </a>,
                                            },
                                            {
                                                title: <a href="/players/list">List</a>,
                                            },
                                        ]}
                                    />
                                </Row>
                                <hr />

                                <Table columns={columns} dataSource={contactUserData} />
                            </Col>
                        </Row>
                    </Layout>
                </Layout>
            </Layout>
        </>
    )
}

export default ContactUser

