let tasks = JSON.parse(localStorage.getItem('myTasks')) || [];

function addTask() {
    const name = document.getElementById('taskName').value;
    const imp = document.getElementById('importance').value;
    const dead = document.getElementById('deadline').value;

    // The "Interrogation" Flow
    const mood = confirm("Are you feeling focused? (OK for Yes, Cancel for No)");
    const energy = prompt("Energy Level (1-10)?");
    const complexity = prompt("How mentally heavy is this task (1-10)?");

    if(!name || !dead) return alert("Missing task details!");

    // Advanced Priority Formula
    // Logic: If mood is low but task is complex, priority lowers (save for later)
    let focusMultiplier = mood ? 1.2 : 0.8;
    let score = ((imp * 10) / dead) * (energy / 5) * focusMultiplier;

    const newTask = {
        id: Date.now(),
        name: name,
        score: score,
        alerted: false
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
// This function checks if any task has a dangerous "Urgency Score"
function monitorUrgency() {
    tasks.forEach(task => {
        // If the score is high (e.g., > 20) and you haven't been alerted yet
        if (task.score > 20 && !task.alerted) {
            sendNotification(task.name);
            task.alerted = true; // Prevents spamming you
        }
    });
    saveAndRender();
}

function sendNotification(taskName) {
    if (Notification.permission === "granted") {
        new Notification("🚨 Focus Alert!", {
            body: `Priority Spike: Start working on "${taskName}" now.`,
            icon: "icon.png"
        });
    }
}
// Initialize separate storage for your diary
let diaryEntries = JSON.parse(localStorage.getItem('myDiary')) || [];

function saveDailySession() {
    const reflection = document.getElementById('dailyReflection').value;
    const plan = document.getElementById('tomorrowPlan').value;

    if (!reflection || !plan) return alert("Write at least one sentence for your future self!");

    const session = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
        reflection: reflection,
        plan: plan,
        // personality tracking: log how you felt during the entry
        energyLevel: prompt("Final Energy Level (1-10)?") 
    };

    // 'unshift' puts the newest day at the very top of your history
    diaryEntries.unshift(session); 
    localStorage.setItem('myDiary', JSON.stringify(diaryEntries));

    // Clear the textareas for a fresh start tomorrow
    document.getElementById('dailyReflection').value = '';
    document.getElementById('tomorrowPlan').value = '';

    alert("Day logged. Your history is updated.");
    renderHistory();
}

function renderHistory() {
    const container = document.getElementById('historyList');
    container.innerHTML = diaryEntries.map(entry => `
        <div class="history-item">
            <div class="history-date">${entry.date} (Energy: ${entry.energyLevel})</div>
            <div class="history-content">
                <strong>Reflection:</strong> ${entry.reflection}<br>
                <strong>Plan:</strong> ${entry.plan}
            </div>
        </div>
    `).join('');
}

// Function to switch between Tasks and History views
function showSection(section) {
    document.getElementById('taskList').style.display = section === 'tasks' ? 'block' : 'none';
    document.getElementById('historyList').style.display = section === 'history' ? 'block' : 'none';
    if(section === 'history') renderHistory();
}

// Check every 60 seconds
setInterval(monitorUrgency, 60000);



