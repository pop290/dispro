/* ──── PLAYLIST SETTINGS ──── */
const playlist = [
    { title: "SugarCrash!", artist: "ElyOtto", src: "https://raw.githubusercontent.com/pop290/dispro/refs/heads/main/suga.mp3", cover: "https://raw.githubusercontent.com/pop290/dispro/refs/heads/main/suga.png" },
    { title: "i like the way you kiss me", artist: "Artemas", src: "i.mp3", cover: "https://i1.sndcdn.com/artworks-S4x5o4CRFkbgsm1L-tYVy3g-t1080x1080.jpg" },
    { title: "Thunder", artist: "Gabry Ponte, LUM!X, Prezioso", src: "https://raw.githubusercontent.com/pop290/dispro/refs/heads/main/Thunder.mp3", cover: "https://raw.githubusercontent.com/pop290/dispro/refs/heads/main/thunder.png" },
    { title: "She Said She's from the Islands (Kompa)", artist: "Glenn Callin", src: "https://raw.githubusercontent.com/pop290/dispro/refs/heads/main/she.mp3", cover: "https://raw.githubusercontent.com/pop290/dispro/refs/heads/main/she.png" }
];
let currentTrackIndex = 0;

/* ──── DOM ELEMENTS ──── */
const enterOverlay = document.getElementById('enter-overlay');
const profileWrapper = document.getElementById('profile-wrapper');
const bgMusic = document.getElementById('bg-music');
const discIcon = document.getElementById('disc-icon');
const snapContainer = document.getElementById('snap-container');

const smallTrackTitle = document.getElementById('small-track-title');
const smallTrackArtist = document.getElementById('small-track-artist');
const largeTrackTitle = document.getElementById('large-track-title');
const largeTrackArtist = document.getElementById('large-track-artist');
const largeCover = document.getElementById('large-cover');

const musicProgress = document.getElementById('music-progress');
const currentTimeEl = document.getElementById('current-time');
const totalTimeEl = document.getElementById('total-time');
const btnPlayPause = document.getElementById('btn-play-pause');
const btnForward = document.getElementById('btn-forward');
const btnBackward = document.getElementById('btn-backward');
const btnNext = document.getElementById('btn-next');
const btnPrev = document.getElementById('btn-prev');


/* ──── ENTER SCREEN LOGIC ──── */
if (enterOverlay) {
    enterOverlay.addEventListener('click', () => {
        enterOverlay.style.opacity = '0';
        enterOverlay.style.pointerEvents = 'none';
        
        if(profileWrapper) profileWrapper.classList.add('show');
        if(snapContainer) snapContainer.classList.remove('locked');
        
        loadTrack(currentTrackIndex); // Start Playlist

        setTimeout(() => {
            enterOverlay.style.display = 'none';
            refreshHoverTargets(); 
        }, 1000);
    });
}

/* ──── MUSIC PLAYBACK LOGIC ──── */
async function loadTrack(index) {
    const track = playlist[index];
    if(bgMusic) {
        bgMusic.pause(); // Pause previously playing audio
        bgMusic.src = track.src;
        bgMusic.load();
        
        if(smallTrackTitle) smallTrackTitle.innerText = track.title;
        if(smallTrackArtist) smallTrackArtist.innerText = track.artist;
        if(largeTrackTitle) largeTrackTitle.innerText = track.title;
        if(largeTrackArtist) largeTrackArtist.innerText = track.artist;
        if(largeCover) largeCover.src = track.cover;
        
        if(btnPlayPause) btnPlayPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
        
        fetchLyrics(track.title, track.artist);
        bgMusic.play().catch(err => console.log("Playback blocked:", err));
    }
}

if(bgMusic) {
    bgMusic.addEventListener('ended', () => {
        currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        loadTrack(currentTrackIndex);
    });
}

