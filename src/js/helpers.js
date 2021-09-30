import { TIMEOUT_SECONDS } from './config';

const timeout = function (s) {
	return new Promise(function (_, reject) {
		setTimeout(function () {
			reject(
				new Error(`Request took too long! Timeout after ${s} second`)
			);
		}, s * 1000);
	});
};

export const sendRequest = async function (url, body = null) {
	const options = body
		? {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(body),
		  }
		: {};

	try {
		const res = await Promise.race([
			fetch(url, options),
			timeout(TIMEOUT_SECONDS),
		]);
		const data = await res.json();

		if (!res.ok) throw new Error(`${data.message} (${res.status})`);

		return data;
	} catch (err) {
		throw err;
	}
};
