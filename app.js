let savedPosts = JSON.parse(localStorage.getItem('gGram_posts')) || [];
let studyNotes = JSON.parse(localStorage.getItem('gGram_notes')) || [];
let liveNews = [];

const API_ARCHI = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.archdaily.com/feed';
const API_BIZ = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.reutersagency.com/feed/?best-topics=business&format=xml';

const stories = {
    '📈': { title: 'Market Logic', detail: 'Reading financial news builds CAT comprehension.', img: 'https://images.unsplash.com/photo-1611974714024-462be009186d', link: '#' },
    '🏛️': { title: 'Pritzker Prep', detail: 'Study the masters of 2026.', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', link: '#' }
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
        const data1 = await res1.json();
        const data2 = await res2.json();
        
        if(data1.items) liveNews.push(...data1.items.slice(0,3).map(i => ({...i, source: 'arch_global'})));
        if(data2.items) liveNews.push(...data2.items.slice(0,2).map(i => ({...i, source: 'biz_intel'})));
    } catch(e) { console.log("News offline"); }
}

function renderStories() {
    const bar = document.getElementById('story-bar');
    bar.innerHTML = Object.keys(stories).map(icon => `
        <div class="story-ring" onclick="openStory('${icon}')"><div class="story-inner">${icon}</div></div>
    `).join('');
}

function renderFeed() {
    const feed = document.getElementById('main-feed');
    let combined = savedPosts.map((p, i) => ({...p, type:'user', id:i}));
    
    liveNews.forEach(n => {
        combined.push({
            user: n.source,
            img: n.thumbnail || n.enclosure?.link || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
            cap: n.title,
            time: 'Global Update',
            link: n.link,
            type: 'news'
        });
    });

    feed.innerHTML = combined.map((p, i) => `
        <article class="post">
            <div class="post-header"><span class="username">${p.user}</span></div>
            <div class="img-box" ${p.type === 'news' ? `onclick="window.open('${p.link}')"` : `ondblclick="doLike(this, ${i})"`}>
                <img src="${p.img}" class="post-img">
                <div class="heart-pop">❤️</div>
            </div>
            <div class="caption-area"><b>${p.user}</b> ${p.cap}</div>
        </article>
    `).join('');
    lucide.createIcons();
}

// Story Controls
let sTimer;
function openStory(icon) {
    const data = stories[icon];
    const viewer = document.getElementById('story-viewer');
    document.getElementById('story-title').innerText = data.title;
    document.getElementById('story-detail').innerText = data.detail;
    const sImg = document.getElementById('story-img');
    sImg.src = data.img; sImg.style.display = 'block';
    viewer.style.display = 'flex';

    let w = 0; clearInterval(sTimer);
    sTimer = setInterval(() => {
        if(w >= 100) closeStory();
        else { w++; document.getElementById('story-progress-bar').style.width = w + '%'; }
    }, 50);
}
function closeStory() { document.getElementById('story-viewer').style.display = 'none'; clearInterval(sTimer); }

// Notes System
function openNote() { 
    document.getElementById('note-context').innerText = "Topic: " + document.getElementById('story-title').innerText;
    document.getElementById('note-modal').style.display = 'block'; 
}
function closeNote() { document.getElementById('note-modal').style.display = 'none'; }
function saveNote() {
    const text = document.getElementById('note-text').value;
    if(!text) return;
    studyNotes.push({ context: document.getElementById('note-context').innerText, text: text });
    localStorage.setItem('gGram_notes', JSON.stringify(studyNotes));
    closeNote(); document.getElementById('cash-sound').play();
}

// Mentor Chat
let activeMentor = "";
function openChat(m) {
    activeMentor = m;
    document.getElementById('active-chat-name').innerText = m;
    document.getElementById('messaging-screen').style.display = 'none';
    document.getElementById('chat-window').style.display = 'block';
    document.getElementById('chat-box').innerHTML = `<div class="msg ai">I am scanning your saved notes now... how can I guide you?</div>`;
}
function closeChat() { document.getElementById('chat-window').style.display = 'none'; }
function openMessaging() { document.getElementById('messaging-screen').style.display = 'block'; }
function closeMessaging() { document.getElementById('messaging-screen').style.display = 'none'; }

function sendMessage() {
    const inp = document.getElementById('user-msg');
    const box = document.getElementById('chat-box');
    if(!inp.value) return;
    box.innerHTML += `<div class="msg user">${inp.value}</div>`;
    
    let reply = "As a mentor, I suggest looking at the structural integrity of this idea.";
    if(inp.value.toLowerCase().includes('revise')) {
        if(studyNotes.length > 0) {
            const last = studyNotes[studyNotes.length - 1];
            reply = `You recently noted: "${last.text}". How does this impact your current site visit?`;
        } else {
            reply = "Take a note in a story first so I can analyze your thinking!";
        }
    }
    setTimeout(() => { box.innerHTML += `<div class="msg ai">${reply}</div>`; box.scrollTop = box.scrollHeight; }, 600);
    inp.value = "";
}

// Double Tap Like
function doLike(container, id) {
    const heart = container.querySelector('.heart-pop');
    document.getElementById('cash-sound').play();
    heart.classList.add('pop-active');
    setTimeout(() => heart.classList.remove('pop-active'), 800);
}

// Uploads
let tempImg = "";
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
function submitPost() {
    const cap = document.getElementById('caption-input').value;
    if(!tempImg) return alert("Select a photo first");
    savedPosts.unshift({ user: 'principal_srikanth', img: tempImg, cap: cap });
    localStorage.setItem('gGram_posts', JSON.stringify(savedPosts));
    renderFeed(); closeUpload();
}

window.onload = init;
