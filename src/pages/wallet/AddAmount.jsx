import React, { useEffect, useState } from "react"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import { Breadcrumb, Button, Col, Form, Input, Layout, Radio, Row, Select } from "antd"
import Swal from "sweetalert2"
import { useNavigate } from "react-router-dom"
import { addPlayerData, addWalletAmountData, getPlayerData } from "../../api/Api"

const { Option } = Select;

const AddAmount = () => {
    const navigate = useNavigate()
    const [players, setPlayers] = useState([]);
    const [selectedPlayer, setSelectedPlayer] = useState([]);
    const [listId, setListId] = useState([]);
    const [formData, setFormData] = useState({
        transactionType: '',
        walletType: '',
        addAmount: '',
        notes: ''
    })
    const [isSidebarVisible, setSidebarVisible] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(
        localStorage.getItem("token") !== null
    );
    const toggleSidebar = () => {
        setSidebarVisible(!isSidebarVisible);
    };

    const handleChange = (e) => {
        setFormData((pre)=>{ 
            return({
            ...pre,
            [e.target.name]: e.target.value 
        })})
    }

    // const handlePlayerChange = (value) => {
    //     const selectedPlayer = players.find((player) => player.email === value);
    
    //     // Set walletAmount and bonusWalletAmount when player changes
    //     if (selectedPlayer) {
    //         setFormData((prev) => ({
    //             ...prev,
    //             list_id: [selectedPlayer._id], // Assuming _id is the correct property
    //             walletAmount: selectedPlayer.walletAmount.toString(),
    //             bonusWalletAmount: selectedPlayer.bonusWalletAmount.toString(),
    //         }));
    //     } else {
    //         // Reset values if no player is selected
    //         setFormData((prev) => ({
    //             ...prev,
    //             list_id: [],
    //             walletAmount: '',
    //             bonusWalletAmount: '',
    //         }));
    //     }
    //     setListId(selectedPlayer ? [selectedPlayer._id] : []);
    //     setSelectedPlayer(selectedPlayer);
    // };

    const handlePlayerChange = (value) => {
        const selectedPlayer = players.find((player) => player.email === value);
    
        // Set walletAmount and bonusWalletAmount when player changes
        if (selectedPlayer) {
            setFormData((prev) => ({
                ...prev,
                list_id: [selectedPlayer._id], // Assuming _id is the correct property
                walletAmount: selectedPlayer.walletAmount.toString(),
                bonusWalletAmount: selectedPlayer.bonusWalletAmount.toString(),
            }));
        } else {
            // Reset values if no player is selected
            setFormData((prev) => ({
                ...prev,
                list_id: [],
                walletAmount: '', 
                bonusWalletAmount: '',
            }));
        }
        setListId(selectedPlayer ? [selectedPlayer._id] : []);
        setSelectedPlayer(selectedPlayer ? [selectedPlayer] : []); // Fix: Wrap selectedPlayer in an array
    };
    

    console.log('selectedPlayer', selectedPlayer)

    const onFinish = async () => {
        try {
            const formDataWithWalletIds = selectedPlayer.map((player) => ({
                ...formData,
                list_id: [player._id], // Pass player ID as an array
            }));
    
            console.log("list_id", listId);
            
            const responses = await Promise.all(
                formDataWithWalletIds.map((data) => addWalletAmountData(data))
            );
    
            if (responses && responses.length > 0) {
                // Assuming the first response is representative of success or failure
                const firstResponse = responses[0];
    
                if (firstResponse.data && firstResponse.data.status === "success") {
                    // Reset form data and selected players after successful submission
                    setFormData({
                        list_id: [],
                        transactionType: '',
                        walletType: '',
                        addAmount: '',
                        notes: '',
                    });
    
                    setSelectedPlayer([]);
                    Swal.fire({
                        icon: "success",
                        title: "Success!",
                        text: firstResponse.data.msg,
                    });
                    // navigate("/");
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Error!",
                        text: firstResponse.data.msg || "Unknown error occurred",
                    });
                }
            } else {
                Swal.fire({
                    icon: "error",
                    title: "Error!",
                    text: "No response received from the server",
                });
            }
        } catch (error) {
            console.error("Error submitting form:", error);
        }
    };
    
    
    // const onFinish = async () => {
    //     try {
    //         const formDataWithWalletIds = selectedPlayer.map((player) => ({
    //             ...formData,
    //             list_id: [player._id], // Pass player ID as an array
    //         }));

    //         console.log("list_id", listId)
    //         const responses = await Promise.all(
    //             formDataWithWalletIds.map((data) => addWalletAmountData(data))
    //         );

    //         // const response = await addPlayerData(formData);

    //         if(responses.data.status === "success") {
    //             // Reset form data and selected players after successful submission
    //             setFormData({
    //                 list_id: [],

    //                 transactionType: '',
    //                 walletType: '',
    //                 addAmount: '',
    //                 notes: ''
    //             });
    
    //             setSelectedPlayer([]);
    //             Swal.fire({
    //                 icon: "success",
    //                 title: "Success!",
    //                 text: responses.data.msg,
    //             });
    //             // navigate("/");
    //         } else {
    //             Swal.fire({
    //                 icon: "error",
    //                 title: "Error!",
    //                 text: responses.data.msg,
    //             });
    //         }
    //     } catch (error) {
    //         console.error("Error submitting form:", error);
    //     }
    // };

    const getWalletPlayers = async () => {
        try {
            const response = await getPlayerData();
            setPlayers(response);   // first problem here
        } catch (error) {
            console.error("Error fetching players:", error);
        }
    };

    console.log('players', players)

    useEffect(() => {
        getWalletPlayers();
    }, []);

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
                                                title: <h3>Wallet</h3>,
                                            },
                                            {
                                                title: <a href="/">Home</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Wallet</a>,
                                            },
                                            {
                                                title: <a href="/players/list">Modify</a>,
                                            },
                                        ]}
                                    />
                                </Row>
                                <hr />
                            
                                <Form layout="vertical" onFinish={onFinish}>
                                    <Form.Item label="Choose Player:" name="email">
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Select
                                                    showSearch
                                                    placeholder="Select a player"
                                                    optionFilterProp="children"
                                                    onChange={handlePlayerChange}
                                                    filterOption={(input, option) =>
                                                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                    }
                                                >
                                                    {players.map((player) => (
                                                        <Option 
                                                            key={player.email} 
                                                            value={player.email}
                                                        >
                                                            {player.email}
                                                        </Option>
                                                    ))}
                                                </Select>
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label='Wallet Amount:' name='walletAmount'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Input
                                                    type="text"
                                                    name="walletAmount"
                                                    value={formData?.walletAmount}
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label='Bonus Wallet Amount:' name='bonusWalletAmount'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Input
                                                    type="text"
                                                    name="bonusWalletAmount"
                                                    value={formData?.bonusWalletAmount}
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label='Transaction Type:' name='transactionType'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Radio.Group
                                                    name="transactionType"
                                                    value={formData.transactionType}
                                                    onChange={(e) => handleChange({ target: { name: "transactionType", value: e.target.value } })}
                                                    >
                                                    <Radio value="credit">Credit</Radio>
                                                    <Radio value="debit">Debit</Radio>
                                                </Radio.Group>
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label='Wallet Type:' name='walletType'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Radio.Group
                                                    name="walletType"
                                                    value={formData.walletType}
                                                    onChange={(e) => handleChange({ target: { name: "walletType", value: e.target.value } })}
                                                >
                                                    <Radio value="bonus">Bouns</Radio>
                                                    <Radio value="win">Win</Radio>
                                                    <Radio value="play">Play</Radio>
                                                </Radio.Group>
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label='Add Amount:' name='addAmount'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Input
                                                    type="text"
                                                    name="addAmount"
                                                    value={formData.addAmount}
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>

                                    <Form.Item label='Notes:' name='notes'>
                                        <Row gutter={16}>
                                            <Col span={24}>
                                                <Input
                                                    type="text"
                                                    name="notes"
                                                    value={formData.notes}
                                                    onChange={handleChange}
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Item>
                                
                                    <Form.Item>
                                        <Button htmlType="submit" type="primary" style={{ marginRight: "1%" }}>Submit</Button>
                                        <Button htmlType="submit" type="primary" >Reset</Button>
                                    </Form.Item>
                                </Form>
                            </Col>
                        </Row>
                    </Layout>
                </Layout>
            </Layout>                                            
        </>
    )
}

export default AddAmount

//   <Form.Item label="Bonus Wallet Amount:" name="bonusWalletAmount">
//     <Row gutter={16}>
//       <Col span={24}>
//         <Input
//           type="text"
//           name="bonusWalletAmount"
//           value={formData.bonusWalletAmount}
//           onChange={handleChange}
//         />
//       </Col>
//     </Row>
//   </Form.Item>
