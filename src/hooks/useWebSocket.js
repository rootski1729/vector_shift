import { useEffect, useRef } from 'react';

function useWebSocket(url, onMessage) {
	const ws = useRef(null);

	useEffect(() => {
		ws.current = new WebSocket(url);
		ws.current.onmessage = event => {
			if (onMessage) onMessage(event.data);
		};
		return () => {
			ws.current.close();
		};
	}, [url, onMessage]);

	return ws.current;
}

export default useWebSocket;
