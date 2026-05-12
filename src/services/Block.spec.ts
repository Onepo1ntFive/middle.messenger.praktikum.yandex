import sinon from 'sinon';
import { expect } from 'chai';
import { describe } from 'mocha';

import Block, { type Props } from './Block.ts';

describe('Block', () => {
    let PageComponent: any;

    before(() => {
        class Page extends Block {
            constructor(props: Props) {
                super(props);
            }

            render() {
                return `<div>
                    <span id="test-text">{{text}}</span>
                    <button>{{text-button}}</button>
                </div>`;
            }
        }

        PageComponent = Page;
    });

    it('Должен создать компонент с состоянием из конструктора', () => {
        const text = 'Hello';

        const pageComponent = new PageComponent({ text });

        const spanText = pageComponent.element?.querySelector('#test-text')?.innerHTML;

        expect(spanText).to.be.eq(text);
    });

    it('Компонент должен иметь реактивное повдение', () => {
        const newValue = 'New value';

        const pageComponent = new PageComponent({ text: 'Hello' });

        pageComponent.setProps({ text: newValue });
        const spanText = pageComponent.element?.querySelector('#test-text')?.innerHTML;

        expect(spanText).to.be.eq(newValue);
    });

    it('Компонент должен установить события на элемент', () => {
        const clickhadnlerStub = sinon.stub();
        const pageComponent = new PageComponent({
            events: {
                click: clickhadnlerStub,
            },
        });

        const event = new MouseEvent('click');
        pageComponent.element?.dispatchEvent(event);

        expect(clickhadnlerStub.calledOnce).to.be.true;
    });
});
