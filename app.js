let savedPosts = JSON.parse(localStorage.getItem('growthGramPosts')) || [
    { user: 'principal_srikanth', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', cap: 'Architecture: Modern glass facades can reduce lighting costs by 30%.', time: '18 Feb 2026, 10:00' }
];

let studyNotes = JSON.parse(localStorage.getItem('growthGramNotes')) || [];
let liveArchiNews = [];

// Sources
const ARCHI_FEED_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.archdaily.com/feed';

const storyData = {
    '💰': { title: 'Revenue Goal', detail: 'Target: $50k Milestone for Q1. Current: Design Phase approval pending.', img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f', link: '#' },
    '📚': { title: 'CAT Formula', detail: 'Logarithms: log(ab) = log a + log b. Simplify to solve faster.', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb', link: 'https://iim-cat.com' },
    '📐': { title: 'Architecture News', detail: 'Fetching latest from ArchDaily...', img: '', link: '#' }
};

async function init() {
    await fetchLiveNews();
    renderStories();
    renderFeed();
    lucide.createIcons();
}

async function fetchLiveNews() {
    try {
        const res = await fetch(ARCHI_FEED_URL);
        const data = await res.json();
        if (data.status === 'ok') {
            liveArchiNews = data.items;
            storyData['📐'].detail = liveArchiNews[0].title;
            storyData['📐'].img = liveArchiNews[0].thumbnail || 'https://images.unsplash.com/photo-1487958449943-2429e8be8625';
            storyData['📐'].link = liveArchiNews[0].link;
        }
    } catch (e) { console.log("News fetch failed."); }
}

function renderStories() {
    const bar = document.getElementById('story-bar');
    const items = Object.keys(storyData);
    bar.innerHTML = items.map(icon => `
        <div class="story-ring" onclick="openStory('${icon}')"><div class="story-inner">${icon}</div></div>
    `).join('');
}

function renderFeed() {
    const feed = document.getElementById('main-feed');
    feed.innerHTML = savedPosts.map((p, i) => `
        <article class="post">
            <div class="post-header"><span class="username">${p.user}</span></div>
            <div class="img-box" ondblclick="doLike(this, ${i})">
                <img src="${p.img}" class="post-img">
                <div class="heart-pop">❤️</div>
            </div>
            <div class="action-bar">
                <i data-lucide="heart" id="like-${i}" onclick="toggleLike(${i})"></i>
                <i data-lucide="message-circle"></i><i data-lucide="send"></i>
            </div>
            <div class="caption-area"><b>${p.user}</b> ${p.cap}
                <div style="font-size: 10px; color: #8e8e8e; margin-top: 5px;">${p.time || 'Earlier'}</div>
            </div>
        </article>
    `).join('');
    lucide.createIcons();
}

let storyTimer;
function openStory(icon) {
    const data = storyData[icon];
    const viewer = document.getElementById('story-viewer');
    const bar = document.getElementById('story-progress-bar');
    document.getElementById('story-category-name').innerText = icon + " Insights";
    document.getElementById('story-title').innerText = data.title;
    document.getElementById('story-detail').innerText = data.detail;
    
    const sImg = document.getElementById('story-img');
    if(data.img) { sImg.src = data.img; sImg.style.display = 'block'; }
    else { sImg.style.display = 'none'; }
    
    document.getElementById('story-link').href = data.link;
    viewer.style.display = 'flex';
    
    let width = 0;
    clearInterval(storyTimer);
    storyTimer = setInterval(() => {
        if (width >= 100) { closeStory(); } 
        else { width++; bar.style.width = width + '%'; }
    }, 50); 
}

function closeStory() { document.getElementById('story-viewer').style.display = 'none'; clearInterval(storyTimer); }

// Notes Logic
function openNote() {
    const title = document.getElementById('story-title').innerText;
    document.getElementById('note-context').innerText = "Analyzing: " + title;
    document.getElementById('note-modal').style.display = 'block';
}

function closeNote() { document.getElementById('note-modal').style.display = 'none'; }

function saveNote() {
    const text = document.getElementById('note-text').value;
    const context = document.getElementById('note-context').innerText;
    if(!text.trim()) return;
    
    studyNotes.push({ date: new Date().toLocaleDateString(), context, content: text });
    localStorage.setItem('growthGramNotes', JSON.stringify(studyNotes));
    document.getElementById('note-text').value = "";
    closeNote();
    document.getElementById('cash-sound').play();
}

// Like Logic
function doLike(container, id) {
    const heart = container.querySelector('.heart-pop');
    document.getElementById('cash-sound').play();
    heart.classList.add('pop-active');
    setTimeout(() => heart.classList.remove('pop-active'), 800);
    document.getElementById(`like-${id}`).classList.add('liked-red');
}

function toggleLike(id) { document.getElementById(`like-${id}`).classList.toggle('liked-red'); }

// Post Upload
function openUpload() { document.getElementById('upload-modal').style.display = 'block'; }
function closeUpload() { document.getElementById('upload-modal').style.display = 'none'; }
function previewImage(event) {
    const reader = new FileReader();
    reader.onload = () => {
        const output = document.getElementById('img-preview');
        output.src = reader.result; output.style.display = 'block';
        document.getElementById('upload-placeholder').style.display = 'none';
    };
    reader.readAsDataURL(event.target.files[0]);
}

function submitPost() {
    const img = document.getElementById('img-preview').src;
    const cap = document.getElementById('caption-input').value;
    if(!img || img.includes('window')) return alert("Select a photo!");
    
    const now = new Date();
    const time = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
    
    savedPosts.unshift({ user: 'principal_srikanth', img, cap, time });
    localStorage.setItem('growthGramPosts', JSON.stringify(savedPosts));
    renderFeed(); closeUpload();
}

// Messaging
function openMessaging() { document.getElementById('messaging-screen').style.display = 'block'; }
function closeMessaging() { document.getElementById('messaging-screen').style.display = 'none'; }

let activeMentor = "";
function openChat(name) {
    activeMentor = name;
    document.getElementById('active-chat-name').innerText = name;
    document.getElementById('chat-window').style.display = 'block';
    const box = document.getElementById('chat-box');
    
    if(name === 'Archi-Intel') {
        let news = liveArchiNews.slice(0,2).map(n => `• <a href="${n.link}" style="color:gold">${n.title}</a>`).join('<br><br>');
        box.innerHTML = `<div class="msg ai"><b>Today's Headlines:</b><br><br>${news}</div>`;
    } else {
        box.innerHTML = `<div class="msg ai">Ready for CAT logic? Ask me to "revise notes" if you've been studying!</div>`;
    }
}

function closeChat() { document.getElementById('chat-window').style.display = 'none'; }

// --- UPGRADED MENTOR LOGIC ---
function sendMessage() {
    const input = document.getElementById('user-msg');
    const box = document.getElementById('chat-box');
    const text = input.value.trim();
    if(!text) return;

    box.innerHTML += `<div class="msg user">${text}</div>`;
    let response = "";

    // Mentorship Logic for Archi-Intel
    if (activeMentor === 'Archi-Intel') {
        if (text.toLowerCase().includes('revise') || text.toLowerCase().includes('note')) {
            response = analyzeArchiNotes();
        } else if (text.toLowerCase().includes('portfolio') || text.toLowerCase().includes('career')) {
            response = "For a Pritzker-track portfolio, don't just show the building. Show the *problem* you solved. Are your recent site visits focusing on social impact or just aesthetics?";
        } else {
            response = "Interesting point. From an architectural standpoint, how does this affect the 'human flow' of the space? Remember: Form follows function, but function follows human behavior.";
        }
    } 

    // Mentorship Logic for CAT-alyst
    else if (activeMentor === 'CAT-alyst') {
        if (text.toLowerCase().includes('revise')) {
            response = analyzeCATNotes();
        } else {
            const puzzles = [
                "Logic check: If you're designing a 10-story building and the elevator takes 15s per floor, how long to reach the top from the 1st? (Mental math is key for CAT!)",
                "Verbal Ability: Define 'Ephemeral' in an architectural context. (Answer: Lasting for a very short time—like a pavilion)."
            ];
            response = puzzles[Math.floor(Math.random() * puzzles.length)];
        }
    }

    setTimeout(() => { 
        box.innerHTML += `<div class="msg ai">${response}</div>`; 
        box.scrollTop = box.scrollHeight; 
    }, 600);
    input.value = "";
}

// AI Analysis of your specific Architectural reflections
function analyzeArchiNotes() {
    if (studyNotes.length === 0) return "I don't see any design reflections yet. Go to your stories, read an article, and 'Take Note'. Then I can analyze your thinking.";
    
    const latest = studyNotes[studyNotes.length - 1];
    return `I've analyzed your note on <b>${latest.context}</b>. You mentioned: "${latest.content}". <br><br><b>Mentor Advice:</b> Connect this to your site work. If you're studying glass facades, look at the curing concrete today—is the thermal mass sufficient for that much glass?`;
}

function analyzeCATNotes() {
    // Logic to pull only CAT-related notes
    const catNotes = studyNotes.filter(n => n.context.includes('CAT'));
    if (catNotes.length === 0) return "No CAT notes found. Start taking notes on formulas to build your logic database.";
    return "Your logic patterns are improving. Focus more on the 'Syllogism' notes you took—that's a high-weightage area.";
}
    setTimeout(() => { box.innerHTML += `<div class="msg ai">${response}</div>`; box.scrollTop = box.scrollHeight; }, 600);
    input.value = "";
}

window.onload = init;
