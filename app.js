// URLs for your news sources
const ARCHI_FEED_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://www.archdaily.com/feed';
const CAT_FEED_URL = 'https://api.rss2json.com/v1/api.json?rss_url=https://gradeup.co/articles/mba/cat-exam/rss'; // Example prep feed

let liveArchiNews = [];

// Fetch Architecture News on Load
async function fetchLiveNews() {
    try {
        const response = await fetch(ARCHI_FEED_URL);
        const data = await response.json();
        if (data.status === 'ok') {
            liveArchiNews = data.items;
            updateArchiStory(); // Automatically update the Story with today's top news
        }
    } catch (error) {
        console.log("News fetch failed, using fallback data.");
    }
}

function updateArchiStory() {
    if (liveArchiNews.length > 0) {
        // Update the 🏛️ Story with the latest ArchDaily headline
        storyData['🏛️'] = {
            title: 'Archi-Daily News',
            detail: liveArchiNews[0].title,
            img: liveArchiNews[0].enclosure.link || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
            link: liveArchiNews[0].link
        };
    }
}

// Call this in your init() function
function init() {
    fetchLiveNews(); 
    renderStories();
    renderFeed();
    lucide.createIcons();
}
let savedPosts = JSON.parse(localStorage.getItem('growthGramPosts')) || [
    { user: 'principal_srikanth', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', cap: 'Architecture: Modern glass facades can reduce lighting costs by 30%.', time: '18 Feb 2026, 10:00' },
    { user: 'principal_srikanth', img: 'https://images.unsplash.com/photo-1509228468518-180dd48219d8', cap: 'CAT Prep: Logical reasoning is just architecture for the mind.', time: '18 Feb 2026, 09:00' }
];

const storyData = {
    '💰': { 
        title: 'Revenue Goal', 
        detail: 'Target: $50k Milestone for Q1. Current: Design Phase approval pending.',
        img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=500',
        link: 'https://www.archdaily.com/search/projects/categories/office-buildings'
    },
    '📐': { 
        title: 'Design Flow', 
        detail: 'Form follows function. Focus on the spatial logic of the lobby today.',
        img: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=500',
        link: 'https://www.architecture.com/knowledge-and-resources/knowledge-landing-page'
    },
    '📚': { 
        title: 'CAT Formula', 
        detail: 'Logarithms: log(ab) = log a + log b. Simplify to solve faster.',
        img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=500',
        link: 'https://iim-cat.com/syllabus'
    },
    '🏛️': { 
        title: 'IELTS Word', 
        detail: '"Pragmatic": Dealing with things sensibly and realistically.',
        img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=500',
        link: 'https://www.ielts.org/for-test-takers/sample-test-questions'
    }
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

// Add this specific function to handle the animation
function doLike(container, id) {
    const heart = container.querySelector('.heart-pop');
    document.getElementById('cash-sound').play();
    heart.classList.add('pop-active');
    
    // Remove the heart after animation finishes
    setTimeout(() => heart.classList.remove('pop-active'), 800);
    
    // Turn the bottom heart icon red
    const icon = document.getElementById(`like-${id}`);
    icon.classList.add('liked-red');
    lucide.createIcons();
}

let storyTimer;
function openStory(icon) {
    const data = storyData[icon];
    const viewer = document.getElementById('story-viewer');
    const bar = document.getElementById('story-progress-bar');
    const sImg = document.getElementById('story-img');
    const sLink = document.getElementById('story-link');

    document.getElementById('story-category-name').innerText = icon + " Insights";
    document.getElementById('story-title').innerText = data.title;
    document.getElementById('story-detail').innerText = data.detail;

    // Handle Image
    if (data.img) {
        sImg.src = data.img;
        sImg.style.display = 'block';
    } else {
        sImg.style.display = 'none';
    }

    // Handle Link
    if (data.link) {
        sLink.href = data.link;
        sLink.style.display = 'inline-block';
    } else {
        sLink.style.display = 'none';
    }

    viewer.style.display = 'flex';
    // ... (keep your existing timer/progress bar code here)
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
    if (!imgUrl || imgUrl === "" || imgUrl.includes('null')) return alert("Select a photo!");

    const now = new Date();
    const timeString = now.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

    savedPosts.unshift({ user: 'principal_srikanth', img: imgUrl, cap: caption || "Captured at Site", time: timeString });
    localStorage.setItem('growthGramPosts', JSON.stringify(savedPosts));
    renderFeed();
    closeUpload();
    document.getElementById('cash-sound').play();
}

function toggleLike(id) {
    document.getElementById(`like-${id}`).classList.toggle('liked-red');
    lucide.createIcons();
}

function openMessaging() { document.getElementById('messaging-screen').style.display = 'block'; }
function closeMessaging() { document.getElementById('messaging-screen').style.display = 'none'; }

let activeMentor = "";
function openChat(name) {
    activeMentor = name;
    document.getElementById('active-chat-name').innerText = name;
    document.getElementById('chat-window').style.display = 'block';
    const chatBox = document.getElementById('chat-box');
    
    if(name === 'Archi-Intel') {
        chatBox.innerHTML = `<div class="msg ai"><b>Today's Brief:</b><br>1. Sustainability prizes are peaking.<br>2. Revit AI tools updated.</div>`;
    } else {
        chatBox.innerHTML = `<div class="msg ai">Ready for a logic challenge, Srikanth?</div>`;
    }
}

function closeChat() { document.getElementById('chat-window').style.display = 'none'; }

function sendMessage() {
    const input = document.getElementById('user-msg');
    const chatBox = document.getElementById('chat-box');
    if (!input.value.trim()) return;

    chatBox.innerHTML += `<div class="msg user">${input.value}</div>`;
    let response = "That's a great observation for your portfolio.";
    
    if(activeMentor === 'CAT-alyst') {
        const qs = ["Clock Math: Angle at 3:30? (75°)", "Logic: Is C taller than A? (No)"];
        response = `<b>Challenge:</b> ${qs[Math.floor(Math.random()*qs.length)]}`;
    }

    setTimeout(() => {
        chatBox.innerHTML += `<div class="msg ai">${response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 800);
    input.value = "";
}

window.onload = init;
