import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { Breadcrumb, Col, Input, Layout, Modal, Row, Select, Space, Spin, Table, message } from "antd"
import { responsiveArray } from "antd/es/_util/responsiveObserver"
import axios from "axios"
import React, { useEffect, useState } from "react"
import Header from "../../components/Header"
import { useNavigate } from "react-router-dom"
import Sidebar from "../../components/Sidebar"
import TournmentForm from "../../components/TournmentForm"
import { getTournamentData } from "../../api/Api"
import { base_url, delete_tournament } from "../../api/Constants"

const TournamentList = () => {
    const { Option } = Select;
    const navigate = useNavigate()
    const [tournamentData, settournamentData] = useState([])  
    const [editData, setEditData] = useState(null)
    const [showTournmentForm, setShowTournmentForm] = useState()
    const [loading, setLoading] = useState(false)
    const [pageSize, setPageSize] = useState(5); 
    const [currentPage, setCurrentPage] = useState(1);
    const [filteredData, setFilteredData] = useState([]);
    const [searchClicked, setSearchClicked] = useState(false);

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
            title: "Tournament Name",
            dataIndex: "tournament_name",
            key: "tournament_name" ,
        },
        {
            title: "Bet Amount",
            dataIndex: "bet_amount",
            key: "bet_amount",
        },
        {
            title: "No Players",
            dataIndex: "no_players",
            key: "no_players",
        },
        {
            title: "Tournaments Interval",
            dataIndex: "tournament_interval",
            key: "tournament_interval",
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
                </Space>
            ),
        },
    ]
    
    // console.log("tournamentData", tournamentData)

    const handleEdit = (record) => {
        setEditData(record);
        setShowTournmentForm(true);
    };

    const handleDelete = (record) => {
    // console.log('Delete:', record);
        Modal.confirm({
            title: 'Confirm Deletion',
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to delete Tournaments data ${record.tournamentName} ${record.noPlayers} ?`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    // const token = localStorage.getItem('token');
                    // const response = await axios.post(`http://localhost:2000/admin/delete-tournaments-data`, {
                    const response = await axios.post(`${base_url}${delete_tournament}`, {
                        tournamentId: record._id,
                    });
                    console.log('Response from backend:', response.data);
                    if(response.data.status === "success") {
                        message.success('tournaments data deleted successfully');
                        mainTournamentData(); // Refresh the tournaments data after deletion
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

    const filterData = () => {
        setSearchClicked(true);
    
        const searchData = document.getElementById('searchInput').value.toLowerCase();
    
        const filteredData = tournamentData.filter((item) =>
            Object.values(item).some((value) =>
                value?.toString().toLowerCase().includes(searchData)
            )
        );
    
        setFilteredData(filteredData);
    };

    const handlePageSizeChange = (value) => {
        console.log('Selected PageSize:', value);
        setPageSize(value);
        setCurrentPage(1); // Reset currentPage when pageSize changes
        setSearchClicked(false);
    };

    const mainTournamentData = async () => {
        try {
            setLoading(true)
            const data = await getTournamentData(currentPage, pageSize);
            console.log("Tournament Data:", data);
            if(data) {
                settournamentData(data);
                setSearchClicked(false);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        mainTournamentData();
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
                                                title: <h3>Tournament</h3>,
                                            },
                                            {
                                                title: <a href="/">Home</a>,
                                            },
                                            {
                                                title: <a href="/touranaments/list">Tournament</a>,
                                            },
                                            {
                                                title: <a href="/touranaments/list">List</a>,
                                            },
                                        ]}
                                    />
                                </Row>
                                <hr />
                                {/* show and search row  */}
                                <p>Tournaments List</p>
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

                                <hr />
                                <Spin spinning={loading} size="large">
                                    <Table 
                                        columns={columns} 
                                        dataSource={searchClicked ? filteredData : tournamentData}
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

                        {
                            showTournmentForm && (
                                <TournmentForm 
                                    // id={id}
                                    showTournamentForm={true} 
                                    setShowTournmentForm={setShowTournmentForm} 
                                    // userId={userId}
                                    getTournamentData={mainTournamentData}
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

export default TournamentList
