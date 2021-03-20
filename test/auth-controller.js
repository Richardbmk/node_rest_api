const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const AuthController = require('../controllers/auth');

// MongoDB Atlas configuration
require('dotenv').config();
const db_user = process.env.DB_USERNAME;
const db_password = process.env.DB_PASSWORD;
const db_name = process.env.DB_TEST_NAME;
const db_url_cloud = `mongodb+srv://${db_user}:${db_password}@cluster0-a0s4s.mongodb.net/${db_name}?retryWrites=true&w=majority`;
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

describe('Auth Controller', function() {
    before(function(done) {
        mongoose
            .connect(db_url_cloud)
            .then(() => {
                const user = new User({
                    email: 'test@test.com',
                    password: 'tester',
                    name: 'Test',
                    post: [],
                    _id: '5c0f66b979af55031b34728a'
                });
                return user.save();
            })
            .then(() => {
                done();
            });
    });

    beforeEach(function() {});

    afterEach(function() {});

    after(function(done) {
        User.deleteMany({})
            .then(() => {
                return mongoose.disconnect();
            })
            .then(() => {
                done();
            });
    });

    it('should throw an error with code 500 if accessing the database fails', function(done) {
        sinon.stub(User, 'findOne');
        User.findOne.throws();

        const req = {
            body: {
                email: 'test@test.com',
                password: 'tester'
            }
        };

        AuthController.login(req, {}, () => {}).then(result => {
            // console.log(result);
            expect(result).to.be.an('error');
            expect(result).to.have.property('statusCode', 500);
            done();
        });

        User.findOne.restore();
    });

    it('should send a response a response with a valid user status for an existing user', function(done) {
        const req = { userId: '5c0f66b979af55031b34728a' };
        const res = {
            statusCode: 500,
            userStatus: null,
            status: function(code) {
                this.statusCode = code;
                return this;
            },
            json: function(data) {
                this.userStatus = data.status;
            }
        };
        AuthController.getUserStatus(req, res, () => {}).then(() => {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am new!');
            done();
        });
    });

});