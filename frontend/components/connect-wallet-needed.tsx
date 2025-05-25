import { ConnectWalletButton } from "./connect-wallet-button";

const ConnectWalletNeeded = () => {
    return (
        <div className="">
            <h1 className="mb-2">You need to connect your wallet</h1>
            <ConnectWalletButton />
        </div>
    );
}
 
export default ConnectWalletNeeded;