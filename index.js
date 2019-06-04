const restify = require('restify');
const restifyErrors = require('restify-errors');
const paginate = require('restify-paginate');
const corsMiddleware = require('restify-cors-middleware');

const server = restify.createServer({
    name: 'rest-api-mysql',
    version: '1.0.0'
});

const knex = require('knex')({
    client: 'mysql',
    connection: {
        host: '',
        user: '',
        password: '',
        database: ''
    }
});

const cors = corsMiddleware({
    origins: ['*']
});

server.pre(cors.preflight);
server.use(cors.actual);

server.use(restify.plugins.acceptParser(server.acceptable));
server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());
server.use(paginate(server));

server.listen(2021, function () {
    console.log('%s listening at %s', server.name, server.url);
});

server.get('/api/collaborators', function (req, res, next) {
    knex('collaborator').then(data => {
        res.paginate.send(data);
    }, next);
});

server.get('/api/collaborators/:id', function (req, res, next) {
    const { id } = req.params;
    knex('collaborator').where('id', id).first().then(data => {
        if (!data) return res.send(new restifyErrors.BadRequestError('Nenhum registro encontrado'));
        res.send(data);
    }, next);
});

server.post('/api/collaborators', function (req, res, next) {
    knex('collaborator').insert(req.body).then(data => {
        res.send(data);
    }, next);
});

server.put('/api/collaborators/:id', function (req, res, next) {
    const { id } = req.params;
    knex('collaborator').where('id', id).update(req.body).then(data => {
        if (!data) return res.send(new restifyErrors.BadRequestError('Não foi possível atualizar o registro'));
        res.send('Dados atualizados com sucesso!');
    }, next);
});

server.del('/api/collaborators/:id', function (req, res, next) {
    const { id } = req.params;
    knex('collaborator').where('id', id).delete().then(data => {
        if (!data) return res.send(new restifyErrors.BadRequestError('Não foi possível deletar o registro'));
        res.send('Dados excluidos com sucesso!');
    }, next);
});