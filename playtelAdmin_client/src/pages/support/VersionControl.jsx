import React, { useState } from "react";
import Header from "../../components/Header";
import { Breadcrumb, Col, Row, Space, Table } from "antd";
import Sidebar from "../../components/Sidebar";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined } from "@ant-design/icons"


const VersionControl = () => {

    const [versionControlData, setversionControlData] = useState()

    const columns = [
        {
            title: "S.No",
            dataIndex: "sNo",
            key: "sno",
            render: (text, record, index) => index + 1,
            // ...getColumnSearchProps("sno")
        },
        {
            title: "Version Control",
            dataIndex: "versionControl",
            key: "versionControl" ,
            // ...getColumnSearchProps("playerId")
        },
        {
            title: "App Link",
            dataIndex: "appLink",
            key: "appLink",
            // ...getColumnSearchProps("appLink")
        },
        // {
        //     title: "Email",
        //     dataIndex: "email",
        //     key: "email",
        //     // ...getColumnSearchProps("email")
        // },
        // {
        //     title: "Aadhar",
        //     dataIndex: "aadhar",
        //     key: "aadhar",
        //     // ...getColumnSearchProps("aadhar")
        // },
        // {
        //     title: "Mobile Number",
        //     dataIndex: "mobileNo",
        //     key: "mobileNo",
        //     // ...getColumnSearchProps("mobileNo")
        // },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => handleEdit(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    />
                    {/* <DeleteOutlined
                        onClick={() => handleDelete(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    />
                    <MessageOutlined 
                        onClick={() => handleNotification(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    /> */}
                </Space>
            ),
        },
    ]

    const handleEdit = (record) => {
        // setEditData(record);
        // setShowPlayerForm(true);
    };

    return ( 
        <>
            {/* <p>VersionControl</p> */}
            <Header />  
            <Row>
                <Col
                    xs={24} 
                    sm={24}
                    md={4} 
                    lg={4} 
                    xl={4}  
                >
                    <Sidebar />
                </Col>
                <Col
                    xs={24} 
                    sm={24}
                    md={20} 
                    lg={20} 
                    xl={20} 
                >
                    <Row>
                        <Breadcrumb
                            items={[
                                {
                                    title: <h3>Version Control</h3>,
                                },
                                {
                                    title: <a href="/">Home</a>,
                                },
                                {
                                    title: <a href="/players/list">Version Control </a>,
                                },
                                {
                                    title: <a href="/players/list">List</a>,
                                },
                            ]}
                        />
                    </Row>
                    <hr />

                    
                    <Table columns={columns} dataSource={versionControlData} />
                </Col>
            </Row>
        </>
    );
}

export default VersionControl;