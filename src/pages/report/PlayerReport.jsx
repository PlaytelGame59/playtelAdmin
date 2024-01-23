import { Breadcrumb, Button, Col, Input, Layout, Modal, Row, Select, Space, Spin, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import PlayerForm from "../../components/PlayerForm";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined } from "@ant-design/icons"
import { getPlayerData, getPlayerdetailReport } from "../../api/Api";

import { CSVLink, CSVDownload } from "react-csv";

import { CopyToClipboard } from 'react-copy-to-clipboard';

import jsPDF from 'jspdf';
import 'jspdf-autotable';
import PlayerReportForm from "../../components/PlayerReportForm";
import { base_url, delete_player } from "../../api/Constants";

const PlayerReport = () => {
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
            render: (_, record) => record.player_id && record.player_id.first_name,
        },
        {     // no_of_loose bonus_ammount
            title: "Refer Code",
            dataIndex: "referCode",
            key: "referCode" ,
        },
        {
            title: "Participate",
            dataIndex: "players_count",
            key: "players_count",  
        },
        {
            title: "Join Code",
            dataIndex: "player_id.join_code", 
            key: "player_id.join_code",
            render: (_, record) => record.player_id && record.player_id.join_code,
        },
        // {
        //     title: "2 Wins",
        //     dataIndex: "tournament_id.winnerCount",
        //     key: "tournament_id.winnerCount",
        //     render: (_, record) => {
        //         const winnerCount = record.tournament_id && record.tournament_id.winnerCount;
        //         return winnerCount === 1 ? "2 Wins" : null; // Render "2 Wins" only when winnerCount is 1
        //     },
        //     // render: (_, record) => record.tournament_id && record.tournament_id.winnerCount,
        // },
        {
            title: "2 Wins",
            dataIndex: "tournament_id.winnerCount",
            key: "tournament_id.winnerCount",
            // render: (_, record) => {
            //     const winnerCount = record.tournament_id && record.tournament_id.winnerCount;
            //     console.log("Winner Count:", winnerCount);
            //     return winnerCount === 1 ? "2 Wins" : null;
            // },
            render: (_, record) => record.tournament_id && record.tournament_id.winnerCount,
        },
        
        {
            title: "4 Wins",
            dataIndex: "tournament_id.winnerCount",
            key: "tournament_id.winnerCount",
            // render: (_, record) => {
            //     const winnerCount = record.tournament_id && record.tournament_id.winnerCount;
            //     return winnerCount === 3 ? "4 Wins" : null; // Render "4 Wins" only when winnerCount is 3
            // },
            render: (_, record) => record.tournament_id && record.tournament_id.winnerCount,
        },
        {
            title: "Total Win",
            dataIndex: "player_id.no_of_total_win",  // player_id.no_of_total_win
            key: "player_id.no_of_total_win",
            render: (_, record) => record.player_id && record.player_id.no_of_total_win,
        },
        // {
        //     title: "Aadhar",
        //     dataIndex: "aadhar",
        //     key: "aadhar",
        //     render: (text, record) => (
        //         <img src={text} alt={`Aadhar of ${record.name}`} style={{ maxWidth: '50px', maxHeight: '50px' }} />
        //     ),
        // },  
        // {
        //     title: "Mobile Number",
        //     dataIndex: "mobileNo",
        //     key: "mobileNo",
        //     // ...getColumnSearchProps("mobileNo")
        // },
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
        //                 onClick={() => handleNotification(record)} 
        //                 style={{ color: '#f4a805', cursor: 'pointer' }}
        //             />
                
        //         </Space>
        //     ),
        // },
    ]

    // const handleExpand = (record) => {
    //     // Only allow expanding the first row
    //     if (!expandedRowKeys.length) {
    //       setExpandedRowKeys([record.key]);
    //     } else {
    //       setExpandedRowKeys([]);
    //     }
    //   };

    const handleExpand = async (record) => {
        // Only allow expanding one row at a time
        setExpandedRowKeys((prevKeys) => {
            if (prevKeys.includes(record._id)) {
                return [];
            } else {
                return [record._id];
            }
        });
        await getPlayerdetailReport(record.playerId, record.tournamentId);
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
                    // const response = await axios.post('http://localhost:2000/player/delete-players-data', {
                    // const response = await axios.post(`${base_url}${delete_player}`, {   
                    const response = await axios.post(`${base_url}${delete_player}`                                                                                                                                                                                                                                                                                                                                       , {
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
    
        // Configure autoTable options
        const options = {
            startY: 10, // Adjust the starting Y position as needed
        };
    
        data.forEach((item, rowIndex) => {
            // Add a page break before each row (except the first one)
            if (rowIndex > 0) {
                pdf.addPage();
            }
    
            // Add row data to the PDF
            pdf.autoTable(pdfColumns, [columns.map(column => item[column.dataIndex])], options);
    
            // Add expanded content below the row
            const expandedContent = [
                [`Total Lose: ${item.totalLose}`],
                [`Loaded Amount: ${item.loadedAmount}`],
                [`Withdraw Amount: ${item.withdrawAmount}`],
                [`Wallet Balance: ${item.walletBalance}`],
                [`Bonus Wallet: ${item.bonusWallet}`],
                [`No. Load: ${item.noLoad}`],
                [`No. withdraw: ${item.noWithdraw}`],
                // Add more expanded row content as needed
            ];
    
            const startY = pdf.lastAutoTable.finalY + 5;
            const startX = 10;
    
            pdf.text('Expanded Content:', startX, startY);
    
            expandedContent.forEach((content, index) => {
                pdf.text(content, startX, startY + (index + 1) * 10);
            });
        });
    
        // Save the PDF
        pdf.save('table.pdf');
    };

    const handlePageSizeChange = (value) => {
        console.log('Selected PageSize:', value);
        setPageSize(value);
        setCurrentPage(1); // Reset currentPage when pageSize changes
        setSearchClicked(false);
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
            const data = await getPlayerdetailReport(currentPage, pageSize);
            console.log("playerData", data)
            if(data) {
                setplayerData(data);
                setSearchClicked(false);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        mainPlayerData();
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
                                                title: <a href="/players/list">Player</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Report</a>,
                                            },
                                        ]}
                                    />
                                </Row>

                                <hr />
                                <p>Player Report </p>

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
                                        dataSource={searchClicked ? filteredData : playerData}  
                                        pagination={{
                                            showSizeChanger: true,
                                            // pageSizeOptions: ['10', '20', '30'],
                                            defaultPageSize: 5,
                                            pageSize: pageSize,
                                            showTotal: (total, range) => `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                            current: currentPage,
                                        }}
                                        expandable={{
                                            expandedRowRender: (record) => (
                                                <>
                                                    <p style={{ margin: 0 }}>Total Lose:  {record.player_id.no_of_loose}</p>
                                                    <p style={{ margin: 0 }}>Loaded Amount: {record.loadedAmount}</p>
                                                    <p style={{ margin: 0 }}>Withdraw Amount: {record.amt_withdraw}</p>
                                                    <p style={{ margin: 0 }}>Wallet Balance: {record.player_id.wallet_amount}</p>
                                                    <p style={{ margin: 0 }}>Bonus Wallet: {record.bonus_amount}</p>
                                                    <p style={{ margin: 0 }}>No. Load: {record.noLoad}</p>
                                                    <p style={{ margin: 0 }}>No. withdraw: {record.noWithdraw}</p>
                                                    {/* Add more expanded row content as needed */}
                                                    Actions <Space size="middle">
                                                                <EditOutlined
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
                                                                />
                                                                {/* <Button>Aadhar approve</Button>
                                                                <Button>pan approve</Button> */}
                                                            </Space>
                                                </>
                                            ),
                                            rowExpandable: (record) => record.name !== "Not Expandable",
                                            expandedRowKeys: expandedRowKeys,
                                            onExpand: (_, record) => handleExpand(record),
                                        }}
                                        rowKey={(record) => record._id}  // Assign the player's ID as the key
                                        onChange={handleTableChange} 
                                    />
                                </Spin>
                            
                            </Col>
                        </Row>

                        {
                            showPlayerForm && (
                                <PlayerReportForm
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

export default PlayerReport;

