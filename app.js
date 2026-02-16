// Load tasks from local storage on startup
let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

function addTask() {
    const name = document.getElementById('taskName').value;
    const imp = document.getElementById('importance').value;
    const dead = document.getElementById('deadline').value;

    if(!name || !dead) return alert("Please fill everything out!");

    const newTask = {
        id: Date.now(),
        name: name,
        importance: parseInt(imp),
        deadline: parseFloat(dead),
        // The Magic Formula
        score: (parseInt(imp) * 10) / parseFloat(dead)
    };

    tasks.push(newTask);
    saveAndRender();
}

function saveAndRender() {
    // Sort tasks by score (Highest first)
    tasks.sort((a, b) => b.score - a.score);
    
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = tasks.map(t => `
        <div class="task-item ${t.score > 15 ? 'urgent' : ''}">
            <div>
                <strong>${t.name}</strong>
                <small>Score: ${t.score.toFixed(1)}</small>
            </div>
            <button onclick="deleteTask(${t.id})">Done</button>
        </div>
    `).join('');
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveAndRender();
}

// Initial render
renderTasks();
