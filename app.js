// 1. DATA & STATE
const contentVault = [
    { type: 'arch', img: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2', caption: '💡 Pritzker Insight: Minimalist glass structures increase property value by 20%. #FirmProfit' },
    { type: 'cat', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb', caption: '🧠 Logic Pulse: If 5 architects design 5 firms in 5 days, how long for 100 architects? #CAT' },
    { type: 'news', img: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e', caption: '📊 Market News: Real estate prices in India expected to surge after new policy update. #Business' }
];

let state = JSON.parse(localStorage.getItem('principalData')) || {
    revenue: 0,
    notes: [],
    history: []
};

// 2. INITIALIZE
function init() {
    renderStories();
    renderFeed();
}

// 3. RENDER STORIES
function renderStories() {
    const bar = document.getElementById('story-bar');
    if (!bar) return;
    const icons = ['📐', '📚', '💰', '📉', '🏛️'];
    bar.innerHTML = icons.map(icon => `
        <div class="story-circle" onclick="playQuiz()">
            <div class="story-inner">${icon}</div>
        </div>
    `).join('');
}

// 4. RENDER FEED (The Instagram Logic)
function renderFeed() {
    const feed = document.getElementById('main-feed');
    if (!feed) return;

    // We repeat the vault to simulate an infinite scroll
    const posts = [...contentVault, ...contentVault, ...contentVault];
    
    feed.innerHTML = posts.map((post, index) => `
        <article class="post-card">
            <div class="post-header"><b>Principal Srikanth</b> • 1h</div>
            
            <div class="heart-container" ondblclick="triggerDopamine(this)">
                <img class="post-img" src="${post.img}">
            </div>

            <div class="post-actions">
                <span class="like-btn" onclick="toggleLike(this)">🤍</span> 
                <span>💬</span> 
                <span>🔖</span>
            </div>
            <div class="post-caption"><b>GrowthGram</b> ${post.caption}</div>
        </article>
    `).join('');
}

// 5. THE DOPAMINE ENGINE (Heart Pop + Sound)
function triggerDopamine(container) {
    // Play Sound
    const sound = document.getElementById('sound-money');
    if (sound) {
        sound.currentTime = 0;
        sound.play();
    }

    // Visual Flash
    const img = container.querySelector('.post-img');
    img.classList.add('liked-flash');
    setTimeout(() => img.classList.remove('liked-flash'), 300);

    // Spawn Heart
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'heart-pop';
    container.appendChild(heart);

    // Auto-fill the little heart icon below the image
    const postCard = container.closest('.post-card');
    const likeBtn = postCard.querySelector('.like-btn');
    likeBtn.innerText = '❤️';

    //
