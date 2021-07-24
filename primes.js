function getPrimes(MAXNUM) {
  const primes = [2, 3];
  let numbers = 0;

  for (var i=5; i<MAXNUM; i+=2) {
    numbers++;
    for (var j=1; (primes[j]*primes[j]<=i) && (i % primes[j] !== 0); j++) {};
    if (j===primes.length || primes[j]*primes[j]>i) {
      primes.push(i);
    }
  }

  return primes;
}

module.exports = getPrimes;