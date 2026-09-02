// Data timezone dengan offset dari UTC
const timezones = [
    { name: 'Jakarta (WIB)', offset: 7, abbr: 'WIB', emoji: '🇮🇩' },
    { name: 'Bangkok (ICT)', offset: 7, abbr: 'ICT', emoji: '🇹🇭' },
    { name: 'Singapore (SGT)', offset: 8, abbr: 'SGT', emoji: '🇸🇬' },
    { name: 'Manila (PHT)', offset: 8, abbr: 'PHT', emoji: '🇵🇭' },
    { name: 'Hong Kong (HKT)', offset: 8, abbr: 'HKT', emoji: '🇭🇰' },
    { name: 'Shanghai (CST)', offset: 8, abbr: 'CST', emoji: '🇨🇳' },
    { name: 'Tokyo (JST)', offset: 9, abbr: 'JST', emoji: '🇯🇵' },
    { name: 'Seoul (KST)', offset: 9, abbr: 'KST', emoji: '🇰🇷' },
    { name: 'Sydney (AEDT)', offset: 11, abbr: 'AEDT', emoji: '🇦🇺' },
    { name: 'Dubai (GST)', offset: 4, abbr: 'GST', emoji: '🇦🇪' },
    { name: 'London (GMT)', offset: 0, abbr: 'GMT', emoji: '🇬🇧' },
    { name: 'Paris (CET)', offset: 1, abbr: 'CET', emoji: '🇫🇷' },
    { name: 'New York (EST)', offset: -5, abbr: 'EST', emoji: '🇺🇸' },
    { name: 'Los Angeles (PST)', offset: -8, abbr: 'PST', emoji: '🇺🇸' },
    { name: 'São Paulo (BRT)', offset: -3, abbr: 'BRT', emoji: '🇧🇷' },
    { name: 'Moscow (MSK)', offset: 3, abbr: 'MSK', emoji: '🇷🇺' }
];

let currentFormat = '12'; // 12 atau 24 hour format
let currentView = 'digital'; // digital atau analog

function getTimeByTimezone(offset) {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const timezoneTime = new Date(utc + 3600000 * offset);
    return timezoneTime;
}

function formatTime(date, format) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    if (format === '12') {
        const h = hours % 12 || 12;
        const ampm = hours >= 12 ? 'PM' : 'AM';
        return `${String(h).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')} ${ampm}`;
    } else {
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
}

function getTimeSegments(date) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    
    let h = hours;
    let ampm = 'AM';
    
    if (currentFormat === '12') {
        h = hours % 12 || 12;
        ampm = hours >= 12 ? 'PM' : 'AM';
    }
    
    return {
        hours: String(h).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        ampm: ampm
    };
}

function createDigitalClockCard(tz) {
    const time = getTimeByTimezone(tz.offset);
    const timeStr = formatTime(time, currentFormat);
    const dateStr = time.toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const segments = getTimeSegments(time);
    
    return `
        <div class="clock-card" data-timezone="${tz.name}" data-offset="${tz.offset}">
            <div class="timezone-name">${tz.emoji} ${tz.name}</div>
            <div class="timezone-abbr">${tz.abbr}</div>
            <div class="digital-clock">${timeStr}</div>
            <div class="time-format">
                <div class="time-segment">
                    <label>Hours</label>
                    <strong>${segments.hours}</strong>
                </div>
                <div class="time-segment">
                    <label>Minutes</label>
                    <strong>${segments.minutes}</strong>
                </div>
                <div class="time-segment">
                    <label>Seconds</label>
                    <strong>${segments.seconds}</strong>
                </div>
                ${currentFormat === '12' ? `<div class="time-segment"><strong>${segments.ampm}</strong></div>` : ''}
            </div>
            <div class="date-time">${dateStr}</div>
        </div>
    `;
}

