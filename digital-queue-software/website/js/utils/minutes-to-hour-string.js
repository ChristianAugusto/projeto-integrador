function getNumberInTimeFormat(value) {
    return `${value < 10 ? `0${value}` : value}`;
}



export default function(minutesTotal) {
    const hours = parseInt(minutesTotal / 60);
    const minutes = parseInt(minutesTotal % 60);
    const seconds = (minutesTotal % 60 - minutes) * 60;


    return `${getNumberInTimeFormat(hours)}:${getNumberInTimeFormat(minutes)}:${getNumberInTimeFormat(seconds)}`;
}
