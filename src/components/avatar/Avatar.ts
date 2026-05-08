import './index.sass'
import Block, { type Props } from '../../services/Block';
import template from './avatar.hbs?raw';
import connect from '../../services/connectStore';
import Store, { IState, TUserDetails } from '../../services/Store';
import SettingsController from '../../controller/SettingsController';
import { IResponse, IResponseAdd } from '../../api/HTTPTransport';
import { BASE_URL } from '../../consts/consts';

interface AvatarProps extends Props {
    avatarSrc?: string | null,
}

class Avatar extends Block {
    constructor(props: AvatarProps) {
        super({
            ...props,
            events: {
                change: (event: Event) => {
                    const eventTarget = event.target as HTMLFormElement;
                    const formData = new FormData()
                    formData.append('avatar', eventTarget.files[0])
                    SettingsController.changeUserAvatar(formData).then((response: IResponse<IResponseAdd>) => {
                        if (response && response.status === 200) {
                            const resp = JSON.parse(response.response)
                            Store.set('user.avatar', resp.avatar)
                            this.setProps({
                                avatarSrc: resp.avatar ? `${BASE_URL}/resources${ resp.avatar }` : '',
                            })
                        }
                    }).catch(error => {
                        console.warn(error)
                    })
                }
            }
        });
    }

    override render(): string {
        return template;
    }
}

function mapUserToProps(state: IState): {
    user: TUserDetails | unknown,
    isLoading: boolean | unknown,
} {
    return {
        user: state.user,
        isLoading: state.isLoading,
    };
}

export default connect(mapUserToProps)(Avatar)
