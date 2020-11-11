export default {
    digitalQueue: {
        id: document.getElementById('js--queue-id'),
        timeSlices: document.getElementById('js--queue-time-slices'),
    },
    registerLightbox: {
        self: document.getElementById('js--register-lightbox'),
        closeLightbox: document.getElementById('js--close-register-lightbox'),
        form: {
            self: document.getElementById('js--queue-register-form'),
            userName: document.getElementById('js--user-name'),
            userEmail: document.getElementById('js--user-email'),
            userTelephone: document.getElementById('js--user-telephone'),
            userDocumentType: document.getElementById('js--user-document-type'),
            userDocument: document.getElementById('js--user-document'),
            userNationality: document.getElementById('js--user-nationality'),
            userTransport: document.getElementById('js--user-transport'),
            userAppointment: document.getElementById('js--user-appointment'),
            registerButton: document.getElementById('register-user-button')
        }
    }
};
