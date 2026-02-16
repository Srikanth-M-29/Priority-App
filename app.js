let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

function addTask() {
    const name = document.getElementById('taskName').value;
    const imp = document.getElementById('importance').value;
    const dead = document.getElementById('deadline').value;
    
    // THE REFINEMENT: Data collection
    const energy = prompt("On a scale of 1-10, how much energy do you have right now?");

    if(!name || !dead || !energy) return alert("Please fill everything out!");

    const newTask = {
        id: Date.now(),
        name: name,
        importance: parseInt(imp),
        deadline: parseFloat(dead),
        userEnergy: parseInt(energy),
        // The Logic: Higher importance + Shorter deadline + High Energy = Top Priority
        score: ((parseInt(imp) * 10) / parseFloat(dead)) * (parseInt(energy) / 5)
    };

    tasks.push(newTask);
    saveAndRender();
}

function saveAndRender() {
    // Automatically sorts so the "Highest Score" is always at the top
    tasks.sort((a, b) => b.score - a.score);
    localStorage.setItem('myTasks', JSON.stringify(tasks));
    renderTasks();
}

function renderTasks() {
    const list = document.getElementById('taskList');
    list.innerHTML = tasks.map((t, index) => `
        <div class="task-item ${index === 0 ? 'urgent' : ''}">
            <div>
                <strong>${index === 0 ? '📍 FOCUS ON: ' : ''}${t.name}</strong>
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

renderTasks();
function requestNotif() {
    // Check if the browser even supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support notifications.");
        return;
    }

    // Ask the iPhone for permission
    Notification.requestPermission().then(permission => {
        if (permission === "granted") {
            alert("Success! Your iPhone will now allow alerts.");
            // Hide the button since we don't need it anymore
            document.getElementById('notif-btn').style.display = 'none';
            
            // Send a test notification immediately
            new Notification("FocusFlow Active", {
                body: "Priority engine is running!",
                icon: "https://srikanth-m-29.github.io/Priority-App/icon.png"
            });
        } else {
            alert("Permission denied. Check your iPhone Settings > Notifications.");
        }
    });
}

