import {React, Utils, Application, AppStatus} from "../../core";
import {Component, Icon} from "../../components";
import * as CoreConfig from "../../config/CoreConfig";
import ConfigField from "../../config/ConfigField";

export default class SkinSwitcher extends Component {


    render() {

        const cfg: ConfigField = CoreConfig.ui.skin.dark;

        return <span
            className={cfg.value ? Icon.F_SUN : Icon.F_MOON}
            onClick={e => {
                cfg.customValue = !cfg.value;
                this.forceUpdate();
            }
            }
        />

    }
}