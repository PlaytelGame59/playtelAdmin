import { Breadcrumb, Button, Col, Input, Layout, Modal, Row, Select, Space, Spin, Table, message } from "antd";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined, PlusOutlined } from "@ant-design/icons"
import React, { useEffect, useState } from "react"
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import axios from "axios";
import moment from 'moment';

import { getAllTransactionData } from "../../api/Api";

import { CSVLink, CSVDownload } from "react-csv";

import { CopyToClipboard } from 'react-copy-to-clipboard';

import jsPDF from 'jspdf';
import 'jspdf-autotable';


const AllTransaction = () => {
    const { Option } = Select;
    const [allTransactionData, setallTransactionData] = useState([])  
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
            // render: (text, record, index) => index + 1,
            render: (text, record, index) => ((currentPage - 1) * pageSize) + index + 1,
            // ...getColumnSearchProps("sno")
        },
        {
            title: "Player ID",
            dataIndex: "_id",
            key: "_id" ,
            // ...getColumnSearchProps("playerId")
        },
        {
            title: "Amount",
            dataIndex: "amount",
            key: "amount",
            // ...getColumnSearchProps("amount")
        },
        {
            title: 'Txn Date/Time',
            dataIndex: 'txndateTime',
            key: 'txndateTime',
            render: (text, record) => {
              console.log('Raw txnDateTime:', record.txndateTime);
              const formattedDate = moment(record.txndateTime).format('YYYY-MM-DD HH:mm:ss');
              console.log('Formatted Date:', formattedDate);
              return <span>{formattedDate}</span>;
            },
          },
        // {
        //     title: 'Txn Date/Time',
        //     dataIndex: 'txndateTime',
        //     key: 'txndateTime',
        //     render: (text, record) => (
        //       <span>{moment(record.txndateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
        //     ),
        // },
        // {
        //     title: 'Txn Date/Time',
        //     dataIndex: 'createdAt',
        //     key: 'createdAt',
        //     render: (text, record) => (
        //       <span>{moment(record.createdAt).format('YYYY-MM-DD HH:mm:ss')}</span>
        //     ),
        // },
        {
            title: "Type",
            dataIndex: "type",
            key: "type",
            // ...getColumnSearchProps("type")
        },
        {
            title: "Txn By",
            dataIndex: "txnBy",
            key: "txnBy",
            // ...getColumnSearchProps("txnBy")
        },
        // {
        //     title: "Notes",
        //     dataIndex: "notes",
        //     key: "notes",
        //     // ...getColumnSearchProps("notes")
        // },
        // {
        //     title: "Wallet Type",
        //     dataIndex: "walletType",
        //     key: "walletType",
        //     // ...getColumnSearchProps("walletType")
        // },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">

                    <PlusOutlined 
                        onClick={() => handleReadData(record)} 
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

    const handleReadData = (record) => {
        // console.log('read:', record);
        Modal.confirm({
            title: 'Confirm To Read ?',
            icon: <ExclamationCircleOutlined />,
            content: `Notes ${record.notes} Wallet Type ${record.walletType}`,
            okText: 'Yes',
            okType: 'danger',
        });
    };

    const copyWithClipboard = () => {
        const tableData = allTransactionData.map((record) => ({
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

    const handleExcel = allTransactionData.map((item, index) => ({
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
        const data = allTransactionData.map((item, index) => ({
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
    
        const filteredData = allTransactionData.filter((item) =>
            Object.values(item).some((value) =>
                value?.toString().toLowerCase().includes(searchData)
            )
        );
        
        setFilteredData(filteredData);
    };

    const maingetAllTransactionData = async () => {
        try {
            setLoading(true)
            const data = await getAllTransactionData(currentPage, pageSize);
            console.log("data", data)
            if(data) {
                console.log(data)
                setallTransactionData(data);
                setSearchClicked(false);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        maingetAllTransactionData()
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
                                    <Col>
                                        <Breadcrumb
                                            items={[
                                                {
                                                    title: <a href="/">Home</a>,
                                                },
                                                {
                                                    title: <a href="/players/list">Report</a>,
                                                },
                                                {
                                                    title: <a href="/players/list">All Transaction History</a>,
                                                },
                                            ]}
                                        />
                                    </Col>
                                    
                                </Row>
                                <hr />

                                <p>All Transaction History</p>

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
                                        dataSource={searchClicked ? filteredData : allTransactionData} 
                                        pagination={{
                                            showSizeChanger: true,
                                            // pageSizeOptions: ['10', '20', '30'],
                                            defaultPageSize: 5,
                                            pageSize: pageSize,
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

export default AllTransaction