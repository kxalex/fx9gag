declare global {
	interface String {
		format(options: { [find: string]: string }): string;
	}
}

/* Useful little function to format strings for us */
String.prototype.format = function (options: { [find: string]: string }) {
	return this.replace(/{([^{}]+)}/g, (match: string, name: string) => {
		if (options[name] !== undefined) {
			return options[name];
		}
		return match;
	});
};

export const Strings = {
	BASE_HTML: `<!DOCTYPE html><html {lang}><!--

██████████         ██████
███               ██    ██
███              ███    ███
███████ ███  ███  ██    ██   .d██b.   ████b.   .d██b.
███       ████      ████     ██P"██b     "██b d██P"██b
███        ██           ███ ███  ███ .d██████ ███  ███
███       ████    ██    ██   ██b ███ ███  ███ Y██b ███
███     ███  ███    ████      █████ "Y██████  "Y█████
                                 ███               ███
                             █   ██          Y█b d██P
                              ███              "Y██P"

   █████ ▐█▌       ███████████                              ███
 ███      █            ███                                  ███
███                    ███                                  ███
███      ███  ███  ███ ███  ███  ███  ███  ██████   ██████  ██████
███████▌ ███   ▐█▌▐█▌  ███  ███  ███  ███ ▐█▌  ▐█▌ ▐█▌  ▐█▌ ███
███      ███    ▐██▌   ███  ███  ███  ███ ████████ ████████ ███
███      ███   ▐█▌▐█▌  ███  ▐██▌ ███ ▐██▌ ▐█▌      ▐█▌      ▐██▌
███      ███  ███  ███ ███   ▐█████████▌    ▐████    ▐████    ▐████
███
███   A better way to embed Tweets on Discord, Telegram, and more.
███   Worker build $ {RELEASE_NAME}

--><head>{headers}</head><body>{body}</body></html>`,
}
