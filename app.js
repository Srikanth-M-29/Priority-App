// 1. DATA PERSISTENCE - Load from memory or use defaults
let savedPosts = JSON.parse(localStorage.getItem('growthGramPosts')) || [
    { user: 'principal_srikanth', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', cap: 'Architecture: Modernist glass facades increase property value by 20%.' },
    { user: 'principal_srikanth', img: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca', cap: 'Study Note: Logic is the foundation of design. #CAT2026' }
];

function init() {
    renderStories();
    renderFeed();
    lucide.createIcons();
}

function renderStories() {
    const bar = document.getElementById('story-bar');
    const items = ['💰', '📐', '📚', '🏛️', '📈', '🏗️'];
    bar.innerHTML = items.map(icon => `
        <div class="story-ring"><div class="story-inner">${icon}</div></div>
    `).join('');
}

function renderFeed() {
    const feed = document.getElementById('main-feed');
    feed.innerHTML = savedPosts.map((p, i) => `
        <article class="post">
            <div class="post-header">
                <div class="mini-avatar"></div>
                <span class="username">${p.user}</span>
            </div>
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
            </div>
        </article>
    `).join('');
    lucide.createIcons();
}

// UPLOAD LOGIC
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

    const newPost = { user: 'principal_srikanth', img: imgUrl, cap: caption || "Captured at Site" };

    savedPosts.unshift(newPost);
    localStorage.setItem('growthGramPosts', JSON.stringify(savedPosts)); // SAVE TO DISK

    renderFeed();
    closeUpload();
    document.getElementById('cash-sound').play();
}

// INTERACTION LOGIC
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

window.onload = init;
