// Simple line chart from mock.json
document.addEventListener('DOMContentLoaded', () => {
	const canvas = document.getElementById('trend-canvas');
	const status = document.getElementById('chart-status');

	if (!canvas || !canvas.getContext) {
		if (status) status.textContent = 'Canvas not supported in this browser.';
		return;
	}

	fetch('data/mock.json')
		.then(res => res.json())
		.then(data => {
			if (!data || data.length === 0) throw new Error('No data');
			
			drawChart(canvas, data);
			if (status) status.textContent = 'Sunday, November 30 (8 AM - 8 PM).';
		})
		.catch(error => {
			console.error('Unable to load chart data', error);
			if (status) status.textContent = 'Unable to load chart data right now. Pretend it looks amazing though!';
		});
});

function drawChart(canvas, data) {
	const ctx = canvas.getContext('2d');
	const w = canvas.width;
	const h = canvas.height;
	const pad = 50;
	
	ctx.clearRect(0, 0, w, h);
	
	// Background gradient
	const gradient = ctx.createLinearGradient(0, 0, 0, h);
	gradient.addColorStop(0, '#ffffff');
	gradient.addColorStop(1, '#e0e7ff');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, w, h);
	
	// Grid lines
	ctx.strokeStyle = '#dbe1f0';
	ctx.lineWidth = 1;
	ctx.font = '12px Arial';
	ctx.fillStyle = '#6b7280';
	
	for (let i = 0; i <= 5; i++) {
		const y = h - pad - (i / 5) * (h - pad * 2);
		ctx.beginPath();
		ctx.moveTo(pad, y);
		ctx.lineTo(w - pad, y);
		ctx.stroke();
		if (i > 0) ctx.fillText(i.toString(), pad - 30, y + 4);
	}
	
	const step = (w - pad * 2) / (data.length - 1);
	for (let i = 0; i < data.length; i++) {
		const x = pad + i * step;
		ctx.beginPath();
		ctx.moveTo(x, pad);
		ctx.lineTo(x, h - pad);
		ctx.stroke();
	}
	
	// Axes
	ctx.strokeStyle = '#94a3b8';
	ctx.lineWidth = 2;
	ctx.beginPath();
	ctx.moveTo(pad, pad);
	ctx.lineTo(pad, h - pad);
	ctx.lineTo(w - pad, h - pad);
	ctx.stroke();
	
	// Y-axis label
	ctx.save();
	ctx.translate(pad - 40, h / 2);
	ctx.rotate(-Math.PI / 2);
	ctx.textAlign = 'center';
	ctx.fillStyle = '#111827';
	ctx.font = '14px Arial';
	ctx.fillText('Busyness Level (1-5)', 0, 0);
	ctx.restore();
	
	// Draw line and fill
	ctx.lineWidth = 3;
	ctx.strokeStyle = '#4f46e5';
	ctx.fillStyle = 'rgba(99, 102, 241, 0.25)';
	ctx.beginPath();
	
	data.forEach((entry, i) => {
		const x = pad + i * step;
		const y = h - pad - (entry.busyness / 5) * (h - pad * 2);
		if (i === 0) ctx.moveTo(x, y);
		else ctx.lineTo(x, y);
	});
	
	ctx.stroke();
	ctx.lineTo(pad + (data.length - 1) * step, h - pad);
	ctx.lineTo(pad, h - pad);
	ctx.closePath();
	ctx.fill();
	
	// Draw points and labels
	data.forEach((entry, i) => {
		const x = pad + i * step;
		const y = h - pad - (entry.busyness / 5) * (h - pad * 2);
		
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
		ctx.fillText(entry.busyness.toString(), x, y - 10);
		
		const date = new Date(entry.timestamp);
		const hour = date.getHours();
		const label = (hour % 12 || 12) + (hour >= 12 ? ' PM' : ' AM');
		ctx.fillStyle = '#4b5563';
		ctx.fillText(label, x, h - pad + 18);
	});
}

