import fs from 'node:fs';

const COLORS = ['primary', 'secondary', 'tertiary', 'success', 'warning', 'error', 'surface'];
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950'];

const builtins = new Set([
	'preset-tonal',
	...COLORS.flatMap((c) => [
		`preset-tonal-${c}`,
		...SHADES.map((s) => `preset-outlined-${c}-${s}`),
		...SHADES.map((s) => `preset-filled-${c}-${s}`),
		...SHADES.flatMap((s1) => SHADES.map((s2) => `preset-filled-${c}-${s1}-${s2}`)),
	]),
]);

function loadCustomPresets() {
	try {
		const css = fs.readFileSync('src/app.css', 'utf8');
		return new Set([...css.matchAll(/\.(preset-[\w-]+)/g)].map((m) => m[1]));
	} catch {
		return new Set();
	}
}

// Initialized once per lint run
const allowed = new Set([...builtins, ...loadCustomPresets()]);

/** @type {import('eslint').Rule.RuleModule} */
export default {
	meta: {
		type: 'problem',
		docs: {
			description:
				'Validate preset-* classes against the Skeleton allowlist and custom presets in app.css.',
		},
		schema: [],
	},
	create(context) {
		return {
			SvelteAttribute(node) {
				if (node.key.name !== 'class') return;
				for (const part of node.value) {
					if (part.type !== 'SvelteLiteral') continue;
					for (const token of part.value.split(/\s+/).filter(Boolean)) {
						if (token.startsWith('preset-') && !allowed.has(token)) {
							context.report({
								node,
								message: `Unknown preset '${token}' — not in Skeleton built-ins or custom presets in app.css.`,
							});
						}
					}
				}
			},
		};
	},
};
