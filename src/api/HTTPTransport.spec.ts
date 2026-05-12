import sinon from 'sinon';
import { expect } from 'chai';
import HTTPTransport from './HTTPTransport.ts';

describe('HTTPTransport', () => {
    it('GET запрос создаётся', () => {
        const stub = sinon.stub(new HTTPTransport().get('/path'));
        expect(stub).to.be.a('promise');
    });

    it('POST запрос создаётся', () => {
        const stub = sinon.stub(new HTTPTransport().post('/path'));
        expect(stub).to.be.a('promise');
    });

    it('PUT запрос создаётся', () => {
        const stub = sinon.stub(new HTTPTransport().put('/path'));
        expect(stub).to.be.a('promise');
    });

    it('DELETE запрос создаётся', () => {
        const stub = sinon.stub(new HTTPTransport().delete('/path'));
        expect(stub).to.be.a('promise');
    });
});
