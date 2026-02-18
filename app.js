let state = JSON.parse(localStorage.getItem('principalData')) || {
    revenue: 0, goal: 500000, tasks: { task1: false, task2: false, task3: false }, history: []
};
function init() { render(); }
function addRevenue(amount) { state.revenue += amount; save(); }
function toggleTask(id) { state.tasks[id] = !state.tasks[id]; save(); }
function sealDay() {
    const today = new Date().toLocaleDateString();
    const tasksDone = Object.values(state.tasks).filter(v => v).length;
    state.history.unshift({ date: today, revenue: state.revenue, tasksDone: tasksDone, success: tasksDone === 3 });
    state.tasks = { task1: false, task2: false, task3: false };
    save();
}
function save() { localStorage.setItem('principalData', JSON.stringify(state)); render(); }
function render() {
    const percent = Math.min((state.revenue / state.goal) * 100, 100);
    document.getElementById('revenue-bar').style.width = percent + "%";
    document.getElementById('revenue-percent').innerText = Math.round(percent) + "%";
    for (let id in state.tasks) {
        const btn = document.getElementById(id);
        if (btn) state.tasks[id] ? btn.classList.add('completed') : btn.classList.remove('completed');
    }
    document.getElementById('growth-timeline').innerHTML = state.history.map(day => `
        <div class="history-card ${day.success ? 'perfect' : ''}">
            <div><small>${day.date}</small><br><b>₹${day.revenue.toLocaleString()}</b></div>
            <span>${day.tasksDone}/3 Tasks</span>
        </div>
    `).join('');
}
window.onload = init;
