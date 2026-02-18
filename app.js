const posts = [
    { user: 'principal_srikanth', img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', cap: 'Study Note: Modernist architecture is 90% logic, 10% art. #CAT2026' },
    { user: 'principal_srikanth', img: 'https://images.unsplash.com/photo-1507537297725-24a1c029d3ca', cap: 'Business: Closing the 50k project today. Discipline > Motivation.' }
];

function init() {
    renderStories();
    renderFeed();
    lucide.createIcons(); // Turns <i data-lucide> into real icons
}

function renderStories() {
    const bar = document.getElementById('story-bar');
    const items = ['💰', '📐', '📚', '🏛️', '📈'];
    bar.innerHTML = items.map(icon => `
        <div class="story-ring"><div class="story-inner">${icon}</div></div>
    `).join('');
}

function renderFeed() {
    const feed = document.getElementById('main-feed');
    feed.innerHTML = [...posts, ...posts].map((p, i) => `
        <article class="post">
            <div class="post-user-row">
                <div class="user-avatar"></div>
                <span class="username">${p.user}</span>
            </div>
            <div class="img-box" ondblclick="doLike(this, ${i})">
                <img src="${p.img}" class="post-img">
                <div class="heart-pop">❤️</div>
            </div>
            <div class="action-bar">
                <i data-lucide="heart" id="like-${i}" onclick="toggleHeart(${i})"></i>
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

let lastTap = 0;
function doLike(container, id) {
    const heart = container.querySelector('.heart-pop');
    const audio = document.getElementById('cash-sound');
    
    // Play Sound & Animate
    audio.currentTime = 0; audio.play();
    heart.classList.add('pop-active');
    setTimeout(() => heart.classList.remove('pop-active'), 800);
    
    // Turn the small heart red
    const heartIcon = document.getElementById(`like-${id}`);
    heartIcon.classList.add('liked');
    heartIcon.setAttribute('fill', '#ed4956');
}

function toggleHeart(id) {
    const icon = document.getElementById(`like-${id}`);
    icon.classList.toggle('liked');
    const isLiked = icon.classList.contains('liked');
    icon.setAttribute('fill', isLiked ? '#ed4956' : 'none');
}

window.onload = init;
