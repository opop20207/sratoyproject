import { useMoralis } from "react-moralis";
import Account from "./Account";

function LoginMeta() {
    const { authenticate, isAuthenticated, logout } = useMoralis();

    if (!isAuthenticated) {
        return (
            <div>
                <button onClick={() => authenticate()}>Connect MetaMask</button>
            </div>
        );
    }

    return (
        <>
            <div>
                <Account />
                <button
                    onClick={() => {
                        logout();
                    }}>
                    logout
                </button>
                <p>로그인 성공</p>
            </div>
        </>
    );
}
export default LoginMeta;
