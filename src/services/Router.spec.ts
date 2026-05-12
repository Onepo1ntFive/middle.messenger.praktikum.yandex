import { expect } from 'chai';
import sinon from 'sinon';
import { describe, it } from 'mocha';

import Router, { Route } from './Router.ts';
import Block, { Props } from './Block.ts';
import { Routes } from '../consts/consts.ts';

describe.only('Route', () => {
    let PageComponent: any;
    let router: any;
    let sandbox: sinon.SinonSandbox;

    before(() => {
        class Page extends Block {
            constructor(props: Props) {
                super(props);
            }

            override render() {
                return `<div id='app'>
                      <span id='test-text'>{{text}}</span>
                      <button>{{text-button}}</button>
                  </div>`;
            }
        }

        PageComponent = new Page({prop: '1'});
        router = Router;
        sandbox = sinon.createSandbox();
        (router as any).history = {
            pushState: sandbox.spy(),
            back: sandbox.spy(),
            forward: sandbox.spy(),
        };
    });

    it('use() должен добавлять маршруты', () => {
        router.use(Routes.LOGIN, PageComponent);
        expect(router.routes.length).to.equal(1);
        expect(router.routes[0]).to.be.instanceOf(Route);
    });

    it('go() должен добавлять путь в history', () => {
        const pushStateSpy = sinon.spy(window.history, 'pushState');
        router.go(Routes.PROFILE);
        expect(pushStateSpy.calledWith({}, '', Routes.PROFILE)).to.be.true;
    });

    it('back() должен вызывать history.back', () => {
        router.back();
        expect((router as any).history.back.calledOnce).to.be.true;
    });

    it('forward() должен вызывать history.forward', () => {
        router.forward();
        expect((router as any).history.forward.calledOnce).to.be.true;
    });
});
