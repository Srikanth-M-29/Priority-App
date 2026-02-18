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
    // Simulate infinite scroll by repeating content
    const posts = [...contentVault, ...contentVault, ...contentVault];
    feed.innerHTML = posts.map(post => `
        <article class="post-card">
            <div class="post-header"><b>Principal Srikanth</b> • 1h</div>
            <img class="post-img" src="${post.img}" ondblclick="triggerDopamine(this)">
            <div class="post-actions"><span>❤️</span> <span>💬</span> <span>🔖</span></div>
            <div class="post-caption"><b>GrowthGram</b> ${post.caption}</div>
        </article>
    `).join('');
}

function triggerDopamine(el) {
    document.getElementById('sound-money').play();
    el.style.filter = "brightness(1.5)";
    setTimeout(() => el.style.filter = "brightness(1)", 200);
}

function playQuiz() {
    document.getElementById('sound-pop').play();
    alert("Story Quiz: What is the ROI of a LEED-certified building? (Check DMs for answer)");
}

window.onload = init;
