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
    content: "Acompáñanos a celebrar los XV Años de:<br><span id='alondra-name'>Alondra Torres Godoy</span><br>En una noche de magia y encanto, donde el Gran Comedor de Hogwarts será nuestro telón de fondo.",
    details: "Fecha: 27 de Diciembre del 2025 <br>Hora: A partir de las 18 Hrs<br>Lugar: <a href='https://maps.app.goo.gl/pzq88P254Us6VpDaA' target='_blank'>Jardín de Eventos 'Manzano'</a>"
};

    const partyDate = new Date("December 27, 2025 23:59:59").getTime();
    const deadlineDate = new Date("November 30, 2025 23:59:59").getTime();
    let countdownInterval;

    if (localStorage.getItem('formSubmitted') === 'true') {
        if (rsvpButton) {
            rsvpButton.disabled = true;
            rsvpButton.textContent = "¡Ya estas registrado!";
            rsvpButton.classList.add('disabled-button'); 
        }
    }

    function showInvitationContent() {
        if (invitationTitle) {
            invitationTitle.innerHTML = invitationText.title;
            invitationTitle.style.opacity = 1;
        }
        if (invitationContent) {
            invitationContent.innerHTML = invitationText.content;
            invitationContent.style.opacity = 1;
        }
        if (invitationDetails) {
            invitationDetails.innerHTML = invitationText.details;
            invitationDetails.style.opacity = 1;
        }
        
        startCountdown();
        if (rsvpButton) rsvpButton.classList.add('visible-button');

        if (backgroundMusic) {
            backgroundMusic.play().catch(e => console.log("Música no se pudo reproducir automáticamente."));
        }
    }

    if (localStorage.getItem('invitationViewed') === 'true') {
        if (clickOverlay) clickOverlay.style.display = 'none';
        if (envelope) {
            envelope.classList.add('open');
            envelope.classList.add('no-animation');
        }
        if (invitationCard) invitationCard.classList.add('visible');
        showInvitationContent();
    } else {
        if (clickOverlay && envelope && invitationCard && invitationTitle && invitationContent && invitationDetails && rsvpButton) {
            clickOverlay.addEventListener('click', () => {
                if (backgroundMusic) {
                    backgroundMusic.play().catch(e => console.log("La reproducción automática fue bloqueada:", e));
                }
                clickOverlay.classList.add('hidden');
                envelope.classList.add('open');
                setTimeout(() => {
                    invitationCard.classList.add('visible');
                    showInvitationContent(); 
                }, 1000);

                localStorage.setItem('invitationViewed', 'true');
            }, { once: true });
        }
    }

    function startCountdown() {
        if (!countdownElement || !deadlineNotice) return;
        countdownElement.style.opacity = 1;
        deadlineNotice.style.opacity = 1;
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
                countdownElement.textContent = `Faltan: ${days}d ${hours}h ${minutes}m ${seconds}s para el evento`;
            }
            if (now >= deadlineDate) {
                if(rsvpButton) {
                    rsvpButton.disabled = true;
                    rsvpButton.textContent = "Registro Cerrado";
                }
                deadlineNotice.textContent = "Fecha límite de confirmación: (Expirada)";
            } else {
                deadlineNotice.textContent = "Fecha límite de confirmación: 30 de Noviembre del 2025";
            }
        }, 1000);
    }
    
    // Lógica para manejar el botón de RSVP en la invitación
    if (rsvpButton) {
        rsvpButton.addEventListener('click', (e) => {
            if (!rsvpButton.disabled) {
                e.preventDefault(); 
                const urlParams = new URLSearchParams(window.location.search);
                const numGuestsFromUrl = urlParams.get('invitados'); 
                
                // Redirige usando el parámetro 'invitados'
                window.location.href = `confirmacion.html?invitados=${numGuestsFromUrl}`;
            }
        });
    }

    const now = new Date().getTime();
    if (now >= deadlineDate) {
        if (rsvpButton) {
            rsvpButton.disabled = true;
            rsvpButton.textContent = "Registro Cerrado";
        }
        if (deadlineNotice) {
            deadlineNotice.textContent = "Fecha límite de confirmación: <br> 20 de noviembre de 2025 (Expirada)";
        }
    }

    // Lógica para el formulario de confirmación
    const formContainer = document.getElementById('formContainer');
    const messageContainer = document.getElementById('messageContainer');
    const form = document.getElementById('attendanceForm');
    const guestFieldsContainer = document.getElementById('guestFieldsContainer');
    const responseMessage = document.getElementById('responseMessage');
    const alreadySubmittedMessage = document.getElementById('alreadySubmittedMessage');
    const finalSuccessMessage = document.getElementById('finalSuccessMessage');
    const guestCountInfo = document.getElementById('guest-count-info');
    const backToInviteBtn = document.getElementById('backToInviteBtn');

    if (form) {
        const urlParams = new URLSearchParams(window.location.search);
        const numGuestsFromUrl = urlParams.get('invitados');
        const numGuests = parseInt(numGuestsFromUrl);

        if (alreadySubmittedMessage) alreadySubmittedMessage.style.display = 'none';
        if (finalSuccessMessage) finalSuccessMessage.style.display = 'none';
        if (backToInviteBtn) backToInviteBtn.style.display = 'none';
        if (formContainer) formContainer.style.display = 'block';

        if (localStorage.getItem('formSubmitted') === 'true') {
            if (formContainer) formContainer.style.display = 'none';
            if (alreadySubmittedMessage) alreadySubmittedMessage.style.display = 'block';
            if (backToInviteBtn) backToInviteBtn.style.display = 'block';
            return;
        }

        if (!numGuests || numGuests < 1 || numGuests > 6) {
            if (guestCountInfo) {
                guestCountInfo.textContent = 'El enlace no es válido. Por favor, revisa el enlace de tu invitación.';
            }
            if (formContainer) formContainer.style.display = 'none';
            if (alreadySubmittedMessage) alreadySubmittedMessage.style.display = 'none';
        } else {
            if (guestCountInfo) {
                guestCountInfo.textContent = `Tienes ${numGuests} pase(s) de entrada. Por favor, registra el/los nombre(s):`;
            }
            generateGuestFields(numGuests);

            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const submitButton = form.querySelector('button[type="submit"]');
                if (submitButton) {
                    submitButton.disabled = true;
                    submitButton.textContent = 'Enviando...';
                }
                
                if (responseMessage) {
                    responseMessage.style.display = 'none';
                    responseMessage.className = 'response-message';
                }

                const guestNames = guestFieldsContainer.querySelectorAll('input');
                let allFilled = true;
                guestNames.forEach(input => {
                    if (!input.value.trim()) {
                        allFilled = false;
                    }
                });

                if (!allFilled) {
                    if (responseMessage) {
                        responseMessage.textContent = 'Por favor, llena todos los campos de nombre.';
                        responseMessage.classList.add('error');
                        responseMessage.style.display = 'block';
                    }
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Confirmar Asistencia';
                    }
                    return;
                }

                const formData = new FormData(form);
                formData.append('numGuests', numGuests);
                // <<<<< IMPORTANTE: Reemplaza esta URL con la que te dio Google al publicar el script >>>>>
                const scriptUrl = 'https://script.google.com/macros/s/AKfycbzTOmYSdUZYzp4HltzdXKVePm9PE4DKCQUPKSc4bfWUkTBc3A3dDdN1Qeni6U62Uwgb/exec'; 

                fetch(scriptUrl, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        if (formContainer) formContainer.style.display = 'none';
                        if (messageContainer) messageContainer.style.display = 'none';
                        if (finalSuccessMessage) {
                            finalSuccessMessage.style.display = 'block';
                            if (backToInviteBtn) backToInviteBtn.style.display = 'block';
                        }
                        localStorage.setItem('formSubmitted', 'true');
                        if (responseMessage) {
                            responseMessage.textContent = '¡Asistencia(s) confirmada(s) exitosamente! Gracias por tu respuesta.';
                            responseMessage.classList.add('success');
                        }
                    } else {
                        if (responseMessage) {
                            responseMessage.textContent = 'Hubo un error al enviar los datos. Inténtalo de nuevo.';
                            responseMessage.classList.add('error');
                            responseMessage.style.display = 'block';
                        }
                    }
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Confirmar Asistencia';
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    if (responseMessage) {
                        responseMessage.textContent = 'Hubo un error de conexión. Por favor, revisa tu conexión o intenta más tarde.';
                        responseMessage.classList.add('error');
                        responseMessage.style.display = 'block';
                    }
                    if (submitButton) {
                        submitButton.disabled = false;
                        submitButton.textContent = 'Confirmar Asistencia';
                    }
                });
            });
        }
    }

    if (backToInviteBtn) {
        backToInviteBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    function generateGuestFields(num) {
        if (!guestFieldsContainer) return;
        guestFieldsContainer.innerHTML = '';
        for (let i = 1; i <= num; i++) {
            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';
            formGroup.innerHTML = `
                <label for="guestName${i}">Nombre Completo del Invitado ${i}:</label>
                <input type="text" id="guestName${i}" name="Nombre_Invitado_${i}" required>
            `;
            guestFieldsContainer.appendChild(formGroup);
        }
    }
});