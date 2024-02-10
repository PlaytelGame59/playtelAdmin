// PlayerList page
import { Breadcrumb, Button, Col, Input, Layout, Modal, Row, Select, Space, Spin, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import PlayerForm from "../../components/PlayerForm";
import { CloseCircleOutlined, DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined } from "@ant-design/icons"
import { getPlayerData } from "../../api/Api";
import { banned_player_status, base_url, delete_player } from "../../api/Constants";

import { CSVLink, CSVDownload } from "react-csv";

import { CopyToClipboard } from 'react-copy-to-clipboard';

import jsPDF from 'jspdf';
import 'jspdf-autotable';


const PlayerList = () => {
    // const tableRef = useRef(null);
    const { Option } = Select;
    const navigate = useNavigate()
    const [playerData, setplayerData] = useState([])    
    const [editData, setEditData] = useState(null)
    const [showPlayerForm, setShowPlayerForm] = useState()
    const [notificationData, setNotificationData] = useState(null)
    const [playerId, setPlayerId] = useState()
    const [pageSize, setPageSize] = useState(5); 
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const [searchClicked, setSearchClicked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [buttonColor, setButtonColor] = useState(false)
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
            dataIndex: "first_name",
            key: "first_name",
        
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        
        },
        {
            title: "player Img",
            dataIndex: "player_image",
            key: "player_image",
            render: (text, record) => (
                <img src={text} alt={`player_image of ${record.name}`} style={{ maxWidth: '50px', maxHeight: '50px' }} />
            ),
        },  

        {
            title: "Mobile Number",
            dataIndex: "mobile",
            key: "mobile",
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
                        onClick={() => handleNotification(record)} 
                        style={{ color: '#f4a805', cursor: 'pointer' }}
                    />

                    <div
                        onClick={() => handleUpdateStatus(record._id, 'banned')}
                        style={{
                            backgroundColor: record.is_banned ? 'red' : '#f4a805',
                            color: 'white',
                            padding: '8px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                        }}
                    >
                        <CloseCircleOutlined />
                    </div>
                                    
                </Space>
            ),
        },
    ]

    console.log("buttonColor", buttonColor)

    // Inside Players List component
    const handleUpdateStatus = async (playerId, status) => {
        try {
            console.log('Updating player status:', playerId, status);
            
            // Convert status to boolean
            const is_banned = status === 'banned';
            
            // Send a request to update the player status
            const response = await axios.post(`${base_url}${banned_player_status}`, {
                playerId,
                is_banned,
            });
    
            console.log('Response from server:', response.data);
    
            if(response.data.is_banned !== undefined) {
                message.success('Player status updated successfully');
                setButtonColor((prevColor) => !prevColor);
                
                
            } else {
                // Log the error message from the server
                console.error('Failed to update player status:', response.data.error);
                message.error('Failed to update player status. Check the console for details.');
            }
        } catch (error) {
            console.error('Error updating player status:', error);
            message.error('An error occurred while updating player status');
        }
    };

    // // Inside Players List component
    // const handleUpdateStatus = async (playerId, status) => {
    //     try {
    //         console.log('Updating player status:', playerId, status);
    //         // Send a request to update the player status
    //         const response = await axios.post(`${base_url}${banned_player_status}`, {
    //             playerId,
    //             isBanned: status,
    //         });

    //         console.log('Response from server:', response.data);

    //         if (response.data.status === 'success') {
    //             message.success('Player status updated successfully');

    //             // Navigate to Banned Players page
    //             navigate('/banned-players');
    //         } else {
    //             message.error('Failed to update player status');
    //         }
    //     } catch (error) {
    //         console.error('Error updating player status:', error);
    //         console.error('Error updating player status:', error);
    //         message.error('An error occurred while updating player status');
    //     }
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
                    const response = await axios.post(`${base_url}${delete_player}`, {
                        playerId: record._id,
                    });
    
                    console.log('Response from backend:', response.data);
    
                    if(response.data.status === 'success') {
                        // message.success('Player data deleted successfully');
                        mainPlayerData(); // Refresh the players data after deletion
                        message.success('Player data deleted successfully');
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
            player_image: record.player_image,
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
        { label: "player_image", key: "player_image"},
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
    //         if (column.dataIndex === 'player_image') {
    //             return {
    //                 content: {
    //                     image: item.player_image, // Directly provide the image URL
    //                     width: 30, // Adjust the width as needed
    //                 },
    //             };
    //         } else if (typeof item[column.dataIndex] === 'object') {
    //             // Handle the case where the data is an object (e.g., 'player' field)
    //             return JSON.stringify(item[column.dataIndex]);
    //         } else {
    //             return item[column.dataIndex];
    //         }
    //     }));
        
    //     console.log("pdfData", pdfData)
    
    //     // Configure autoTable options
    //     const options = {
    //         startY: 10, // Adjust the starting Y position as needed
    //     };
    
    //     pdf.autoTable(pdfColumns, pdfData, options);
    
    //     // Save the PDF
    //     pdf.save('table.pdf');
    // };

    // console.log("downloadPdf", downloadPdf)

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
            // Check if the column is 'player_image'
            if (column.dataIndex === 'player_image') {
                return {
                    content: '',
                    image: item.player_image, // Directly provide the image URL
                    width: 30, // Adjust the width as needed
                };
            } else {
                return item[column.dataIndex];
            }
        }));
    
        // Configure autoTable options
        const options = {
            startY: 10, // Adjust the starting Y position as needed
        };
    
        // Flatten the pdfData array to a 2D array
        const flattenedPdfData = pdfData.map(row => row.map(cell => (cell && cell.content) || cell));
    
        pdf.autoTable(pdfColumns, flattenedPdfData, options);
    
        // Save the PDF   
        pdf.save('table.pdf');
    };    
    
    console.log("downloadPdf", downloadPdf)
    
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
    
    //     // Save the PDF
    //     pdf.save('table.pdf');
    // };

    // console.log("downloadPdf", downloadPdf)

    
    const handlePageSizeChange = (value) => {
        console.log('Selected PageSize:', value);
        setPageSize(value);
        setCurrentPage(1); // Reset currentPage when pageSize changes
        setSearchClicked(false);
    };

    console.log("pageSize", pageSize)

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
            // Set loading to true when starting to fetch data
            setLoading(true); 
            console.log('Fetching data with pageSize:', pageSize);
            const data = await getPlayerData(currentPage, pageSize);
            console.log('Data received:', data);
            if(data) {
                setplayerData(data);
                setSearchClicked(false);
            }
        } catch (error) {
            console.error(error);
        } finally {
            // Set loading to false when data fetching is complete
            setLoading(false); 
        }
    }

    useEffect(() => {
        mainPlayerData();
    }, [currentPage, pageSize, buttonColor])

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
                                            // {
                                            //     title: <h3>Players</h3>,
                                            // },
                                            {
                                                title: <a href="/">Home</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Player</a>,
                                            },
                                            {
                                                title: <a>List</a>,
                                            },
                                        ]}
                                    />
                                </Row>

                                <hr />
                                <p>Players List</p>

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
                                    {/* Table and other components */}
                                    <Table
                                        columns={columns}
                                        dataSource={searchClicked ? filteredData : playerData}
                                        pagination={{
                                            showSizeChanger: true,
                                            // pageSizeOptions: ["5", "10", "15"],
                                            defaultPageSize: 5,
                                            pageSize: pageSize,
                                            showTotal: (total, range) =>
                                                `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                                current: currentPage,
                                        }}
                                        onChange={handleTableChange} // Handle page changes
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
                                    // getPlayerData={fetchPlayerData}
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

export default PlayerList;






