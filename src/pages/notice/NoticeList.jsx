import { Breadcrumb, Col, Layout, Modal, Row, Space, Spin, Table, message } from "antd"
import React, { useEffect, useState } from "react"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined } from "@ant-design/icons"
import axios from "axios"
import NoticeForm from "../../components/NoticeForm"
import { getNoticeData } from "../../api/Api"
import { base_url, delete_notice } from "../../api/Constants"


const NoticeList = () => {
    const [noticeData, setnoticeData] = useState([]) 
    const [editData, setEditData] = useState(null) 
    const [showNoticeForm, setShowNoticeForm] = useState()
    const [loading, setLoading] = useState(false)
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
        },
        {
            title: "Player ID",
            dataIndex: "_id",
            key: "playerId" ,
            render: (text) => text.toUpperCase(),
            // render: (text, record, index) => `pt${((currentPage - 1) * pageSize) + index + 1}`,
        },
        {
            title: "Message",
            dataIndex: "message",
            key: "message" ,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <EditOutlined
                        onClick={() => handleEdit(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    />
                    <DeleteOutlined
                        onClick={() => handleDelete(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    />
                    {/* <MessageOutlined 
                        onClick={() => handleDelete(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    /> */}
                </Space>
            ),
        },
    ]

    const handleEdit = (record) => {
        setEditData(record);
        setShowNoticeForm(true);
    };

    const handleDelete = (record) => {
    // console.log('Delete:', record);
        Modal.confirm({
            title: 'Confirm Deletion',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete notices data ${record.sNo} ${record.message} ?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    // const token = localStorage.getItem('token');  delete_notice
                    // const response = await axios.post(`http://localhost:2000/notice/delete-notices-data`, {
                    const response = await axios.post(`${base_url}${delete_notice}`, {
                        noticeId: record._id,
                    });
                    console.log('Response from backend:', response.data);
                    if(response.data.status === "success") {
                        message.success('notice data deleted successfully');
                        getNoticeData(); // Refresh the notice data  after deletion
                    } else {
                        message.error('Failed to delete notice data');
                    }
                } catch (error) {
                    console.error(error);
                    message.error('An error occurred while deleting the notice data');
                }
            },
        });
    };

    const mainNoticeData = async () => {
        try {
            // Set loading to true when starting to fetch data
            setLoading(true); 
            const data = await getNoticeData();
            if(data) {
                setnoticeData(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            // Set loading to false when data fetching is complete
            setLoading(false); 
        }
    }

    useEffect(() => {
        mainNoticeData()
    }, [])


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
                                                title: <a href="/players/list">List</a>,
                                            },
                                        ]}
                                    />
                                </Row>
                                <hr />
                                <Spin spinning={loading} size="large">
                                    <Table 
                                        columns={columns} 
                                        dataSource={noticeData}
                                        pagination={{
                                            showSizeChanger: true,
                                            pageSizeOptions: ['10', '20', '30'],
                                            defaultPageSize: 10,
                                            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                        }}
                                    />
                                </Spin>
                            </Col>
                        </Row>

                        {
                            showNoticeForm && (
                                <NoticeForm
                                    showNoticeForm={true} 
                                    setShowNoticeForm={setShowNoticeForm} 
                                    // noticeId={noticeId}
                                    getNoticeData={mainNoticeData}
                                    onEdit={handleEdit}  
                                    editData={editData}
                                />
                            )
                        }
                    </Layout>
                </Layout>
            </Layout>       
        </>
    )
}

export default NoticeList

