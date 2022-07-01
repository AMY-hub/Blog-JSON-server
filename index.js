const jsonServer = require('json-server');
const auth = require('json-server-auth');
const cors = require('cors');

const server = jsonServer.create();
const router = jsonServer.router('./db.json');
server.db = router.db;

const middleWares = jsonServer.defaults();

const port = 8000;

//Permission rules:
const rules = auth.rewriter({
  posts: 664,
  newpost: 660,
});

const whitelist = [
  'http://localhost', 
  'http://localhost:8000',
  'http://localhost:3000',
  'https://glitch.com'
];

const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        const originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    methods: ['GET', 'PUT', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: 'accept, content-type, authorization'
};

server.use(cors(corsOptions));
server.use(rules);
server.use(auth);
server.use(middleWares);

server.get('/echo', (req, res) => {
    res.jsonp(req.query)
  });

server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'POST' || req.method === 'PUT') {
    req.body.createdAt = Date.now()
  }
  next()
})

server.use(router);
server.listen(port);