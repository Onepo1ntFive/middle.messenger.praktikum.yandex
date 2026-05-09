import EventBus from './EventBus';
import Handlebars from 'handlebars';
import { v4 as makeUUID } from 'uuid';

Handlebars.registerHelper('ifNotEquals', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

export interface Props {
    attr?: Record<string, string>;
    events?: Record<string, EventListener>;

    [key: string]: unknown;
}

export default class Block {
    static EVENTS = {
        INIT: 'init',
        FLOW_CDM: 'flow:component-did-mount',
        FLOW_CDU: 'flow:component-did-update',
        FLOW_RENDER: 'flow:render'
    };

    protected element: HTMLElement | null = null;
    protected id: string = makeUUID();

    props: Props;
    protected events: Props;

    protected eventBus: () => EventBus<string>;

    children: Record<string, Block | Block[]>

    constructor(propsAndChildren: Props) {
        const eventBus = new EventBus<string>();
        const {children, props} = this._getChildren(propsAndChildren);
        this.children = children;
        this.props = this._makePropsProxy(props);
        this.events = this.props.events || {};
        this.eventBus = () => eventBus;

        this._registerEvents(eventBus);
        eventBus.emit(Block.EVENTS.INIT);
    }

    private _getChildren(propsAndChildren: Props): {
        children: Record<string, Block | Block[]>,
        props: Props
    } {
        const children: Record<string, Block | Block[]> = {};
        const props: Props = {};

        Object.entries(propsAndChildren).forEach(([key, value]) => {
            if (value instanceof Block) {
                children[key] = value;
            } else if (Array.isArray(value) && value.length > 0 && value[0] instanceof Block) {
                children[key] = value as Block[];
            } else {
                props[key as keyof Props] = value as Props[keyof Props];
            }
        });

        return {children, props};
    }

    private _registerEvents(eventBus: EventBus<string>) {
        eventBus.on(Block.EVENTS.INIT, this.init.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDM, this._componentDidMount.bind(this));
        eventBus.on(Block.EVENTS.FLOW_CDU, this._componentDidUpdate.bind(this));
        eventBus.on(Block.EVENTS.FLOW_RENDER, this._render.bind(this));
    }

    private _addEvents(): void {
        const {events = {}} = this.props;

        this._removeEvents();

        Object.entries(events).forEach(([key, value]) => {
            const eventName = key as keyof HTMLElementEventMap;
            const listener = value as EventListener;
            this.element?.addEventListener(eventName, listener, true);
        });
    }

    private _removeEvents(): void {
        Object.entries(this.events).forEach(([key, value]) => {
            const eventName = key as keyof HTMLElementEventMap;
            const listener = value as EventListener;
            this.element?.removeEventListener(eventName, listener);
        });
    }

    protected addAttributes(): void {
        const {attr = {}} = this.props;

        Object.entries(attr).forEach(([key, value]) => {
            this.element?.setAttribute(key, value as string);
        });
    }

    protected init(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_RENDER);
    }

    private _componentDidMount(): void {
        this.componentDidMount();
    }

    protected componentDidMount(): void {
    }

    public dispatchComponentDidMount(): void {
        this.eventBus().emit(Block.EVENTS.FLOW_CDM);
    }

    private _componentDidUpdate(): void {
        const response = this.componentDidUpdate();
        if (!response) {
            return;
        }
        this._render();
    }

    protected componentDidUpdate(): boolean {
        return true;
    }

    public getContent(): HTMLElement {
        if (!this.element) {
            throw new Error('Элемент не создан');
        }
        return this.element;
    }

    public getProps(): Props {
        if (!this.props) {
            throw new Error('Нет пропсов');
        }
        return this.props;
    }

    public hide(): void {
        this.getContent().style.display = 'none';
    }

    private _createDocumentElement(tagName: string): HTMLTemplateElement {
        return document.createElement(tagName) as HTMLTemplateElement;
    }

    public setProps(nextProps: Props): void {
        if (!nextProps) {
            return;
        }

        Object.assign(this.props, nextProps);
    };

    private _render(): void {
        const currentProps = {...this.props};

        Object.entries(this.children).forEach(([key, child]) => {
            if (Array.isArray(child)) {
                currentProps[key] = child.map(c => `<div data-id='${ c.id }'></div>`);
            } else {
                currentProps[key] = `<div data-id='${ child.id }'></div>`;
            }
        });

        const fragment = this._createDocumentElement('template');
        fragment.innerHTML = Handlebars.compile(this.render())(currentProps);

        Object.values(this.children).forEach((child) => {
            if (Array.isArray(child)) {
                child.forEach(c => {
                    const stub = fragment.content.querySelector(`[data-id="${ c.id }"]`);
                    if (stub) {
                        stub.replaceWith(c.getContent());
                    }
                });
            } else {
                const stub = fragment.content.querySelector(`[data-id="${ child.id }"]`);
                if (stub) {
                    stub.replaceWith(child.getContent());
                }
            }
        });

        const newElement = fragment.content.firstElementChild as HTMLElement;
        if (this.element && newElement) {
            this._removeEvents();
            this.element.replaceWith(newElement);
        }

        this.element = newElement;
        this._addEvents();
        this.addAttributes();
    }

    render(): string {
        return '';
    }

    private _makePropsProxy(props: Props): Props {
        const self: this = this;

        return new Proxy(props, {
            get(target: Props, prop: string) {
                if (prop.indexOf('_') === 0) {
                    throw new Error('Нет доступа');
                }

                const value = target[prop];
                return typeof value === 'function' ? value.bind(target) : value;
            },

            set(target: Props, prop: string, value: unknown): boolean {
                if (prop.indexOf('_') === 0) {
                    throw new Error('Нет доступа');
                }

                const oldTarget = {...target};
                target[prop] = value;
                self.eventBus().emit(Block.EVENTS.FLOW_CDU, oldTarget, target);
                return true;
            },

            deleteProperty(): boolean {
                throw new Error('Нет доступа');
            },
        });
    }
}
