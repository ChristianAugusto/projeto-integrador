export default {
    digitalQueue: {
        id: document.getElementById('js--digital-queue-id'),
        timeSlices: document.getElementById('js--digital-queue-time-slices'),
    },
    registerLightbox: {
        self: document.getElementById('js--register-digital-queue-user-lightbox'),
        closeLightbox: document.getElementById('js--close-register-digital-queue-user-lightbox'),
        form: {
            self: document.getElementById('js--digital-queue-register-form'),
            digitalQueueUserName: document.getElementById('js--digital-queue-user-name'),
            digitalQueueUserEmail: document.getElementById('js--digital-queue-user-email'),
            digitalQueueUserTelephone: document.getElementById('js--digital-queue-user-telephone'),
            digitalQueueUserDocumentType: document.getElementById('js--digital-queue-user-documentType'),
            digitalQueueUserDocument: document.getElementById('js--digital-queue-user-document'),
            digitalQueueUserNationality: document.getElementById('js--digital-queue-user-nationality'),
            digitalQueueUserTransport: document.getElementById('js--digital-queue-user-transport'),
            digitalQueueUserAppointment: document.getElementById('js--digital-queue-user-appointment')
        }
    }
};
