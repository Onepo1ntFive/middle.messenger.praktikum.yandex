import './index.sass';
import Block, { type Props } from '../../services/Block';
import template from './errorPage.hbs?raw';
import { Link } from '../../components';

interface ErrorPageProps extends Props {
    changePage: (page: string) => void;
}

export class ErrorPage extends Block {
    constructor(props: ErrorPageProps) {
        super({
            ...props,
            Link: new Link({
                label: props.linkLabel as string
            })
        });
    }

    override render() {
        return template;
    }
}
