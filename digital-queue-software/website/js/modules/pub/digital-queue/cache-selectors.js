export default {
    digitalQueue: {
        id: document.querySelector('.js--queue-id'),
        timeSlices: document.querySelector('.js--queue-time-slices'),
    },
    registerLightbox: {
        self: document.querySelector('.js--register-lightbox'),
        closeLightbox: document.querySelector('#js--close-register-lightbox'),
        form: {
            self: document.querySelector('.js--queue-register-form'),
            userName: document.querySelector('#js--user-name'),
            userEmail: document.querySelector('#js--user-email'),
            userTelephone: document.querySelector('#js--user-telephone'),
            userDocumentType: document.querySelector('#js--user-document-type'),
            userDocument: document.querySelector('#js--user-document'),
            userNationality: document.querySelector('#js--user-nationality'),
            userTransport: document.querySelector('#js--user-transport'),
            userAppointment: document.querySelector('#js--user-appointment'),
            registerButton: document.querySelector('#register-user-button')
        }
    }
};
