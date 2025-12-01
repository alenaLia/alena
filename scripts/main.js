/**
 * OpenSeat - Main JavaScript
 * Handles theme toggling, data loading, and UI updates
 */

// ============================================
// Theme Toggle Functionality
// ============================================

function initThemeToggle() {
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('.theme-icon');
    
    // Check for saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
    }
    updateThemeIcon(savedTheme, themeIcon);
    
    // Toggle theme on button click
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.contains('dark-mode');
        const newTheme = isDark ? 'light' : 'dark';
        
        if (newTheme === 'dark') {
            document.body.classList.add('dark-mode');
        } else {
            document.body.classList.remove('dark-mode');
        }
        
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme, themeIcon);
    });
}

function updateThemeIcon(theme, iconElement) {
    iconElement.textContent = theme === 'light' ? '🌙' : '☀️';
}

// ============================================
// Data Loading & Display
// ============================================

async function loadData() {
    try {
        const response = await fetch('data/mock.json');
        const data = await response.json();
        
        // Group data by floor
        const floorMap = {};
        data.forEach(entry => {
            if (!floorMap[entry.floor]) {
                floorMap[entry.floor] = [];
            }
            floorMap[entry.floor].push(entry);
        });
        
        // Calculate average busyness and report count for each floor
        const floors = [];
        for (const floorName in floorMap) {
            const entries = floorMap[floorName];
            const totalBusyness = entries.reduce((sum, e) => sum + e.busyness, 0);
            const avgBusyness = Math.round(totalBusyness / entries.length);
            
            // Extract floor number from name (e.g., "1st Floor" -> 1)
            const floorNum = parseInt(floorName);
            
            floors.push({
                floor: floorNum,
                score: avgBusyness,
                reportCount: entries.length
            });
        }
        
        // Sort by floor number
        floors.sort((a, b) => a.floor - b.floor);
        
        return { floors };
    } catch (error) {
        console.error('Error loading data:', error);
        return null;
    }
}

function updateLastUpdateTime() {
    const timeElement = document.getElementById('last-update-time');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', { 
            hour: 'numeric', 
            minute: '2-digit',
            hour12: true 
        });
        timeElement.textContent = timeString;
    }
}

function renderFloorCards(floorData) {
    const floorList = document.getElementById('floor-list');
    if (!floorList) return;
    
    // Clear loading message
    floorList.innerHTML = '';
    
    // Create floor cards
    floorData.forEach(floor => {
        const card = createFloorCard(floor);
        floorList.appendChild(card);
    });
}

function createFloorCard(floor) {
    const card = document.createElement('div');
    card.className = 'floor-card floor-card--square';

    const crowdScore = getCrowdScore(floor);
    const occupancyPercent = typeof floor.occupancy === 'number'
        ? floor.occupancy
        : (crowdScore / 5) * 100;
    const crowdText = getCrowdText(occupancyPercent);

    card.innerHTML = `
        <h3>Floor ${floor.floor}</h3>
        <p class="crowd-score">${crowdScore} / 5</p>
        <p class="crowd-description">${crowdText}</p>
        <p class="card-meta">${floor.reportCount || 0} recent reports</p>
    `;

    return card;
}

function getCrowdScore(floor) {
    const rawScore = typeof floor.score === 'number'
        ? floor.score
        : typeof floor.busyness === 'number'
            ? floor.busyness
            : typeof floor.occupancy === 'number'
                ? (floor.occupancy / 100) * 5
                : 3;

    return Math.max(1, Math.min(5, Math.round(rawScore)));
}

function getCrowdLevel(occupancy) {
    if (occupancy < 40) return 'low';
    if (occupancy < 70) return 'medium';
    return 'high';
}

function getCrowdText(occupancy) {
    if (occupancy < 20) return '🟢 Very Quiet';
    if (occupancy < 40) return '🟢 Quiet';
    if (occupancy < 60) return '🟡 Moderate';
    if (occupancy < 80) return '🟠 Busy';
    return '🔴 Very Crowded';
}

// ============================================
// Initialization
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
    // Initialize theme toggle
    initThemeToggle();
    
    // Update timestamp
    updateLastUpdateTime();
    
    // Load and display floor data from mock.json
    const data = await loadData();
    if (data && data.floors) {
        renderFloorCards(data.floors);
    } else {
        // Fallback data if loading fails
        const sampleFloors = [
            { floor: 1, score: 2, reportCount: 4 },
            { floor: 2, score: 3, reportCount: 6 },
            { floor: 3, score: 5, reportCount: 9 }
        ];
        renderFloorCards(sampleFloors);
    }
    
    // Update time every minute
    setInterval(updateLastUpdateTime, 60000);
});