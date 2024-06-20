import { HTMLRewriterElementContentHandlers } from '@cloudflare/workers-types';

interface SocialMediaPosting {
	'@id': string,
	'mainEntityOfPage': string,

	author: {
		name: string;
		url: string;
	}

	video: {
		name: string;
		description: string;
		thumbnailUrl: string;
		uploadDate: string;
		contentUrl: string;
		duration: string;
	}
}

function getVideoMetaAttributes(media: SocialMediaPosting) {
	return [
		`<meta property="theme-color" content="#00a8fc" />`,

		// twitter
		// `<meta property="twitter:player:height" content="1350" />`,
		// `<meta property="twitter:player:width" content="1080" />`,
		`<meta property="twitter:player:stream" content="${media.video.contentUrl}" />`,
		`<meta property="twitter:player:stream:content_type" content="video/mp4" />`,

		// og
		// `<meta property="og:video:width" content="1080" />`,
		// `<meta property="og:video:height" content="1350" />`,
		`<meta property="og:video" content="${media.video.contentUrl}" />`,
		`<meta property="og:video:secure_url" content="${media.video.contentUrl}" />`,
		`<meta property="og:video:type" content="video/mp4" />`
	];
}

function extractMetaAttributes(message: string): SocialMediaPosting | undefined {
	const regex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
	const matches = message.matchAll(regex);
	const scripts = Array.from(matches, match => match[1]);
	if (scripts.length === 0) {
		return undefined;
	}
	return JSON.parse(scripts[0]) as SocialMediaPosting;
}

export async function generate9gagResponse(url: URL): Promise<Response> {
	console.log('Fetching 9gag:', url.toString());

	const response = await fetch(url, {
		cf: {
			cacheEverything: true,
			cacheTtl: 2_592_000 // 30 days
		},
		headers: {
			'User-Agent': 'TelegramBot (like TwitterBot)'
		}
	});

	if (!response.ok) {
		console.error('Error fetching 9gag: ', url.toString(), response.status);
		return new Response('Error fetching ' + url.toString(), { status: 500 });
	}

	const rewriter = new HTMLRewriter();

	const message = await response.clone().text();
	const metaAttributes = extractMetaAttributes(message);

	if (metaAttributes === undefined) {
		console.error('No scripts found in 9gag response');
		return new Response('No scripts found in 9gag response', { status: 500 });
	}

	const removeElement: HTMLRewriterElementContentHandlers = {
		element(element: Element): void {
			element.remove();
		}
	};

	rewriter
		.on('script', removeElement)
		.on('style', removeElement)
		.on('link[rel=preload]', removeElement)
		.on('div', removeElement)
		.on('meta[property="og:site_name"]', {
			element(element: Element): void {
				element.setAttribute('content', 'FX9GAG');
			}
		});

	if (metaAttributes.video) {
		const videoMetaAttributes = getVideoMetaAttributes(metaAttributes);
		rewriter.on('meta[property="og:image"]', {
			element(element: Element): void | Promise<void> {
				videoMetaAttributes.forEach((meta) => {
					element.after(meta, { html: true });
				});
			}
		});
	}

	return rewriter.transform(response);
}