function formatTime(seconds) {
    if(isNaN(seconds)) return "0:00";
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

if(bgMusic) {
    bgMusic.addEventListener('loadedmetadata', () => {
        if(musicProgress) musicProgress.max = bgMusic.duration;
        if(totalTimeEl) totalTimeEl.innerText = formatTime(bgMusic.duration);
    });

    if(btnPlayPause) {
        btnPlayPause.addEventListener('click', () => {
            if(bgMusic.paused) {
                bgMusic.play();
                btnPlayPause.innerHTML = '<i class="fa-solid fa-pause"></i>';
                if(discIcon) discIcon.style.animationPlayState = "running";
            } else {
                bgMusic.pause();
                btnPlayPause.innerHTML = '<i class="fa-solid fa-play"></i>';
                if(discIcon) discIcon.style.animationPlayState = "paused";
            }
        });
    }

    if(musicProgress) {
        musicProgress.addEventListener('input', () => { bgMusic.currentTime = musicProgress.value; });
    }

    if(btnForward) {
        btnForward.addEventListener('click', () => { bgMusic.currentTime = Math.min(bgMusic.duration, bgMusic.currentTime + 10); });
    }

    if(btnBackward) {
        btnBackward.addEventListener('click', () => { bgMusic.currentTime = Math.max(0, bgMusic.currentTime - 10); });
    }

    if(btnNext) {
        btnNext.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
            loadTrack(currentTrackIndex);
        });
    }

    if(btnPrev) {
        btnPrev.addEventListener('click', () => {
            currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
            loadTrack(currentTrackIndex);
        });
    }
}

/* ──── LIVE CLOCK / TIMEZONE LOGIC ──── */
function updateClock() {
    const slTimeEl = document.getElementById('sl-time');
    const hourHand = document.getElementById('hour-hand');
    const minHand = document.getElementById('min-hand');
    const secHand = document.getElementById('sec-hand');

    if(slTimeEl) {
        // Sri Lanka Timezone (Asia/Colombo)
        const now = new Date().toLocaleString("en-US", {timeZone: "Asia/Colombo"});
        const slDate = new Date(now);
        let hours = slDate.getHours();
        let minutes = slDate.getMinutes();
        let seconds = slDate.getSeconds();
        
        // Analog Clock Rotation Math
        if(secHand) {
            const secDeg = (seconds * 6);
            const minDeg = (minutes * 6) + (seconds * 0.1);
            const hourDeg = ((hours % 12) * 30) + (minutes * 0.5);
            
            secHand.style.transform = `rotate3d(0, 0, 1, ${secDeg}deg)`;
            minHand.style.transform = `rotate3d(0, 0, 1, ${minDeg}deg)`;
            hourHand.style.transform = `rotate3d(0, 0, 1, ${hourDeg}deg)`;
        }

        // Digital Time Format
        hours = hours < 10 ? '0' + hours : hours;
        minutes = minutes < 10 ? '0' + minutes : minutes;
        seconds = seconds < 10 ? '0' + seconds : seconds;
        
        const timeString = `${hours}:${minutes}:${seconds}`;
        slTimeEl.innerText = timeString;
        slTimeEl.setAttribute('data-text', timeString); 
    }
}
setInterval(updateClock, 1000);
updateClock();


/* ──── SCROLL OBSERVER (Animations & Side Nav) ──── */
const scrollArrow = document.getElementById('scroll-arrow');
const sections = document.querySelectorAll('.section');
const navDots = document.querySelectorAll('.nav-dot');

const observerOptions = { root: snapContainer, threshold: 0.5 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Update Active Nav Dot
            navDots.forEach(dot => dot.classList.remove('active'));
            const activeDot = document.querySelector(`.nav-dot[data-target="${entry.target.id}"]`);
            if (activeDot) activeDot.classList.add('active');
            
            // Trigger Fade-in-up Animation for sections
            sections.forEach(sec => sec.classList.remove('active-section'));
            entry.target.classList.add('active-section');
        }
    });
}, observerOptions);

sections.forEach(sec => observer.observe(sec));

navDots.forEach(dot => {
    dot.addEventListener('click', () => {
        const targetSection = document.getElementById(dot.getAttribute('data-target'));
        if (targetSection && snapContainer) snapContainer.scrollTo({ top: targetSection.offsetTop, behavior: 'smooth' });
    });
});

