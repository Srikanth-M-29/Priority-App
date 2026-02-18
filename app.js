const feedData = [
    { user: 'Principal Srikanth', img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab', caption: '🏢 Architectural Research: Modern glass facades can reduce lighting costs by 30%.' },
    { user: 'Principal Srikanth', img: 'https://images.unsplash.com/photo-1509228468518-180dd48219d8', caption: '🧠 CAT Prep: Logical reasoning is just architecture for the mind. Solve this morning puzzle.' },
    { user: 'Principal Srikanth', img: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8', caption: '📚 IELTS Prep: Use the word "Pragmatic" in your next client meeting. Level up your vocabulary.' }
];

function loadApp() {
    const feed = document.getElementById('main-feed');
    const stories = document.getElementById('story-bar');

    // 1. Load Stories
    const icons = ['💰', '📐', '📚', '📈', '🏢', '🏗️'];
    stories.innerHTML = icons.map(icon => `
        <div class="story-circle"><div class="story-inner">${icon}</div></div>
    `).join('');

    // 2. Load Feed (Doubled for scrolling)
    const allPosts = [...feedData, ...feedData];
    feed.innerHTML = allPosts.map(post => `
        <article class="post-card">
            <div class="post-user">${post.user}</div>
            <div class="img-container" onclick="handleLike(this)">
                <img src="${post.img}" class="post-img">
                <div class="heart-pop">❤️</div>
            </div>
            <div class="post-info">
                <div class="post-caption"><b>GrowthGram</b> ${post.caption}</div>
            </div>
        </article>
    `).join('');
}

// Double-Tap Detection Logic
let lastClick = 0;
function handleLike(container) {
    const time = new Date().getTime();
    if (time - lastClick < 300) {
        showHeart(container);
    }
    lastClick = time;
}

function showHeart(container) {
    const heart = container.querySelector('.heart-pop');
    const audio = document.getElementById('cash-sound');

    // Play Reward Sound
    if (audio) { audio.currentTime = 0; audio.play(); }

    // Trigger Animation
    heart.classList.remove('animate-heart');
    void heart.offsetWidth; // Force CSS refresh
    heart.classList.add('animate-heart');

    console.log("Dopamine hit logged!");
}

window.addEventListener('DOMContentLoaded', loadApp);
