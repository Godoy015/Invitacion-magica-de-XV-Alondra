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
    content: "Acompáñanos a celebrar los XV Años de:<br><span>Alondra Torres Godoy</span><br>en una noche de magia y encanto, donde el Gran Comedor de Hogwarts será nuestro telón de fondo.",
    details: "Fecha: Harry Potter <br>Hora: [Hora]<br>Lugar: [Lugar]<br>¡Se requiere varita!"
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
                    typewriterEffect(invitationContent, invitationText.content, 0, () => {
                        typewriterEffect(invitationDetails, invitationText.details, 0, () => {
                            startCountdown();
                            rsvpButton.classList.add('visible-button');
                        });
                    });
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
            if (callback) {
                callback();
            }
        }
    }
    
    if (rsvpButton) {
        rsvpButton.addEventListener('click', () => {
            if (!rsvpButton.disabled) {
                const urlParams = new URLSearchParams(window.location.search);
                const numGuestsFromUrl = urlParams.get('invitados'); 
                
                localStorage.setItem('invitationViewed', 'true');
                
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
            deadlineNotice.textContent = "Fecha límite de confirmación: 20 de noviembre de 2025 (Expirada)";
        }
    }

    // Lógica para el formulario de confirmación
    const urlParams = new URLSearchParams(window.location.search);
    const numGuestsFromUrl = urlParams.get('invitados');
    
    const formContainer = document.getElementById('formContainer');
    const form = document.getElementById('attendanceForm');
    const guestFieldsContainer = document.getElementById('guestFieldsContainer');
    const responseMessage = document.getElementById('responseMessage');
    const alreadySubmittedMessage = document.getElementById('alreadySubmittedMessage');
    const finalSuccessMessage = document.getElementById('finalSuccessMessage');
    const guestCountInfo = document.getElementById('guest-count-info');
    const backToInviteBtn = document.getElementById('backToInviteBtn');
    const clearStorageBtn = document.getElementById('clearStorageBtn');

    if (form) {
        const numGuests = parseInt(numGuestsFromUrl);

        if (!numGuests || numGuests < 1 || numGuests > 6) {
            if (guestCountInfo) {
                guestCountInfo.textContent = 'El enlace no es válido. Por favor, revisa el enlace de tu invitación.';
            }
            if (formContainer) formContainer.style.display = 'none';
        } else {
            if (guestCountInfo) {
                guestCountInfo.textContent = `Tienes ${numGuests} pase(s) para esta celebración. Por favor, registra el/los nombre(s):`;
            }
            generateGuestFields(numGuests);
            
            // Lógica para bloquear futuros envíos.
            //if (localStorage.getItem('formSubmitted') === 'true') {
              //  if (formContainer) formContainer.style.display = 'none';
               // if (alreadySubmittedMessage) alreadySubmittedMessage.style.display = 'block';
            //}

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
                const scriptUrl = 'https://script.google.com/macros/s/AKfycbxYjNzS-S5xVFH1GxZzz-JKO7p_3HDfdi7cLbSGYgL4lRbtTpgCaHmFeh9D7-QdgLGt/exec';

                fetch(scriptUrl, {
                    method: 'POST',
                    body: formData
                })
                .then(response => response.json())
                .then(data => {
                    if (data.result === 'success') {
                        if (formContainer) formContainer.style.display = 'none';
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
        // Usamos history.back() para regresar en el historial del navegador.
        // Esto es más seguro y fiable que usar una ruta de archivo.
        history.back();
    });
}

    if (clearStorageBtn) {
        clearStorageBtn.addEventListener('click', () => {
            localStorage.removeItem('formSubmitted');
            alert('El registro de envío ha sido borrado. Ahora puedes volver a enviar el formulario.');
            location.reload();
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