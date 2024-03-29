import React, { useEffect, useState } from "react"
import { Row, Col, Card, Image, Layout, Menu, Breadcrumb, Table} from 'antd'
import Header from "../components/Header"
import { useNavigate } from "react-router-dom"
import { MehOutlined, MailOutlined, DollarOutlined, FolderViewOutlined, LogoutOutlined } from "@ant-design/icons"
import Sidebar from "../components/Sidebar"
import axios from "axios"
import { getPlayerData, getWithdrawListData } from "../api/Api"
import { base_url, get_player, get_transaction, get_withdrawList } from "../api/Constants"

const { Sider, Content } = Layout;

const Dashboard = () => {

    const navigate = useNavigate()   
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [loading, setLoading] = useState(false);
    const [recentPlayers, setRecentPlayers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(5)
    // const [currentPageSize, setCurrentPageSize] = useState(10);
    const [withdrawListData, setWithdrawListData] = useState([])  
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("token") !== null
    );
    const [playerData, setplayerData] = useState({
        logo: '',  
        text: 'Total Players',
        number: 0,
    });
    const [transactionData, settransactionData] = useState({
        logo: '',  
        text: 'Income',
        number: 0,
    });

    const [withdrawData, setwithdrawData] = useState({
        logo: '',  
        text: 'Withdraw Request',
        number: 0,
    });

    const columns = [
        {
            title: "S.No",
            dataIndex: "sNo",
            key: "sno",
            render: (text, record, index) => index + 1,
        },
        {
            title: "Player ID",
            dataIndex: "_id",
            key: "_id" ,
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
            title: "Mobile Number",
            dataIndex: "mobile",
            key: "mobile",
        }
    ]
    
    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

   // Fetch total players list from your backend
    const fetchTotalPlayers = async () => {
        try {
            const response = await axios.get(`${base_url}${get_player}`);
            const playersList = response.data.playerList; // Assuming the response is an array of players
    
            setplayerData((prevData) => ({ ...prevData, players: playersList }));
        } catch (error) {
            console.error("Error fetching total players list:", error);
        }
    
    };

    const fetchIncomeAmount = async (player_id) => {
        try {
            // const response = await axios.get("http://localhost:2000/player/transaction-list");
            const response = await axios.post(`${base_url}${get_transaction}`, {
                params: { player_id }
            });
            const transactionList = response.data.data; // Assuming the response is an array of transaction
    
            // Calculate total amount
            const totalAmount = transactionList.reduce((acc, transaction) => acc + transaction.amount, 0);

   
            settransactionData((prevData) => ({ ...prevData, transaction: transactionList, totalAmount }));
        } catch (error) {
            console.error("Error fetching total transaction list:", error);
        }
    }

    const fetchWithdrawRequest = async () => {
        
        try {
            const response = await axios.get(`${base_url}${get_withdrawList}`);
            const withdrawalRequests = response.data.data; // Assuming the response is an array of players
    
            setwithdrawData((prevData) => ({ ...prevData, withdraw: withdrawalRequests }));
            console.log("withdrawalRequests", withdrawalRequests)
        } catch (error) {
            console.error("Error fetching total players list:", error);
        }
    }

    // const handleRecentPlayer = async () => {
    //     try {
    //         setLoading(true);
    
    //         const currentTime = new Date();
    //         // const oneHourAgo = new Date(currentTime - 60 * 60 * 1000); // 1 hour ago
    //         // const tweleveHourAgo = new Date(currentTime - 12 * 60 * 60 * 1000); // 12 hour ago
    //         const tweleveHourAgo = (new Date(currentTime - 5 * 48 * 60 * 60 * 1000)) // new Date(currentTime - 48 * 60 * 60 * 1000); // 48 hour ago
    //         const tenDaysAgo = new Date(currentTime - 10 * 24 * 60 * 60 * 1000);

    
    //         const data = await getPlayerData();
    //         console.log("data", data)
    //         if(data) {
    //             // Filter players created in the last 1 hour or 12 hour
    //             // const recentPlayers = data.filter(player => new Date(player.created_at) >= oneHourAgo);
    //             const recentPlayers = data.filter(player => new Date(player.created_at) >= tenDaysAgo);
    
    //             setRecentPlayers(recentPlayers);
    //         }
    //         // const data = await getPlayerData();
    //         // console.log('Player Data:', data);

    //         // // ...

    //         // const recentPlayers = data.filter(player => new Date(player.created_at) >= tweleveHourAgo);
    //         // console.log('Recent Players:', recentPlayers);

    //     } catch (error) {
    //         console.error(error);
    //     } finally {
    //         setLoading(false);
    //     }
    // };
    

    // console.log("recent player", recentPlayers)

    const handleRecentPlayer = async () => {
        try {
            setLoading(true);
    
            const currentTime = new Date();
            const tenDaysAgo = new Date(currentTime - 10 * 24 * 60 * 60 * 1000);
    
            const data = await getPlayerData();
            console.log("data", data);
    
            if (data) {
                // Filter players created in the last 10 days
                const recentPlayers = data.filter(player => new Date(player.createdAt) >= tenDaysAgo);
    
                setRecentPlayers(recentPlayers);
            }
    
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    console.log("recent player", recentPlayers)
    

    useEffect(() => {
        fetchTotalPlayers();
        fetchIncomeAmount()
        // fetchNetIncome()
        fetchWithdrawRequest()
        handleRecentPlayer()
    }, []); 
    // Run only once when the component mounts

    const handleTotalPlayerList = () => {
        navigate('/players/list')
    }

    const handleWithdrawRequestList = () => {
        navigate('/withdraw/list')
    }

    const handleAllTransaction = () => {
        navigate('/alltransaction')
    }

    const handleRechargeTransaction = () => {
        navigate('/rechargetransaction')
    }

    return (
        <>
            <Layout style={{ minHeight: "100vh" }}>
                <Header 
                    toggleSidebar={toggleSidebar}
                    isAuthenticated={isAuthenticated}
                />
                <Layout>
                    {isSidebarVisible && <Sidebar />}
                    <Layout>
                
                        <Content 
                            style={{ 
                                padding: "24px", 
                                minHeight: "280px", 
                                cursor: "pointer"
                            }}> 
                                <Row>
                                    <Breadcrumb
                                        items={[
                                            {
                                            title: <h3>Dashboard</h3>,
                                            },
                                            {
                                            title: <a href="/">Home</a>,
                                            },
                                        ]}
                                    />
                                </Row>

                                <hr />

                                <Row>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={16}
                                        lg={6}
                                        xl={6}
                                        className="totalPlayers"
                                        onClick={handleTotalPlayerList}
                                    >
                                        {/* Total Players */}
                                        <Card
                                            style={{ 
                                                backgroundColor: '#088bd7', 
                                                width: 230, 
                                                textAlign: 'center',
                                                color: 'white'
                                            }}
                                            className="card"
                                        >
                                            
                                            <MehOutlined style={{ fontSize: '30rem'  }} />
                                            <h3>{playerData.text}</h3>
                                            <p>{playerData.players ? playerData.players.length : 0 }</p>
                                            
                                        </Card>
                                    </Col>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                        className="totalPlayers"
                                        onClick={handleAllTransaction}
                                    >
                                        {/* Income */}
                                        <Card
                                            style={{ 
                                                backgroundColor: '#049763', 
                                                width: 230, 
                                                textAlign: 'center',
                                                color: "white" 
                                            }}
                                            className="card"
                                        >
                                            {/* <DollarOutlined /> */}
                                            <DollarOutlined style={{ fontSize: '30rem' }} />
                                            <h3>{transactionData.text}</h3>
                                            <p>{transactionData.totalAmount}</p>
                                        </Card>
                                    </Col>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                        className="totalPlayers"
                                        onClick={handleRechargeTransaction}
                                    >
                                        {/* Net Income */}
                                        <Card
                                            style={{ 
                                                backgroundColor: '#b92808', 
                                                width: 230, 
                                                textAlign: 'center', 
                                                color: "white" 
                                            }}
                                            className="card"
                                        >
                                            <MailOutlined style={{ fontSize: '30rem' }} />
                                            <h3>Net Income</h3>
                                            <p>{(transactionData.totalAmount*10)/100}</p>
                                            
                                        </Card>
                                    </Col>
                                    <Col
                                        xs={24}
                                        sm={24}
                                        md={6}
                                        lg={6}
                                        xl={6}
                                        className="totalPlayers"
                                        onClick={handleWithdrawRequestList}
                                    >
                                        <Card
                                            style={{ 
                                                backgroundColor: '#edaf03', 
                                                width: 230, 
                                                textAlign: 'center',
                                                color: 'white'
                                            }}
                                            className="card"
                                        >
                                            <FolderViewOutlined style={{ fontSize: '30rem' }} />
                                        
                                            <h3>{withdrawData.text}</h3>
                                            <p>{withdrawData.withdraw ? withdrawData.withdraw.length : 0 }</p>
                                        </Card>
                                    </Col>
                            
                                    <Card
                                        className="recent-players"
                                        onClick={handleRecentPlayer}
                                    >    
                                        Recent Players
                                        {/* {loading && <p>Loading...</p>}
                                        {!loading && recentPlayers.length > 0 && (
                                            <ul>
                                                {recentPlayers.map(player => (
                                                    <li key={player.id}> {player.name}</li>
                                                ))}
                                            </ul>
                                        )} */}

                                        {/* {!loading && recentPlayers.length === 0 && <p>No recent players found.</p>}  */}
                                    
                                        <Table 
                                            columns={columns} 
                                            dataSource={recentPlayers} 
                                            pagination={{
                                                current: currentPage,
                                                pageSize: pageSize,
                                                onChange: (page, pageSize) => {
                                                    setCurrentPage(page);
                                                    setPageSize(pageSize);
                                                },
                                            }}
                                        />  
                                    </Card>
                                </Row>
                        </Content>
                    </Layout>
                </Layout>
            </Layout>
        </>
    )
}

export default Dashboard

// // Update your state to include recent players
// // ...

// // Render recent players in your component
// <Card
//     className="recent-players"
//     onClick={handleRecentPlayer}
// >    
//     Recent Players
//     {loading && <p>Loading...</p>}
//     {!loading && recentPlayers.length > 0 && (
//         <ul>
//             {recentPlayers.map(player => (
//                 <li key={player.id}>{player.name}</li>
//             ))}
//         </ul>
//     )}
//     {!loading && recentPlayers.length === 0 && <p>No recent players found.</p>}
// </Card>