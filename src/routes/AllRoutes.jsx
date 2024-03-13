// // AllRoutes page
// import React, { useEffect, useState } from "react"
// import { Route, Routes, useNavigate } from "react-router-dom"
// // import Home from "../pages/Home"
// import Login from "../pages/Login"
// import Signup from "../pages/Signup"
// import TournamentList from "../pages/Tournament/TournamentsList"
// import PlayerList from "../pages/player/PlayerList"
// import WithdrawList from "../pages/wallet/WithdrawList"
// import NoticeList from "../pages/notice/NoticeList"
// import AllTransaction from "../pages/report/AllTransaction"
// import RechargeTransaction from "../pages/report/RechargeTransaction"
// import CreateTournament from "../pages/Tournament/CreateTournament"
// import AddAmount from "../pages/wallet/AddAmount"
// import NoticeCreate from "../pages/notice/NoticeCreate"
// import NotificationAllPlayers from "../pages/notification/NotificationAllPlayers"
// import ContactUser from "../pages/notice/ContactUser"
// import Dashboard from "../pages/Dashbard"   
// import ActivePlayer from "../pages/player/ActivePlayer"
// import PlayerLeadboard from "../pages/player/PlayerLeadboard"
// import ApproveTransaction from "../pages/report/ApproveTransaction"
// import BannedPlayers from "../pages/report/BannedPlayer"
// import PlayerReport from "../pages/report/PlayerReport"
// import RejectTransaction from "../pages/report/RejectTransaction"
// import BotControl from "../pages/support/BotControl"
// import VersionControl from "../pages/support/VersionControl"
// import PrivacyPolicy from "../pages/PrivacyPolicy"
// import PlayerCreate from "../pages/player/PlayerCreate"
// import PlayerListPage from "../pages/player/PlayerListPage"
// import Header from "../components/Header"
// import SignOut from "../pages/Signout"
// import AdharPanApprove from "../pages/report/AdharPanApprove"
// import { useAuthContext } from "../context/AuthContext"
// // import GameHistory from "../pages/report/GameHistory"


// const AllRoutes = () => {
//     const navigate = useNavigate()
//     const { userToken } = useAuthContext()

//     console.log("Route Token ::: ", userToken)

//     const [isAuthenticated, setIsAuthenticated] = useState(
//         localStorage.getItem("token") !== null
//     );      

//     const handleLogin = () => {
//         // Implement your login logic here
//         setIsAuthenticated(true);
//     };   

//     useEffect(() => {
//         // Implement a mechanism to check session timeout and handle it
//         const checkSessionTimeout = () => {
//             const lastActivity = localStorage.getItem("lastActivity");
//             const currentTime = new Date().getTime();
//             // const sessionTimeout = 60 * 60 * 1000; // 1 hour (adjust as needed)
//             const sessionTimeout = 60 * 1000; // 1 mint (adjust as needed)  
//             // const sessionTimeout = 30 * 1000; // 30 sec (adjust as needed)
    
//             if (lastActivity && currentTime - lastActivity > sessionTimeout) {
//                 // Session timed out, perform logout and redirect to login
//                 setIsAuthenticated(false);
//                 localStorage.clear();
//                 console.log("Session timed out. Redirecting to login.");
//                 navigate('/admin/login');
//             }
//         };
    
//         checkSessionTimeout();
    
//         const activityInterval = setInterval(() => {
//             localStorage.setItem("lastActivity", new Date().getTime());
//             checkSessionTimeout();
//         }, 1000); // Check every second (adjust as needed)
    
//         return () => clearInterval(activityInterval);
//     }, [navigate]);
    

//     const handleSignOut = () => {
//         // Implement your sign-out logic here
//         setIsAuthenticated(false);
//         localStorage.clear();
//     };   

//     return (
//         <>
//             <Routes>
//                 {/* Header */}
//                 {/* <Header 
//                     toggleSidebar={toggleSidebar} 
//                     isAuthenticated={isAuthenticated}
//                 /> */}

//                 <Route path="/admin/login" element= { <Login onLogin={handleLogin} />} />
//                 <Route path='*' element={<div style={{ minHeight: "100vh", minWidth: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}>Not Found</div>} />
//                 {
//                     userToken && <>

