import {React, PropTypes, Record, Is, Repository} from "../../core";
import {Component} from "../../components";
import JsonViewer from "../JsonViewer";


export default class DTO extends Component {

    static propTypes = {
        record: PropTypes.instanceOf(Record),
    };

    record: Record;
    viewer: JsonViewer;

    constructor() {
        super(...arguments);
        this.record = this.props.record;
        this.record.onReferenceChange.listen(this, e => Is.defined(this.viewer, v => v.update(this.buildDTO())));
        this.record.onFieldChange.listen(this, e => Is.defined(this.viewer, v => v.update(this.buildDTO())));
    }

    render() {
        return <div style={{flex: "auto", padding: "8px"}}>
            <div>DTO:</div>
            <JsonViewer object={this.buildDTO()} instance={e => this.viewer = e}/>
        </div>
    }

    buildDTO(): ?Object {
        let dto = Repository.buildDTO([this.record], true);
        if (!dto) return;
        dto = dto[this.record.repo.key];
        if (!dto) return;
        dto = dto[0];
        if (!dto) return;
        return dto;
    }
}

