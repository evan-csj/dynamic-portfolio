import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const isMarketOpen = () => {
    dayjs.extend(timezone);
    const currentTime = dayjs().tz('America/Toronto');
    const currentDay = currentTime.day();
    const currentHour = currentTime.hour();
    const result =
        currentDay === 0 ||
        currentDay === 6 ||
        currentHour >= 8 ||
        currentHour < 4;
    return result;
};

const getMarketState = () => {
    dayjs.extend(timezone);
    const currentTime = dayjs().tz('America/Toronto');
    const currentDay = currentTime.day();
    const currentHour = currentTime.hour();
    const currentMinute = currentTime.minute();

    let result = '';
    if (
        currentDay === 0 ||
        currentDay === 6 ||
        currentHour >= 20 ||
        currentHour < 4
    ) {
        result = 'Market-Close';
    } else if (
        (currentHour === 9 && currentMinute >= 30) ||
        (currentHour >= 10 && currentHour < 16)
    ) {
        result = 'Regular-Market-Hours';
    } else if (currentHour >= 16) {
        result = 'After-Hours';
    } else {
        result = 'Pre-Market';
    }
    return result;
};

export { isMarketOpen, getMarketState };
