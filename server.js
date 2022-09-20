const jsonServer = require('json-server');
const server = jsonServer.create()
const router = jsonServer.router('src/app/api/db.json')
const middlewares = jsonServer.defaults()

const db = router.db;
const name = 'todos';

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares)

// Add custom routes before JSON Server router
server.get('/summary', (req, res) => {
  const todos = db.get(name).value();

  let list = [...todos];
  let completed = req.query.completed || null;

  if (completed !== null) {
    completed = completed === 'true';
    list = list.filter(val => val.completed === completed);
  }

  let page = req.query._page || 1;
  let limit = req.query._limit || 9999;
  page = typeof page === 'string' ? Number(page): page;
  limit = typeof limit === 'string' ? Number(limit): limit;

  let size = Math.ceil(list.length / limit);
  size = size === 0 ? 1 : size;

  const uncompletedCount = todos.filter(val => !val.completed).length;

  const result = list.slice((page -1) * limit, page * limit);
  res.header('X-Total-Count', todos.length);

  res.jsonp({
    todos: result,
    pages: {
      page,
      limit,
      size,
      uncompletedCount,
      categoryCount: list.length,
      totalCount: todos.length
    }
  })
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser)
server.use((req, res, next) => {
  // Continue to JSON Server router
  next()
})

// Set All
server.put('/all', (req, res) => {
  const todosDB = db.get(name);
  const todos = todosDB.value();
  const completed = req.query.completed === 'true';

  todos.forEach(item => {
    todosDB.updateById(item.id, { completed }).write()
  });

  res.jsonp({
    todos
  });
});

// Remove
server.delete('/completed', (req, res) => {
  const todosDB = db.get(name);
  const todos = todosDB.value();

  todos
    .filter(item => item.completed)
    .map(item => {
      todosDB.removeById(item.id).write();
    })

  res.status(200).send();
});

// Use default router
server.use(router)
server.listen(4201, () => {
  console.log('JSON Server is running')
})
