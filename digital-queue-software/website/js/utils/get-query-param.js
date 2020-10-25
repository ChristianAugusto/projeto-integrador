export default function(target) {
    try {
        const params = window.location.search.substring(1).split('&');

        for (let i = 0; i < params.length; i++) {
            const [name, value] = params[i].split('=');

            if (target === name) {
                return value;
            }
        }

        return null;
    }
    catch (error) {
        console.warn(error);

        return null;
    }
}
