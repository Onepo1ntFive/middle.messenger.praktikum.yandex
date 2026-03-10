enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE'
}

type Data = Record<string, string> | FormData | null;
type HTTPMethod = (url: string, options?: Options) => Promise<XMLHttpRequest>;

type Options = {
    method: METHODS;
    data?: Data;
};

function queryStringify(data: Record<string, unknown>) {
    if (typeof data !== 'object') {
        throw new Error('Data must be object');
    }

    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
        return `${ result }${ key }=${ data[key] }${ index < keys.length - 1 ? '&' : '' }`;
    }, '?');
}

class HTTPTransport {
    get = (url: string, options?: Options) => {
        return this.request(url, {...options, method: METHODS.GET});
    };

    post = (url: string, options?: Options) => {
        return this.request(url, {...options, method: METHODS.POST});
    };

    put = (url: string, options?: Options) => {
        return this.request(url, {...options, method: METHODS.PUT});
    };

    delete = (url: string, options?: Options) => {
        return this.request(url, {...options, method: METHODS.DELETE});
    };

    request: HTTPMethod = (url, options = {method: METHODS.GET}) => {
        const {method, data} = options;

        return new Promise(function (resolve, reject) {
            if (!method) {
                reject('Нет метода');
                return;
            }

            const xhr = new XMLHttpRequest();

            xhr.open(method, method === METHODS.GET && !!data ? `${ url }${ queryStringify(data) }` : url);

            xhr.onload = function () {
                resolve(xhr);
            };

            xhr.onabort = reject;
            xhr.onerror = reject;

            xhr.ontimeout = reject;

            if (method === METHODS.GET || !data) {
                xhr.send();
            } else {
                xhr.send(data);
            }
        });
    };
}