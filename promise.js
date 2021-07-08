console.log('Record 1');

setTimeout(() => {
  console.log('Record 2');
  Promise.resolve().then(() => {
    setTimeout(() => {
    console.log('Record 3');
    Promise.resolve().then(() => {
      console.log('Record 4');
      });
    });
  });
});

console.log('Record 5');

Promise.resolve().then(() => Promise.resolve().then(() => console.log('Record 6')));

// Порядок выполнения - 1, 5, 6, 2, 3, 4
// 1 и 5 выполняются, как обычный синхронный код
// 6 - очередь микрозадач
// 2 - очередь таймеров
// 3, 4 - новая очередь микрозадач