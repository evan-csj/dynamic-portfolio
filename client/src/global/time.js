import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

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

const marketState = () => {
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
        result = 'close';
    } else if (currentHour >= 14 && currentMinute >= 30 && currentHour < 22) {
        result = 'regular';
    } else if (currentHour >= 22) {
        result = 'after';
    } else {
        result = 'pre';
    }
    return result;
};

export { isMarketOpen, marketState };
