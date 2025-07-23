// Theme colors
const COLORS = {
    background: '#1a1a1a',
    cardBg: '#2d2d2d',
    text: '#e0e0e0',
    textSecondary: '#999',
    border: '#404040',
    highlight: '#C56723',
    line: '#666',
    accent: '#C56723'
};

// Generate dummy time series data
function generateTimeSeriesData(points = 50, trend = 0.1) {
    const data = [];
    let value = Math.random() * 100;
    
    for (let i = 0; i < points; i++) {
        value += (Math.random() - 0.5) * 10 + trend;
        data.push(Math.max(0, value));
    }
    return data;
}

// Chart.js default settings
Chart.defaults.color = COLORS.text;
Chart.defaults.borderColor = COLORS.border;
Chart.defaults.backgroundColor = COLORS.cardBg;

// Initialize line charts
function initLineCharts() {
    const chartConfigs = [
        { id: 'chart1', color: '#c56723', trend: 0.2 },
        { id: 'chart2', color: '#c24d53', trend: 0.1 },
        { id: 'chart3', color: '#c56723', trend: -0.1 },
        { id: 'chart4', color: '#c24d53', trend: 0.05 },
        { id: 'chart5', color: '#c56723', trend: 0.15 },
        { id: 'chart6', color: '#c24d53', trend: 0.08 }
    ];

    chartConfigs.forEach(config => {
        const ctx = document.getElementById(config.id).getContext('2d');
        const data = generateTimeSeriesData(30, config.trend);
        
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: Array.from({ length: 30 }, (_, i) => i + 1),
                datasets: [{
                    data: data,
                    borderColor: config.color,
                    backgroundColor: config.color + '20',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 4,
                    pointHoverBackgroundColor: config.color,
                    pointHoverBorderColor: '#fff',
                    pointHoverBorderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    });
}

// Initialize circular progress charts
function initCircleCharts() {
    const circleConfigs = [
        { id: 'circle1', progress: 85, color: '#c56723' },
        { id: 'circle2', progress: 65, color: '#c24d53' },
        { id: 'circle3', progress: 45, color: '#c56723' },
        { id: 'circle4', progress: 35, color: '#c24d53' },
        { id: 'circle5', progress: 25, color: '#c56723' },
        { id: 'circle6', progress: 15, color: '#c24d53' }
    ];

    circleConfigs.forEach(config => {
        const ctx = document.getElementById(config.id).getContext('2d');
        
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [config.progress, 100 - config.progress],
                    backgroundColor: [config.color, '#2d2d2d'],
                    borderColor: [config.color, '#404040'],
                    borderWidth: 2,
                    cutout: '70%'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    });
}

// Initialize Mapbox map
function initMap() {
    // You'll need to replace this with your actual Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiZXZhbmRhcHBsZWdhdGUiLCJhIjoiY2tmbzA1cWM1MWozeTM4cXV4eHUwMzFhdiJ9.Z5f9p8jJD_N1MQwycF2NEw'; // Replace with actual token
    
    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/dark-v10',
        center: [-112.76078665736577, 32.11740901277048], // Alaska coordinates
        zoom: 10
    });



    // Add some dummy markers
    const markers = [
        { lng: -112.7298, lat: 32.1412, title: 'KZD-001', status: 'active' },
        { lng: -112.7398, lat: 32.1512, title: 'KZD-002', status: 'completed' },
        { lng: -112.7498, lat: 32.1612, title: 'KZD-003', status: 'planned' }
    ];

    map.on('load', () => {
        markers.forEach((marker, index) => {
            // Create a DOM element for the marker
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.cssText = `
                background-color: ${marker.status === 'active' ? '#c56723' : marker.status === 'completed' ? '#c24d53' : '#666'};
                width: 20px;
                height: 20px;
                border-radius: 50%;
                border: 2px solid #404040;
                cursor: pointer;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            `;

            // Add marker to map
            new mapboxgl.Marker(el)
                .setLngLat([marker.lng, marker.lat])
                .setPopup(new mapboxgl.Popup({ offset: 25 })
                    .setHTML(`
                        <div style="background: #2d2d2d; color: #e0e0e0; padding: 10px; border-radius: 4px;">
                            <h4>${marker.title}</h4>
                            <p>Status: ${marker.status}</p>
                        </div>
                    `))
                .addTo(map);
        });
    });

    // Handle case where mapbox token is not set
    map.on('error', (e) => {
        console.warn('Mapbox error - likely due to missing access token');
        document.getElementById('map').innerHTML = `
            <div style="display: flex; align-items: center; justify-content: center; height: 100%; background: #333; color: #999;">
                <div style="text-align: center;">
                    <h3>Map View</h3>
                    <p>Add your Mapbox access token to dashboard.js</p>
                </div>
            </div>
        `;
    });
}

// Initialize dashboard
document.addEventListener('DOMContentLoaded', () => {
    initLineCharts();
    initCircleCharts();
    initMap();
});

// Dropdown functionality
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId + '-dropdown');
    dropdown.classList.toggle('show');
    
    // Close other dropdowns
    document.querySelectorAll('.dropdown-content').forEach(content => {
        if (content.id !== dropdownId + '-dropdown') {
            content.classList.remove('show');
        }
    });
}

function selectDropdownItem(dropdownId, value) {
    // Update button text
    const button = document.querySelector(`[onclick="toggleDropdown('${dropdownId}')"] span`);
    button.textContent = value;
    
    // Update selected state
    const dropdown = document.getElementById(dropdownId + '-dropdown');
    dropdown.querySelectorAll('.dropdown-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    const selectedItem = Array.from(dropdown.querySelectorAll('.dropdown-item'))
        .find(item => item.textContent === value);
    if (selectedItem) {
        selectedItem.classList.add('selected');
    }
    
    // Close dropdown
    dropdown.classList.remove('show');
}

// Close dropdowns when clicking outside
document.addEventListener('click', (event) => {
    if (!event.target.closest('.dropdown')) {
        document.querySelectorAll('.dropdown-content').forEach(content => {
            content.classList.remove('show');
        });
    }
}); 