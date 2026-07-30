/**
 * BAHER SILVER ERP — SPARKLINE & MINI CHARTS COMPONENT MODULE
 */
const Charts = {
  renderSparkline(points = [10, 25, 18, 30, 45, 40, 60], width = 120, height = 36, color = '#C3B097') {
    const min = Math.min(...points);
    const max = Math.max(...points);
    const len = points.length - 1;

    const pathPoints = points.map((p, idx) => {
      const x = (idx / len) * width;
      const y = height - ((p - min) / (max - min || 1)) * height;
      return `${x},${y}`;
    }).join(' L ');

    return `
      <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" class="overflow-visible">
        <path d="M ${pathPoints}" fill="none" stroke="${color}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
      </svg>
    `;
  }
};
