const expect = require('chai').expect;

describe('simple test for mocha and chai', function() {
    it('should add numbers correctly', function() {
        const num1 = 1;
        const num2 = 3;
        expect(num1 + num2).to.equal(4);
    });
});

