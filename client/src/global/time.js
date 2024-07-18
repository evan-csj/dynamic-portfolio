import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

const isMarketOpen = () => {
    dayjs.extend(utc);
    const currentUTC = dayjs().utc();
    const currentEST = currentUTC.subtract(4, 'hour');
    const currentDay = currentEST.day();
    const currentHour = currentEST.hour();
    const result =
        currentDay === 0 ||
        currentDay === 6 ||
        currentHour >= 8 ||
        currentHour < 4;
    return result;
};

const getMarketState = () => {
    dayjs.extend(utc);
    const currentUTC = dayjs().utc();
    const currentEST = currentUTC.subtract(4, 'hour');
    const currentDay = currentEST.day();
    const currentHour = currentEST.hour();
    const currentMinute = currentEST.minute();

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
