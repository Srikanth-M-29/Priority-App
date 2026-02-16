// NEW STATE STRUCTURE
let state = JSON.parse(localStorage.getItem('principalData')) || {
    revenue: 0,
    goal: 500000,
    dailyTasks: { task1: false, task2: false, task3: false },
    history: [] // This is where Day 1, Day 2, etc. live
};

// NEW FUNCTION: End the day and track progress
function sealDay() {
    const today = new Date().toLocaleDateString();
    
    // Create a snapshot of today
    const daySnapshot = {
        date: today,
        revenueAtDate: state.revenue,
        tasksDone: Object.values(state.dailyTasks).filter(v => v).length,
        isSuccess: Object.values(state.dailyTasks).every(v => v)
    };

    // Add to history if it's a new day
    state.history.unshift(daySnapshot); 
    
    // Reset daily tasks for tomorrow
    state.dailyTasks = { task1: false, task2: false, task3: false };
    
    save();
}

function renderHistory() {
    const container = document.getElementById('growth-timeline');
    container.innerHTML = state.history.map((day, index) => `
        <div class="history-card">
            <div class="day-count">DAY ${state.history.length - index}</div>
            <div class="day-stats">
                <span>📅 ${day.date}</span>
                <span>💰 Total: ₹${day.revenueAtDate.toLocaleString()}</span>
                <span>✅ Tasks: ${day.tasksDone}/3</span>
            </div>
            <div class="status-indicator ${day.isSuccess ? 'perfect' : 'partial'}"></div>
        </div>
    `).join('');
}
