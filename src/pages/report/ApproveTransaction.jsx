import { Breadcrumb, Button, Col, Input, Layout, Modal, Row, Select, Space, Spin, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import PlayerForm from "../../components/PlayerForm";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined } from "@ant-design/icons"
import { getPlayerData, getapproveWithdrawData } from "../../api/Api";

import { CSVLink, CSVDownload } from "react-csv";

import { CopyToClipboard } from 'react-copy-to-clipboard';

import jsPDF from 'jspdf';
import 'jspdf-autotable';


const ApproveTransaction = () => {
    // const tableRef = useRef(null);
    const { Option } = Select;
    const navigate = useNavigate()
    const [playerData, setplayerData] = useState([])    
    const [editData, setEditData] = useState(null)
    const [showPlayerForm, setShowPlayerForm] = useState()
    const [notificationData, setNotificationData] = useState(null)
    const [playerId, setPlayerId] = useState()
    const [pageSize, setPageSize] = useState(10); 
    const [filteredData, setFilteredData] = useState([]);
    const [searchClicked, setSearchClicked] = useState(false);
    const [expandedRowKeys, setExpandedRowKeys] = useState([]);
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
            title: "Player Id",
            dataIndex: "playerId",
            key: "playerId",
            // ...getColumnSearchProps("playerId")
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
            // ...getColumnSearchProps("name")
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount" ,
            // ...getColumnSearchProps("amount")
        },
        {
            title: "Requested At",
            dataIndex: "requestedAt",
            key: "requestedAt" ,
            // ...getColumnSearchProps("requestedAt")
        },
        {
            title: "Approve At",
            dataIndex: "approveAt",
            key: "approveAt",
            // ...getColumnSearchProps("approveAt")
        },
        {
            title: "Requested By",
            dataIndex: "requestedBy",
            key: "requestedBy",
            // ...getColumnSearchProps("requestedBy")
        },
        {
            title: "Account Number",
            dataIndex: "accountNumber",
            key: "accountNumber",
            // ...getColumnSearchProps("accountNumber")
        },
        {
            title: "IFSC Code",
            dataIndex: "ifscCode",
            key: "ifscCode",
            // ...getColumnSearchProps("ifscCode")
        },
        {
            title: "Transaction id",
            dataIndex: "transactionId",
            key: "transactionId",
            // ...getColumnSearchProps("transactionId")
        },
    ]

    // const handleExpand = (record) => {
    //     // Only allow expanding the first row
    //     if (!expandedRowKeys.length) {
    //       setExpandedRowKeys([record.key]);
    //     } else {
    //       setExpandedRowKeys([]);
    //     }
    //   };

    const handleExpand = (record) => {
        // Only allow expanding one row at a time
        setExpandedRowKeys((prevKeys) => {
            if (prevKeys.includes(record._id)) {
                return [];
            } else {
                return [record._id];
            }
        });
    };

    // const handleExpand = (record) => {
    //     // Only allow expanding one row at a time
    //     setExpandedRowKeys((prevKeys) => {
    //         if(prevKeys.includes(record.key)) {
    //             return [];
    //         } else {
    //             return [record.key];
    //         }
    //     });
    // };

    const handleEdit = (record) => {
        setEditData(record);
        setShowPlayerForm(true);
    };

    const handleNotification = (record) => {
        // convertBase64UrlInAadharImg(record.aadhar);
        navigate(`/notification?playerName=${record.name}`);
    };

    const handleDelete = async (record) => {
        Modal.confirm({
            title: 'Confirm Deletion',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete Players data ${record.name} ${record.email} ?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    const response = await axios.post('http://localhost:2000/player/delete-players-data', {
                        playerId: record._id,
                    });
    
                    console.log('Response from backend:', response.data);
    
                    if (response.data.status === 'success') {
                        message.success('Player data deleted successfully');
                        mainPlayerData(); // Refresh the players data after deletion
                    } else {
                        message.error('Failed to delete player data');
                    }
                } catch (error) {
                    console.error(error);
                    message.error('An error occurred while deleting the player data');
                }
            },
        });
    };

    const copyWithClipboard = () => {
        const tableData = playerData.map((record) => ({
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

    const handleExcel = playerData.map((item, index) => ({
        sNo: index + 1,
        ...item,
    }));

    const headers = [
        // Your CSV headers
        { label: "S.No", key: "sNo" },
        { label: "Play ID", key: "playId" },
        { label: "Name", key: "name" },
        { label: "Email", key: "email" },
        { label: "Aadhar", key: "aadhar"},
        { label: "Mobile Number", key: "mobileNo" },
        // Add more headers as needed
    ];

    // const downloadPdf = () => {
    //     const pdf = new jsPDF();
    //     // Add serial numbers to each row in the data
    //     const data = playerData.map((item, index) => ({
    //         sNo: index + 1,
    //         ...item,
    //     }));
    //     pdf.autoTable({ 
    //         head: [columns.map(column => column.title)],
    //         body: data.map(item => columns.map(column => item[column.dataIndex]))
    //     });
    //     pdf.save('table.pdf');
    // }
    
    const downloadPdf = () => {
        const pdf = new jsPDF();
    
        // Add serial numbers to each row in the data
        const data = playerData.map((item, index) => ({
            sNo: index + 1,
            ...item,
        }));
    
        // Define the columns for the table
        const pdfColumns = columns.map(column => column.title);
    
        // Map data to a format suitable for autoTable
        const pdfData = data.map(item => columns.map(column => {
            // Check if the column contains an image
            if(column.dataIndex === 'aadhar') {
                return {
                    content: {
                        image: item.aadhar, // Assuming 'aadhar' contains the base64-encoded image
                        width: 10, // Adjust the width as needed
                    },
                };
            } else {
                return item[column.dataIndex];
            }
        }));
    
        // Configure autoTable options
        const options = {
            startY: 10, // Adjust the starting Y position as needed
        };
    
        pdf.autoTable(pdfColumns, pdfData, options);
    
        // Save the PDF
        pdf.save('table.pdf');
    };
    

    // const downloadPdf = () => {
    //     const pdf = new jsPDF();
    
    //     // Add serial numbers to each row in the data
    //     const data = playerData.map((item, index) => ({
    //         sNo: index + 1,
    //         ...item,
    //     }));
    
    //     // Define the columns for the table
    //     const pdfColumns = columns.map(column => column.title);
    
    //     // Map data to a format suitable for autoTable
    //     const pdfData = data.map(item => columns.map(column => {
    //         // Check if the column contains an image
    //         if(column.dataIndex === 'aadhar') {
    //             return {
    //                 content: {
    //                     content: '',
    //                     image: item.aadhar, // Assuming 'aadhar' contains the base64-encoded image
    //                     width: 10, // Adjust the width as needed
    //                 },
    //             };
    //         } else {
    //             return item[column.dataIndex];
    //         }
    //     }));

    //     // Configure autoTable options
    //     const options = {
    //         startY: 10, // Adjust the starting Y position as needed
    //     };
    
    //     pdf.autoTable(pdfColumns, pdfData, options);

    //     const tableY = pdf.lastAutoTable.finalY;

    //     data.forEach((item, rowIndex) => {
    //         const imgData = item.aadhar;
    //         const tableY = pdf.lastAutoTable.finalY + 5 + rowIndex * 10;
    //         if(imgData) {
    //             const imgWidth = 10; // Adjust the width as needed
    //             const imgHeight = 10; // Adjust the height as needed
    //             // pdf.addImage(imgData, 'JPEG', 15, imgWidth, imgHeight);
    //             const imgX = 15;
    //             pdf.addImage(imgData, 'JPEG', imgX, tableY, imgWidth, imgHeight);
    //         }
    //     })
    
    //     pdf.save('table.pdf');
    // };

    const handlePageSizeChange = (value) => {
        setPageSize(value);
    };

    const filterData = () => {
        setSearchClicked(true);
    
        const searchData = document.getElementById('searchInput').value.toLowerCase();
    
        const filteredData = playerData.filter((item) =>
            Object.values(item).some((value) =>
                value?.toString().toLowerCase().includes(searchData)
            )
        );
    
        setFilteredData(filteredData);
    };

    const mainPlayerData = async () => {
        try {
            setLoading(true)
            const data = await getapproveWithdrawData();
            if(data) {
                setplayerData(data);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        mainPlayerData();
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
                                    <Breadcrumb
                                        items={[
                                            {
                                                title: <h3>Players</h3>,
                                            },
                                            {
                                                title: <a href="/">Home</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Player</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Report</a>,
                                            },
                                        ]}
                                    />
                                </Row>

                                <hr />
                                <p>Approved Transaction History </p>

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
                                        dataSource={searchClicked ? filteredData : playerData}  
                                        pagination={{
                                            showSizeChanger: true,
                                            pageSizeOptions: ['10', '20', '30'],
                                            defaultPageSize: 10,
                                            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                        }}
                                        expandable={{
                                            expandedRowRender: (record) => (
                                                <>
                                                    <p style={{ margin: 0 }}>Paytm Number {record.paytmNumber}</p>
                                                    <p style={{ margin: 0 }}>Notes {record.notes}</p>
                                                    {/* <p style={{ margin: 0 }}>Wallet Balance {record.totalLose}</p>
                                                    <p style={{ margin: 0 }}>Bonus Wallet {record.totalLose}</p>
                                                    <p style={{ margin: 0 }}>No. Load {record.totalLose}</p>
                                                    <p style={{ margin: 0 }}>No. Load {record.totalLose}</p>
                                                    <p style={{ margin: 0 }}>No. withdraw {record.totalLose}</p> */}
                                                    {/* Add more expanded row content as needed */}
                                                    Actions <Space size="middle">
                                                        {/* <EditOutlined
                                                            onClick={() => handleEdit(record)}
                                                            style={{ color: "#f4a805", cursor: "pointer" }}
                                                        />
                                                        <DeleteOutlined
                                                            onClick={() => handleDelete(record)}
                                                            style={{ color: "#f4a805", cursor: "pointer" }}
                                                        />
                                                        <MessageOutlined
                                                            onClick={() => handleNotification(record)}
                                                            style={{ color: "#f4a805", cursor: "pointer" }}
                                                        /> */}
                                                        <Button onClick={() => 
                                                            // handleUpdateStatus
                                                            (record._id, 'approve')}>Approve</Button>
                                                        <Button onClick={() => 
                                                            // handleUpdateStatus
                                                            (record._id, 'withdraw')}>Withdraw</Button>
                                                        <Button onClick={() => 
                                                            // handleUpdateStatus
                                                            (record._id, 'reject')}>Reject</Button>
                                                    </Space>
                                                </>
                                            ),
                                            rowExpandable: (record) => record.name !== "Not Expandable",
                                            expandedRowKeys: expandedRowKeys,
                                            onExpand: (_, record) => handleExpand(record),
                                        }}
                                        rowKey={(record) => record._id}  // Assign the player's ID as the key
                                    />
                                </Spin>
                            
                            </Col>
                        </Row>

                        {
                            showPlayerForm && (
                                <PlayerForm
                                    // id={id}
                                    showPlayerForm={true} 
                                    setShowPlayerForm={setShowPlayerForm} 
                                    // playerId={playerId}
                                    getPlayerData={mainPlayerData}
                                    onEdit={handleEdit}  
                                    editData={editData}
                                    notificationData={notificationData}
                                />
                            )
                        }
                    </Layout>
                </Layout>
            </Layout>
        </>
    );
}

export default ApproveTransaction;


