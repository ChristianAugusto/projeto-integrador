import logger from '@ServerUtils/logger';



export default function(requiredFields, obj) {
    try {
        const fields = Object.keys(obj);

        for (let i = 0; i < requiredFields.length; i++) {
            const value = obj[requiredFields[i]];

            if (
                fields.indexOf(requiredFields[i]) == -1 || value == '' || value == null
            ) {
                return false;
            }
        }

        return true;
    }
    catch (error) {
        logger.info(error);

        return false;
    }
}
