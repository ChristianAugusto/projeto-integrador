export default function(hourStr) {
    const hourPieces = hourStr.split(':');

    return Number(hourPieces[0]) * 60 + Number(hourPieces[1]) + Number(hourPieces[2]) / 60;
}
