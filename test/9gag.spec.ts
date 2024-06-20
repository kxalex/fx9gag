import { beforeAll, describe, expect, it } from 'vitest';
import { fetchMock } from 'cloudflare:test';
import { generate9gagResponse } from '../src/9gag';

import videoResponse from './responses/9gag-video-response.json';
// import parse from '../../node-html-parser';
// import imageResponse from './responses/9gag-image-response.json';

beforeAll(() => {
	fetchMock.disableNetConnect();
});

describe('9gag', () => {

	it('should fetch 9gag video post', async () => {
		fetchMock.get('https://9gag.com')
			.intercept({
				path: '/gag/avygY5W',
				headers: { 'User-Agent': 'TelegramBot (like TwitterBot)' }
			})
			.reply(200, videoResponse.response);

		const response = await generate9gagResponse(new URL('https://9gag.com/gag/avygY5W'));

		const body = await response.text();
		// const html = parse(body)
		// console.log(body);

		expect(response.status).toBe(200);
	});

	it('should return 500 for invalid URL', async () => {
		const response = await generate9gagResponse(new URL('https://example.com'));

		expect(response.status).toBe(500);
		expect(await response.text()).toEqual("No scripts found in 9gag response");
	});

});
