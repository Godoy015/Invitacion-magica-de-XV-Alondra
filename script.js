document.addEventListener('DOMContentLoaded', () => {

    // Lógica para la invitación
    const clickOverlay = document.querySelector('.click-overlay');
    const envelope = document.querySelector('.envelope');
    const invitationCard = document.querySelector('.invitation-card');
    const invitationTitle = document.querySelector('.invitation-card .title');
    const invitationContent = document.querySelector('.invitation-card .content');
    const invitationDetails = document.querySelector('.invitation-card .details');
    const rsvpButton = document.querySelector('.rsvp-button');
    const countdownElement = document.getElementById('countdown');
    const deadlineNotice = document.getElementById('deadline-notice');
    const backgroundMusic = document.getElementById('background-music');

    const invitationText = {
    title: "ESTAS CORDIALMENTE INVITADO/A",
    content: "Acompáñanos a celebrar los XV Años de:<br><span style='display: block; text-align: center;'>Alondra Torres Godoy</span><br><br>en una noche de magia y encanto, donde el Gran Comedor de Hogwarts será nuestro telón de fondo.",
    details: "Fecha: Harry Potter<br>Hora: [Hora]<br>Lugar: [Lugar]<br>¡Se requiere varita!"
};

    const partyDate = new Date("November 22, 2025 23:59:59").getTime();
    const deadlineDate = new Date("November 20, 2025 23:59:59").getTime();
    let countdownInterval;

    function startCountdown() {
        if (!countdownElement || !deadlineNotice) return;
        countdownElement.classList.remove('hidden');
        countdownElement.classList.add('visible');
        deadlineNotice.classList.remove('hidden');
        deadlineNotice.classList.add('visible');
        countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = partyDate - now;
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            if (distance < 0) {
                clearInterval(countdownInterval);
                countdownElement.textContent = "¡Es hoy la fiesta!";
            } else {
                countdownElement.textContent = `Faltan: ${days}d ${hours}h ${minutes}m ${seconds}s`;
            }
            if (now >= deadlineDate) {
                if(rsvpButton) {
                    rsvpButton.disabled = true;
                    rsvpButton.textContent = "Registro Cerrado";
                }
                deadlineNotice.textContent = "Fecha límite de confirmación: 20 de noviembre de 2025 (Expirada)";
            } else {
                deadlineNotice.textContent = "Fecha límite de confirmación: 20 de noviembre de 2025";
            }
        }, 1000);
    }
    
    if (clickOverlay && envelope && invitationCard && invitationTitle && invitationContent && invitationDetails && rsvpButton) {
        clickOverlay.addEventListener('click', () => {
            if (backgroundMusic) {
                backgroundMusic.play().catch(e => console.log("La reproducción automática fue bloqueada:", e));
            }
            clickOverlay.classList.add('hidden');
            envelope.classList.add('open');
            setTimeout(() => {
    invitationCard.classList.add('visible');
    typewriterEffect(invitationTitle, invitationText.title, 0, () => {
        invitationContent.innerHTML = invitationText.content;
        invitationContent.style.opacity = 1;
        
        invitationDetails.innerHTML = invitationText.details;
        invitationDetails.style.opacity = 1;
        
        startCountdown();
        rsvpButton.classList.add('visible-button');
    });
}, 1000);
        }, { once: true });
    }

    function typewriterEffect(element, text, i, callback) {
    if (i < text.length) {
        element.innerHTML += text.charAt(i);
        element.style.opacity = 1;
        setTimeout(() => typewriterEffect(element, text, i + 1, callback), 50);
    } else {
        // Al final, nos aseguramos de que el contenido final sea el correcto
        element.innerHTML = text; 
        if (callback) {
            callback();
        }
    }
}
    
    if (rsvpButton) {
        rsvpButton.