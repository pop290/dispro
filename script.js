/* ──── ENTER SCREEN LOGIC ──── */
const enterOverlay = document.getElementById('enter-overlay');
const profileWrapper = document.getElementById('profile-wrapper');
const bgMusic = document.getElementById('bg-music');
const discIcon = document.getElementById('disc-icon');

if (enterOverlay) {
    enterOverlay.addEventListener('click', () => {
        enterOverlay.style.opacity = '0';
        enterOverlay.style.pointerEvents = 'none';
        profileWrapper.classList.add('show');
        
        if(bgMusic && bgMusic.src) {
            bgMusic.play().catch(error => console.log("Audio play blocked: ", error));
        }

        setTimeout(() => {
            enterOverlay.style.display = 'none';
            refreshHoverTargets(); 
        }, 1000);
    });
}

/* ──── VOLUME & MUTE CONTROL LOGIC ──── */
const volumeControl = document.getElementById('volume-control');
const volumeToggle = document.getElementById('volume-toggle');
const volumeIcon = document.getElementById('volume-icon');
let previousVolume = 1;

if (volumeControl && bgMusic) {
    bgMusic.volume = volumeControl.value;
    volumeControl.addEventListener('input', (e) => {
        const currentVolume = e.target.value;
        bgMusic.volume = currentVolume;
        updateVolumeIcon(currentVolume);
        if (currentVolume > 0) previousVolume = currentVolume;
    });
}

if (volumeToggle && bgMusic) {
    volumeToggle.addEventListener('click', () => {
        if (bgMusic.volume > 0) {
            previousVolume = bgMusic.volume;
            bgMusic.volume = 0;
            volumeControl.value = 0;
            updateVolumeIcon(0);
        } else {
            bgMusic.volume = previousVolume;
            volumeControl.value = previousVolume;
            updateVolumeIcon(previousVolume);
        }
    });
}

function updateVolumeIcon(volume) {
    if (!volumeIcon) return;
    volumeIcon.className = "fa-solid";
    if (volume == 0) {
        volumeIcon.classList.add("fa-volume-xmark");
        if(discIcon) discIcon.style.animationPlayState = "paused";
    } else if (volume < 0.4) {
        volumeIcon.classList.add("fa-volume-low");
        if(discIcon) discIcon.style.animationPlayState = "running";
    } else {
        volumeIcon.classList.add("fa-volume-high");
        if(discIcon) discIcon.style.animationPlayState = "running";
    }
}

/* ──── INTERACTIVE SNOW ──── */
const snowContainer = document.getElementById('snow');
const maxSnowflakes = 45; 
const snowflakes = [];
let mouseX = window.innerWidth / 2;
let lastMouseX = window.innerWidth / 2;
let targetWindX = 0;   
let currentWindX = 0;  
let speedBoost = 0;    

class Snowflake {
    constructor() {
        this.reset();
        this.y = Math.random() * window.innerHeight; 
    }
    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = -30;
        this.size = Math.random() * 2 + 1; 
        this.speedY = Math.random() * 0.7 + 0.5; 
        this.opacity = Math.random() * 0.4 + 0.3;
        this.sway = Math.random() * 0.2 - 0.1; 
    }
    update() {
        this.y += this.speedY + (speedBoost * 0.08);
        this.x += currentWindX + this.sway;
        if (this.y > window.innerHeight + 20) this.reset();
        if (this.x < -40) this.x = window.innerWidth + 40;
        if (this.x > window.innerWidth + 40) this.x = -40;
    }
    draw() {
        const angleRad = Math.atan2(currentWindX, this.speedY + (speedBoost * 0.08));
        const angleDeg = (angleRad * 180) / Math.PI;
        if(this.element) {
            this.element.style.transform = `translate3d(${this.x}px, ${this.y}px, 0) rotate(${-angleDeg}deg)`;
        }
    }
}

