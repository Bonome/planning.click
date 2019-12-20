import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import livereload from 'rollup-plugin-livereload';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

const production = !process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
//		dir: 'public/build/'
		file: 'public/build/bundle.js'
	},
        
        moduleContext: (id) => {
            const thisAsWindowForModules = [
                'node_modules/intl-messageformat/lib/core.js',
                'node_modules/intl-messageformat/lib/compiler.js',
                'node_modules/intl-messageformat/lib/formatters.js',
                'node_modules/intl-format-cache/lib/index.js',
                'node_modules/intl-messageformat-parser/lib/normalize.js',
                'node_modules/intl-messageformat-parser/lib/parser.js',
                'node_modules/intl-messageformat-parser/lib/skeleton.js,',
                'node_modules/intl-messageformat-parser/lib/skeleton.js',
            ];

            if (thisAsWindowForModules.some(id_ => id.trimRight().endsWith(id_))) {
                return 'window';
            }
        },
	plugins: [
		svelte({
			// enable run-time checks when not in production
			dev: !production,
			// we'll extract any component CSS out into
			// a separate file — better for performance
			css: css => {
				css.write('public/build/bundle.css');
			}
		}),

		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration —
		// consult the documentation for details:
		// https://github.com/rollup/rollup-plugin-commonjs
		resolve({
			browser: true,
			dedupe: importee => importee === 'svelte' || importee.startsWith('svelte/')
		}),
		commonjs(),
                json({
                    namedExports: false,
                    compact:production
                }),

		// In dev mode, call `npm run start` once
		// the bundle has been generated
		!production && serve(),

		// Watch the `public` directory and refresh the
		// browser on changes when not in production
		!production && livereload('public'),

		// If we're building for production (npm run build
		// instead of npm run dev), minify
		production && terser()
	],
	watch: {
		clearScreen: false
	}
};

function serve() {
	let started = false;

	return {
		writeBundle() {
			if (!started) {
				started = true;

				require('child_process').spawn('npm', ['run', 'start', '--', '--dev'], {
					stdio: ['ignore', 'inherit', 'inherit'],
					shell: true
				});
			}
		}
	};
}