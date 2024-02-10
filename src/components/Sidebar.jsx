import { Card, Layout, Menu } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppstoreOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons';
// import { Menu } from 'antd';

const { Sider } = Layout;
const { SubMenu } = Menu; // Import SubMenu

const Sidebar = () => {
    const navigate = useNavigate()
    const [openKeys, setOpenKeys] = useState([]); // State to track open keys

    const handleSubMenuClick = (key) => {
        setOpenKeys((prevKeys) => {
            const isKeyOpen = prevKeys.includes(key);
            return isKeyOpen ? prevKeys.filter((k) => k !== key) : [...prevKeys, key];
        });
    };

    // Dashboard / Home
    const handleDashboard = () => {
        navigate('/')
    }

    // player
    const handlePlayerList = () => {
        navigate('/players/list')
    }
    const handleActivePlayer = () => {
        navigate('/player/active')
    }
    const handleAPlayerLeadboard = () => {
        navigate('/player/leadboard')
    }
    // const handlePlayerCreate = () => {
    //     navigate('/player/create')
    // }

    // Touranament
    const handleTournamentList = () => {
        navigate('/touranaments/list')
    }
    const handleCreateTournament = () => {
        navigate('/create/touranaments')
    }

    // Wallet / Withdraw
    const handleWithdrawList = () => {
        navigate('/withdraw/list')
    }
    const handleAddAmount = () => {
        navigate('/wallet/showpage')
    }

    // Support
    const handleBotControl = () => {
        // navigate('/boat_control/list')
    }
    const handleVersionControl = () => {
        // navigate('/version_control/list')
    }

    // Report 
    const handlePlayerReport = () => {
        navigate('/report/players')
    }
    const handleBannedReport = () => {
        navigate('/report/bannedPlayers')
    }
    const handleApproveTransaction = () => {
        navigate('/report/approvedwithdraw')
    }
    const handleAllTransaction = () => {
        navigate('/alltransaction')
    }
    const handleRechargeTransaction = () => {
        navigate('/rechargetransaction')
    }
    const handleRejectWithdraw = () => {
        navigate('/report/rejectedwithdraw')
    }
    // const handleGameHistory = () => {
    //     navigate('/report/gamehistory')
    // }

    // PrivacyPolicy
    const handlePrivacyPolicy = () => {
        navigate('/disclaimer')
    }

    // Notification
    const handleNotification = () => {
        navigate('/notification')
    }

    // Notice
    const handleNoticeCreate = () => {
        navigate('/notice/create')
    }
    const handleNoticeList = ()=> {
        navigate('/notice/list')
    }
    const handleContactUser = () => {
        navigate('/user/contact/list')
    }

    const handleadharpanapprove = () => {
        navigate('/report/adharpanapprove')
    }

    

    return (
        <>
            <Sider
                width={200}
                style={{
                    overflowY: "auto", // Enable vertical scrolling
                    height: "100vh", // Set a fixed height or use '100%' based on your layout
                }}
            >
                <Menu
                    mode="vertical"
                    openKeys={openKeys}
                    onOpenChange={(keys) => setOpenKeys(keys)}
                    style={{
                        background: "#f4a805", // Background color for the entire menu
                        borderRight: 0, // Remove border to avoid double border when wrapped in a Card
                    }}
                >
                    
                    {/* Dashboard / Home */}
                    <Menu.Item key="dashboard" onClick={handleDashboard}>Dashboard</Menu.Item>

                    {/* Player */}
                    <SubMenu
                        key="players"
                        title='Players'
                        >
                        <Menu.Item key="playerlist" onClick={handlePlayerList}>Player List</Menu.Item>
                        <Menu.Item key="activeplayer" onClick={handleActivePlayer}>Active Player</Menu.Item>
                        <Menu.Item key="playerleaderboard" onClick={handleAPlayerLeadboard}>Player Leaderboard</Menu.Item>
                        
                    </SubMenu>

                    {/* Touranament */}
                    <SubMenu key="tournaments" title="Tournaments">
                        <Menu.Item key="tournamentslist" onClick={handleTournamentList}>Tournament List</Menu.Item>
                        <Menu.Item key="createtournaments" onClick={handleCreateTournament}>Create Tournament</Menu.Item>
                    </SubMenu>

                    {/* Wallet / Withdraw */}
                    <SubMenu key="wallet" title="Wallet">
                        <Menu.Item key="withdrawlist"  onClick={handleWithdrawList}>Withdraw List</Menu.Item>
                        <Menu.Item key="addamount" onClick={handleAddAmount}>Add / Deduct Amount</Menu.Item>
                    </SubMenu>

                    {/* Support */}
                    <SubMenu key="support" title="Support">
                        <Menu.Item key="botcontrol" onClick={handleBotControl}>Bot Control</Menu.Item>
                        <Menu.Item key="versioncontrol" onClick={handleVersionControl}>Version Control</Menu.Item>
                    </SubMenu>

                    {/* Report */}
                    <SubMenu key="reports" title="Reports">
                        <Menu.Item key="playerdetailreport" onClick={handlePlayerReport}>Player Detail Report</Menu.Item>
                        <Menu.Item key="bannedplayers" onClick={handleBannedReport}>Banned Players Report</Menu.Item>
                        <Menu.Item key="alltransactions" onClick={handleAllTransaction}>All Transactions</Menu.Item>
                        <Menu.Item key="rechargetransactions" onClick={handleRechargeTransaction}>Recharge Transactions</Menu.Item>
                        <Menu.Item key="approvedwithdraw" onClick={handleApproveTransaction}>Approved Withdraw</Menu.Item>
                        <Menu.Item key="rejectedwithdraw" onClick={handleRejectWithdraw}>Rejected Withdraw</Menu.Item>
                        <Menu.Item key=" /report/adharpanapprove" onClick={ handleadharpanapprove}> /report/adharpanapprove</Menu.Item>
                    </SubMenu>

                    {/* Other menu items */}
                    
                    {/* Privacy Policy */}
                    <Menu.Item key="Privacy" onClick={handlePrivacyPolicy}>Privacy Policy</Menu.Item>

                    {/* Notification */}
                    <SubMenu key="notification" title="Notification">
                        <Menu.Item key="notificationallplayer" onClick={handleNotification}>Notification All Players</Menu.Item>
                    </SubMenu>

                    {/* Notice */}
                    <SubMenu key="notice" title="Notice">
                        <Menu.Item key="noticelist" onClick={handleNoticeList}>Notice List</Menu.Item>
                        <Menu.Item key="noticecreate" onClick={handleNoticeCreate}>Notice Create</Menu.Item>
                        <Menu.Item key="noticeuser" onClick={handleContactUser}>Contact Users</Menu.Item>
                    </SubMenu>
                
                </Menu>
                
            </Sider>
        </>
    );
};

export default Sidebar;