if (snowContainer) {
    for (let i = 0; i < maxSnowflakes; i++) {
        const flake = new Snowflake();
        const flakeEl = document.createElement('div');
        flakeEl.style.position = 'absolute';
        flakeEl.style.width = flake.size + 'px';
        flakeEl.style.height = (flake.size * 4) + 'px'; 
        flakeEl.style.background = 'linear-gradient(to bottom, rgba(255,255,255,0.7), rgba(255,255,255,0.1))';
        flakeEl.style.borderRadius = '2px';
        flakeEl.style.opacity = flake.opacity;
        flakeEl.style.pointerEvents = 'none';
        flakeEl.style.top = '0';
        flakeEl.style.left = '0';
        flakeEl.style.willChange = 'transform';
        snowContainer.appendChild(flakeEl);
        flake.element = flakeEl;
        snowflakes.push(flake);
    }
}

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    const screenCenter = window.innerWidth / 2;
    targetWindX = (mouseX - screenCenter) * 0.005;
    const deltaX = mouseX - lastMouseX;
    const currentSpeed = Math.abs(deltaX);
    if (currentSpeed > speedBoost) speedBoost = currentSpeed; 
    lastMouseX = mouseX;
});

function animateSnow() {
    currentWindX += (targetWindX - currentWindX) * 0.04;
    speedBoost *= 0.94; 
    snowflakes.forEach(flake => {
        flake.update();
        flake.draw();
    });
    requestAnimationFrame(animateSnow);
}
animateSnow();

/* Title Auto-Typing Loop */
const titleText = "@popzzi";
let currentIdx = 0;
let isDeleting = false;
let typingSpeed = 220; 

function animateTitleLoop() {
    if (!isDeleting && currentIdx <= titleText.length) {
        document.title = titleText.substring(0, currentIdx) || " ";
        currentIdx++;
        typingSpeed = 200; 
    } else if (isDeleting && currentIdx >= 0) {
        document.title = titleText.substring(0, currentIdx) || " ";
        currentIdx--;
        typingSpeed = 100; 
    }
    if (currentIdx > titleText.length) {
        isDeleting = true;
        currentIdx = titleText.length; 
        typingSpeed = 2500; 
    } else if (currentIdx < 0) {
        isDeleting = false;
        currentIdx = 0;
        typingSpeed = 800; 
    }
    setTimeout(animateTitleLoop, typingSpeed);
}
animateTitleLoop();

/* Free Roaming Neon Stars Setup */
const starContainer = document.getElementById('star-container');
const neonColors = ['#00f2fe', '#00ff66', '#ff007f', '#ff00ff', '#ffff00', '#00ffff', '#ff3333', '#9d4edd'];
const activeStars = [];
const totalFreeStars = 5;