if(scrollArrow && snapContainer) {
    scrollArrow.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = document.getElementById(scrollArrow.getAttribute('href').substring(1));
        if(targetSection) snapContainer.scrollTo({ top: targetSection.offsetTop, behavior: 'smooth' });
    });
}


/* ──── EMOTICON ANIMATOR (0.8s) ──── */
const emoticons = ["(^◕.◕^)", "^_~", "^_^", ":D", "U_U", "^o^", "~_~", "X_X", "+_+", "O_O", "^_+", "*_*", "=_=", "$_$", ">.<", ";D", "^_-", "✪ ω ✪", "(☞ﾟヮﾟ)☞", "༼ つ ◕_◕ ༽つ", "(¬_¬\")", "(。・・)ノ", "<@_@>", "◉_◉", "(•ˋ _ ˊ•)", "(◎﹏◎)"];
const emoTitle = document.getElementById('emoticon-title');
if(emoTitle) {
    setInterval(() => {
        emoTitle.innerText = emoticons[Math.floor(Math.random() * emoticons.length)];
    }, 800);
}


/* ──── REAL VIEW COUNTER LOGIC ──── */
async function fetchViewCount() {
    const countEl = document.getElementById('view-count-text');
    if(!countEl) return;
    try {
        const res = await fetch('https://api.counterapi.dev/v1/popzzi_top/visits/up');
        const data = await res.json();
        if(data && data.count) {
            countEl.innerText = data.count.toLocaleString();
        } else {
            countEl.innerText = "1";
        }
    } catch (err) {
        console.log("View count error:", err);
        countEl.innerText = "1"; 
    }
}


/* ──── ONEKO PIXEL CAT INTEGRATION ──── */
(function oneko() {
    const nekoEl = document.createElement("div");
    let nekoPosX = 32; let nekoPosY = 32;
    let mousePosX = 0; let mousePosY = 0;
    let frameCount = 0; let idleTime = 0;
    let idleAnimation = null; let idleAnimationFrame = 0;
    const nekoSpeed = 10; 
    let lastMouseX = 0; let lastMouseY = 0;

    const spriteSets = {
        idle: [[-3, -3]], alert: [[-7, -3]],
        scratch: [[-5, 0], [-6, 0], [-7, 0]], tired: [[-3, -2]],
        sleeping: [[-2, 0], [-2, -1]],
        N: [[-1, -2], [-1, -3]], NE: [[0, -2], [0, -3]],
        E: [[-3, 0], [-3, -1]], SE: [[-5, -1], [-5, -2]],
        S: [[-6, -3], [-7, -2]], SW: [[-5, -3], [-6, -1]],
        W: [[-4, -2], [-4, -3]], NW: [[-1, 0], [-1, -1]]
    };

    function create() {
        nekoEl.id = "oneko";
        nekoEl.style.width = "32px";
        nekoEl.style.height = "32px";
        nekoEl.style.position = "fixed";
        nekoEl.style.pointerEvents = "none";
        nekoEl.style.zIndex = "9999999";
        nekoEl.style.backgroundImage = "url('https://raw.githubusercontent.com/adryd325/oneko.js/main/oneko.gif')";
        nekoEl.style.imageRendering = "pixelated";
        nekoEl.style.left = "0px";
        nekoEl.style.top = "0px";
        nekoEl.style.filter = "drop-shadow(0 0 4px rgba(255,255,255,0.6))";
        nekoEl.style.transform = "translate3d(16px,16px,0)";
        
        document.body.appendChild(nekoEl);

        window.addEventListener('mousemove', (event) => {
            mousePosX = event.clientX; mousePosY = event.clientY;
        }, {passive: true}); 

        setInterval(frame, 100);
    }

    function setSprite(name, frame) {
        const sprite = spriteSets[name][frame % spriteSets[name].length];
        nekoEl.style.backgroundPosition = `${sprite[0] * 32}px ${sprite[1] * 32}px`;
    }

    function resetIdleAnimation() { idleAnimation = null; idleAnimationFrame = 0; }

    function idle() {
        idleTime += 1;
        if (idleTime > 10 && Math.floor(Math.random() * 200) == 0 && idleAnimation == null) {
            idleAnimation = ["sleeping", "scratch"][Math.floor(Math.random() * 2)];
        }
        switch (idleAnimation) {
            case "sleeping":
                if (idleAnimationFrame < 8) { setSprite("tired", 0); break; }
                setSprite("sleeping", Math.floor(idleAnimationFrame / 4));
                if (idleAnimationFrame > 192) resetIdleAnimation();
                break;
            case "scratch":
                setSprite("scratch", idleAnimationFrame);
                if (idleAnimationFrame > 9) resetIdleAnimation();
                break;
            default:
                setSprite("idle", 0); return;
        }
        idleAnimationFrame += 1;
    }

    function frame() {
        if (mousePosX === lastMouseX && mousePosY === lastMouseY && idleAnimation === "sleeping") {
            idle();
            return;
        }
        
        frameCount += 1;
        const diffX = nekoPosX - mousePosX; const diffY = nekoPosY - mousePosY;
        const distance = Math.sqrt(diffX ** 2 + diffY ** 2);

        if (distance < nekoSpeed || distance < 48) { 
            lastMouseX = mousePosX; lastMouseY = mousePosY;
            idle(); 
            return; 
        }
        idleAnimation = null; idleAnimationFrame = 0;

        if (idleTime > 1) {
            setSprite("alert", 0); idleTime = Math.min(idleTime, 7); idleTime -= 1; return;
        }

        let direction = diffY / distance > 0.5 ? "N" : "";
        direction += diffY / distance < -0.5 ? "S" : "";
        direction += diffX / distance > 0.5 ? "W" : "";
        direction += diffX / distance < -0.5 ? "E" : "";
        setSprite(direction, frameCount);

        nekoPosX -= (diffX / distance) * nekoSpeed;
        nekoPosY -= (diffY / distance) * nekoSpeed;
        
        nekoEl.style.transform = `translate3d(${nekoPosX - 16}px, ${nekoPosY - 16}px, 0)`;
        lastMouseX = mousePosX; lastMouseY = mousePosY;
    }
    create();
})();


