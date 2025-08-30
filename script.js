document.addEventListener('DOMContentLoaded', () => {

    const invitationPageElements = {
        clickOverlay: document.querySelector('.click-overlay'),
        envelope: document.querySelector('.envelope'),
        invitationCard: document.querySelector('.invitation-card'),
        invitationTitle: document.querySelector('.invitation-card .title'),
        invitationContent: document.querySelector('.invitation-card .content'),
        invitationDetails: document.querySelector('.invitation-card .details'),
        rsvpButton: document.querySelector('.rsvp-button'),
        countdownElement: document.getElementById('countdown'),
        deadlineNotice: document.getElementById('deadline-notice'),
        backgroundMusic: document.getElementById('background-music')
    };

    const confirmationPageElements = {
        formContainer: document.getElementById('formContainer'),
        messageContainer: document.getElementById('messageContainer'),
        form: document.getElementById('attendanceForm'),
        guestFieldsContainer: document.getElementById('guestFieldsContainer'),
        responseMessage: document.getElementById('responseMessage'),
        alreadySubmittedMessage: document.getElementById('alreadySubmittedMessage'),
        finalSuccessMessage: document.getElementById('finalSuccessMessage'),
        guestCountInfo: document.getElementById('guest-count-info'),
        backToInviteBtn: document.getElementById('backToInviteBtn'),
        confirmButtonExtra: document.getElementById('confirmButton'),
        maybeButtonExtra: document.getElementById('maybeButton'),
        extraButtonsSection: document.getElementById('extraButtons')
    };

    const urlParams = new URLSearchParams(window.location.search);
    const uniqueId = urlParams.get('id');

    // Lógica para la página de invitación (index.html)
    if (invitationPageElements.clickOverlay) {
        const invitationText = {
            title: "ESTAS CORDIALMENTE INVITADO/A",
            content: "Acompáñanos a celebrar los XV Años de:<br><span id='alondra-name'>Alondra Torres Godoy</span><br>en una noche de magia y encanto, donde el Gran Comedor de Hogwarts será nuestro telón de fondo.",
            details: "Fecha: [Fecha]<br>Hora: [Hora]<br>Lugar: [Lugar]<br>¡se requiere Varita!"
        };
        const partyDate = new Date("November 22, 2025 23:59:59").getTime();
        const deadlineDate = new Date("November 20, 2025 23:59:59").getTime();
        let countdownInterval;

        function showInvitationContent() {
            if (invitationPageElements.invitationTitle) invitationPageElements.invitationTitle.innerHTML = invitationText.title;
            if (invitationPageElements.invitationContent) invitationPageElements.invitationContent.innerHTML = invitationText.content;
            if (invitationPageElements.invitationDetails) invitationPageElements.invitationDetails.innerHTML = invitationText.details;

            [invitationPageElements.invitationTitle, invitationPageElements.invitationContent, invitationPageElements.invitationDetails].forEach(el => {
                if(el) el.style.opacity = 1;
            });
            
            startCountdown();
            if (invitationPageElements.rsvpButton) invitationPageElements.rsvpButton.classList.add('visible-button');

            if (invitationPageElements.backgroundMusic) {
                invitationPageElements.backgroundMusic.play().catch(e => console.log("Música no se pudo reproducir automáticamente."));
            }
        }

        function startCountdown() {
            if (!invitationPageElements.countdownElement || !invitationPageElements.deadlineNotice) return;
            invitationPageElements.countdownElement.style.opacity = 1;
            invitationPageElements.deadlineNotice.style.opacity = 1;
            countdownInterval = setInterval(() => {
                const now = new Date().getTime();
                const distance = partyDate - now;
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                
                if (distance < 0) {
                    clearInterval(countdownInterval);
                    invitationPageElements.countdownElement.textContent = "¡Es hoy la fiesta!";
                } else {
                    invitationPageElements.countdownElement.textContent = `Faltan: ${days}d ${hours}h ${minutes}m ${seconds}s`;
                }

                if (now >= deadlineDate) {
                    if(invitationPageElements.rsvpButton) {
                        invitationPageElements.rsvpButton.disabled = true;
                        invitationPageElements.rsvpButton.textContent = "Registro Cerrado";
                    }
                    invitationPageElements.deadlineNotice.textContent = "Fecha límite de confirmación: 20 de noviembre de 2025 (Expirada)";
                } else {
                    invitationPageElements.deadlineNotice.textContent = "Fecha límite de confirmación: 20 de noviembre de 2025";
                }
            }, 1000);
        }

        if (localStorage.getItem('invitationViewed') === 'true') {
            invitationPageElements.clickOverlay.classList.add('hidden');
            if (invitationPageElements.envelope) invitationPageElements.envelope.classList.add('open');
            if (invitationPageElements.invitationCard) invitationPageElements.invitationCard.classList.add('visible');
            showInvitationContent();
        } else {
            invitationPageElements.clickOverlay.addEventListener('click', () => {
                if (invitationPageElements.backgroundMusic) {
                    invitationPageElements.backgroundMusic.play().catch(e => console.log("La reproducción automática fue bloqueada:", e));
                }
                invitationPageElements.clickOverlay.classList.add('hidden');
                if (invitationPageElements.envelope) invitationPageElements.envelope.classList.add('open');
                
                setTimeout(() => {
                    if (invitationPageElements.invitationCard) invitationPageElements.invitationCard.classList.add('visible');
                    showInvitationContent();
                }, 1000);

                localStorage.setItem('invitationViewed', 'true');
            }, { once: true });
        }

        if (invitationPageElements.rsvpButton) {
            // Verifica si hay un ID único en el URL
            const rsvpUniqueId = urlParams.get('id');

            if (!rsvpUniqueId) {
                // Si no hay ID, el botón no funcionará
                invitationPageElements.rsvpButton.disabled = true;
                invitationPageElements.rsvpButton.textContent = "Enlace inválido";
            } else {
                // El botón ahora redirige a la página de confirmación con el ID único
                invitationPageElements.rsvpButton.href = `confirmacion.html?id=${rsvpUniqueId}`;
            }

            if (localStorage.getItem('formSubmitted') === 'true') {
                invitationPageElements.rsvpButton.disabled = true;
                invitationPageElements.rsvpButton.textContent = "¡Ya te has registrado!";
                invitationPageElements.rsvpButton.classList.add('disabled-button'); 
            }
        }
    }

    // Lógica para la página de confirmación (confirmacion.html)
    if (confirmationPageElements.form) {
        const scriptUrl = 'https://script.google.com/macros/s/AKfycbwZa9U8gbWYIhvOWR_MUWWUeS9pICKQcp5FgbxinnvIXx5eT0j9LrvraFx2UUHG0gCi/exec';
        
        // Función para enviar el estado de asistencia
        function sendAttendanceStatus(status) {
            if (!uniqueId) {
                alert("ID de invitado no encontrado. Por favor, use el enlace de su invitación.");
                return;
            }

            const formData = new FormData();
            formData.append('ID_Unico', uniqueId);
            formData.append('status', status);

            fetch(scriptUrl, {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.result === 'success') {
                    alert(`Tu estado ha sido actualizado a: ${status}`);
                } else {
                    alert('Hubo un error al actualizar tu estado. Inténtalo de nuevo.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Hubo un error de conexión. Por favor, revisa tu conexión.');
            });
        }

        // Manejar el clic de los nuevos botones
        if (confirmationPageElements.confirmButtonExtra) {
            confirmationPageElements.confirmButtonExtra.addEventListener('click', () => {
                sendAttendanceStatus('confirmed');
            });
        }
        if (confirmationPageElements.maybeButtonExtra) {
            confirmationPageElements.maybeButtonExtra.addEventListener('click', () => {
                sendAttendanceStatus('maybe');
            });
        }

        // Cargar los datos del invitado al cargar la página
        if (uniqueId) {
            fetch(`${scriptUrl}?id=${uniqueId}`, { method: 'GET' })
                .then(response => response.json())
                .then(data => {
                    if (data.error) {
                        if (confirmationPageElements.guestCountInfo) confirmationPageElements.guestCountInfo.textContent = 'El enlace no es válido. Por favor, revisa el enlace de tu invitación.';
                        if (confirmationPageElements.formContainer) confirmationPageElements.formContainer.style.display = 'none';
                        return;
                    }

                    const numGuests = data.numGuests;
                    const status = data.status;

                    if (status === 'confirmed' || status === 'maybe') {
                        if (confirmationPageElements.formContainer) confirmationPageElements.formContainer.style.display = 'none';
                        if (confirmationPageElements.alreadySubmittedMessage) confirmationPageElements.alreadySubmittedMessage.style.display = 'block';
                        if (confirmationPageElements.backToInviteBtn) confirmationPageElements.backToInviteBtn.style.display = 'block';
                        localStorage.setItem('formSubmitted', 'true');
                        return;
                    }
                    
                    if (confirmationPageElements.guestCountInfo) {
                        confirmationPageElements.guestCountInfo.textContent = `Tienes ${numGuests} pase(s) de entrada. Por favor, registra el/los nombre(s):`;
                    }
                    generateGuestFields(numGuests);
                    
                    if (confirmationPageElements.form) {
                        confirmationPageElements.form.addEventListener('submit', function(e) {
                            e.preventDefault();
                            
                            const submitButton = confirmationPageElements.form.querySelector('button[type="submit"]');
                            if (submitButton) {
                                submitButton.disabled = true;
                                submitButton.textContent = 'Enviando...';
                            }
                            
                            const guestNames = confirmationPageElements.guestFieldsContainer.querySelectorAll('input');
                            let allFilled = true;
                            guestNames.forEach(input => {
                                if (!input.value.trim()) {
                                    allFilled = false;
                                }
                            });

                            if (!allFilled) {
                                alert('Por favor, llena todos los campos de nombre.');
                                if (submitButton) {
                                    submitButton.disabled = false;
                                    submitButton.textContent = 'Confirmar Asistencia';
                                }
                                return;
                            }

                            const formData = new FormData(confirmationPageElements.form);
                            formData.append('numGuests', numGuests);
                            formData.append('ID_Unico', uniqueId); // Agrega el ID único al formulario
                            formData.append('status', 'confirmed'); // Por defecto, es 'confirmed' si envían el formulario

                            fetch(scriptUrl, {
                                method: 'POST',
                                body: formData
                            })
                            .then(response => response.json())
                            .then(data => {
                                if (data.result === 'success') {
                                    if (confirmationPageElements.formContainer) confirmationPageElements.formContainer.style.display = 'none';
                                    if (confirmationPageElements.messageContainer) confirmationPageElements.messageContainer.style.display = 'none';
                                    if (confirmationPageElements.finalSuccessMessage) {
                                        confirmationPageElements.finalSuccessMessage.style.display = 'block';
                                        if (confirmationPageElements.backToInviteBtn) confirmationPageElements.backToInviteBtn.style.display = 'block';
                                    }
                                    localStorage.setItem('formSubmitted', 'true');
                                } else {
                                    alert('Hubo un error al enviar los datos. Inténtalo de nuevo.');
                                }
                                if (submitButton) {
                                    submitButton.disabled = false;
                                    submitButton.textContent = 'Confirmar Asistencia';
                                }
                            })
                            .catch(error => {
                                console.error('Error:', error);
                                alert('Hubo un error de conexión. Por favor, revisa tu conexión o intenta más tarde.');
                                if (submitButton) {
                                    submitButton.disabled = false;
                                    submitButton.textContent = 'Confirmar Asistencia';
                                }
                            });
                        });
                    }
                })
                .catch(error => {
                    console.error('Error al obtener datos del invitado:', error);
                    if (confirmationPageElements.guestCountInfo) {
                        confirmationPageElements.guestCountInfo.textContent = 'Error al cargar los datos. Por favor, inténtalo de nuevo.';
                    }
                    if (confirmationPageElements.formContainer) confirmationPageElements.formContainer.style.display = 'none';
                });
        }


        if (confirmationPageElements.backToInviteBtn) {
            confirmationPageElements.backToInviteBtn.addEventListener('click', () => {
                window.location.href = `index.html?id=${uniqueId}`;
            });
        }

        function generateGuestFields(num) {
            if (!confirmationPageElements.guestFieldsContainer) return;
            confirmationPageElements.guestFieldsContainer.innerHTML = '';
            for (let i = 1; i <= num; i++) {
                const formGroup = document.createElement('div');
                formGroup.className = 'form-group';
                formGroup.innerHTML = `
                    <label for="guestName${i}">Nombre Completo del Invitado ${i}:</label>
                    <input type="text" id="guestName${i}" name="Nombre_Invitado_${i}" required>
                `;
                confirmationPageElements.guestFieldsContainer.appendChild(formGroup);
            }
        }
    }
});