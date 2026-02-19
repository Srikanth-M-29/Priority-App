let savedPosts = JSON.parse(localStorage.getItem('gGram_posts')) || [];
let studyNotes = JSON.parse(localStorage.getItem('gGram_notes')) || [];
let liveNews = [];
let sTimer;
let activeMentor = "";

const API_ARCHI = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.archdaily.com/feed';
const API_BIZ = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.reutersagency.com/feed/?best-topics=business&format=xml';

const stories = {
    '📐': { title: 'Design Logic', detail: 'Form follows function. Analyze spatial flow in architecture today.', img: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625', link: 'https://www.archdaily.com' },
    '📊': { title: 'Market Pulse', detail: 'Financial news builds CAT logic. Read the Reuters updates below.', img: 'https://images.unsplash.com/photo-1611974714024-462be009186d', link: 'https://www.reuters.com' }
};

async function init() {
    await fetchGlobalNews();
    renderStories();
    renderFeed();
    lucide.createIcons();
}

async function fetchGlobalNews() {
    try {
        const [res1, res2] = await Promise.all([fetch(API_ARCHI), fetch(API_BIZ)]);
        const d1 = await res1.json();
        const d2 = await res2.json();
        if(d1.items) liveNews.push(...d1.items.slice(0,3).map(i => ({...i, source: 'ArchDaily'})));
        if(d2.items) liveNews.push(...d2.items.slice(0,2).map(i => ({...i, source: 'Reuters Business'})));
        renderFeed();
    } catch(e) { console.log("Offline Mode"); }
}

function renderStories() {
    const bar = document.getElementById('story-bar');
    bar.innerHTML = Object.keys(stories).map(icon => `
        <div class="story-ring" onclick="openStory('${icon}')"><div class="story-inner">${icon}</div></div>
    `).join('');
}

function renderFeed() {
    const feed = document.getElementById('main-feed');
    let combined = [];
    savedPosts.forEach((p, i) => combined.push({...p, type:'user', id: 'u'+i}));
    liveNews.forEach((n, i) => {
        combined.push({
            user: n.source,
            img: n.thumbnail || n.enclosure?.link || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
            cap: n.title,
            link: n.link,
            type: 'news',
            id: 'n'+i
        });
    });

    feed.innerHTML = combined.map((p) => `
        <article class="post">
            <div class="post-header"><span class="username">@${p.user}</span></div>
            <div class="img-box" ondblclick="doLike(this, '${p.id}')">
                <img src="${p.img}" class="post-img">
                <div class="heart-pop">❤️</div>
            </div>
            <div class="post-actions">
                <i data-lucide="heart" id="heart-${p.id}" onclick="toggleLike('${p.id}')"></i>
                <i data-lucide="message-circle" onclick="openMessaging()"></i>
                <i data-lucide="send"></i>
            </div>
            <div class="caption-area">
                <b>${p.user}</b> ${p.cap}
                ${p.type === 'news' ? `<br><a href="${p.link}" target="_blank" class="read-news-btn">Read Article →</a>` : ''}
            </div>
        </article>
    `).join('');
    lucide.createIcons();
}

function doLike(container, id) {
    const heartPop = container.querySelector('.heart-pop');
    const heartIcon = document.getElementById('heart-' + id);
    document.getElementById('cash-sound').play();
    heartPop.classList.add('pop-active');
    if(heartIcon) heartIcon.classList.add('liked');
    setTimeout(() => heartPop.classList.remove('pop-active'), 800);
    lucide.createIcons();
}

function toggleLike(id) {
    const icon = document.getElementById('heart-' + id);
    if(icon) {
        icon.classList.toggle('liked');
        if(icon.classList.contains('liked')) document.getElementById('cash-sound').play();
    }
    lucide.createIcons();
}

function openStory(icon) {
    const data = stories[icon];
    const viewer = document.getElementById('story-viewer');
    document.getElementById('story-category-name').innerText = data.title;
    document.getElementById('story-title').innerText = data.title;
    document.getElementById('story-detail').innerText = data.detail;
    document.getElementById('story-bg-image').style.backgroundImage = `url('${data.img}')`;
    document.getElementById('story-link').href = data.link;
    viewer.style.display = 'flex';
    let w = 0; clearInterval(sTimer);
    sTimer = setInterval(() => {
        if(w >= 100) closeStory();
        else { w++; document.getElementById('story-progress-bar').style.width = w + '%'; }
    }, 50);
}

function closeStory() { document.getElementById('story-viewer').style.display = 'none'; clearInterval(sTimer); }

function openNote() { 
    document.getElementById('note-context').innerText = "Reflecting: " + document.getElementById('story-title').innerText;
    document.getElementById('note-modal').style.display = 'block'; 
}
function closeNote() { document.getElementById('note-modal').style.display = 'none'; }
function saveNote() {
    const text = document.getElementById('note-text').value;
    if(!text) return;
    studyNotes.push({ context: document.getElementById('note-context').innerText, text: text });
    localStorage.setItem('gGram_notes', JSON.stringify(studyNotes));
    closeNote(); document.getElementById('cash-sound').play();
    document.getElementById('note-text').value = "";
}

function openMessaging() { document.getElementById('messaging-screen').style.display = 'block'; }
function closeMessaging() { document.getElementById('messaging-screen').style.display = 'none'; }
function openChat(m) {
    activeMentor = m;
    document.getElementById('active-chat-name').innerText = m;
    document.getElementById('messaging-screen').style.display = 'none';
    document.getElementById('chat-window').style.display = 'block';
    document.getElementById('chat-box').innerHTML = `<div class="msg ai">Hello Srikanth. Reviewing your ${studyNotes.length} notes now. Ask me to "revise" them.</div>`;
}
function closeChat() { document.getElementById('chat-window').style.display = 'none'; }

// --- THE ADVANCED MENTOR ENGINE ---

function sendMessage() {
    const inp = document.getElementById('user-msg');
    const box = document.getElementById('chat-box');
    const userText = inp.value.trim();
    if(!userText) return;

    box.innerHTML += `<div class="msg user">${userText}</div>`;
    
    // We pass your message AND your saved notes to the brain
    const reply = getAIResponse(userText, activeMentor);

    setTimeout(() => {
        box.innerHTML += `<div class="msg ai">${reply}</div>`;
        box.scrollTop = box.scrollHeight;
    }, 600);
    inp.value = "";
}

function getAIResponse(input, mentor) {
    const msg = input.toLowerCase();
    
    if (mentor === 'Archi-Intel') {
        // 1. Check if asking for revision of data
        if (msg.includes('revise') || msg.includes('analyze') || msg.includes('notes')) {
            return analyzeMyData();
        }

        // 2. Simulated "Generative" Architecture Logic
        if (msg.includes('minimalism') || msg.includes('modern')) {
            return "Minimalism isn't just an aesthetic; it's a structural discipline. In your projects, are you achieving it through 'subtraction' (hiding elements) or 'honesty' (leaving structure exposed)? The latter is much harder to execute in the Indian climate.";
        }
        if (msg.includes('client') || msg.includes('business')) {
            return "Architecture is 50% design and 50% psychology. If a client wants more F.A.R. but less 'mass,' you need to pitch 'Vertical Porosity.' It satisfies the ego and the environment.";
        }
        if (msg.includes('site') || msg.includes('context')) {
            return "Context is king. A building in Nellore cannot breathe like a building in Tokyo. Are you looking at 'Passive Cooling' or just relying on HVAC? As your mentor, I suggest the former for your 2026 portfolio.";
        }
        
        return "That's a valid design inquiry. Looking at it as a Principal Architect: How does this specific decision impact the 'User Experience' over a 10-year period? Think about durability and maintenance.";
    } 

    if (mentor === 'CAT-alyst') {
        if (msg.includes('logic') || msg.includes('math') || msg.includes('quiz')) {
            return "Let's do a Reading Comprehension (RC) check: Based on the ArchDaily posts in your feed, summarize the 'Main Idea' in one sentence. This is the #1 skill for CAT 99th percentile.";
        }
        return "To master the CAT, stop memorizing and start 'Inferring.' Every news post in your feed is a potential RC passage. Try to find the 'Author's Tone' in the business news above.";
    }
}

function analyzeMyData() {
    if (studyNotes.length === 0) return "My 'brain' is ready, but your 'log' is empty. Go take a note on a post first so I have data to analyze!";
    
    const lastNote = studyNotes[studyNotes.length - 1].text;
    const context = studyNotes[studyNotes.length - 1].context;

    // The "Analysis" Step
    let analysis = `I am analyzing your note on **${context}**. You mentioned: "${lastNote}". <br><br>`;
    
    if (lastNote.length < 10) {
        analysis += "Critique: This note is too short. To grow, you need to write about the *Structural Intent*. Why did the architect choose this form?";
    } else {
        analysis += "Expert Insight: This aligns with 'Critical Regionalism.' You're connecting global design to local needs. For your CAT prep, try to calculate the 'Cost-to-Utility' ratio of this design decision.";
    }
    
    return analysis;
}

function openUpload() { document.getElementById('upload-modal').style.display = 'block'; }
function closeUpload() { document.getElementById('upload-modal').style.display = 'none'; }
function previewImage(e) {
    const reader = new FileReader();
    reader.onload = () => { 
        document.getElementById('img-preview').src = reader.result;
        document.getElementById('img-preview').style.display = 'block';
        document.getElementById('up-hint').style.display = 'none';
        tempImg = reader.result;
    };
    reader.readAsDataURL(e.target.files[0]);
}
let tempImg = "";
function submitPost() {
    if(!tempImg) return alert("Select a photo!");
    savedPosts.unshift({ user: 'principal_srikanth', img: tempImg, cap: document.getElementById('caption-input').value });
    localStorage.setItem('gGram_posts', JSON.stringify(savedPosts));
    renderFeed(); closeUpload();
}

window.onload = init;
