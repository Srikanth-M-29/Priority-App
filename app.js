let myData = JSON.parse(localStorage.getItem('mySpaceData')) || [];
let currentPage = 'study';

function changePage(pageId, title) {
    currentPage = pageId;
    document.getElementById('page-title').innerText = title;
    
    // Customize placeholder based on page
    const input = document.getElementById('mainInput');
    const placeholders = {
        study: "What did you learn today?",
        ideas: "Capture that spark...",
        goals: "What is the next big step?",
        wins: "Celebrate a small victory!",
        growth: "What needs to be better tomorrow?",
        alerts: "EMI or Deadline? (Format: Name - Date)"
    };
    input.placeholder = placeholders[pageId];
    renderPage();
}

function saveEntry() {
    const text = document.getElementById('mainInput').value;
    if(!text) return;

    const entry = {
        id: Date.now(),
        category: currentPage,
        content: text,
        date: new Date().toLocaleDateString(),
        timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
    };

    myData.unshift(entry);
    localStorage.setItem('mySpaceData', JSON.stringify(myData));
    document.getElementById('mainInput').value = '';
    renderPage();
}

function renderPage() {
    const feed = document.getElementById('page-feed');
    const filteredData = myData.filter(item => item.category === currentPage);
    
    feed.innerHTML = filteredData.map(item => `
        <div class="card ${item.category}">
            <small>${item.date} • ${item.timestamp}</small>
            <p>${item.content}</p>
            <button class="del-btn" onclick="deleteEntry(${item.id})">×</button>
        </div>
    `).join('');
}

function deleteEntry(id) {
    myData = myData.filter(i => i.id !== id);
    localStorage.setItem('mySpaceData', JSON.stringify(myData));
    renderPage();
}

// Initial Render
changePage('study', '📖 Study');
