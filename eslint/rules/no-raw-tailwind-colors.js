const FORBIDDEN_COLORS = [
	'red',
	'green',
	'blue',
	'yellow',
	'orange',
	'amber',
	'lime',
	'emerald',
	'teal',
	'cyan',
	'sky',
	'indigo',
	'violet',
	'purple',
	'fuchsia',
	'pink',
	'rose',
	'gray',
	'zinc',
	'slate',
	'stone',
	'neutral',
];
const PREFIXES = [
	'bg',
	'text',
	'border',
	'ring',
	'fill',
	'stroke',
	'shadow',
	'outline',
	'accent',
	'caret',
	'divide',
	'placeholder',
];
const RE = new RegExp(`^(${PREFIXES.join('|')})-(?!opacity)(${FORBIDDEN_COLORS.join('|')})-\\d+`);

/** @type {import('eslint').Rule.RuleModule} */
export default {
	meta: {
		type: 'problem',
		docs: { description: 'Disallow raw Tailwind palette colors — use Skeleton presets instead.' },
		schema: [],
	},
	create(context) {
		return {
			SvelteAttribute(node) {
				if (node.key.name !== 'class') return;
				for (const part of node.value) {
					if (part.type !== 'SvelteLiteral') continue;
					for (const token of part.value.split(/\s+/).filter(Boolean)) {
						if (RE.test(token)) {
							context.report({
								node,
								message: `Raw Tailwind color '${token}' — use a Skeleton preset instead.`,
							});
						}
					}
				}
			},
		};
	},
};
