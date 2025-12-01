// OpenSeat - Main JavaScript

// Shrinking Header on Scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('header');
    if (window.scrollY > 50) {
        header.classList.add('header--scrolled');
    } else {
        header.classList.remove('header--scrolled');
    }
});

// Theme Toggle
function initThemeToggle() {
    const toggle = document.getElementById('theme-toggle');
    const icon = toggle.querySelector('.theme-icon');
    
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        icon.textContent = '☀️';
    } else {
        icon.textContent = '🌙';
    }
    
    toggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        icon.textContent = isDark ? '☀️' : '🌙';
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// Data Loading
async function loadData() {
    try {
        const response = await fetch('data/mock.json');
        const data = await response.json();
        
        const floorMap = {};
        data.forEach(entry => {
            if (!floorMap[entry.floor]) {
                floorMap[entry.floor] = [];
            }
            floorMap[entry.floor].push(entry);
        });
        
        const floors = [];
        for (const floorName in floorMap) {
            const entries = floorMap[floorName];
            const total = entries.reduce((sum, e) => sum + e.busyness, 0);
            const avg = Math.round(total / entries.length);
            
            floors.push({
                floor: parseInt(floorName),
                score: avg,
                reportCount: entries.length
            });
        }
        
        floors.sort((a, b) => a.floor - b.floor);
        return { floors };
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

function updateLastUpdateTime() {
    const timeEl = document.getElementById('last-update-time');
    if (timeEl) {
        const now = new Date();
        timeEl.textContent = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
    }
}

function renderFloorCards(floorData) {
    const list = document.getElementById('floor-list');
    if (!list) return;
    
    list.innerHTML = '';
    floorData.forEach(floor => {
        list.appendChild(createFloorCard(floor));
    });
}

function createFloorCard(floor) {
    const card = document.createElement('div');
    card.className = 'floor-card floor-card--square';
    
    const score = floor.score || 3;
    const text = getCrowdText(score);

    card.innerHTML = `
        <h3>Floor ${floor.floor}</h3>
        <p class="crowd-score">${score} / 5</p>
        <p class="crowd-description">${text}</p>
        <p class="card-meta">${floor.reportCount || 0} recent reports</p>
    `;

    return card;
}

function getCrowdText(score) {
    if (score <= 1) return '🟢 Very Quiet';
    if (score === 2) return '🟢 Quiet';
    if (score === 3) return '🟡 Moderate';
    if (score === 4) return '🟠 Busy';
    return '🔴 Very Crowded';
}

// Initialization
document.addEventListener('DOMContentLoaded', async () => {
    initThemeToggle();
    updateLastUpdateTime();
    setInterval(updateLastUpdateTime, 60000);
    
    const data = await loadData();
    if (data && data.floors) {
        renderFloorCards(data.floors);
    } else {
        renderFloorCards([
            { floor: 1, score: 2, reportCount: 4 },
            { floor: 2, score: 3, reportCount: 6 },
            { floor: 3, score: 5, reportCount: 9 }
        ]);
    }
});