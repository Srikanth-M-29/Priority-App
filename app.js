// Data Structure
let state = JSON.parse(localStorage.getItem('principalData')) || {
    revenue: 0,
    goal: 500000,
    tasks: { task1: false, task2: false, task3: false },
    history: []
};

// Start the App
function init() {
    render();
}

function addRevenue(amount) {
    state.revenue += amount;
    save();
}

function toggleTask(id) {
    state.tasks[id] = !state.tasks[id];
    save();
}

function sealDay() {
    const today = new Date().toLocaleDateString();
    const tasksDone = Object.values(state.tasks).filter(v => v).length;
    
    const snapshot = {
        date: today,
        revenue: state.revenue,
        tasksDone: tasksDone,
        success: tasksDone === 3
    };

    state.history.unshift(snapshot);
    state.tasks = { task1: false, task2: false, task3: false };
    save();
    alert("Day Sealed! History Updated.");
}

function save() {
    localStorage.setItem('principalData', JSON.stringify(state));
    render();
}

function render() {
    // 1. Update Revenue Bar
    const percent = Math.min((state.revenue / state.goal) * 100, 100);
    document.getElementById('revenue-bar').style.width = percent + "%";
    document.getElementById('revenue-percent').innerText = Math.round(percent) + "%";

    // 2. Update Task Buttons
    for (let id in state.tasks) {
        const btn = document.getElementById(id);
        if (state.tasks[id]) btn.classList.add('completed');
        else btn.classList.remove('completed');
    }

    // 3. Render History
    const historyDiv = document.getElementById('growth-timeline');
    historyDiv.innerHTML = state.history.map((day, index) => `
        <div class="history-card ${day.success ? 'perfect' : ''}">
            <div>
                <small>${day.date}</small><br>
                <b>₹${day.revenue.toLocaleString()}</b>
            </div>
            <span>${day.tasksDone}/3 Tasks</span>
        </div>
    `).join('');

    // 4. AI Roast
    const roast = document.getElementById('ai-roast');
    if (percent < 5) roast.innerText = "Revenue is low. Stop scrolling, start selling.";
    else if (state.history.length > 0 && state.history[0].success) roast.innerText = "Solid yesterday. Keep the momentum, Principal.";
    else roast.innerText = "Stage prizes don't come to lazy architects.";
}

window.onload = init;
