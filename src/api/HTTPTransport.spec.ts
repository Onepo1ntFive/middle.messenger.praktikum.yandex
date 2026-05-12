import { expect } from 'chai';
import HTTPTransport, { queryStringify } from './HTTPTransport.ts';
import sinon from 'sinon';

describe.only('HTTPTransport', () => {
    let options: Record<string, unknown>
    let http: HTTPTransport

    beforeEach(() => {
        http = new HTTPTransport();
        options = {
            headers: {
                Accept: 'application/json',
            },
        };
    })
    it('queryStringify отдаёт корректную строку с для запроса', () => {
        const result = queryStringify({a: 'a', b: 2, c: false});
        expect(result).eq('?a=a&b=2&c=false')
    });

    it('get запрос выполняется ', async () => {
        const stub = sinon.stub(http, 'get')
        stub.resolves()
        const result = await http.get('/auth/user');
        expect(result).eq(undefined);
        expect(stub.calledOnce).to.be.true;
        stub.restore();
    });

    it('post запрос выполняется c данными', async () => {
        const stub = sinon.stub(http, 'post')
        const data = {
            login: 'login',
            password: 'password',
        };
        stub.resolves(data)
        const result = await http.post('/auth/user', {data: data});
        expect(result).deep.eq(data);
        expect(stub.calledOnce).to.be.true;
        stub.restore();
    });

    it('post запрос выполняется c заголовком', async () => {
        const stub = sinon.stub(http, 'post')
        stub.resolves(options)
        const result = await http.post('/auth/user', options);
        expect(result).deep.eq(options);
        expect(stub.calledOnce).to.be.true;
        stub.restore();
    });

    it('post запрос выполняется c formData', async () => {
        const data = {data: new FormData()};
        const stub = sinon.stub(http, 'post')
        stub.resolves(data)
        const result = await http.post('/auth/user', data);
        expect(result).deep.eq(data);
        expect(stub.calledOnce).to.be.true;
        stub.restore();

    });
});
