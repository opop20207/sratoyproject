import {
    BrowserRouter as Router,
    Link,
    NavLink,
    Route,
} from "react-router-dom";
import { ButtonGroup } from "react-bootstrap";
import Menu, { SubMenu, MenuItem } from "rc-menu";
import "antd/dist/antd.css";
import Account from "../components/Account";

const styles = {
    content: {
        display: "flex",
        justifyContent: "center",
        fontFamily: "Roboto, sans-serif",
        color: "#041836",
        marginTop: "130px",
        padding: "10px",
    },
    header: {
        position: "fixed",
        zIndex: 1,
        width: "100%",
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontFamily: "Roboto, sans-serif",
        borderBottom: "2px solid rgba(0, 0, 0, 0.06)",
        padding: "0 10px",
        boxShadow: "0 1px 10px rgb(151 164 175 / 10%)",
    },
    headerRight: {
        display: "flex",
        gap: "20px",
        alignItems: "center",
        fontSize: "15px",
        fontWeight: "600",
    },
};

function Header() {
    return (
        <div style={{ height: "10vh", overflow: "auto" }}>
            <div style={styles.header}>
                <Menu
                    theme="light"
                    mode="horizontal"
                    style={{
                        display: "flex",
                        fontSize: "16px",
                        fontWeight: "500",
                        marginLeft: "50px",
                        width: "100%",
                    }}
                    defuaultselectedkeys={["CLone.ns"]}>
                    <Menu.Item key="CLone.ns">
                        <NavLink to={"/"}>
                            <a>{"CLone.ns"}</a>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="MarketPlace">
                        <NavLink to={"/MarketPlace"}>
                            <a>{"MarketPlace"}</a>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="MyNFT">
                        <NavLink to={"/MyNFT"}>
                            <a>{"MyNFT"}</a>
                        </NavLink>
                    </Menu.Item>
                    <Menu.Item key="Create">
                        <NavLink to={"/Create"}>
                            <a>{"Create"}</a>
                        </NavLink>
                    </Menu.Item>
                </Menu>
                <div style={styles.headerRight}>
                    <Account />
                </div>
            </div>
        </div>
    );
}

export const Logo = () => {
    <div style={{ display: "flex" }}>
        <svg>
            <text>CLone.ns</text>
        </svg>
    </div>;
};

export default Header;
