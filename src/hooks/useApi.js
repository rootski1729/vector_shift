import { useState, useEffect } from 'react';
import { instance } from '../services/api';

function useApi(url, options = {}) {
	const [data, setData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		async function fetchData() {
			setLoading(true);
			try {
				const res = await instance.get(url, options);
				setData(res.data.data);
				setLoading(false);
			} catch (err) {
				setError(err);
				setLoading(false);
			}
		}
		fetchData();
	}, [url]);

	return { data, loading, error };
}

export default useApi;
