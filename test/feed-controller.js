const expect = require('chai').expect;
const sinon = require('sinon');
const mongoose = require('mongoose');

const User = require('../models/user');
const FeedController = require('../controllers/feed');

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

describe('Feed Controller', function() {
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

    it('should add a created post to the posts of the creator', function(done) {
        const req = {
            body: {
                title: 'Test Post',
                content: 'A Test Post'
            },
            file: {
                path: 'abc'
            },
            userId: '5c0f66b979af55031b34728a'
        };

        const res = {
            status: function() {
                return this;
            },
            json: function() {}
        };

        FeedController.createPost(req, res, () => {}).then(savedUser => {
            expect(savedUser).to.have.property('posts');
            expect(savedUser.posts).to.have.length(1);
            done();
        });
    });
});