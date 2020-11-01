import getQueueData from './get-queue-data';
import buildTimeSlices from './build-time-slices';



function timeSliceClickCallback() {
    console.log('oi');
}



export default async function() {
    try {
        await getQueueData();
        buildTimeSlices(timeSliceClickCallback);
    }
    catch (error) {
        console.error(error);
        console.error('Error in mount page');
    }
}
