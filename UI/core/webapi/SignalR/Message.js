export var MessageType;
(function (MessageType) {
    MessageType[MessageType["Text"] = 0] = "Text";
    MessageType[MessageType["Binary"] = 1] = "Binary";
    MessageType[MessageType["Close"] = 2] = "Close";
    MessageType[MessageType["Error"] = 3] = "Error";
})(MessageType || (MessageType = {}));
export class Message {
    constructor(type, content) {
        this.type = type;
        this.content = content;
    }
}
