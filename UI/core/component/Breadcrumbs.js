/**
 * Pasek nawigacyjny strony (bieżąca lokalizacja)
 * http://getbootstrap.com/components/#breadcrumbs
 */


import {React, PropTypes, AppEvent, Endpoint} from "../core";
import {Component, Icon, Link} from "../components";


export default class Breadcrumb extends Component {

    static propTypes = {
        home: PropTypes.bool
    };

    page: Endpoint;

    constructor() {
        super(...arguments);
        AppEvent.NAVIGATE.listen(this, data => {
            this.page = data.endpoint;
            this.forceUpdate(true);
        });
    }

    render() {
        if (!this.page) return null;


        let pages: Endpoint[] = [];
        let page = this.page;
        while (page) {
            if (!this.props.home || page !== Endpoint.homePage)
                pages.push(page);
            page = page._parent;
        }
        pages = pages.reverse();

        let idx = 0;
        let elms = [];

        if (this.props.home)
            elms.push(<Link key={0} link={Endpoint.homePage ? Endpoint.homePage.getLink() : "/"}><span
                className={Icon.HOME.className}/></Link>);

        pages.forEach((page: Endpoint) => {
            if (elms.length)
                elms.push(<span className={Icon.ANGLE_DOUBLE_RIGHT}
                                key={++idx}
                                style={{
                                    fontSize: "0.8em",
                                 //   display: "table-cell",
                                    padding: "0 .5em",
                                    verticalAlign: "middle"
                                }}/>);

            elms.push(page.canNavigate ? <Link key={++idx} link={page}>{page._name}</Link> :
                <a key={++idx}>{page._name}</a>
            );
        });

        return <span className="c-breadcrumbs">
            {elms}
        </span>
    }

}