import './index.sass';
import Block, { type Props } from '../../services/Block';
import template from './errorPage.hbs?raw';
import { Link } from '../../components';
import { Routes } from '../../consts/consts';
import Router from '../../services/Router';

interface ErrorPageProps extends Props {
    [key: string]: unknown;
}

export class ErrorPage extends Block {
    constructor(props: ErrorPageProps) {
        super({
            ...props,
            title: 'Ошибка',
            errorCode: '500',
            Link: new Link({
                label: 'На главную',
                events: {
                    click: (event) => {
                        event.preventDefault();
                        Router.go(Routes.LOGIN);
                    }
                }
            })
        });
    }

    override render() {
        return template;
    }
}

export type TErrorPage = typeof ErrorPage;
