import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

const isMarketOpen = () => {
    dayjs.extend(utc);
    const currentTime = dayjs().utc();
    const currentDay = currentTime.day();
    const currentHour = currentTime.hour();
    const result =
        currentDay !== 0 &&
        currentDay !== 6 &&
        (currentHour < 2 || currentHour >= 9);
    return result;
};

const getMarketState = () => {
    dayjs.extend(utc);
    const currentTime = dayjs().utc();
    const currentDay = currentTime.day();
    const currentHour = currentTime.hour();
    const currentMinute = currentTime.minute();

    let result = '';
    if (
        currentDay === 0 ||
        currentDay === 6 ||
        (currentHour >= 2 && currentHour < 9)
    ) {
        result = 'Market-Close';
    } else if (
        (currentHour === 14 && currentMinute >= 30) ||
        (currentHour >= 15 && currentHour < 22)
    ) {
        result = 'Regular-Market-Hours';
    } else if (currentHour >= 22) {
        result = 'After-Hours';
    } else {
        result = 'Pre-Market';
    }
    return result;
};

export { isMarketOpen, getMarketState };
