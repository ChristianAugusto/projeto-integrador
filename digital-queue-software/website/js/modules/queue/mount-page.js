import El from './cache-selectors';
import getQueue from './get-queue';
import getQueueUsers from './get-queue-users';
import hourStringToMinutes from '@WebsiteUtils/hour-string-to-minutes';
import minutesToHourString from '@WebsiteUtils/minutes-to-hour-string';



export default async function() {
    const queueResponse = await getQueue();

    const queue = queueResponse.data[0];

    const queueUsersResponse = await getQueueUsers();

    const queueUsers = queueUsersResponse.data;

    buildTimeSlices(
        queue.start, queue.end, queue.userTimeMinutes, queueUsers
    );
}

function buildTimeSlices(start, end, userTimeMinutes, queueUsers) {
    /*
        TODO: Montar fila de usuários preenchidos com o nome
        e seu respectivo horário. Também pensar em uma forma
        de informar a pessoa se deu certo marcar ou não.
    */

    for (
        let curentTime = hourStringToMinutes(start), limit = hourStringToMinutes(end);
        curentTime < limit; curentTime += userTimeMinutes
    ) {
        const userInTime = queueUsers.filter(
            queueUser => hourStringToMinutes(queueUser.appointment) === curentTime
        );

        let userName = null;
        let userAttended  = null;

        if (userInTime.length > 0) {
            userName = userInTime[0].name;
            userAttended = userInTime[0].attended;
        }

        El.digitalQueueTimeSlices.innerHTML += `
            <li class="queue__time-slice${userInTime.length === 0 ? '' : ' unavailable'}${userAttended === null ? '' : ' attended'}">
                <div class="queue__time-slice__art">
                    <p class="queue__time-slice__user-name">${userName || ''}</p>
                </div>
                <div class="queue__time-slice__label">
                    <p class="queue__time-slice__time">${minutesToHourString(curentTime)}</p>
                </div>
            </li>
        `;
    }
}
