import page from '@WebsiteGlobal/page';
import overlay from '@WebsiteGlobal/overlay';
import El from './cache-selectors';



export default function() {
    page.blockScroll();
    overlay.show();
    El.registerLightbox.self.classList.add('is--visible');
}
