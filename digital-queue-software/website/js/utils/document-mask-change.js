import IMask from 'imask';



/**
    * @param {HTMLElement} select
    * @param {HTMLElement} fieldTarget
*/
export default function(select, fieldTarget) {
    const selectOptions = select.querySelectorAll('option');


    const options = {};
    for (let i = 0; i < selectOptions.length; i++) {
        options[selectOptions[i].value] = {
            mask: selectOptions[i].getAttribute('data-mask'),
            replaceRegex: selectOptions[i].getAttribute('data-replace-regex')
        };
    }


    let curentMask = null;


    function change() {
        if (!options[select.value].mask) {
            if (curentMask != null) {
                curentMask.destroy();
            }

            curentMask = null;

            fieldTarget.value = '';
            fieldTarget.setAttribute('data-replace-regex', '');

            return;
        }


        if (curentMask === null) {
            curentMask = IMask(fieldTarget, {
                mask: options[select.value].mask
            });
        }
        else {
            curentMask.updateOptions({
                mask: options[select.value].mask
            });
        }

        fieldTarget.value = '';
        fieldTarget.setAttribute('data-replace-regex', options[select.value].replaceRegex);
        curentMask.updateValue();

        fieldTarget.dmc_updateValue = function() {
            curentMask.updateValue();
        };
    }

    select.dmc_triggerChange = change;
    select.addEventListener('change', change);
}
