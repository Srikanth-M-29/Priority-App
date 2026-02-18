let savedPosts = JSON.parse(localStorage.getItem('gGram_posts')) || [];
let studyNotes = JSON.parse(localStorage.getItem('gGram_notes')) || [];
let liveNews = [];

const API_ARCHI = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.archdaily.com/feed';
const API_BIZ = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.reutersagency.com/feed/?best-topics=business&format=xml';

const stories = {
    '📐': { title: 'Design Logic', detail: 'Form follows function. Analyze spatial flow today.', img: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625', link: '#' },
    '📊': { title: 'Market Pulse', detail: 'Financial news builds CAT logic. Read carefully.', img: 'https://images.unsplash.com/photo-1611974714024-462be009186d', link: '#' }
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
    } catch(e) { console.log("News Offline"); }
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

let sTimer;
function openStory(icon) {
    const data = stories[icon];
    const viewer = document.getElementById('story-viewer');
    document.getElementById('story-title').innerText = data.title;
    document.getElementById('story-detail').innerText = data.detail;
    document.getElementById('story-img').src = data.img;
    document.getElementById('story-img').style.display = 'block';
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

function sendMessage() {
    const inp = document.getElementById('user-msg');
    const box = document.getElementById('chat-box');
    const userText = inp.value.trim().toLowerCase();
    if(!userText) return;
    box.innerHTML += `<div class="msg user">${inp.value}</div>`;
    let reply = "Focus on the core principle. How does this solve a real-world problem?";
    if(userText.includes('revise')) {
        if(studyNotes.length > 0) {
            const last = studyNotes[studyNotes.length - 1];
            reply = `Your last note was about <b>${last.context}</b>. You said: "${last.text}". How does this apply to your current site layout?`;
        } else {
            reply = "You haven't saved any notes yet! Click '+ Take Note' in a story first.";
        }
    }
    setTimeout(() => { box.innerHTML += `<div class="msg ai">${reply}</div>`; box.scrollTop = box.scrollHeight; }, 600);
    inp.value = "";
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
