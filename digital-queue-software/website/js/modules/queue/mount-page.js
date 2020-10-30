import El from './cache-selectors';
import getQueue from './get-queue';
import getQueueUsers from './get-queue-users';
import hourStringToMinutes from '@WebsiteUtils/hour-string-to-minutes';



export default async function() {
    const queueResponse = await getQueue();

    const queue = queueResponse.data[0];

    const queueUsersResponse = await getQueueUsers();

    const queueUsers = queueUsersResponse.data;

    buildTimeSlices(
        queue.start, queue.end, queue.userTimeMinutes, queueUsers
    );
}

function buildTimeSlices(start, end, userTimeMinutes) {
    /*
        TODO: Montar fila de usuários preenchidos com o nome
        e seu respectivo horário. Também pensar em uma forma
        de informar a pessoa se deu certo marcar ou não.
    */

    for (
        let i = hourStringToMinutes(start), limit = hourStringToMinutes(end);
        i < limit; i+= userTimeMinutes
    ) {
        El.digitalQueueTimeSlices.innerHTML += `
            <li class="queue__time-slice">
                <div class="queue__time-slice__art">
                
                </div>
                <div class="queue__time-slice__label">
                    
                </div>
            </li>
        `;
    }
}
