import { Message, MessageType } from './Message';
let knownTypes = {
    "T": MessageType.Text,
    "B": MessageType.Binary,
    "C": MessageType.Close,
    "E": MessageType.Error
};
function splitAt(input, searchString, position) {
    let index = input.indexOf(searchString, position);
    if (index < 0) {
        return [input.substr(position), input.length];
    }
    let left = input.substring(position, index);
    return [left, index + searchString.length];
}
export var ServerSentEventsFormat;
(function (ServerSentEventsFormat) {
    function parse(input) {
        if (input.length == 0) {
            throw new Error("Message is missing header");
        }
        let [header, offset] = splitAt(input, "\n", 0);
        let payload = input.substring(offset);
        if (header.endsWith('\r')) {
            header = header.substr(0, header.length - 1);
        }
        var messageType = knownTypes[header];
        if (messageType === undefined) {
            throw new Error(`Unknown type value: '${header}'`);
        }
        if (messageType == MessageType.Binary) {
            throw new Error("TODO: Support for binary messages");
        }
        return new Message(messageType, payload);
    }
    ServerSentEventsFormat.parse = parse;
})(ServerSentEventsFormat || (ServerSentEventsFormat = {}));
export var TextMessageFormat;
(function (TextMessageFormat) {
    const InvalidPayloadError = new Error("Invalid text message payload");
    const LengthRegex = /^[0-9]+$/;
    function hasSpace(input, offset, length) {
        let requiredLength = offset + length;
        return input.length >= requiredLength;
    }
    function parseMessage(input, position) {
        var offset = position;
        var [lenStr, offset] = splitAt(input, ":", offset);
        if (!LengthRegex.test(lenStr)) {
            throw new Error(`Invalid length: '${lenStr}'`);
        }
        let length = Number.parseInt(lenStr);
        if (!hasSpace(input, offset, 3 + length)) {
            throw new Error("Message is incomplete");
        }
        var [typeStr, offset] = splitAt(input, ":", offset);
        var messageType = knownTypes[typeStr];
        if (messageType === undefined) {
            throw new Error(`Unknown type value: '${typeStr}'`);
        }
        var payload = input.substr(offset, length);
        offset += length;
        if (input[offset] != ';') {
            throw new Error("Message missing trailer character");
        }
        offset += 1;
        if (messageType == MessageType.Binary) {
            throw new Error("TODO: Support for binary messages");
        }
        return [offset, new Message(messageType, payload)];
    }
    function parse(input) {
        if (input.length == 0) {
            return [];
        }
        if (input[0] != 'T') {
            throw new Error(`Unsupported message format: '${input[0]}'`);
        }
        let messages = [];
        var offset = 1;
        while (offset < input.length) {
            let message;
            [offset, message] = parseMessage(input, offset);
            messages.push(message);
        }
        return messages;
    }
    TextMessageFormat.parse = parse;
})(TextMessageFormat || (TextMessageFormat = {}));
