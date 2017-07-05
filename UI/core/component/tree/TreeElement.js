import TreeNode from "./TreeNode";
export default class TreeElement {

    node(id: string, name: string): TreeNode {
        return new TreeNode(this, id, name);
    }
}