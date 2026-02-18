let savedPosts = JSON.parse(localStorage.getItem('growthGramPosts')) || [
    { user: 'principal_srikanth', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', cap: 'Architecture: Modern glass facades can reduce lighting costs by 30%.' },
    { user: 'principal_srikanth', img: 'https://images.unsplash.com/photo-1509228468518-180dd48219d8', cap: 'CAT Prep: Logical reasoning is just architecture for the mind.' }
];

const storyData = {
    '💰': { title: 'Revenue Goal', detail: 'Target: $50k Milestone for Q1. Current: Design Phase approval pending.' },
    '📐': { title: 'Design Flow', detail: 'Form follows function. Focus on the spatial logic of the lobby today.' },
    '📚': { title: 'CAT Formula', detail: 'Logarithms: log(ab) = log a + log b. Simplify to solve faster.' },
    '🏛️': { title: 'IELTS Word', detail: '"Pragmatic": Dealing with things sensibly and realistically based on practical conditions.' },
    '📈': { title: 'Growth Insight', detail: 'Architecture prizes are won by those who solve social problems, not just aesthetic ones.' },
    '🏗️': { title: 'Site Priority', detail: 'Concrete curing check at Sector 7. Ensure temperature control is active.' }
};

function init() {
    renderStories();
    renderFeed();
    lucide.createIcons();
}

function renderStories() {
    const bar = document.getElementById('story-bar');
    const items = ['💰', '📐', '📚', '🏛️', '📈', '🏗️'];
    bar.innerHTML = items.map(icon => `
        <div class="story-ring" onclick="openStory('${icon}')">
            <div class="story-inner">${icon}</div>
        </div>
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
                <i data-lucide="message-circle"></i>
                <i data-lucide="send"></i>
            </div>
<div class="caption-area">
    <b>${p.user}</b> ${p.cap}
    <div style="font-size: 10px; color: #8e8e8e; margin-top: 5px;">${p.time || 'Earlier Today'}</div>
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
    viewer.style.display = 'flex';
    bar.style.width = '0%';
    let width = 0;
    clearInterval(storyTimer);
    storyTimer = setInterval(() => {
        if (width >= 100) { closeStory(); } 
        else { width++; bar.style.width = width + '%'; }
    }, 50); 
}

function closeStory() {
    document.getElementById('story-viewer').style.display = 'none';
    clearInterval(storyTimer);
}

function openUpload() { document.getElementById('upload-modal').style.display = 'block'; }
function closeUpload() { document.getElementById('upload-modal').style.display = 'none'; }

function previewImage(event) {
    const reader = new FileReader();
    reader.onload = () => {
        const output = document.getElementById('img-preview');
        output.src = reader.result;
        output.style.display = 'block';
        document.getElementById('upload-placeholder').style.display = 'none';
    };
    reader.readAsDataURL(event.target.files[0]);
}

function submitPost() {
    const imgUrl = document.getElementById('img-preview').src;
    const caption = document.getElementById('caption-input').value;
    if (!imgUrl || imgUrl.includes('window.location.href')) return alert("Select a photo!");

    // Capture the current date and time
    const now = new Date();
    const timeString = now.toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' 
    });

    const newPost = { 
        user: 'principal_srikanth', 
        img: imgUrl, 
        cap: caption || "Captured at Site",
        time: timeString // Store the timestamp
    };

    savedPosts.unshift(newPost);
    localStorage.setItem('growthGramPosts', JSON.stringify(savedPosts));
    renderFeed();
    closeUpload();
    document.getElementById('cash-sound').play();
}

function doLike(container, id) {
    const heart = container.querySelector('.heart-pop');
    document.getElementById('cash-sound').play();
    heart.classList.add('pop-active');
    setTimeout(() => heart.classList.remove('pop-active'), 800);
    document.getElementById(`like-${id}`).classList.add('liked-red');
    lucide.createIcons();
}

function toggleLike(id) {
    document.getElementById(`like-${id}`).classList.toggle('liked-red');
    lucide.createIcons();
}
// Open/Close Messaging
function openMessaging() { document.getElementById('messaging-screen').style.display = 'block'; }
function closeMessaging() { document.getElementById('messaging-screen').style.display = 'none'; }

let activeMentor = "";

function openChat(mentorName) {
    activeMentor = mentorName;
    document.getElementById('active-chat-name').innerText = mentorName;
    document.getElementById('chat-window').style.display = 'block';
    
    // Initial Greeting
    const chatBox = document.getElementById('chat-box');
    chatBox.innerHTML = `<div class="msg ai">Hello Srikanth! I am your ${mentorName} assistant. How can I help you progress today?</div>`;
}

function closeChat() { document.getElementById('chat-window').style.display = 'none'; }

function sendMessage() {
    const input = document.getElementById('user-msg');
    const chatBox = document.getElementById('chat-box');
    if (!input.value) return;

    // Add user message
    chatBox.innerHTML += `<div class="msg user">${input.value}</div>`;
    
    // Simulated AI Logic
    let response = "That's a great question. Let me analyze that for your architecture portfolio.";
    if (activeMentor === 'CAT-alyst') response = "Focus on the logic here: If P implies Q, then not-Q implies not-P. Want a practice sum?";
    
    setTimeout(() => {
        chatBox.innerHTML += `<div class="msg ai">${response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 1000);

    input.value = "";
}

// Update the header icon in index.html to: <i data-lucide="message-circle" onclick="openMessaging()"></i>
window.onload = init;
