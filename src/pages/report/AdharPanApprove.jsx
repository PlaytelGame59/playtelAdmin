import { Breadcrumb, Button, Col, Input, Layout, Modal, Row, Select, Space, Spin, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import PlayerForm from "../../components/PlayerForm";
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined } from "@ant-design/icons"
import { getAdharKYCRequest, getAdharPanKYCRequest, getKYCRequestData, getPlayerData, getPlayerdetailReport } from "../../api/Api";

import { CSVLink, CSVDownload } from "react-csv";

import { CopyToClipboard } from 'react-copy-to-clipboard';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PlayerReportForm from "../../components/PlayerReportForm";
import { Image_url, base_url, delete_player } from "../../api/Constants";

const AdharPanApprove = () => {
    // const tableRef = useRef(null);
    const { Option } = Select;
    const navigate = useNavigate()
    const [kycData, setkycData] = useState([])    
    const [editData, setEditData] = useState(null)
    const [showPlayerForm, setShowPlayerForm] = useState()
    const [notificationData, setNotificationData] = useState(null)
    const [playerId, setPlayerId] = useState()
    const [pageSize, setPageSize] = useState(5); 
    const [currentPage, setCurrentPage] = useState(1);
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
        },
        {
            title: "Name",
            dataIndex: "player_id.first_name",
            key: "player_id.first_name",
            render: (_, record) => {
                if (record.adharKYCData && record.adharKYCData.player_id) {
                    return record.adharKYCData.player_id.first_name;
                }
                return "";
            },
        },
        {
            title: "Aadhar FPhoto",
            dataIndex: "aadhar_front_image",
            key: "aadhar_front_image",
            render: (text, record) => (
                <img src={text} alt={`aadhar_front_image of ${record.first_name}`} style={{ maxWidth: '50px', maxHeight: '50px' }} />
            ),
        }, 
        {
            title: "Aadhar FPhoto",
            dataIndex: "aadhar_back_image",
            key: "aadhar_back_image",
            render: (text, record) => (
                <img src={text} alt={`aadhar_back_image of ${record.first_name}`} style={{ maxWidth: '50px', maxHeight: '50px' }} />
            ),
        },
        {
            title: "Aadhar No",
            dataIndex: "aadhar_no",
            key: "aadhar_no",  
        },
        {
            title: "Pan Photo",
            dataIndex: "player_id.pan_image",
            key: "player_id.pan_image",
            render: (text, record) => (
                <img src={Image_url + text} alt={`player_id.pan_image of ${record.first_name}`} style={{ maxWidth: '50px', maxHeight: '50px' }} />
            ),
        },
        {
            title: "Pan No",
            dataIndex: "player_id.pan_no", 
            key: "player_id.pan_no",
            render: (_, record) => record.player_id && record.player_id.pan_no,
        },
        {
            title: 'Aadhar Approval',
            key: 'aadharApproval',
            render: (_, record) => (
                record.aadharApproval ? <CheckOutlined /> : <CloseOutlined />
            ),
        },
        {
            title: 'Pan Approval',
            key: 'panApproval',
            render: (_, record) => (
                record.panApproval ? <CheckOutlined /> : <CloseOutlined />
            ),
        },
    ]

    const copyWithClipboard = () => {
        const tableData = kycData.map((record) => ({
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

    const handleExcel = kycData.map((item, index) => ({
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

    const downloadPdf = () => {
        const pdf = new jsPDF();
        // Add serial numbers to each row in the data
        const data = kycData.map((item, index) => ({
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
        console.log('Selected PageSize:', value);
        setPageSize(value);
        setCurrentPage(1); // Reset currentPage when pageSize changes
        setSearchClicked(false);
    };

    const filterData = () => {
        setSearchClicked(true);
    
        const searchData = document.getElementById('searchInput').value.toLowerCase();
    
        const filteredData = kycData.filter((item) =>
            Object.values(item).some((value) =>
                value?.toString().toLowerCase().includes(searchData)
            )
        );
    
        setFilteredData(filteredData);
    };

    const mainKycData = async () => {
        try {
            setLoading(true)
            const data = await getKYCRequestData(currentPage, pageSize);
            console.log("kycData", data)
            // if(data) {
            //     setkycData(data);
            //     setSearchClicked(false);
            // }
            if(Array.isArray(data)) {
                setkycData(data);
                setSearchClicked(false);
            } else {
                console.error('Invalid data format from API:', data);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        mainKycData();
    }, [currentPage, pageSize])

    const handleTableChange = (pagination) => {
        setCurrentPage(pagination.current);
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
                                                title: <h3>Players</h3>,
                                            },
                                            {
                                                title: <a href="/">Home</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Aadhar & Pan Approve</a>,
                                            },
                                        ]}
                                    />
                                </Row>

                                <hr />
                                <p>Aadhar & Pan Approve Report </p>

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

                                <Spin spinning={loading} size="large">
                                    <Table 
                                        columns={columns} 
                                        dataSource={searchClicked ? filteredData : kycData}  
                                        pagination={{
                                            showSizeChanger: true,
                                            // pageSizeOptions: ['10', '20', '30'],
                                            defaultPageSize: 5,
                                            pageSize: pageSize,
                                            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                            current: currentPage,
                                        }}
                                        // expandable={{
                                        //     expandedRowRender: (record) => (
                                        //         <>
                                        //             <p style={{ margin: 0 }}>Total Lose:  {record.player_id.no_of_loose}</p>
                                        //             <p style={{ margin: 0 }}>Loaded Amount: {record.loadedAmount}</p>
                                        //             <p style={{ margin: 0 }}>Withdraw Amount: {record.amt_withdraw}</p>
                                        //             <p style={{ margin: 0 }}>Wallet Balance: {record.player_id.wallet_amount}</p>
                                        //             <p style={{ margin: 0 }}>Bonus Wallet: {record.bonus_amount}</p>
                                        //             <p style={{ margin: 0 }}>No. Load: {record.noLoad}</p>
                                        //             <p style={{ margin: 0 }}>No. withdraw: {record.noWithdraw}</p>
                                        //             {/* Add more expanded row content as needed */}
                                        //             Actions <Space size="middle">
                                        //                         <EditOutlined
                                        //                             onClick={() => handleEdit(record)}
                                        //                             style={{ color: "#f4a805", cursor: "pointer" }}
                                        //                         />
                                        //                         <DeleteOutlined
                                        //                             onClick={() => handleDelete(record)}
                                        //                             style={{ color: "#f4a805", cursor: "pointer" }}
                                        //                         />
                                        //                         <MessageOutlined
                                        //                             onClick={() => handleNotification(record)}
                                        //                             style={{ color: "#f4a805", cursor: "pointer" }}
                                        //                         />
                                        //                         <Button>Aadhar approve</Button>
                                        //                         <Button>pan approve</Button>
                                        //                     </Space>
                                        //         </>
                                        //     ),
                                        //     rowExpandable: (record) => record.name !== "Not Expandable",
                                        //     expandedRowKeys: expandedRowKeys,
                                        //     onExpand: (_, record) => handleExpand(record),
                                        // }}
                                        // rowKey={(record) => record._id}  // Assign the player's ID as the key
                                        // onChange={handleTableChange} 
                                    />
                                </Spin>
                            
                            </Col>
                        </Row>

                        {/* {
                            showPlayerForm && (
                                <PlayerReportForm
                                    // id={id}
                                    showPlayerForm={true} 
                                    setShowPlayerForm={setShowPlayerForm} 
                                    // playerId={playerId}
                                    getkycData={mainkycData}
                                    onEdit={handleEdit}  
                                    editData={editData}
                                    notificationData={notificationData}
                                />
                            )
                        } */}
                    </Layout>
                </Layout>
            </Layout>
        </>
    );
}

export default AdharPanApprove;

