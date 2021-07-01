const colors = require("colors/safe");

if(process.argv[2] && process.argv[3]) {
    let startNum = parseInt(process.argv[2]);
    let endNum = parseInt(process.argv[3]);
    if(typeof startNum === 'number' && typeof endNum === 'number') {
        let counter = 1;
        for(let i = (endNum >= startNum ? startNum : endNum); i <= (endNum >= startNum ? endNum : startNum); i++) {
            if(isPrime(i)) {
                switch (counter % 3) {
                    case 1:
                        console.log(colors.green(i));
                        counter++;
                        break;
                    case 2:
                        console.log(colors.yellow(i));
                        counter++;
                        break;
                    case 0:
                        console.log(colors.red(i));
                        counter++;
                        break;
                    default:
                        break;
                }
            }
        }
        console.log(colors.green('В диапазоне от ') + colors.cyan(endNum >= startNum ? startNum : endNum) + colors.green(' до ') + colors.magenta(endNum >= startNum ? endNum : startNum) + (--counter ? (colors.green(' найдено ') + colors.blue(counter) + colors.green(' простых чисел')) : colors.red(' простых числе не найдено!')));
    }
} else {
    console.log(colors.red('При запуске программы укажите два целых числа в качестве диапазона!'));
}

function isPrime(n) {
    if( n === 1)
        return false;
    for (let i = 2; i < n; i++)
        if (n % i === 0)
            return false;
    return true;
}