export function isReactElement(elem:any):boolean{
    return elem && elem.$$typeof && elem.props;
}