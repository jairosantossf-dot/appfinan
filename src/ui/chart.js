// Donut chart using Canvas API — implemented in Stage 6 (Summary)

/**
 * Renders a donut chart on a <canvas> element.
 * @param {HTMLCanvasElement} canvas
 * @param {Array<{label:string, value:number, color:string}>} segments
 * @param {string} [centerText] - optional text to show in the center
 */
export function drawDonut(canvas, segments, centerText = '') {
  const dpr  = window.devicePixelRatio || 1;
  const size = canvas.clientWidth || 200;
  canvas.width  = size * dpr;
  canvas.height = size * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2 - 4;
  const innerR = outerR * 0.65;

  const total = segments.reduce((s, seg) => s + Math.max(0, seg.value), 0);

  if (total === 0) {
    // Draw empty state ring
    ctx.beginPath();
    ctx.arc(cx, cy, outerR, 0, Math.PI * 2);
    ctx.arc(cx, cy, innerR, 0, Math.PI * 2, true);
    const isDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
    ctx.fillStyle = isDark ? '#334155' : '#e2e8f0';
    ctx.fill();

    ctx.fillStyle = isDark ? '#94a3b8' : '#94a3b8';
    ctx.font = `600 ${size * 0.1}px -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('Sin datos', cx, cy);
    return;
  }

  let startAngle = -Math.PI / 2;
  segments.forEach(seg => {
    const slice = (seg.value / total) * Math.PI * 2;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.arc(cx, cy, outerR, startAngle, startAngle + slice);
    ctx.arc(cx, cy, innerR, startAngle + slice, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = seg.color;
    ctx.fill();
    startAngle += slice;
  });

  // Center text
  if (centerText) {
    const isDark = window.matchMedia('(prefers-color-scheme:dark)').matches;
    ctx.fillStyle = isDark ? '#f1f5f9' : '#0f172a';
    ctx.font = `700 ${size * 0.13}px -apple-system, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(centerText, cx, cy);
  }
}
