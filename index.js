const EventEmitter = require('events');
const colors = require('colors/safe');
const { DateTime } = require("luxon");
const timersEvents = new EventEmitter;

const timerInit = process.argv.slice(2);
const timersArr = [];

timersEvents.on('init', parseTimers);
timersEvents.on('start', showTimers);
timersEvents.on('error', (err) => {
    throw new Error(err);
});

try {
    timersEvents.emit('init');
    timersEvents.emit('start');
} catch(err) {
    console.error('-----');
    console.error(colors.red(err.message));
}

function parseTimers() {
    if(timerInit.length) {
        timerInit.forEach((timer, index) => {
            let tmpArr = timer.split('-').reverse().map(item => parseInt(item));
            if(tmpArr.length !== 4)
                timersEvents.emit('error',`${index+1}-й аргумент (${timer}) не соотвествует формату "час-день-месяц-год"!`);
            let tmpDate = DateTime.local(...tmpArr);
            if(!tmpDate)
                timersEvents.emit('error',`Не могу сконвертировать в дату - ${timer}`);
            timersArr.push(tmpDate);
        });
    } else
        timersEvents.emit('error',`Нет аргументов в командной строке!`);
}

function showTimers() {
    setInterval(() => {
        timersArr.forEach((timer, index) => {
            let diff = timer.diff(DateTime.now(), ['years', 'months', 'days', 'hours', 'minutes', 'seconds']);
            if (timer > DateTime.now()) {
                console.info(
                    colors.green(`До окончания ${index + 1}-го таймера осталось:
                ${diff.values.years} лет
                ${diff.values.months} месяцев
                ${diff.values.days} дней
                ${diff.values.hours} часов
                ${diff.values.minutes} минут
                ${diff.values.seconds} секунд`));
            } else
                console.info(colors.yellow(`Таймер ${index + 1} закончился.`))
        });
    },1000);
}