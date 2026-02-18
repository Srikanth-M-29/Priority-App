const posts = [
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
    feed.innerHTML = [...posts, ...posts].map((p, i) => `
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

function doLike(container, id) {
    const heart = container.querySelector('.heart-pop');
    const audio = document.getElementById('cash-sound');
    
    audio.currentTime = 0; audio.play();
    heart.classList.add('pop-active');
    setTimeout(() => heart.classList.remove('pop-active'), 800);
    
    // Auto-fill small heart
    const heartIcon = document.getElementById(`like-${id}`);
    heartIcon.classList.add('liked-red');
    lucide.createIcons();
}

function toggleLike(id) {
    const icon = document.getElementById(`like-${id}`);
    icon.classList.toggle('liked-red');
    lucide.createIcons();
}

window.onload = init;
