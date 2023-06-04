import React, { useState, useCallback, useEffect } from 'react';
import useWebSocket, { ReadyState } from 'react-use-websocket';

export const WebSocketDemo = () => {
    const FINNHUB_KEY = process.env.REACT_APP_FINNHUB_KEY;
    const socketUrl = `wss://ws.finnhub.io?token=${FINNHUB_KEY}`;
    const [messageHistory, setMessageHistory] = useState([]);

    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl);

    useEffect(() => {
        if (lastMessage !== null) {
            setMessageHistory(prev => prev.concat(lastMessage));
        }
    }, [lastMessage, setMessageHistory]);

    const handleClickSendMessage = useCallback(type => {
        sendMessage(JSON.stringify({ type: type, symbol: 'BINANCE:BTCUSDT' }));
        sendMessage(JSON.stringify({ type: type, symbol: 'BINANCE:ETHUSDT' }));
    }, []);

    const connectionStatus = {
        [ReadyState.CONNECTING]: 'Connecting',
        [ReadyState.OPEN]: 'Open',
        [ReadyState.CLOSING]: 'Closing',
        [ReadyState.CLOSED]: 'Closed',
        [ReadyState.UNINSTANTIATED]: 'Uninstantiated',
    }[readyState];

    return (
        <div>
            <button
                onClick={() => handleClickSendMessage('subscribe')}
                disabled={readyState !== ReadyState.OPEN}
            >
                START
            </button>
            <button
                onClick={() => handleClickSendMessage('unsubscribe')}
                disabled={readyState !== ReadyState.OPEN}
            >
                STOP
            </button>
            <span>The WebSocket is currently {connectionStatus}</span>
            {lastMessage ? <span>Last message: {lastMessage.data}</span> : null}
            {/* <ul>
                {messageHistory.map((message, idx) => (
                    <span key={idx}>{message ? message.data : null}</span>
                ))}
            </ul> */}
        </div>
    );
};
