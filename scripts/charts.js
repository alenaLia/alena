// Simple custom line chart that pulls hourly data from mock.json and draws it on a canvas
document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('trend-canvas');
	const statusEl = document.getElementById('chart-status');

	if (!canvas || !canvas.getContext) {
		if (statusEl) statusEl.textContent = 'Canvas not supported in this browser.';
		return;
	}

	fetch('data/mock.json')
		.then((res) => res.json())
		.then((entries) => {
			if (!Array.isArray(entries) || entries.length === 0) {
				throw new Error('No data points found');
			}

			const points = entries
				.map((entry) => {
					const date = new Date(entry.timestamp);
					return {
						date,
						label: formatHour(date),
						value: Number(entry.busyness) || 0
					};
				})
				.sort((a, b) => a.date - b.date);

			drawLineChart(canvas, points);

			if (statusEl && points.length) {
				const displayDate = points[0].date.toLocaleDateString(undefined, {
					weekday: 'short',
					month: 'short',
					day: 'numeric'
				});
				statusEl.textContent = `Sunday, November 30 (8 AM - 8 PM).`;
			}
		})
		.catch((error) => {
			console.error('Unable to load chart data', error);
			if (statusEl) {
				statusEl.textContent = 'Unable to load chart data right now. Pretend it looks amazing though!';
			}
		});
});

function drawLineChart(canvas, points) {
	const ctx = canvas.getContext('2d');
	const width = canvas.width;
	const height = canvas.height;
	const padding = 50;
	const minValue = 0;
	const maxValue = 5;

	ctx.clearRect(0, 0, width, height);

	const gradient = ctx.createLinearGradient(0, 0, 0, height);
	gradient.addColorStop(0, '#ffffff');
	gradient.addColorStop(1, '#e0e7ff');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);

	drawGrid(ctx, { width, height, padding, minValue, maxValue }, points.length);
	drawAxes(ctx, { width, height, padding });

	ctx.lineWidth = 3;
	ctx.strokeStyle = '#4f46e5';
	ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
	ctx.beginPath();

	points.forEach((point, index) => {
		const { x, y } = mapPoint(index, points.length, point.value, { width, height, padding, minValue, maxValue });
		if (index === 0) {
			ctx.moveTo(x, y);
		} else {
			ctx.lineTo(x, y);
		}
	});

	ctx.stroke();

	// Fill under the line for a softer look
	const lastX = padding + (points.length - 1) * stepSize(width, padding, points.length);
	ctx.lineTo(lastX, height - padding);
	ctx.lineTo(padding, height - padding);
	ctx.closePath();
	ctx.fill();

	// Plot each point with a contrasting outline and label
	points.forEach((point, index) => {
		const { x, y } = mapPoint(index, points.length, point.value, { width, height, padding, minValue, maxValue });
		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = '#ef4444';
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(x, y, 5, 0, Math.PI * 2);
		ctx.fill();
		ctx.stroke();

		ctx.fillStyle = '#111827';
		ctx.font = '12px Arial';
		ctx.textAlign = 'center';
		ctx.fillText(point.value.toString(), x, y - 10);

		ctx.fillStyle = '#4b5563';
		ctx.fillText(point.label, x, height - padding + 18);
	});
}

function drawGrid(ctx, { width, height, padding, minValue, maxValue }, count) {
	ctx.strokeStyle = '#dbe1f0';
	ctx.lineWidth = 1;
	ctx.font = '12px Arial';
	ctx.fillStyle = '#6b7280';

	for (let value = minValue; value <= maxValue; value += 1) {
		const y = valueToY(value, { height, padding, minValue, maxValue });
		ctx.beginPath();
		ctx.moveTo(padding, y);
		ctx.lineTo(width - padding, y);
		ctx.stroke();
		if (value > 0) {
			ctx.fillText(value.toString(), padding - 30, y + 4);
		}
	}

	const step = stepSize(width, padding, count);
	for (let index = 0; index < count; index += 1) {
		const x = padding + index * step;
		ctx.beginPath();
		ctx.moveTo(x, padding);
		ctx.lineTo(x, height - padding);
		ctx.stroke();
	}
}

function drawAxes(ctx, { width, height, padding }) {
	ctx.strokeStyle = '#94a3b8';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(padding, padding);
	ctx.lineTo(padding, height - padding);
	ctx.lineTo(width - padding, height - padding);
	ctx.stroke();

	ctx.save();
	ctx.translate(padding - 40, height / 2);
	ctx.rotate(-Math.PI / 2);
	ctx.textAlign = 'center';
	ctx.fillStyle = '#111827';
	ctx.font = '14px Arial';
	ctx.fillText('Busyness Level (1-5)', 0, 0);
	ctx.restore();
}

function valueToY(value, { height, padding, minValue, maxValue }) {
	const ratio = (value - minValue) / (maxValue - minValue);
	const plotHeight = height - padding * 2;
	return height - padding - ratio * plotHeight;
}

function mapPoint(index, total, value, { width, height, padding, minValue, maxValue }) {
	const x = padding + index * stepSize(width, padding, total);
	const y = valueToY(value, { height, padding, minValue, maxValue });
	return { x, y };
}

function stepSize(width, padding, total) {
	return total > 1 ? (width - padding * 2) / (total - 1) : 0;
}

function formatHour(date) {
	const hour = date.getHours();
	const suffix = hour >= 12 ? ' PM' : ' AM';
	const normalized = hour % 12 || 12;
	return `${normalized}${suffix}`;
}
