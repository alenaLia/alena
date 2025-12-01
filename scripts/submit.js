// Simple submit-page interactions: update range label, list submissions, show silly alert
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('crowd-report-form');
    if (!form) return;

    const floorSelect = document.getElementById('floor');
    const busynessInput = document.getElementById('busyness');
    const busynessLabel = document.getElementById('busyness-label');
    const notesInput = document.getElementById('notes');
    const reportList = document.getElementById('report-list');

    const updateBusynessLabel = () => {
        if (busynessLabel && busynessInput) {
            busynessLabel.textContent = busynessInput.value;
        }
    };

    const addReportToList = (report) => {
        if (!reportList) return;

        // remove placeholder text when first real submission arrives
        if (reportList.children.length === 1 && reportList.firstElementChild.textContent.includes('No reports')) {
            reportList.innerHTML = '';
        }

        const listItem = document.createElement('li');
        const noteText = report.notes ? ` — ${report.notes}` : ' — No extra notes';
        listItem.textContent = `${report.floor} | Busy level ${report.busyness}/5${noteText}`;
        reportList.prepend(listItem);
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        if (!floorSelect.value) {
            alert('Please pick a floor before sending your report.');
            return;
        }

        const report = {
            floor: floorSelect.value,
            busyness: busynessInput?.value || '3',
            notes: notesInput.value.trim()
        };

        addReportToList(report);
        alert('Thanks! Your response has been carefully discarded because this is a demo project.');

        form.reset();
        if (busynessInput) {
            busynessInput.value = '3';
        }
        updateBusynessLabel();
    });

    form.addEventListener('reset', () => {
        // wait for default values to return, then update label
        window.requestAnimationFrame(updateBusynessLabel);
    });

    busynessInput?.addEventListener('input', updateBusynessLabel);
    updateBusynessLabel();
});
