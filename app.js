let state = JSON.parse(localStorage.getItem('principalData')) || {
    revenue: 0,
    goal: 500000,
    tasks: { task1: false, task2: false, task3: false }
};

function init() {
    document.getElementById('greeting').innerText = "Principal Srikanth";
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

function save() {
    localStorage.setItem('principalData', JSON.stringify(state));
    render();
}

function render() {
    // Update Revenue Bar
    const percent = Math.min((state.revenue / state.goal) * 100, 100);
    document.getElementById('revenue-bar').style.width = percent + "%";
    document.getElementById('revenue-percent').innerText = Math.round(percent) + "%";

    // Update Tasks
    for (let id in state.tasks) {
        const btn = document.getElementById(id);
        if (state.tasks[id]) {
            btn.classList.add('completed');
        } else {
            btn.classList.remove('completed');
        }
    }

    // AI Roast logic
    const roast = document.getElementById('ai-roast');
    if (percent < 10) roast.innerText = "Revenue is looking thin. Focus on the firm, Principal.";
    else if (state.tasks.task2 === false) roast.innerText = "CAT doesn't study itself. Get back to the Library.";
    else roast.innerText = "Solid progress. Stage prizes are getting closer.";
}

init();
