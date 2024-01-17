import { Breadcrumb, Button, Col, Input, Layout, Modal, Row, Select, Spin, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";


import { CSVLink, CSVDownload } from "react-csv";

import { CopyToClipboard } from 'react-copy-to-clipboard';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { getactivePlayerData } from "../../api/Api";

const ActivePlayer = () => {
    const { Option } = Select;
    const [activePlayerData,  setactivePlayerData] = useState([])
    
    const [pageSize, setPageSize] = useState(5); 
    const [filteredData, setFilteredData] = useState([]);
    const [searchClicked, setSearchClicked] = useState(false);
    const [loading, setLoading] = useState(false)
    const [currentPage, setCurrentPage] = useState(1);

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
        },
        {
            title: "Player ID",
            dataIndex: "_id",
            key: "playerId" ,
            render: (text) => text.toUpperCase(),
            // render: (text, record, index) => `pt${((currentPage - 1) * pageSize) + index + 1}`,
        },
        {
            title: "Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Mobile Number",
            dataIndex: "mobileNo",
            key: "mobileNo",
        },
    ]

    const copyWithClipboard = () => {
        const tableData = activePlayerData.map((record) => ({
            SNo: record.sNo,
            'Play ID': record.playId,
            Name: record.name,
            Email: record.email,
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

    const handleExcel = activePlayerData.map((item, index) => ({
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
        const data = activePlayerData.map((item, index) => ({
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
    
        const filteredData = activePlayerData.filter((item) =>
            Object.values(item).some((value) =>
                value?.toString().toLowerCase().includes(searchData)
            )
        );
    
        setFilteredData(filteredData);
    };

    const mainActivePlayerData = async () => {
        try {
            setLoading(true)
            const data = await getactivePlayerData(currentPage, pageSize);
            if(data) {
                setactivePlayerData(data);
                setSearchClicked(false);
            }
        } catch (error) {
            console.log(error)
        } finally {
            // Set loading to false when data fetching is complete
            setLoading(false); 
        }
    }

    useEffect(() => {
        mainActivePlayerData()
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
                                                title: <a href="/player/active">Active </a>,
                                            },
                                            {
                                                title: <a href="/player/active">Players</a>,
                                            },
                                        ]}
                                    />
                                </Row>
                                <hr />

                                <p>Active Players</p>
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
                                        // dataSource={searchClicked ? filteredData : playerLeadboardData}
                                        dataSource={searchClicked ? filteredData : activePlayerData}
                                        pagination={{
                                            showSizeChanger: true,
                                            // pageSizeOptions: ["10", "20", "30"],
                                            defaultPageSize: 5,
                                            pageSize: pageSize,
                                            showTotal: (total, range) =>
                                                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                                current: currentPage,
                                        }}
                                        onChange={handleTableChange} // Handle page changes
                                    />
                                </Spin>
                                {/* <Table columns={columns} dataSource={activePlayerData} /> */}
                                {/* <Table columns={columns} dataSource={searchClicked ? filteredData : activePlayerData}  /> */}

                            </Col>
                        </Row>
                    </Layout>
                </Layout>
            </Layout>
        </>
    );
}

export default ActivePlayer;