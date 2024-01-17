import { Breadcrumb, Button, Col, Input, Modal, Row, Select, Space, Spin, Table, message } from "antd";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import PlayerForm from "../../components/PlayerForm";
import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, MessageOutlined } from "@ant-design/icons"
// import { getPlayerData } from "../../api/Api";

import { CSVLink, CSVDownload } from "react-csv";

import { CopyToClipboard } from 'react-copy-to-clipboard';

import jsPDF from 'jspdf';
import 'jspdf-autotable';

// implementing redux
import { useDispatch, useSelector } from 'react-redux';
import { deletePlayerDataRequest, fetchPlayerDataRequest } from '../../redux/ActionsCreators/actionCreators';  // ../../redux/ActionCreators/actionCreators
import { setIsLoading } from "../../redux/ActionsCreators/dashboardActions";
import { FETCH_PLAYER_DATA_REQUEST } from "../../redux/ActionTypes/actionTypes";


const PlayerListPage = () => {
    // const tableRef = useRef(null);
    const { Option } = Select;
    const navigate = useNavigate()
    // const [playerData, setplayerData] = useState([])    
    const [editData, setEditData] = useState(null)
    const [showPlayerForm, setShowPlayerForm] = useState()
    const [notificationData, setNotificationData] = useState(null)
    const [playerId, setPlayerId] = useState()
    const [pageSize, setPageSize] = useState(10); 
    const [filteredData, setFilteredData] = useState([]);
    const [searchClicked, setSearchClicked] = useState(false);
    // const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    const playerData = useSelector((state) => state.player.playerData);
    const loading = useSelector((state) => state.player.loading);
    const error = useSelector((state) => state.player.error);

    const columns = [
        {
            title: "S.No",
            dataIndex: "sNo",
            key: "sno",
            render: (text, record, index) => index + 1,
            // render: (text, record, index) => ((currentPage - 1) * pageSize) + index + 1,
            // ...getColumnSearchProps("sno")
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
            // ...getColumnSearchProps("name")
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            // ...getColumnSearchProps("email")
        },
        {
            title: "player_image",
            dataIndex: "player_image",
            key: "player_image",
            render: (text, record) => (
                <img src={text} alt={`player_image of ${record.name}`} style={{ maxWidth: '50px', maxHeight: '50px' }} />
            ),
        },  
        {
            title: "Mobile Number",
            dataIndex: "mobileNo",
            key: "mobileNo",
            // ...getColumnSearchProps("mobileNo")
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
                
                </Space>
            ),
        },
    ]

    const handleEdit = (record) => {
        setEditData(record);
        setShowPlayerForm(true);
    };

    const handleNotification = (record) => {
        // convertBase64UrlInplayer_imageImg(record.player_image);
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
                // dispatch(deletePlayerDataRequest(playerId));
                // try {
                //     // const response = await axios.post('http://localhost:2000/player/delete-players-data', {
                //     //     playerId: record._id,
                //     // });
    
                //     // console.log('Response from backend:', response.data);
    
                //     // if (response.data.status === 'success') {
                //     //     // message.success('Player data deleted successfully');
                //     //     // // mainPlayerData(); // Refresh the players data after deletion

                //     //     // implementing redux
                //     //     // Dispatch the setPlayerData and setLoading actions with the updated data and false
                //     //     // dispatch(setPlayerData(response.data.updatedData));
                //     //     // dispatch(setLoading(false));
                //     //     message.success('Player data deleted successfully');
                //     // } else {
                //     //     // dispatch(setLoading(false));
                    
                //     //     message.error('Failed to delete player data');
                //     // }
                // } catch (error) {
                //     console.error(error);
                //     // dispatch(setLoading(false));

                //     message.error('An error occurred while deleting the player data');
                // }
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
            if(column.dataIndex === 'player_image') {
                return {
                    content: {
                        image: item.player_image, // Assuming 'player_image' contains the base64-encoded image
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
    //         if(column.dataIndex === 'player_image') {
    //             return {
    //                 content: {
    //                     content: '',
    //                     image: item.player_image, // Assuming 'player_image' contains the base64-encoded image
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
    //         const imgData = item.player_image;
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

    // const mainPlayerData = async () => {
    //     try {
    //         // Set loading to true when starting to fetch data
    //         setLoading(true); 
    //         const data = await getPlayerData();
    //         if(data) {
    //             setplayerData(data);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         // Set loading to false when data fetching is complete
    //         setLoading(false); 
    //     }
    // }

    // useEffect(() => {
    //     mainPlayerData();
    // }, [])

    // console.log("playerData", playerData)
    
    // useEffect(() => {
    //     console.log('Dispatching fetchPlayerDataRequest action...');
    //     dispatch(FETCH_PLAYER_DATA_REQUEST());
    // }, [dispatch]);
    
    // console.log('Player data from Redux:', playerData);

    useEffect(() => {
        dispatch(setIsLoading())
    }, [])

    return ( 
        <>
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
                                    title: <h3>Players</h3>,
                                },
                                {
                                    title: <a href="/">Home</a>,
                                },
                                {
                                    title: <a href="/players/list">Player</a>,
                                },
                                {
                                    title: <a href="/players/list">List</a>,
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
                        {/* Table and other components */}
                        <Table
                            columns={columns}
                            dataSource={searchClicked ? filteredData : playerData}
                            pagination={{
                                showSizeChanger: true,
                                pageSizeOptions: ["10", "20", "30"],
                                defaultPageSize: 10,
                                showTotal: (total, range) =>
                                    `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                            }}
                        />

                        {/* {playerData && playerData.length > 0 ? (
                            <Table
                                columns={columns}
                                dataSource={searchClicked ? filteredData : playerData}
                                pagination={{
                                    showSizeChanger: true,
                                    pageSizeOptions: ["10", "20", "30"],
                                    defaultPageSize: 10,
                                    showTotal: (total, range) =>
                                        `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                }}
                            />
                        ) : (
                            <p>No player data available.</p>
                        )} */}

                        {/* // implementing table data in redux */}
                        {/* {Array.isArray(playerData) && playerData.length > 0 ? (
                            <Table
                                columns={columns}
                                dataSource={searchClicked ? filteredData : playerData}
                                pagination={{
                                    showSizeChanger: true,
                                    pageSizeOptions: ["10", "20", "30"],
                                    defaultPageSize: 10,
                                    showTotal: (total, range) =>
                                        `Showing ${range[0]} to ${range[1]} of ${total} entries`,
                                }}
                            />
                        ) : (
                            <p>No player data available.</p>
                        )} */}

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
                        // getPlayerData={mainPlayerData}
                        getPlayerData={playerData}
                        onEdit={handleEdit}  
                        editData={editData}
                        notificationData={notificationData}
                    />
                )
            }

        </>
    );
}

export default PlayerListPage;