if (starContainer) {
    starContainer.style.position = "fixed";
    starContainer.style.top = "0";
    starContainer.style.left = "0";
    starContainer.style.width = "100vw";
    starContainer.style.height = "100vh";
    starContainer.style.zIndex = "-1"; 
    starContainer.style.pointerEvents = "none"; 

    for(let i=0; i < totalFreeStars; i++) {
        const starEl = document.createElement('i');
        starEl.className = "fa-solid fa-star orbit-star";
        starEl.style.position = "absolute";
        starEl.style.zIndex = "-1"; 
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
}

function updateStarsPhysicsAnimation() {
    const wWidth = window.innerWidth;
    const wHeight = window.innerHeight;
    activeStars.forEach(star => {
        star.x += star.dx;
        star.y += star.dy;
        let hitWall = false;
        if (star.x <= 0) { star.x = 0; star.dx = -star.dx; hitWall = true; }
        else if (star.x >= wWidth - star.size) { star.x = wWidth - star.size; star.dx = -star.dx; hitWall = true; }
        if (star.y <= 0) { star.y = 0; star.dy = -star.dy; hitWall = true; }
        else if (star.y >= wHeight - star.size) { star.y = wHeight - star.size; star.dy = -star.dy; hitWall = true; }
        if (hitWall) {
            const pickedColor = neonColors[Math.floor(Math.random() * neonColors.length)];
            star.element.style.color = pickedColor;
            star.element.style.filter = `drop-shadow(0 0 10px ${pickedColor}) drop-shadow(0 0 20px ${pickedColor})`;
        }
        star.element.style.transform = `translate3d(${star.x}px, ${star.y}px, 0)`;
    });
    requestAnimationFrame(updateStarsPhysicsAnimation);
}
if (activeStars.length > 0) updateStarsPhysicsAnimation();

/* ──── MOUSE CURSOR PARTICLE LOGIC ──── */
const customCursor = document.getElementById('custom-cursor');
window.addEventListener('mousemove', (e) => {
    if(customCursor) {
        customCursor.style.left = e.clientX + 'px';
        customCursor.style.top = e.clientY + 'px';
    }
    if (Math.random() > 0.25) { 
        const particle = document.createElement('i');
        particle.className = "fa-solid fa-star cursor-particle";
        const randomColor = neonColors[Math.floor(Math.random() * neonColors.length)];
        particle.style.color = randomColor;
        particle.style.filter = `drop-shadow(0 0 5px ${randomColor}) drop-shadow(0 0 10px ${randomColor})`;
        const size = Math.random() * 8 + 6;
        particle.style.fontSize = `${size}px`;
        particle.style.setProperty('--x', `${e.clientX - size/2}px`);
        particle.style.setProperty('--y', `${e.clientY - size/2}px`);
        const movementX = (Math.random() - 0.5) * 60;
        const movementY = (Math.random() - 0.5) * 60;
        particle.style.setProperty('--mx', `${e.clientX + movementX}px`);
        particle.style.setProperty('--my', `${e.clientY + movementY}px`);
        document.body.appendChild(particle);
        setTimeout(() => { particle.remove(); }, 800);
    }
});

function refreshHoverTargets() {
    const customCursor = document.getElementById('custom-cursor');
    const interactionTargets = document.querySelectorAll('.link-card, a, button, .volume-btn, .volume-slider');
    interactionTargets.forEach(target => {
        target.addEventListener('mouseenter', () => { if(customCursor) customCursor.classList.add('hovered'); });
        target.addEventListener('mouseleave', () => { if(customCursor) customCursor.classList.remove('hovered'); });
    });
}

/* ──── DISCORD API LINK (WebSocket) ──── */
const DISCORD_ID = '1150456297922252832'; 
function initDiscordLanyard() {
    const avatarImg = document.getElementById('discord-avatar');
    const decoImg = document.getElementById('discord-decoration');
    const statusDot = document.getElementById('status-dot');
    const customStatusDiv = document.getElementById('discord-custom-status');
    const activityDiv = document.getElementById('discord-activity');

    const ws = new WebSocket('wss://api.lanyard.rest/socket');
    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.op === 1) {
            setInterval(() => { ws.send(JSON.stringify({ op: 3 })); }, msg.d.heartbeat_interval);
            ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
        }
        if (msg.op === 0 && (msg.t === 'INIT_STATE' || msg.t === 'PRESENCE_UPDATE')) {
            const data = msg.d;
            if (!data) return;
            const user = data.discord_user || (data[DISCORD_ID] ? data[DISCORD_ID].discord_user : null);
            const presence = data.discord_status || (data[DISCORD_ID] ? data[DISCORD_ID].discord_status : 'offline');
            const activities = data.activities || (data[DISCORD_ID] ? data[DISCORD_ID].activities : []);
            if (!user) return;

            if (avatarImg && user.avatar) {
                const isGif = user.avatar.startsWith("a_");
                avatarImg.src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}.${isGif ? 'gif' : 'png'}?size=256`;
            }
            if (decoImg) {
                if (user.avatar_decoration_data && user.avatar_decoration_data.asset) {
                    decoImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.avatar_decoration_data.asset}.png?size=256&passthrough=true`;
                    decoImg.style.display = 'block';
                } else {
                    decoImg.style.display = 'none';
                }
            }
            if (statusDot) {
                const colors = { online: '#00ff66', idle: '#faa81a', dnd: '#f04747', offline: '#747f8d' };
                statusDot.style.backgroundColor = colors[presence] || colors.offline;
                statusDot.style.boxShadow = `0 0 8px ${colors[presence] || colors.offline}`;
            }
            let customStatusText = "";
            let gamingActivityText = "";
            if (activities && activities.length > 0) {
                activities.forEach(act => {
                    if (act.type === 4) customStatusText = act.state || "";
                    else if (act.type === 0) gamingActivityText = `Playing ${act.name}`;
                    else if (act.type === 2) gamingActivityText = `Listening to ${act.name}`;
                });
            }
            if (customStatusDiv) customStatusDiv.innerText = customStatusText;
            if (activityDiv) activityDiv.innerText = gamingActivityText;
        }
    };
    ws.onclose = () => setTimeout(initDiscordLanyard, 5000);
}

document.addEventListener('DOMContentLoaded', () => {
    initDiscordLanyard(); 
    refreshHoverTargets();
});
