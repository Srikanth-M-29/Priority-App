let myStory = JSON.parse(localStorage.getItem('myStoryData')) || [];

function captureThought() {
    const text = document.getElementById('mainInput').value;
    const type = document.getElementById('entryType').value;
    
    if(!text) return alert("Your mind isn't empty! Write something down.");

    const entry = {
        id: Date.now(),
        date: new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        content: text,
        type: type,
        // The "Teacher" element: A self-reflection question
        reflection: prompt("Teacher's Question: How will you use this information tomorrow?")
    };

    myStory.unshift(entry); // Newest thoughts at the top
    saveAndRender();
    document.getElementById('mainInput').value = '';
}

function saveAndRender() {
    localStorage.setItem('myStoryData', JSON.stringify(myStory));
    const feed = document.getElementById('timeline-feed');
    
    feed.innerHTML = myStory.map(item => `
        <div class="feed-card ${item.type}">
            <div class="card-header">
                <span class="type-tag">${item.type.toUpperCase()}</span>
                <span class="time">${item.date} • ${item.time}</span>
            </div>
            <div class="content">${item.content}</div>
            ${item.reflection ? `<div class="mentor-note"><strong>Application:</strong> ${item.reflection}</div>` : ''}
            <button class="del-btn" onclick="deleteEntry(${item.id})">×</button>
        </div>
    `).join('');

    updateGreeting();
}

function updateGreeting() {
    const greetings = ["Keep growing.", "Stay curious.", "Focus on the process.", "Learning is a superpower."];
    document.getElementById('mentor-greeting').innerText = greetings[Math.floor(Math.random() * greetings.length)];
}

function deleteEntry(id) {
    if(confirm("Are you sure you want to remove this memory?")) {
        myStory = myStory.filter(i => i.id !== id);
        saveAndRender();
    }
}

saveAndRender();
