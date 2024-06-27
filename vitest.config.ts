// @ts-ignore
import { defineWorkersConfig } from '@cloudflare/vitest-pool-workers/config';

export default defineWorkersConfig({
	test: {
		onConsoleLog: (log: string, type: 'stdout' | 'stderr'): boolean | void => {
			return type === 'stderr' || log.startsWith('DBG: ');
		},
		globals: true,
		poolOptions: {
			workers: {
				wrangler: { configPath: './wrangler.toml' },
			},
		},
	},
});
