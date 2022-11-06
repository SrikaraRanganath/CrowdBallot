const routes = require('next-routes')();

routes
    .add('/ballots/new','ballots/new')
    .add('/ballots/:address','/ballots/show')
    .add('/ballots/:address/candidate','/ballots/candidate')
    .add('/ballots/:address/castvote','/ballots/castvote');


module.exports = routes;