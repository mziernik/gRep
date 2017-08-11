import ReactCurrentOwner from "react/lib/ReactCurrentOwner";
import {ReactComponent} from "../core";

export {default as ELEMENT} from 'react-dom/lib/ReactElementSymbol';

export function isReactElement(elem: any): boolean {
    return elem && elem.$$typeof && elem.props;
}

export function getCurrentlyRenderedComponent(): ReactComponent {
    return ReactCurrentOwner.current;
}

export function getComponentAtNode(node: HTMLElement) {
    for (var key in node) {
        if (key.startsWith("__reactInternalInstance$")) {
            var compInternals = node[key]._currentElement;
            var compWrapper = compInternals._owner;
            var comp = compWrapper._instance;
            return comp;
        }
    }
    return null;
}
