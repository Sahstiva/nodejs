const db = require('./models/db.js');
const initdb = require('./models/initdb.js');
initdb();

const express = require('express');

const app = express();

const http = require('http').createServer(app);

const io = require('socket.io')(http);

const { Worker } = require('worker_threads');

app.use(express.static(__dirname+'/public'));

const session = require('express-session');
const sessionMiddleware = session({
  secret: "Большой секрет",
  resave: false,
  saveUninitialized: false,
  rolling: true,
  cookie: { maxAge: 600000 }
});

app.use(sessionMiddleware);

io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

io.on('connection', socket => {
  if (!socket.request.session || !socket.request.session.username) {
    console.log('Unauthorised user connected!');
    socket.disconnect();
    return;
  }
  io.emit('UserConnected', { username: socket.request.session.username, users: io.of("/").sockets.size });


  socket.on('disconnect', () => {
    io.emit('UserDisconnected', { username: socket.request.session.username, users: io.of("/").sockets.size });

  });

  socket.on('chatMessage', (data) => {
    console.log('Chat message from', socket.request.session.username+':', data);
    data.message = socket.request.session.username + ': ' + data.message;
    io.emit('chatMessage', data);
  });

  socket.on('workerLogStart', data => {
    console.log('Starting log worker:', data.sourceFile);
    const worker = new Worker('./logworker.js', {
      workerData: data,
    });
    worker.on('message', progress => {
      socket.emit('progress', progress);
    });
  });
});

const getPrimes = require('./primes.js');

io.of('/primes').on('connection', (socket) => {
  console.log('Primes user connected');
  socket.on('getPrimes', data => {
    console.log('getPrimes:', data.MAXNUM);
    const primes = getPrimes(data.MAXNUM);
    socket.emit('result', { primes });
  })
  socket.on('workerPrimes', data => {
    console.log('workerPrimes:', data.MAXNUM);
    const worker = new Worker('./primesWorker.js', {
      workerData: data,
    })

    const timer = setInterval(() => {
      socket.emit('working', { task: data.MAXNUM });
    }, 1000);

    worker.on('message', data => {
      socket.emit('result', { primes: data.primes });
      clearInterval(timer);
    })
  })
})
const middlewares = require('./middlewares');
app.use(middlewares.logSession);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const templating = require('consolidate');
const handlebars = require('handlebars');
templating.requires.handlebars = handlebars;

const registerHelpers = require('./views/helpers');
registerHelpers();

app.engine('hbs', templating.handlebars);
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');

const router = require('./routers');

app.get('/primes', (req, res) => res.render('primes', {}));
app.use(router);

http.listen(3000, () => {
    console.log('Server listening on 3000 port.');
});
