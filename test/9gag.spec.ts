import { beforeAll, describe, expect, it } from 'vitest';
import { fetchMock } from 'cloudflare:test';
import { generate9gagResponse } from '../src/9gag';

import videoResponse from './responses/9gag-video-response.json';
import parse from '../node_modules/@kxalex/node-html-parser';

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
		const html = parse(body);

		let metas: any = {};
		html.querySelectorAll('meta').forEach(meta => {
			const key = meta.getAttribute('property') || meta.getAttribute('name');
			if (key) {
				metas[key] = meta.getAttribute('content');
			}
		});

		expect(metas['description']).toEqual('513 points • 64 comments - Your daily dose of funny memes, reaction meme pictures, GIFs and videos. We deliver hundreds of new memes daily and much more humor anywhere you go.');
		expect(metas['article:author']).toEqual('https://facebook.com/9gag');
		expect(metas['twitter:card']).toEqual('summary_large_image');
		expect(metas['twitter:site']).toEqual('@9gag');
		expect(metas['twitter:image']).toEqual('https://images-cdn.9gag.com/photo/avygY5W_ogimage.jpg');
		expect(metas['og:title']).toEqual('Learn not to fear words - Video');
		expect(metas['og:site_name']).toEqual('FX9GAG');
		expect(metas['og:url']).toEqual('http://9gag.com/gag/avygY5W');
		expect(metas['og:description']).toEqual('513 points • 64 comments');
		expect(metas['og:type']).toEqual('article');
		expect(metas['og:image']).toEqual('https://images-cdn.9gag.com/photo/avygY5W_ogimage.jpg');
		expect(metas['fb:app_id']).toEqual('111569915535689');
		// we don't care about fb pages
		// expect(metas['fb:pages']).toEqual('21785951839');
		expect(metas['al:ios:url']).toEqual('ninegag://9gag.com/gag/avygY5W');
		expect(metas['al:ios:app_store_id']).toEqual('545551605');
		expect(metas['al:ios:app_name']).toEqual('9GAG');
		expect(metas['al:android:url']).toEqual('ninegag://9gag.com/gag/avygY5W');
		expect(metas['al:android:package']).toEqual('com.ninegag.android.app');
		expect(metas['al:android:app_name']).toEqual('9GAG');
		expect(metas['og:video']).toEqual('https://img-9gag-fun.9cache.com/photo/avygY5W_460sv.mp4');
		expect(metas['og:video:secure_url']).toEqual('https://img-9gag-fun.9cache.com/photo/avygY5W_460sv.mp4');
		expect(metas['og:video:type']).toEqual('video/mp4');
		expect(metas['og:video:width']).toEqual('460');
		expect(metas['og:video:height']).toEqual('345');

		expect(response.status).toBe(200);
	});

	it('should return 500 for invalid URL', async () => {
		const response = await generate9gagResponse(new URL('https://example.com'));

		expect(response.status).toBe(500);
		expect(await response.text()).toEqual('No data found in 9gag response');
	});

});
