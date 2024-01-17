import { Breadcrumb, Button, Col, Input, Layout, Modal, Row, Select, Space, Spin, Table, message } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import { getRechargeTransactionData } from "../../api/Api";
import { CSVLink, CSVDownload } from "react-csv";

import { CopyToClipboard } from 'react-copy-to-clipboard';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { base_url, delete_player } from "../../api/Constants";

const RechargeTransaction = () => {
    const { Option } = Select;
    const [rechargeTransactionData, setrechargeTransactionData] = useState([])
    const [pageSize, setPageSize] = useState(10); 
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
            render: (text, record, index) => index + 1,
            // ...getColumnSearchProps("sno")
        },
        {
            title: "Player ID",
            dataIndex: "playerId",   
            key: "playerId" ,
            // ...getColumnSearchProps("playerId")
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            // ...getColumnSearchProps("amount")
        },
        {
            title: "Txn Date/Time",
            dataIndex: "txndateTime",
            key: "txndateTime",
            // ...getColumnSearchProps("txndateTime")
        },
        {
            title: "Notes",
            dataIndex: "notes",
            key: "notes",
            // ...getColumnSearchProps("notes")
        },
    
        // {
        //     title: 'Action',
        //     key: 'action',
        //     render: (_, record) => (
        //         <Space size="middle">
        //             <EditOutlined
        //                 onClick={() => handleEdit(record)} 
        //                 style={{ color: '#f4a805', cursor: 'pointer' }}
        //             />
        //             <DeleteOutlined
        //                 onClick={() => handleDelete(record)} 
        //                 style={{ color: '#f4a805', cursor: 'pointer' }}
        //             />
        //             <MessageOutlined 
        //                 onClick={() => handleDelete(record)} 
        //                 style={{ color: '#f4a805', cursor: 'pointer' }}
        //             />
        //         </Space>
        //     ),
        // },
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
                    // const response = await axios.delete(`http://localhost:2000/player/delete-players-data/${record._id}`, {
                    const response = await axios.delete(`${base_url}${delete_player}/${record._id}`, {
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

    
    const copyWithClipboard = () => {
        const tableData = rechargeTransactionData.map((record) => ({
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

    const handleExcel = rechargeTransactionData.map((item, index) => ({
        sNo: index + 1,
        ...item,
    }));

    const headers = [
        // Your CSV headers
        { label: "S.No", key: "sNo" },
        { label: "Player ID", key: "playerId" },
        { label: "Amount", key: "amount" },
        { label: "Txn Date/Time", key: "txndateTime" },
        { label: "Type", key: "type" },
        { label: "Txn By", key: "txnBy" },
        // Add more headers as needed
    ];

    const downloadPdf = () => {
        const pdf = new jsPDF();
        // Add serial numbers to each row in the data
        const data = rechargeTransactionData.map((item, index) => ({
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
    
        const filteredData = rechargeTransactionData.filter((item) =>
            Object.values(item).some((value) =>
                value?.toString().toLowerCase().includes(searchData)
            )
        );
    
        setFilteredData(filteredData);
    };

    const maingetRechargeTransactionData = async () => {
        try {
            setLoading(true)
            const data = await getRechargeTransactionData();
            if(data) {
                setrechargeTransactionData(data);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        maingetRechargeTransactionData()
    }, [])

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
                                    {/* <Col>
                                        <p>Recharge Transaction History</p>
                                    </Col> */}
                                    <Col>
                                        <Breadcrumb
                                            items={[
                                                // {
                                                //     title: <h3>Home</h3>,
                                                // },
                                                {
                                                    title: <a href="/">Home</a>,
                                                },
                                                {
                                                    title: <a href="/players/list">Report</a>,
                                                },
                                                {
                                                    title: <a href="/players/list">Recharge Transaction History</a>,
                                                },
                                            ]}
                                        />
                                    </Col>
                                    
                                </Row>
                                <hr />

                                <p>Recharge History</p>

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
                                            <Option value={10}>10</Option>
                                            <Option value={20}>20</Option>
                                            <Option value={30}>30</Option>
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

                                <Spin spinning={loading} size="large">
                                    <Table 
                                        columns={columns} 
                                        dataSource={searchClicked ? filteredData : rechargeTransactionData} 
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
                    </Layout>
                </Layout>
            </Layout>
        </>
    )
}  

export default RechargeTransaction