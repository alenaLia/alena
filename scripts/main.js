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
    card.className = 'floor-card';
    
    const crowdLevel = getCrowdLevel(floor.occupancy);
    const crowdText = getCrowdText(floor.occupancy);
    
    card.innerHTML = `
        <h3>Floor ${floor.floor}</h3>
        <div class="crowd-level">${Math.round(floor.occupancy)}%</div>
        <p>${crowdText}</p>
        <div class="crowd-indicator">
            <div class="crowd-indicator-fill crowd-${crowdLevel}" 
                 style="width: ${floor.occupancy}%"
                 role="progressbar" 
                 aria-valuenow="${floor.occupancy}" 
                 aria-valuemin="0" 
                 aria-valuemax="100">
            </div>
        </div>
        <p style="margin-top: 0.5rem; font-size: 0.875rem;">
            ${floor.reportCount || 0} recent reports
        </p>
    `;
    
    return card;
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

document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme toggle
    initThemeToggle();
    
    // Update timestamp
    updateLastUpdateTime();
    
    // Load and display floor data (will be replaced by actual data loading)
    // For now, check if data.js provides a loadData function
    if (typeof loadData === 'function') {
        loadData().then(data => {
            if (data && data.floors) {
                renderFloorCards(data.floors);
            }
        }).catch(error => {
            console.error('Error loading data:', error);
        });
    }
    
    // Update time every minute
    setInterval(updateLastUpdateTime, 60000);
});