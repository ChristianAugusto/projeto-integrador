import El from './cache-selectors';
import pageCache from './page-cache';
import hourStringToMinutes from '@WebsiteUtils/hour-string-to-minutes';
import minutesToHourString from '@WebsiteUtils/minutes-to-hour-string';



export default function(timeSliceClickCallback, childElements) {
    const { start, end, userTimeMinutes } = pageCache.queue;
    const { queueUsers } = pageCache;


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

        const queueTimeSlice = document.createElement('li');

        queueTimeSlice.className = `queue__time-slice${userInTime.length === 0 ? '' : ' unavailable'}${userAttended === null ? '' : ' attended'}`;
        queueTimeSlice.innerHTML = `
            <div class="queue__time-slice__art">
                <p class="queue__time-slice__user-name">${userName || ''}</p>
            </div>
            <div class="queue__time-slice__label">
                <p class="queue__time-slice__time">${minutesToHourString(curentTime)}</p>
            </div>
        `;

        if (childElements) {
            for (let i = 0; i < childElements.length; i++) {
                queueTimeSlice.appendChild(childElements[i]);
            }
        }

        if (userInTime.length === 0) {
            queueTimeSlice.onclick = timeSliceClickCallback;
        }



        El.digitalQueueTimeSlices.appendChild(queueTimeSlice);
    }
}