//                         {/* Admin login and signout */}
//                         <Route path="/signup" element= { <Signup />} />
//                         <Route path="/admin/signout" element={<SignOut onSignOut={handleSignOut} />} />

//                         {/* Dashboard / Home */}
//                         <Route path="/" element= { < Dashboard isAuthenticated={isAuthenticated} />} />

//                         {/* Player */}
//                         <Route path="/players/list" element= { <PlayerList /> } />
//                         <Route path="/player/active" element={ <ActivePlayer /> } />
//                         <Route path="/player/leadboard" element={ <PlayerLeadboard /> } />
//                         {/* <Route path="/player/create" element={ <PlayerCreate /> } /> */}

//                         <Route path="/players/listpage" element= { <PlayerListPage /> } />

//                         {/* Touranament */}
//                         <Route path="/touranaments/list" element= { <TournamentList /> } />
//                         <Route path="/create/touranaments" element= { <CreateTournament /> } />

//                         {/* Wallet / Withdraw */}
//                         <Route path="/withdraw/list" element= { <WithdrawList /> } />
//                         <Route path="/wallet/showpage" element={ <AddAmount /> } />

//                         {/* Support */}
//                         <Route path="/boat_control/list" element={ <BotControl /> } />
//                         <Route path="/version_control/list" element={ <VersionControl /> } />

//                         {/* Report */}
//                         <Route path="/alltransaction" element= { <AllTransaction /> } />
//                         <Route path="/rechargetransaction" element= { <RechargeTransaction /> } />
//                         <Route path="/report/approvedwithdraw" element={ <ApproveTransaction /> } />
//                         <Route path="/report/bannedPlayers" element={ <BannedPlayers /> } />
//                         <Route path="/report/players" element={ <PlayerReport /> } />
//                         <Route path="/report/rejectedwithdraw" element={ <RejectTransaction /> } />
//                         {/* <Route path="/report/gamehistory" element= { <GameHistory /> } /> */}
//                         <Route path="/report/adharpanapprove" element={ <AdharPanApprove /> } />


//                         {/* Privacy Policy */}
//                         <Route path="/disclaimer" element={ < PrivacyPolicy /> } />

//                         {/* Notification */}
//                         <Route path="/notification" element={ <NotificationAllPlayers /> } />

//                         {/* Notice */}
//                         <Route path="/notice/list" element= { <NoticeList /> } />
//                         <Route path="/notice/create" element= { <NoticeCreate /> } />
//                         <Route path="/user/contact/list" element= { <ContactUser /> } />
//                     </>
//                 }



//             </Routes>
//         </>
//     )
// }

// export default AllRoutes



import React, { useEffect, useState } from "react"
import { Route, Routes, useNavigate } from "react-router-dom"
// import Home from "../pages/Home"
import Login from "../pages/Login"
import Signup from "../pages/Signup"
import TournamentList from "../pages/Tournament/TournamentsList"
import PlayerList from "../pages/player/PlayerList"
import WithdrawList from "../pages/wallet/WithdrawList"
import NoticeList from "../pages/notice/NoticeList"
import AllTransaction from "../pages/report/AllTransaction"
import RechargeTransaction from "../pages/report/RechargeTransaction"
import CreateTournament from "../pages/Tournament/CreateTournament"
import AddAmount from "../pages/wallet/AddAmount"
import NoticeCreate from "../pages/notice/NoticeCreate"
import NotificationAllPlayers from "../pages/notification/NotificationAllPlayers"
import ContactUser from "../pages/notice/ContactUser"
import Dashboard from "../pages/Dashbard"   
import ActivePlayer from "../pages/player/ActivePlayer"
import PlayerLeadboard from "../pages/player/PlayerLeadboard"
import ApproveTransaction from "../pages/report/ApproveTransaction"
import BannedPlayers from "../pages/report/BannedPlayer"
import PlayerReport from "../pages/report/PlayerReport"
import RejectTransaction from "../pages/report/RejectTransaction"
import BotControl from "../pages/support/BotControl"
import VersionControl from "../pages/support/VersionControl"
import PrivacyPolicy from "../pages/PrivacyPolicy"
import PlayerCreate from "../pages/player/PlayerCreate"
import PlayerListPage from "../pages/player/PlayerListPage"
import Header from "../components/Header"
import SignOut from "../pages/Signout"
import AdharPanApprove from "../pages/report/AdharPanApprove"
import { useAuthContext } from "../context/AuthContext"
// import GameHistory from "../pages/report/GameHistory"

