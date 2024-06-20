export function replaceUrl(url: URL) {
	const url9gag = new URL(url.pathname, 'https://9gag.com');
	url9gag.search = url.search;
	url9gag.hash = url.hash;
	return url9gag;
}
