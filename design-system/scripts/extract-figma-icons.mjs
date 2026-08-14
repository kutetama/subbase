import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const figma = JSON.parse(fs.readFileSync(path.join(root, 'figma-source/subbase.fig.json'), 'utf8'));
const output = path.join(root, 'src/assets/figma/metaphor-icons.svg');

function find(node, id) {
  if (node.id === id) return node;
  for (const child of node.children ?? []) {
    const result = find(child, id);
    if (result) return result;
  }
}

const slug = (name) => name.replace('Iconography / Metaphor / ', '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const matrix = (transform) => transform ? `matrix(${transform[0][0]} ${transform[1][0]} ${transform[0][1]} ${transform[1][1]} ${transform[0][2]} ${transform[1][2]})` : null;
const visibleSolid = (paints) => (paints ?? []).some((paint) => paint.visible !== false && paint.type === 'SOLID');

function render(node, rootNode = false) {
  const shapes = [];
  if (visibleSolid(node.fills)) for (const geometry of node.fillGeometry ?? []) shapes.push(`<path d="${geometry.path}" fill="currentColor" fill-rule="${geometry.windingRule === 'EVENODD' ? 'evenodd' : 'nonzero'}"/>`);
  if (visibleSolid(node.strokes)) for (const geometry of node.strokeGeometry ?? []) shapes.push(`<path d="${geometry.path}" fill="currentColor" fill-rule="${geometry.windingRule === 'EVENODD' ? 'evenodd' : 'nonzero'}"/>`);
  for (const child of node.children ?? []) shapes.push(render(child));
  const body = shapes.join('');
  const transform = rootNode ? null : matrix(node.relativeTransform);
  return transform ? `<g transform="${transform}">${body}</g>` : body;
}

const frame = find(figma.document, '33:4208');
const icons = frame.children.filter((node) => node.type === 'COMPONENT' && node.name.startsWith('Iconography / Metaphor /'));
const symbols = icons.map((icon) => `<symbol id="${slug(icon.name)}" viewBox="0 0 24 24">${render(icon, true)}</symbol>`).join('');
fs.writeFileSync(output, `<svg xmlns="http://www.w3.org/2000/svg"><defs>${symbols}</defs></svg>\n`);
console.log(`Figma Metaphor SVG 생성 — ${icons.length}개: ${output}`);
