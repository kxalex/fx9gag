// test/index.spec.ts
import { env, createExecutionContext, fetchMock, SELF } from 'cloudflare:test';
import { describe, it, expect, beforeAll } from 'vitest';
import worker from '../src/index';
import videoResponse from './responses/9gag-video-response.json';
import { generate9gagResponse } from '../src/9gag';

beforeAll(() => {
	fetchMock.disableNetConnect();
});

// For now, you'll need to do something like this to get a correctly typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('9gag worker', () => {
	it('responds with 404 for invalid URL', async () => {
		// given
		const request = new IncomingRequest('https://example.com');

		// when
		const response = await worker.fetch(request, env, createExecutionContext());

		// then
		expect(response.status).toBe(404);
		expect(await response.text()).toMatchInlineSnapshot(`"Invalid URL"`);
	});

	it.each([
		'/gag/avygY5W?utm_source=Telegram&utm_medium=post_share'
	])('redirects to 9gag URL when User-Agent is not Telegram', async (url) => {
		const response = await SELF.fetch('https://example.com' + url, {
			headers: { 'User-Agent': 'NotGram' },
			redirect: 'manual'
		});

		expect(response.status).toBe(301);
		expect(response.headers.get('Location')).toEqual("https://9gag.com" + url);
	});

	it('should fetch 9gag video post', async () => {
		fetchMock.get('https://9gag.com')
			.intercept({
				path: '/gag/avygY5W',
				headers: { 'User-Agent': 'TelegramBot (like TwitterBot)' }
			})
			.reply(200, videoResponse.response);

		const response = await SELF.fetch(new IncomingRequest('https://example.com/gag/avygY5W', {
			headers: { 'User-Agent': 'TelegramBot (like TwitterBot)' },
			redirect: 'manual'
		}), env);

		const body = await response.text();
		console.log(body);

		expect(response.status).toBe(200);
	});

	// it('should return 500 for invalid URL', async () => {
	// 	fetchMock.get('https://9gag.com')
	// 		.intercept({ path: '/gag/404' })
	// 		.reply(200, '<html lang="en"></html>');
	//
	// 	const request = new IncomingRequest(
	// 		'https://example.com/gag/404',
	// 		{ headers: { 'User-Agent': 'TelegramBot (like TwitterBot)' } }
	// 	);
	// 	const response = await worker.fetch(request, env, createExecutionContext());
	//
	// 	expect(response.status).toBe(500);
	// 	expect(await response.text()).toEqual("No scripts found in 9gag response");
	// });

	// it('responds with Hello World! (unit style)', async () => {
	// 	const request = new IncomingRequest('http://example.com');
	// 	// Create an empty context to pass to `worker.fetch()`.
	// 	const ctx = createExecutionContext();
	// 	const response = await worker.fetch(request, env, ctx);
	// 	// Wait for all `Promise`s passed to `ctx.waitUntil()` to settle before running test assertions
	// 	await waitOnExecutionContext(ctx);
	// 	expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	// });
	//
	// it('responds with Hello World! (integration style)', async () => {
	// 	const response = await SELF.fetch('https://example.com');
	// 	expect(await response.text()).toMatchInlineSnapshot(`"Hello World!"`);
	// });
});
