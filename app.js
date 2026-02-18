// Add 'notes: []' to your initial state if it's not there
if (!state.notes) state.notes = [];

function showView(viewName) {
    document.getElementById('home-view').style.display = viewName === 'home' ? 'block' : 'none';
    document.getElementById('library-view').style.display = viewName === 'library' ? 'block' : 'none';
    
    // Update nav icons
    const navs = document.querySelectorAll('.nav-item');
    navs[0].classList.toggle('active', viewName === 'home');
    navs[1].classList.toggle('active', viewName === 'library');
    
    if(viewName === 'library') renderLibrary();
}

function saveStudyNote() {
    const subject = document.getElementById('study-subject').value;
    const summary = document.getElementById('study-summary').value;
    const question = document.getElementById('study-question').value;
    const confidence = document.getElementById('study-confidence').value;

    if(!summary) return alert("Summarize it first, Principal!");

    const aiComments = {
        CAT: "Math is the language of profit. Solve another tomorrow.",
        IELTS: "Your global stage awaits. Speak clearly!",
        News: "Policy knowledge is power in architecture."
    };

    const newNote = {
        id: Date.now(),
        date: new Date().toLocaleDateString(),
        subject, summary, question, confidence,
        aiHint: aiComments[subject] + (confidence < 5 ? " Focus harder on this one." : " Looking sharp!")
    };

    state.notes.unshift(newNote);
    save(); // Existing save function
    
    // Clear inputs
    document.getElementById('study-summary').value = "";
    document.getElementById('study-question').value = "";
    renderLibrary();
}

function renderLibrary() {
    const feed = document.getElementById('study-feed');
    feed.innerHTML = state.notes.map(note => `
        <div class="study-card">
            <i>${note.date} - ${note.subject} (Conf: ${note.confidence}/10)</i>
            <p><b>Summary:</b> ${note.summary}</p>
            <p><b>Question:</b> ${note.question}</p>
            <div class="ai-response">🤖 ${note.aiHint}</div>
        </div>
    `).join('');
}
