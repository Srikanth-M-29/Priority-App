// Sample Database for Infinite Scroll
const contentVault = [
    { type: 'arch', img: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2', caption: '💡 Pritzker Insight: Minimalist glass structures increase property value by 20%. #FirmProfit' },
    { type: 'cat', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb', caption: '🧠 Logic Pulse: If 5 architects design 5 firms in 5 days, how long for 100 architects? #CAT' },
    { type: 'news', img: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e', caption: '📊 Market News: Real estate prices in India expected to surge after new policy update. #Business' }
];

function init() {
    renderStories();
    renderFeed();
}

function renderStories() {
    const bar = document.getElementById('story-bar');
    // Using simple icons as stories for now
    const icons = ['📐', '📚', '💰', '📉', '🏛️'];
    bar.innerHTML = icons.map(icon => `
        <div class="story-circle" onclick="playQuiz()">
            <div class="story-inner">${icon}</div>
        </div>
    `).join('');
}

function renderFeed() {
    const feed = document.getElementById('main-feed');
    const posts = [...contentVault, ...contentVault, ...contentVault];
    
    feed.innerHTML = posts.map(post => `
        <article class="post-card">
            <div class="post-header"><b>Principal Srikanth</b> • 1h</div>
            
            <div class="heart-container" ondblclick="triggerDopamine(this)">
                <img class="post-img" src="${post.img}">
                <div class="heart-overlay"></div> 
            </div>

            <div class="post-actions">
                <span onclick="this.innerText = this.innerText == '❤️' ? '🤍' : '❤️'">🤍</span> 
                <span>💬</span> 
                <span>🔖</span>
            </div>
            <div class="post-caption"><b>GrowthGram</b> ${post.caption}</div>
        </article>
    `).join('');
}

function triggerDopamine(container) {
    // 1. Play Money Sound
    const sound = document.getElementById('sound-money');
    sound.currentTime = 0; // Reset sound so you can "spam" likes
    sound.play();

    // 2. Visual Flash on Image
    const img = container.querySelector('.post-img');
    img.classList.add('liked-flash');
    setTimeout(() => img.classList.remove('liked-flash'), 300);

    // 3. Spawn the Heart
    const heart = document.createElement('div');
    heart.innerHTML = '❤️';
    heart.className = 'heart-pop';
    container.appendChild(heart);

    // 4. Clean up the heart after animation
    setTimeout(() => {
        heart.remove();
    }, 800);

    // 5. Logic: Save this to "Learned" or "Library"
    console.log("Post saved to Study Library");
}
