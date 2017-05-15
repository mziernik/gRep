export class HttpClient {
    get(url, headers) {
        return this.xhr("GET", url, headers);
    }
    post(url, content, headers) {
        return this.xhr("POST", url, headers, content);
    }
    xhr(method, url, headers, content) {
        return new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest();
            xhr.open(method, url, true);
            if (headers) {
                headers.forEach((value, header) => xhr.setRequestHeader(header, value));
            }
            xhr.send(content);
            xhr.onload = () => {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(xhr.response);
                }
                else {
                    reject({
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                }
            };
            xhr.onerror = () => {
                reject({
                    status: xhr.status,
                    statusText: xhr.statusText
                });
            };
        });
    }
}
