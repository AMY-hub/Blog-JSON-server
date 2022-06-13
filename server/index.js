const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('./db.json');
const middleWares = jsonServer.defaults();

const port = 8000;

server.use(middleWares);

server.get('/echo', (req, res) => {
    res.jsonp(req.query)
  });

server.use(jsonServer.bodyParser);

server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now()
  }
  next()
})

server.use(router);
server.listen(port);