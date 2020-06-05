var chai = require('chai');
var assert = require('chai').assert;
var chaiHttp = require('chai-http');
var app = require('../app');

chai.use(chaiHttp);
chai.should();

describe('test backend api', async () => {
    it('should return OK on get', async () => {
        app.action();
    });
})