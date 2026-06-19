export function run(input) {
  const num = (v, name) => {
    if (typeof v !== 'number' || !isFinite(v)) throw new TypeError(name + ' must be a finite number');
    return v;
  };
  if (input === null || typeof input !== 'object' || Array.isArray(input)) throw new TypeError('input must be an object');
  const width = num(input.width, 'width');
  const height = num(input.height, 'height');
  if (width < 0 || height < 0) throw new RangeError('width and height must be >= 0');
  const direction = input.direction === undefined ? 'row' : input.direction;
  if (direction !== 'row' && direction !== 'column') throw new RangeError("direction must be 'row' or 'column'");
  const gap = input.gap === undefined ? 0 : num(input.gap, 'gap');
  const padding = input.padding === undefined ? 0 : num(input.padding, 'padding');
  const justify = input.justify === undefined ? 'start' : input.justify;
  const align = input.align === undefined ? 'start' : input.align;
  const validJustify = ['start', 'center', 'end', 'space-between', 'space-around'];
  const validAlign = ['start', 'center', 'end', 'stretch'];
  if (!validJustify.includes(justify)) throw new RangeError('invalid justify: ' + justify);
  if (!validAlign.includes(align)) throw new RangeError('invalid align: ' + align);
  const children = input.children === undefined ? [] : input.children;
  if (!Array.isArray(children)) throw new TypeError('children must be an array');
  const n = children.length;
  if (n === 0) return [];
  const isRow = direction === 'row';
  const mainTotal = isRow ? width : height;
  const crossTotal = isRow ? height : width;
  const availMain = Math.max(0, mainTotal - 2 * padding);
  const availCross = Math.max(0, crossTotal - 2 * padding);
  const sizes = children.map((c, i) => {
    if (c === null || typeof c !== 'object' || Array.isArray(c)) throw new TypeError('child must be an object at index ' + i);
    const s = num(c.size, 'children[' + i + '].size');
    if (s < 0) throw new RangeError('children[' + i + '].size must be >= 0');
    return s;
  });
  const sumSizes = sizes.reduce((a, b) => a + b, 0);
  const totalGap = gap * (n - 1);
  const free = availMain - sumSizes - totalGap;
  let offset = padding;
  let spacing = gap;
  if (justify === 'center') offset = padding + free / 2;
  else if (justify === 'end') offset = padding + free;
  else if (justify === 'space-between') { if (n > 1) spacing = gap + free / (n - 1); }
  else if (justify === 'space-around') { const each = free / n; offset = padding + each / 2; spacing = gap + each; }
  const result = [];
  let cursor = offset;
  for (let i = 0; i < n; i++) {
    const c = children[i];
    const mainSize = sizes[i];
    let crossSize;
    if (align === 'stretch') crossSize = availCross;
    else crossSize = c.cross === undefined ? availCross : num(c.cross, 'children[' + i + '].cross');
    let crossPos = padding;
    if (align === 'center') crossPos = padding + (availCross - crossSize) / 2;
    else if (align === 'end') crossPos = padding + (availCross - crossSize);
    const box = {
      id: c.id === undefined ? i : c.id,
      x: isRow ? cursor : crossPos,
      y: isRow ? crossPos : cursor,
      width: isRow ? mainSize : crossSize,
      height: isRow ? crossSize : mainSize
    };
    result.push(box);
    cursor += mainSize + spacing;
  }
  return result;
}