/* ──── VOLUME CONTROLS ──── */
const volumeControl = document.getElementById('volume-control');
const volumeToggle = document.getElementById('volume-toggle');
const volumeIcon = document.getElementById('volume-icon');
if (volumeControl && bgMusic) {
    bgMusic.volume = volumeControl.value;
    volumeControl.addEventListener('input', (e) => {
        bgMusic.volume = e.target.value; updateVolumeIcon(e.target.value);
        if (e.target.value > 0) previousVolume = e.target.value;
    });
}
if (volumeToggle && bgMusic) {
    volumeToggle.addEventListener('click', () => {
        if (bgMusic.volume > 0) {
            previousVolume = bgMusic.volume; bgMusic.volume = 0; volumeControl.value = 0; updateVolumeIcon(0);
        } else {
            bgMusic.volume = previousVolume; volumeControl.value = previousVolume; updateVolumeIcon(previousVolume);
        }
    });
}

/* ──── INTERACTIVE SNOW (15 DROPS) ──── */
const snowContainer = document.getElementById('snow');
const maxSnowflakes = 15; 
const snowflakes = []; let currentWindX = 0; let speedBoost = 0; let lastMouseXSnow = window.innerWidth / 2; let targetWindX = 0;
class Snowflake {
    constructor() { this.reset(); this.y = Math.random() * window.innerHeight; }
    reset() { this.x = Math.random() * window.innerWidth; this.y = -30; this.size = Math.random() * 2 + 1; this.speedY = Math.random() * 0.7 + 0.5; this.opacity = Math.random() * 0.4 + 0.3; this.sway = Math.random() * 0.2 - 0.1; }
    update() { this.y += this.speedY + (speedBoost * 0.08); this.x += currentWindX + this.sway; if (this.y > window.innerHeight + 20) this.reset(); if (this.x < -40) this.x = window.innerWidth + 40; if (this.x > window.innerWidth + 40) this.x = -40; }
    draw() { const angleRad = Math.atan2(currentWindX, this.speedY + (speedBoost * 0.08)); const angleDeg = (angleRad * 180) / Math.PI; if(this.element) this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${-angleDeg}deg)`; }
}
if (snowContainer) {
    for (let i = 0; i < maxSnowflakes; i++) {
        const flake = new Snowflake(); const flakeEl = document.createElement('div'); flakeEl.style.position = 'absolute'; flakeEl.style.width = flake.size + 'px'; flakeEl.style.height = (flake.size * 4) + 'px'; flakeEl.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.1))'; flakeEl.style.borderRadius = '2px'; flakeEl.style.opacity = flake.opacity; flakeEl.style.pointerEvents = 'none'; flakeEl.style.top = '0'; flakeEl.style.left = '0'; flakeEl.style.willChange = 'transform'; snowContainer.appendChild(flakeEl); flake.element = flakeEl; snowflakes.push(flake);
    }
}
window.addEventListener('mousemove', (e) => {
    targetWindX = (e.clientX - (window.innerWidth / 2)) * 0.005;
    const currentSpeed = Math.abs(e.clientX - lastMouseXSnow); if (currentSpeed > speedBoost) speedBoost = currentSpeed; lastMouseXSnow = e.clientX;
}, {passive: true});

function animateSnow() { currentWindX += (targetWindX - currentWindX) * 0.04; speedBoost *= 0.94; snowflakes.forEach(flake => { flake.update(); flake.draw(); }); requestAnimationFrame(animateSnow); }
animateSnow();

/* Title Type Loop & Orbit Stars */
const titleText = "@popzzi"; let currentIdx = 0; let isDeleting = false; let typingSpeed = 220;
function animateTitleLoop() { if (!isDeleting && currentIdx <= titleText.length) { document.title = titleText.substring(0, currentIdx) || " "; currentIdx++; typingSpeed = 200; } else if (isDeleting && currentIdx >= 0) { document.title = titleText.substring(0, currentIdx) || " "; currentIdx--; typingSpeed = 100; } if (currentIdx > titleText.length) { isDeleting = true; currentIdx = titleText.length; typingSpeed = 2500; } else if (currentIdx < 0) { isDeleting = false; currentIdx = 0; typingSpeed = 800; } setTimeout(animateTitleLoop, typingSpeed); }
animateTitleLoop();

/* ──── DVD PLAYER PHYSICS ANIMATION (1 STAR) ──── */
const starContainer = document.getElementById('star-container');
const neonColors = ['#00f2fe', '#00ff66', '#ff007f', '#ff00ff', '#ffff00', '#00ffff', '#ff3333', '#9d4edd'];
const activeStars = [];
if (starContainer) {
    const starEl = document.createElement('i'); 
    starEl.className = "fa-solid fa-star orbit-star"; 
    starContainer.appendChild(starEl);
    activeStars.push({ 
        element: starEl, 
        x: Math.random() * (window.innerWidth - 30), 
        y: Math.random() * (window.innerHeight - 30), 
        dx: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1), 
        dy: (Math.random() * 2 + 1) * (Math.random() < 0.5 ? 1 : -1), 
        size: 16 
    });
}
function updateStarsPhysicsAnimation() {
    activeStars.forEach(star => {
        star.x += star.dx; star.y += star.dy; let hitWall = false;
        if (star.x <= 0) { star.x = 0; star.dx = -star.dx; hitWall = true; } else if (star.x >= window.innerWidth - star.size) { star.x = window.innerWidth - star.size; star.dx = -star.dx; hitWall = true; }
        if (star.y <= 0) { star.y = 0; star.dy = -star.dy; hitWall = true; } else if (star.y >= window.innerHeight - star.size) { star.y = window.innerHeight - star.size; star.dy = -star.dy; hitWall = true; }
        if (hitWall) { const pickedColor = neonColors[Math.floor(Math.random() * neonColors.length)]; star.element.style.color = pickedColor; star.element.style.filter = `drop-shadow(0 0 10px ${pickedColor}) drop-shadow(0 0 20px ${pickedColor})`; }
        star.element.style.transform = `translate3d(${star.x}px, ${star.y}px, 0)`;
    });
    requestAnimationFrame(updateStarsPhysicsAnimation);
}
if (activeStars.length > 0) updateStarsPhysicsAnimation();

/* Mouse Particles Logic (OPTIMIZED DROPRATE) */
window.addEventListener('mousemove', (e) => {
    const customCursor = document.getElementById('custom-cursor'); if(customCursor) { customCursor.style.transform = `translate3d(${e.clientX}px, ${e.clientY}px, 0) translate3d(-50%, -50%, 0)`; customCursor.style.left = '0px'; customCursor.style.top = '0px'; }
    
    if (Math.random() > 0.65) { 
        const p = document.createElement('i'); p.className = "fa-solid fa-star cursor-particle";
        const rc = neonColors[Math.floor(Math.random() * neonColors.length)];
        p.style.color = rc; p.style.filter = `drop-shadow(0 0 5px ${rc}) drop-shadow(0 0 10px ${rc})`;
        const sz = Math.random() * 8 + 6; p.style.fontSize = `${sz}px`;
        p.style.setProperty('--x', `${e.clientX - sz/2}px`); p.style.setProperty('--y', `${e.clientY - sz/2}px`);
        p.style.setProperty('--mx', `${e.clientX + (Math.random() - 0.5) * 60}px`); p.style.setProperty('--my', `${e.clientY + (Math.random() - 0.5) * 60}px`);
        document.body.appendChild(p); setTimeout(() => { p.remove(); }, 800);
    }
}, {passive: true});

function refreshHoverTargets() {
    const customCursor = document.getElementById('custom-cursor');
    document.querySelectorAll('.link-card, a, button, .volume-btn, .volume-slider, .nav-dot, .music-progress').forEach(target => {
        target.addEventListener('mouseenter', () => { if(customCursor) customCursor.classList.add('hovered'); });
        target.addEventListener('mouseleave', () => { if(customCursor) customCursor.classList.remove('hovered'); });
    });
}

/* ──── DISCORD API LINK ──── */
const DISCORD_ID = '1150456297922252832'; 
function initDiscordLanyard() {
    const ws = new WebSocket('wss://api.lanyard.rest/socket');
    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.op === 1) {
            setInterval(() => { ws.send(JSON.stringify({ op: 3 })); }, msg.d.heartbeat_interval);
            ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
        }
        if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
            const data = msg.d; if (!data) return;
            const user = data.discord_user || (data[DISCORD_ID] ? data[DISCORD_ID].discord_user : null);
            const presence = data.discord_status || (data[DISCORD_ID] ? data[DISCORD_ID].discord_status : 'offline');
            const activities = data.activities || (data[DISCORD_ID] ? data[DISCORD_ID].activities : []);
            if (!user) return;

            const avatarImg = document.getElementById('discord-avatar');
            const decoImg = document.getElementById('discord-decoration');
            if (avatarImg && user.avatar) avatarImg.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}.${user.avatar.startsWith("a_") ? 'gif' : 'png'}?size=256`;
            if (decoImg) {
                if (user.avatar_decoration_data && user.avatar_decoration_data.asset) {
                    decoImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=256&passthrough=true`; decoImg.style.display = 'block';
                } else decoImg.style.display = 'none';
            }
            const statusDot = document.getElementById('status-dot');
            if (statusDot) {
                const colors = { online: '#00ff66', idle: '#faa81a', dnd: '#f04747', offline: '#747f8d' };
                statusDot.style.backgroundColor = colors[presence] || colors.offline;
                statusDot.style.boxShadow = `0 0 8px ${colors[presence] || colors.offline}`;
            }
            let customStatusText = "", gamingActivityText = "";
            if (activities) {
                activities.forEach(act => {
                    if (act.type === 4) customStatusText = act.state || "";
                    else if (act.type === 0) gamingActivityText = `Playing ${act.name}`;
                    else if (act.type === 2) gamingActivityText = `Listening to ${act.name}`;
                });
            }
            const customStatusDiv = document.getElementById('discord-custom-status');
            const activityDiv = document.getElementById('discord-activity');
            if (customStatusDiv) customStatusDiv.innerText = customStatusText;
            if (activityDiv) activityDiv.innerText = gamingActivityText;
        }
    };
    ws.onclose = () => setTimeout(initDiscordLanyard, 5000);
}

/* ──── API හරහා ලිරික්ස් ලබා ගැනීම (LRCLIB) ──── */
let lyricsData = []; 
const lyricsWrapper = document.getElementById('lyrics-wrapper');
const lyricsContainer = document.getElementById('lyrics-container');
let lyricElements = [];

async function fetchLyrics(trackName, artistName) {
    try {
        if (lyricsWrapper) lyricsWrapper.innerHTML = '<div class="lyric-line active" style="font-size:1.5rem;">🎵 Loading Lyrics...</div>';
        
        const cleanTrackName = trackName.replace(/ft\.|feat\.|&/gi, "").trim();
        const response = await fetch(`https://lrclib.net/api/get?track_name=${encodeURIComponent(cleanTrackName)}&artist_name=${encodeURIComponent(artistName)}`);
        
        const data = await response.json();
        if (data && data.syncedLyrics) parseLRC(data.syncedLyrics);
        else lyricsData = [{ time: 0, text: "🎵 No synchronized lyrics found 🎵" }];
        generateLyrics();
    } catch (error) {
        lyricsData = [{ time: 0, text: "🎵 Error loading lyrics 🎵" }]; generateLyrics();
    }
}

function parseLRC(lrcText) {
    lyricsData = []; const lines = lrcText.split('\n'); const regex = /\[(\d{2}):(\d{2}\.\d{2,3})\](.*)/;
    lyricsData.push({ time: 0, text: "🎵 (Music Intro) 🎵" });
    lines.forEach(line => {
        const match = line.match(regex);
        if (match) {
            const text = match[3].trim();
            if (text !== "") lyricsData.push({ time: (parseInt(match[1]) * 60) + parseFloat(match[2]), text: text });
        }
    });
}

function generateLyrics() {
    if (!lyricsWrapper) return;
    lyricsWrapper.innerHTML = '';
    lyricElements = lyricsData.map((item) => {
        const p = document.createElement('div'); p.className = 'lyric-line'; p.innerText = item.text;
        lyricsWrapper.appendChild(p); return p;
    });

    setTimeout(() => {
        if (lyricElements.length > 0 && lyricsContainer) {
            const el = lyricElements[0];
            lyricsWrapper.style.transform = `translateY(${(lyricsContainer.offsetHeight * 0.35) - el.offsetTop - (el.offsetHeight / 2)}px)`;
        }
    }, 150);
}

document.addEventListener('DOMContentLoaded', () => {
    initDiscordLanyard(); refreshHoverTargets(); fetchViewCount();
});

if (bgMusic) {
    let lastTime = 0; 
    bgMusic.addEventListener('timeupdate', () => {
        const currentTime = bgMusic.currentTime;
        
        if(musicProgress && !musicProgress.matches(':active')) musicProgress.value = currentTime;
        if(currentTimeEl) currentTimeEl.innerText = formatTime(currentTime);

        let activeIndex = 0;
        if (currentTime < lastTime - 1.0) lyricElements.forEach(el => el.classList.remove('active'));
        lastTime = currentTime;

        for (let i = 0; i < lyricsData.length; i++) {
            if (currentTime >= lyricsData[i].time) activeIndex = i; else break;
        }

        lyricElements.forEach((el, index) => {
            if (index === activeIndex) {
                if (!el.classList.contains('active')) {
                    el.classList.add('active');
                    lyricsWrapper.style.transform = `translateY(${(lyricsContainer.offsetHeight * 0.35) - el.offsetTop - (el.offsetHeight / 2)}px)`;
                }
            } else el.classList.remove('active');
        });
    });
}
