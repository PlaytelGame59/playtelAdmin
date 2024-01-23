import React, { useEffect, useState } from "react"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import { Breadcrumb, Button, Col, Input, Layout, Modal, Row, Select, Space, Spin, Table, message } from "antd"
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined } from "@ant-design/icons"
import axios from "axios"

import { CSVLink, CSVDownload } from "react-csv";

import { CopyToClipboard } from 'react-copy-to-clipboard';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getWithdrawListData } from "../../api/Api"
import { base_url, update_withdraw_status } from "../../api/Constants"


const WithdrawList = () => {
    const { Option } = Select;
    const [withdrawListData, setWithdrawListData] = useState([])  
    const [pageSize, setPageSize] = useState(5); 
    const [currentPage, setCurrentPage] = useState(1); 
    const [filteredData, setFilteredData] = useState([]);
    const [searchClicked, setSearchClicked] = useState(false);
    const [loading, setLoading] = useState(false)
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("token") !== null
    );
    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const columns = [
        {
            title: "S.No",
            dataIndex: "sNo",
            key: "sno",
            render: (text, record, index) => ((currentPage - 1) * pageSize) + index + 1,
            // ...getColumnSearchProps("sno")
        },
        {
            title: "Player ID",
            dataIndex: "_id",
            key: "_id" ,
            // ...getColumnSearchProps("_id")
        },
        {
            title: "Player Name",
            dataIndex: "player_id.first_name",
            key: "player_id.first_name",
            render: (_, record) => record.player_id && record.player_id.first_name,
        },
        {
            title: "Wallet Amount",
            dataIndex: "player_id.wallet_amount",
            key: "player_id.wallet_amount",
            render: (_, record) => record.player_id && record.player_id.wallet_amount,
        },
        {
            title: "Request Amount",
            dataIndex: "amt_withdraw",
            key: "amt_withdraw",
        },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            // ...getColumnSearchProps("type")
        },
        {
            title: "Acc No",
            dataIndex: "bank_account",
            key: "bank_account",
        },
        {
            title: "Ifsc",
            dataIndex: "bank_ifsc",
            key: "bank_ifsc",
        },
        {
            title: "Paytm No",
            dataIndex: "paytmNo",
            key: "paytmNo",
            // ...getColumnSearchProps("paytmNo")
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
                    <MessageOutlined 
                        onClick={() => handleDelete(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    />
                    <MessageOutlined 
                        onClick={() => handleApproveDisapprove(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    />
                </Space>
            ),
        },
    ]
    
    const handleEdit = (record) => {
        // setEditData(record);
        // setShowPlayerForm(true);
    };

    const handleDelete = (record) => {
    // console.log('Delete:', record);
        Modal.confirm({
            title: 'Confirm Deletion',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete Players data ${record.name} ${record.email} ?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    // const token = localStorage.getItem('token');
                    const response = await axios.delete(`${base_url}/player/delete-players-data/${record._id}`, {
                        // headers: {
                        //     Authorization: `Bearer ${token}`,
                        // },
                    });
                    console.log('Response from backend:', response.data);
                    if(response.data.status === "success") {
                        message.success('tournaments data deleted successfully');
                        // getPlayerData(); // Refresh the tournaments data  after deletion
                    } else {
                        message.error('Failed to delete tournaments data');
                    }
                } catch (error) {
                    console.error(error);
                    message.error('An error occurred while deleting the tournaments data');
                }
            },
        });
    };

    const handleApproveDisapprove = (record) => {
        Modal.confirm({
            title: 'Confirm Approve',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to approve withdraw request amount for player ${record.player_id.first_name} with requested amount ${record.amt_withdraw} ?`,
            okText: 'Approve',
            okType: 'danger',
            cancelText: 'Reject',
            onOk: async () => {
                try {
                    // Adjust the payload to match the server-side API
                    const response = await axios.post(`${base_url}${update_withdraw_status}`, {
                        player_id: record.player_id, // Pass the player_id
                        new_status: true, // Adjust this based on your backend logic
                    });
    
                    console.log("playerId", record.player_id);
                    console.log('Response from server:', response.data);
    
                    if (response.data.success) {
                        message.success('Withdraw status updated successfully');
                        // You may choose to update your local state or trigger a data refresh here.
                    } else {
                        console.error('Failed to update Withdraw status:', response.data.error);
                        message.error('Failed to update Withdraw status. Check the console for details.');
                    }
                } catch (error) {
                    console.error('Error updating Withdraw status:', error);
                    console.log('Full Axios Error:', error);
                    message.error('An error occurred while updating Withdraw status');
                }
            },
        });
    };
    
    
    const copyWithClipboard = () => {
        const tableData = withdrawListData.map((record) => ({
            SNo: record.sNo,
            'Play ID': record.playId,
            Name: record.name,
            Email: record.email,
            Aadhar: record.aadhar,
            'Mobile Number': record.mobileNo,
        }));
        const formattedData = tableData.map((record) => Object.values(record).join('\t')).join('\n');
        navigator.clipboard.writeText(formattedData);
        if(formattedData) {
            handleCopySuccess()
        }
    }

    const handleCopySuccess = () => {
        message.success('Data copied to clipboard');
    };

    const handleExcel = withdrawListData.map((item, index) => ({
        sNo: index + 1,
        ...item,
    }));

    const headers = [
        // Your CSV headers
        { label: "S.No", key: "sNo" },
        { label: "Play ID", key: "playId" },
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Mobile Number", key: "mobileNo" },
        // Add more headers as needed
    ];

    const downloadPdf = () => {
        const pdf = new jsPDF();
        // Add serial numbers to each row in the data
        const data = withdrawListData.map((item, index) => ({
            sNo: index + 1,
            ...item,
        }));
        pdf.autoTable({ 
            head: [columns.map(column => column.title)],
            body: data.map(item => columns.map(column => item[column.dataIndex]))
        });
        pdf.save('table.pdf');
    }

    const handlePageSizeChange = (value) => {
        setPageSize(value);
    };

    const filterData = () => {
        setSearchClicked(true);
    
        const searchData = document.getElementById('searchInput').value.toLowerCase();
    
        const filteredData = withdrawListData.filter((item) =>
            Object.values(item).some((value) =>
                value?.toString().toLowerCase().includes(searchData)
            )
        );
    
        setFilteredData(filteredData);
    };

    const mainWithdrawListData = async () => {
        try {
            // Set loading to true when starting to fetch data
            setLoading(true); 
            const data = await getWithdrawListData();
            console.log("getWithdrawListData", data)
            if(data) {
                setWithdrawListData(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            // Set loading to false when data fetching is complete
            setLoading(false); 
        }
    }

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
    };

    useEffect(() => {
        mainWithdrawListData()
    }, [currentPage, pageSize])

    useEffect(() => {
        console.log("Withdraw List Data:", withdrawListData);
    }, [withdrawListData]);

    

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
                                    
                                    <Col>
                                        <Breadcrumb
                                            items={[
                                                {
                                                    title: <a href="/">Home</a>,
                                                },
                                                {
                                                    title: <a href="/players/list">Withdraw Request</a>,
                                                },
                                                {
                                                    title: <a href="/players/list">List</a>,
                                                },
                                            ]}
                                        />
                                    </Col>
                                    
                                </Row>
                                <hr />
                            
                                <p>Withdraw Request List</p>

                                <CopyToClipboard text="Copy" onCopy={copyWithClipboard}>
                                    <Button>Copy</Button>
                                </CopyToClipboard>
                                <CSVLink data={handleExcel}  headers={headers} filename="player_data.csv"><Button>Excel</Button></CSVLink>
                                <Button onClick={downloadPdf}>PDF</Button>

                                {/* show and search row  */}
                                <Row>
                                    <Col 
                                        xs={24} 
                                        sm={24} 
                                        md={12} 
                                        lg={16} 
                                        xl={16}
                                    >
                                        Show Entities:{" "}
                                        <Select
                                            style={{ width: 80, marginLeft: 8 }}
                                            defaultValue={pageSize}
                                            onChange={handlePageSizeChange}
                                        >
                                            <Option value={5}>5</Option>
                                            <Option value={10}>10</Option>
                                            <Option value={15}>15</Option>
                                        </Select>
                                    </Col>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={12}
                                        lg={8}
                                        xl={8}
                                    >
                                        <Row gutter={[16, 16]}>
                                            <Col 
                                                xs={24} 
                                                sm={24} 
                                                md={12} 
                                                lg={4} 
                                                xl={4}
                                            >
                                                <span style={{ display: 'inline-block', marginRight: 8 }}>Search:</span>
                                            </Col>
                                            <Col 
                                                xs={24} 
                                                sm={24} 
                                                md={12} 
                                                lg={20} 
                                                xl={20}
                                            >
                                                <Input id="searchInput" label="search" onChange={filterData} />
                                            </Col>
                                        </Row>
                                    </Col>
                                </Row>
                                <Spin spinning={loading} size='large'>
                                    <Table 
                                        columns={columns} 
                                        dataSource={searchClicked ? filteredData : withdrawListData} 
                                        pagination={{
                                            showSizeChanger: true,
                                            // pageSizeOptions: ['10', '20', '30'],
                                            pageSize: pageSize,
                                            defaultPageSize: 5,
                                            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                            current: currentPage,
                                        }}
                                        onChange={handleTableChange}
                                    />
                                </Spin>
                            </Col>
                        </Row>
                        
                    </Layout>
                </Layout>
            </Layout>        
        </>
    )
}

export default WithdrawList
