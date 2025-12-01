// Submit page form interactions
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('crowd-report-form');
    if (!form) return;

    const floor = document.getElementById('floor');
    const busyness = document.getElementById('busyness');
    const label = document.getElementById('busyness-label');
    const notes = document.getElementById('notes');
    const list = document.getElementById('report-list');

    const updateLabel = () => {
        if (label && busyness) label.textContent = busyness.value;
    };

    const addReport = (report) => {
        if (!list) return;

        if (list.children.length === 1 && list.firstElementChild.textContent.includes('No reports')) {
            list.innerHTML = '';
        }

        const item = document.createElement('li');
        const noteText = report.notes ? ` — ${report.notes}` : ' — No extra notes';
        item.textContent = `${report.floor} | Busy level ${report.busyness}/5${noteText}`;
        list.prepend(item);
    };

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        if (!floor.value) {
            alert('Please pick a floor before sending your report.');
            return;
        }

        addReport({
            floor: floor.value,
            busyness: busyness.value || '3',
            notes: notes.value.trim()
        });

        alert('Thanks! Your response has been carefully discarded because this is a demo project.');
        form.reset();
        busyness.value = '3';
        updateLabel();
    });

    form.addEventListener('reset', () => {
        requestAnimationFrame(updateLabel);
    });

    busyness.addEventListener('input', updateLabel);
    updateLabel();
});
