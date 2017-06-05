/**
 * Pasek nawigacyjny strony (bieżąca lokalizacja)
 * http://getbootstrap.com/components/#breadcrumbs
 */


import {React, PropTypes, AppEvent, PageDef} from "../core";
import {Component, FontAwesome, Link} from "../components";


export default class Breadcrumb extends Component {

    page: PageDef;

    static propTypes = {
        home: PropTypes.bool.isRequired
    };

    static defaultProps = {
        home: true
    };

    constructor() {
        super(...arguments);
        AppEvent.NAVIGATE.listen(this, (page: PageDef) => {
            this.page = page;
            this.forceUpdate();
        });
    }

    render() {
        if (!this.page) return null;


        let pages: PageDef[] = [];
        let page = this.page;
        while (page) {
            if (!this.props.home || page !== PageDef.homePage)
                pages.push(page);
            page = page._parent;
        }
        pages = pages.reverse();

        let idx = 0;
        let elms = [];

        if (this.props.home)
            elms.push(<Link key={0} link={PageDef.homePage ? PageDef.homePage.getLink() : "/"}><span
                className={FontAwesome.HOME.className}/></Link>);

        pages.forEach((page: PageDef) => {
            if (elms.length)
                elms.push(<span key={++idx} style={ {margin: "8px"} }>/</span>);

            elms.push(page.hasLink()
                ? <Link key={++idx} link={page}>{page._name}</Link> :
                <a key={++idx}>{page._name}</a>
            );
        });


        return <span className="breadcrumbs">
            { elms }
        </span>
    }


}