function createAnalogClockCard(tz) {
    const time = getTimeByTimezone(tz.offset);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const seconds = time.getSeconds();
    
    const secondDegrees = (seconds / 60) * 360;
    const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
    const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;
    
    const dateStr = time.toLocaleDateString('id-ID', { weekday: 'short', month: 'short', day: 'numeric' });
    const timeStr = formatTime(time, currentFormat);
    
    return `
        <div class="clock-card">
            <div class="timezone-name">${tz.emoji} ${tz.name}</div>
            <div class="timezone-abbr">${tz.abbr}</div>
            <div class="analog-clock">
                <div class="clock-number">
                    <span style="top: 10px;">12</span>
                    <span style="top: 50%; right: 10px; transform: translateX(0) translateY(-50%);">3</span>
                    <span style="bottom: 10px;">6</span>
                    <span style="top: 50%; left: 10px; transform: translateX(0) translateY(-50%);">9</span>
                </div>
                <div class="hand hour-hand" style="transform: rotate(${hourDegrees}deg);"></div>
                <div class="hand minute-hand" style="transform: rotate(${minuteDegrees}deg);"></div>
                <div class="hand second-hand" style="transform: rotate(${secondDegrees}deg);"></div>
                <div class="clock-center"></div>
            </div>
            <div style="font-weight: 600; color: #333; margin-top: 10px;">${timeStr}</div>
            <div style="font-size: 0.9em; color: #999;">${dateStr}</div>
        </div>
    `;
}

function initializeClocks() {
    const grid = document.getElementById('clockGrid');
    let html = '';
    
    timezones.forEach(tz => {
        if (currentView === 'digital') {
            html += createDigitalClockCard(tz);
        } else {
            html += createAnalogClockCard(tz);
        }
    });
    
    grid.innerHTML = html;
    grid.className = `clock-grid view-mode ${currentView}`;
}

function updateClocks() {
    const grid = document.getElementById('clockGrid');
    const cards = grid.querySelectorAll('.clock-card');
    
    cards.forEach((card, index) => {
        const tz = timezones[index];
        const time = getTimeByTimezone(tz.offset);
        
        if (currentView === 'digital') {
            const timeStr = formatTime(time, currentFormat);
            const segments = getTimeSegments(time);
            
            card.querySelector('.digital-clock').textContent = timeStr;
            
            const timeFormat = card.querySelector('.time-format');
            if (currentFormat === '12') {
                if (timeFormat.children.length === 3) {
                    const ampmDiv = document.createElement('div');
                    ampmDiv.className = 'time-segment';
                    ampmDiv.innerHTML = `<strong>${segments.ampm}</strong>`;
                    timeFormat.appendChild(ampmDiv);
                }
            } else {
                if (timeFormat.children.length === 4) {
                    timeFormat.removeChild(timeFormat.lastChild);
                }
            }
            
            Array.from(timeFormat.children).forEach((el, i) => {
                if (i === 0) el.querySelector('strong').textContent = segments.hours;
                else if (i === 1) el.querySelector('strong').textContent = segments.minutes;
                else if (i === 2) el.querySelector('strong').textContent = segments.seconds;
                else if (i === 3) el.querySelector('strong').textContent = segments.ampm;
            });
        } else {
            // Update analog clock
            const hours = time.getHours();
            const minutes = time.getMinutes();
            const seconds = time.getSeconds();
            
            const secondDegrees = (seconds / 60) * 360;
            const minuteDegrees = (minutes / 60) * 360 + (seconds / 60) * 6;
            const hourDegrees = (hours / 12) * 360 + (minutes / 60) * 30;
            
            const hands = card.querySelectorAll('.hand');
            hands[0].style.transform = `rotate(${hourDegrees}deg)`;
            hands[1].style.transform = `rotate(${minuteDegrees}deg)`;
            hands[2].style.transform = `rotate(${secondDegrees}deg)`;
            
            const timeStr = formatTime(time, currentFormat);
            const div = card.querySelector('div[style*="font-weight: 600"]');
            if (div) div.textContent = timeStr;
        }
    });
}

function setFormat(format) {
    currentFormat = format;
    
    // Update button state
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update clocks
    initializeClocks();
}

function setView(view) {
    currentView = view;
    
    // Update button state
    document.querySelectorAll('.view-toggle').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Update clocks
    initializeClocks();
}

// Initialize on load
window.addEventListener('load', () => {
    initializeClocks();
    
    // Update every second
    setInterval(updateClocks, 1000);
});