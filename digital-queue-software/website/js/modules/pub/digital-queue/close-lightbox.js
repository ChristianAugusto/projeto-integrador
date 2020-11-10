import page from '@WebsiteGlobal/page';
import overlay from '@WebsiteGlobal/overlay';
import El from './cache-selectors';



export default function() {
    page.unblockScroll();
    overlay.hide();
    El.registerLightbox.self.classList.remove('is--visible');
}
