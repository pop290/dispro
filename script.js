/* ──── ENTER SCREEN LOGIC ──── */
const enterOverlay = document.getElementById('enter-overlay');
const profileWrapper = document.getElementById('profile-wrapper');
const bgMusic = document.getElementById('bg-music');
const discIcon = document.getElementById('disc-icon');

enterOverlay.addEventListener('click', () => {
    enterOverlay.style.opacity = '0';
    enterOverlay.style.pointerEvents = 'none';
    profileWrapper.classList.add('show');
    
    if(bgMusic.src && !bgMusic.src.includes('YOUR_MUSIC_FILE_URL_HERE')) {
        bgMusic.play().catch(error => console.log("Audio play blocked: ", error));
    }

    setTimeout(() => {
        enterOverlay.style.display = 'none';
    }, 1000);
});

/* ──── VOLUME & MUTE CONTROL LOGIC ──── */
const volumeControl = document.getElementById('volume-control');
const volumeToggle = document.getElementById('volume-toggle');
const volumeIcon = document.getElementById('volume-icon');
let previousVolume = 1;

bgMusic.volume = volumeControl.value;

volumeControl.addEventListener('input', (e) => {
    const currentVolume = e.target.value;
    bgMusic.volume = currentVolume;
    updateVolumeIcon(currentVolume);
    
    if (currentVolume > 0) {
        previousVolume = currentVolume;
    }
});

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

function updateVolumeIcon(volume) {
    volumeIcon.className = "fa-solid";
    if (volume == 0) {
        volumeIcon.classList.add("fa-volume-xmark");
        discIcon.style.animationPlayState = "paused";
    } else if (volume < 0.4) {
        volumeIcon.classList.add("fa-volume-low");
        discIcon.style.animationPlayState = "running";
    } else {
        volumeIcon.classList.add("fa-volume-high");
        discIcon.style.animationPlayState = "running";
    }
}

/* Ambient Background Micro-Sparks Setup */
const snowContainer = document.getElementById('snow');
const flakeCount = 35;

for (let i = 0; i < flakeCount; i++) {
    const flake = document.createElement('div');
    flake.classList.add('snowflake');
    flake.style.left = Math.random() * 100 + 'vw';
    flake.style.animationDuration = (Math.random() * 5 + 4) + 's';
    flake.style.animationDelay = Math.random() * 5 + 's';
    flake.style.width = flake.style.height = (Math.random() * 2.5 + 1) + 'px';
    snowContainer.appendChild(flake);
}

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
const neonColors = [
    '#00f2fe', '#00ff66', '#ff007f', '#ff00ff', 
    '#ffff00', '#00ffff', '#ff3333', '#9d4edd'
];
const activeStars = [];
const totalFreeStars = 5;

for(let i=0; i < totalFreeStars; i++) {
    const starEl = document.createElement('i');
    starEl.className = "fa-solid fa-star orbit-star";
    starContainer.appendChild(starEl);

    activeStars.push({
        element: starEl,
        x: Math.random() * (window.innerWidth - 30),
        y: Math.random() * (window.innerHeight - 30),
        dx: (Math.random() * 3 + 1.5) * (Math.random() < 0.5 ? 1 : -1),
        dy: (Math.random() * 3 + 1.5) * (Math.random() < 0.5 ? 1 : -1),
        size: 16
    });
}

function updateStarsPhysicsAnimation() {
    const wWidth = window.innerWidth;
    const wHeight = window.innerHeight;

    activeStars.forEach(star => {
        star.x += star.dx;
        star.y += star.dy;

        let hitWall = false;

        if (star.x <= 0) {
            star.x = 0;
            star.dx = -star.dx;
            hitWall = true;
        } else if (star.x >= wWidth - star.size) {
            star.x = wWidth - star.size;
            star.dx = -star.dx;
            hitWall = true;
        }

        if (star.y <= 0) {
            star.y = 0;
            star.dy = -star.dy;
            hitWall = true;
        } else if (star.y >= wHeight - star.size) {
            star.y = wHeight - star.size;
            star.dy = -star.dy;
            hitWall = true;
        }

        if (hitWall) {
            const pickedColor = neonColors[Math.floor(Math.random() * neonColors.length)];
            star.element.style.color = pickedColor;
            star.element.style.filter = `drop-shadow(0 0 10px ${pickedColor}) drop-shadow(0 0 20px ${pickedColor})`;
        }

        star.element.style.transform = `translate3d(${star.x}px, ${star.y}px, 0)`;
    });

    requestAnimationFrame(updateStarsPhysicsAnimation);
}

updateStarsPhysicsAnimation();

window.addEventListener('resize', () => {
    activeStars.forEach(star => {
        if (star.x > window.innerWidth) star.x = window.innerWidth - star.size;
        if (star.y > window.innerHeight) star.y = window.innerHeight - star.size;
    });
});

/* ──── MOUSE CURSOR PARTICLE EFFECT LOGIC ──── */
const customCursor = document.getElementById('custom-cursor');

window.addEventListener('mousemove', (e) => {
    customCursor.style.left = e.clientX + 'px';
    customCursor.style.top = e.clientY + 'px';

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

        setTimeout(() => {
            particle.remove();
        }, 800);
    }
});

const interactionTargets = document.querySelectorAll('a, button, #enter-overlay');
interactionTargets.forEach(target => {
    target.addEventListener('mouseenter', () => customCursor.classList.add('hovered'));
    target.addEventListener('mouseleave', () => customCursor.classList.remove('hovered'));
});


/* ──── 🔗 DISCORD LIVE AVATAR & DECORATION LOGIC ──── */
const DISCORD_ID = '1150456297922252832'; 

async function fetchDiscordProfile() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();

        if (data.success && data.data) {
            const user = data.data.discord_user;

            // 1. Live Avatar (Profile Picture) එක Update කිරීම
            const avatarHash = user.avatar;
            let avatarUrl = "";
            if (avatarHash) {
                const isGif = avatarHash.startsWith("a_");
                avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${avatarHash}.${isGif ? 'gif' : 'png'}?size=256`;
                document.getElementById('discord-avatar').src = avatarUrl;
            }

            // 2. Live Avatar Decoration (Nitro Effect) එක Update කිරීම
            if (user.avatar_decoration_data && user.avatar_decoration_data.asset) {
                const decoHash = user.avatar_decoration_data.asset;
                const decoUrl = `https://cdn.discordapp.com/avatar-decoration-presets/${decoHash}.png?size=256&passthrough=true`;
                
                const decoImg = document.getElementById('discord-decoration');
                decoImg.src = decoUrl;
                decoImg.style.display = 'block'; // Effect එක තියෙනවා නම් පෙන්වනවා
            }
        }
    } catch (error) {
        console.error("Discord live data load කිරීමට නොහැකි විය:", error);
    }
}

// Page එක load වෙද්දීම Discord data ටික ඇදලා ගන්නවා
fetchDiscordProfile();