const AllRoutes = () => {
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const { userToken } = useAuthContext();

    useEffect(() => {
        const checkSessionTimeout = () => {
            const lastActivity = localStorage.getItem("lastActivity");
            const currentTime = new Date().getTime();
            const sessionTimeout = 60 * 1000; // 1 minute (adjust as needed)

            if (!userToken || (lastActivity && currentTime - lastActivity > sessionTimeout)) {
                // Redirect to login if not authenticated or session timed out
                setIsAuthenticated(false);
                localStorage.clear();
                console.log("User not authenticated or session timed out. Redirecting to login.");
                navigate('/admin/login');
            } else {
                setIsAuthenticated(true);
            }
        };

        checkSessionTimeout();

        const activityInterval = setInterval(() => {
            localStorage.setItem("lastActivity", new Date().getTime());
            checkSessionTimeout();
        }, 1000);

        return () => clearInterval(activityInterval);
    }, [navigate, userToken]);

    const handleLogin = () => {
        setIsAuthenticated(true);
    };

    const handleSignOut = () => {
        setIsAuthenticated(false);
        localStorage.clear();
    };

    return (
        <>
            <Routes>
                {/* ... (previous routes) */}
                <Route path="/admin/login" element={<Login onLogin={handleLogin} />} />
                <Route path='*' element={<div style={{ minHeight: "100vh", minWidth: "100vw", display: "flex", alignItems: "center", justifyContent: "center" }}>Not Found</div>} />
                {
                    userToken && <>
                        {/* Admin login and signout */}
                        <Route path="/signup" element= { <Signup />} />
                        <Route path="/admin/signout" element={<SignOut onSignOut={handleSignOut} />} />

                        {/* Dashboard / Home */}
                        <Route path="/" element= { < Dashboard isAuthenticated={isAuthenticated} />} />

                        {/* Player */}
                        <Route path="/players/list" element= { <PlayerList /> } />
                        <Route path="/player/active" element={ <ActivePlayer /> } />
                        <Route path="/player/leadboard" element={ <PlayerLeadboard /> } />
                        {/* <Route path="/player/create" element={ <PlayerCreate /> } /> */}

                        <Route path="/players/listpage" element= { <PlayerListPage /> } />

                        {/* Touranament */}
                        <Route path="/touranaments/list" element= { <TournamentList /> } />
                        <Route path="/create/touranaments" element= { <CreateTournament /> } />

                        {/* Wallet / Withdraw */}
                        <Route path="/withdraw/list" element= { <WithdrawList /> } />
                        <Route path="/wallet/showpage" element={ <AddAmount /> } />

                        {/* Support */}
                        <Route path="/boat_control/list" element={ <BotControl /> } />
                        <Route path="/version_control/list" element={ <VersionControl /> } />

                        {/* Report */}
                        <Route path="/alltransaction" element= { <AllTransaction /> } />
                        <Route path="/rechargetransaction" element= { <RechargeTransaction /> } />
                        <Route path="/report/approvedwithdraw" element={ <ApproveTransaction /> } />
                        <Route path="/report/bannedPlayers" element={ <BannedPlayers /> } />
                        <Route path="/report/players" element={ <PlayerReport /> } />
                        <Route path="/report/rejectedwithdraw" element={ <RejectTransaction /> } />
                        {/* <Route path="/report/gamehistory" element= { <GameHistory /> } /> */}
                        <Route path="/report/adharpanapprove" element={ <AdharPanApprove /> } />


                        {/* Privacy Policy */}
                        <Route path="/disclaimer" element={ < PrivacyPolicy /> } />

                        {/* Notification */}
                        <Route path="/notification" element={ <NotificationAllPlayers /> } />

                        {/* Notice */}
                        <Route path="/notice/list" element= { <NoticeList /> } />
                        <Route path="/notice/create" element= { <NoticeCreate /> } />
                        <Route path="/user/contact/list" element= { <ContactUser /> } />
                    </>
                }
            </Routes>
        </>
    );
}

export default AllRoutes;
