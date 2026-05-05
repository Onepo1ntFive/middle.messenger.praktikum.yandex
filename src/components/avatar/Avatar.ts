import './index.sass'
import Block, { type Props } from '../../services/Block';
import template from './avatar.hbs?raw';
import connect from '../../services/connectStore';
import Store, { Indexed, TUserDetails } from '../../services/Store';
import SettingsController from '../../controller/SettingsController';

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
                    SettingsController.changeUserAvatar(formData).then((response: Response) => {
                        if (response && response.status === 200) {
                            const resp = JSON.parse(response.response)
                            Store.set('user.avatar', resp.avatar)
                            this.setProps({
                                avatarSrc: `https://ya-praktikum.tech/api/v2/resources${resp.avatar}`,
                            })
                        }
                    })
                }
            }
        });
    }

    override render(): string {
        return template;
    }
}

function mapUserToProps(state: Indexed): {
    user: TUserDetails,
    isLoading: boolean,
} {
    return {
        user: state.user,
        isLoading: state.isLoading,
    };
}

export default connect(mapUserToProps)(Avatar)
