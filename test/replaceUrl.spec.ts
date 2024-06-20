import { describe, expect, it } from 'vitest';
import { replaceUrl } from '../src/replaceUrl';

describe('replaceUrl', () => {

	it.each([
		"https://example.com/gag/avygY5W?utm_source=Telegram&utm_medium=post_share",
	])
	('should replace current URL with 9gag URL', async (url) => {
		const actualUrl = replaceUrl(new URL(url));

		expect(actualUrl.hostname).toBe('9gag.com');
		expect(actualUrl.pathname).toBe('/gag/avygY5W');
		expect(actualUrl.search).toBe('?utm_source=Telegram&utm_medium=post_share');
	});

});
