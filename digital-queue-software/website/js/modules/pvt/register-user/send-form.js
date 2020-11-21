import El from './cache-selectors';
import {
    ROUTES,
    SERVER_ERROR_MESSAGE
} from '@WebsiteConstants';
import {
    buildHeaders
} from '@WebsiteUtils/api-call';



const PASSWORD_MIN_SIZE = 8;
const PASSWORD_MAX_SIZE = 16;


/**
    * @param {string} email
*/
async function validateEmail(email) {
    try {
        const response = await fetch(ROUTES.api.pvt.users, {
            method: 'POST',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                email
            })
        });

        const responseObj = await response.json();

        return responseObj.data.length === 0;
    }
    catch (error) {
        console.error(error);
        return false;
    }
}


export default async function(event) {
    event.preventDefault();


    try {
        const userEmail = El.form.userEmail.value.trim();
        const userPassword = El.form.userPassword.value.trim();
        const userConfirmPassword = El.form.userConfirmPassword.value.trim();

        const validateEmailResponse = await validateEmail(userEmail);

        if (!validateEmailResponse) {
            El.form.userEmail.classList.add('has--errors');

            alert('O email informado já foi cadastrado');

            return false;
        }

        if (userPassword.length < PASSWORD_MIN_SIZE || userPassword.length > PASSWORD_MAX_SIZE) {
            El.form.userPassword.classList.add('has--errors');
            alert(`A senha escolhida precisa ter no mínimo ${PASSWORD_MIN_SIZE} caracteres e no máximo ${PASSWORD_MAX_SIZE} caracteres`);

            return false;
        }

        if (userPassword != userConfirmPassword) {
            El.form.userPassword.classList.add('has--errors');
            El.form.userConfirmPassword.classList.add('has--errors');

            alert('Os campos de senhas não coincidem');

            return false;
        }



        const newUser = {
            name: El.form.userName.value.trim(),
            email: userEmail,
            password: userPassword,
            telephone: El.form.userTelephone.value.trim(),
            document: El.form.userDocument.value.trim().replace(
                new RegExp(El.form.userDocument.getAttribute('data-replace-regex'), 'gmi'),
                ''
            ),
            documentType: El.form.userDocumentType.value,
            nationality: El.form.userNationality.value.trim(),
            roleType: El.form.userRoleType.value
        };

        const sendFormResponse = await fetch(ROUTES.api.pvt.users, {
            method: 'PUT',
            headers: buildHeaders({
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify(newUser)
        });

        const sendFormResponseObj = await sendFormResponse.json();

        if (sendFormResponseObj.created) {
            alert('Sucesso');
            window.location.reload();
        }
        else {
            alert(SERVER_ERROR_MESSAGE);
        }

        return true;
    }
    catch (error) {
        console.error(error);
        alert(SERVER_ERROR_MESSAGE);
        return false;
    }
}
