import ReactCurrentOwner from "react/lib/ReactCurrentOwner";
import {ReactComponent} from "../core";


export function isReactElement(elem: any): boolean {
    return elem && elem.$$typeof && elem.props;
}

export function getCurrentlyRenderedComponent(): ReactComponent {
    return ReactCurrentOwner.current;
}