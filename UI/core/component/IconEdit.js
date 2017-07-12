import {React, PropTypes, Field} from "../core";
import {Component} from "../components";

export default class IconEdit extends Component {

    static propTypes = {
        type: PropTypes.string.isRequired,
        icon: PropTypes.string.isRequired,
        value: PropTypes.string,
        placeholder: PropTypes.string.isRequired,
        onChange: PropTypes.func.isRequired,
        onEnter: PropTypes.func
    };

    render() {

        const size = "40px";

        //ToDo: Przemek
        return <div className="c-icon-edit" style={{
            margin: "8px"
        }}>

            <span className={"btn btn-primary fa fa-" + this.props.icon}
                  style={{
                      boxSizing: "border-box",
                      display: "inline-block",
                      width: size,
                      height: size,
                      fontSize: "26px",
                      padding: "7px 10px",
                      verticalAlign: "middle",
                      color: "white",
                      borderRadius: "4px 0 0 4px",
                      border: "1px solid #444",
                      borderRight: "none"
                  }}
            />

            <input type={this.props.type}
                   placeholder={this.props.placeholder}
                   onChange={this.props.onChange}
                   defaultValue={this.props.value}
                   onKeyDown={(e) => {
                       if (e.keyCode === 13 && typeof this.props.onEnter === "function")
                           this.props.onEnter(e);
                   }
                   }
                   style={{
                       boxSizing: "border-box",
                       width: "300px",
                       height: size,
                       padding: "4px 16px",
                       fontSize: "16px",
                       verticalAlign: "middle",
                       color: "#666",
                       border: "1px solid #444",
                   }}/>
        </div>
    }


}