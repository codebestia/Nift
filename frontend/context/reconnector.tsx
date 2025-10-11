"use client";

import { createContext, ReactNode, useEffect, useCallback, useState } from "react";
import { useConnect } from "@starknet-react/core";

interface ReconnectorContextType {
  reconnect: () => void;
  setConnectionId: (id: string) => void;
  connectionId: string;
}

export const ReconnectorContext = createContext<ReconnectorContextType>({
  reconnect: () => {},
  setConnectionId: (id: string) => {},
  connectionId: "",
});



export function ReconnectorProvider({children}: {children: ReactNode}){
    const { connect, connectors } = useConnect();
    const [connectionId, setConnectionIdState] = useState<string>("");

    const setConnectionId = (id: string) => {
        localStorage.setItem('lastConnectedWallet', id);
        setConnectionIdState(id);
    }
    const reconnect = useCallback(() => {
        const lastConnectedWallet = localStorage.getItem('lastConnectedWallet');
        
        if (lastConnectedWallet) {
        // Find the matching connector
        const connector = connectors.find(
            (c) => c.id === lastConnectedWallet
        );
        
        if (connector) {
            // Attempt to reconnect
            connect({ connector });
            setConnectionIdState(lastConnectedWallet);
        }
        }
    }, [connect, connectors]);

    useEffect(() => {
        reconnect();
    }, [connect, connectors]);
    return (
        <ReconnectorContext.Provider value={
            {
                reconnect, 
                setConnectionId, 
                connectionId
            }
        }>
            {children}
        </ReconnectorContext.Provider>
    )
}