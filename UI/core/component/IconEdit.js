import {React, PropTypes, Field} from "../core";
import {Component} from "../components";

export default class IconEdit extends Component {

    static propTypes = {
        type: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        value: PropTypes.string,
        placeholder: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        onEnter: PropTypes.func,
        autoCompleteOff: PropTypes.bool,
        id: PropTypes.string
    };


    render() {

        const size = "40px";

        //
        return <div className="c-icon-edit">

            <span className={"btn btn-primary c-icon-edit-btn fa fa-" + this.props.icon}
                  style={{
                      display: "inline-block",
                      width: size,
                      height: size
                  }}
            />

            <input className="c-icon-edit-input"
                   id={this.props.id}
                   type={this.props.type}
                   placeholder={this.props.placeholder}
                   onChange={this.props.onChange}
                   defaultValue={this.props.value}
                   autoComplete={this.props.autoCompleteOff ? "off" : undefined}
                   onKeyDown={(e) => {
                       if (e.keyCode === 13 && typeof this.props.onEnter === "function")
                           this.props.onEnter(e);
                   }
                   }
                   style={{
                       height: size,
                   }}/>
        </div>
    }


}