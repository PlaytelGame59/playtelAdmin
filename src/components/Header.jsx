// Header.js
import React from "react";
import { Button, Col, Row } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";

const Header = ({ toggleSidebar, isAuthenticated }) => {
    const navigate = useNavigate()

    const handleSignOut = () => {
        navigate('/admin/signout')
    }
    console.log("Is Authenticated:", isAuthenticated);

    return (
        <>
            <Row
                style={{
                    backgroundColor: "#edaf03",
                    height: "5rem",
                    textAlign: "center",
                    paddingTop: "1.5%",
                }}
            >
                <Col 
                    xs={8} 
                    sm={8} 
                    md={8} 
                    lg={8} 
                    xl={8}>
                    <Button className="menu-button" onClick={toggleSidebar}>
                        <MenuOutlined />
                    </Button>
                </Col>

                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                    <p>Playtel Admin</p>
                </Col>

                <Col xs={8} sm={8} md={8} lg={8} xl={8}>
                    {isAuthenticated ? (      
                        <Button onClick={handleSignOut}>
                            SignOut
                        </Button>
                    ) : null}
                </Col>
            </Row>
        </>
    );
};

export default Header;
