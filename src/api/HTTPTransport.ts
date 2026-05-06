import { BASE_URL } from '../consts/consts';

enum METHODS {
    GET = 'GET',
    POST = 'POST',
    PUT = 'PUT',
    DELETE = 'DELETE',
}

type Options = {
    method?: METHODS;
    headers?: Record<string, string>;
    data?: unknown;
    timeout?: number;
};

export interface IResponse<T> {
    data: T;
    status: number;
    response: string;
    responseText: string;
}

export interface IResponseAdd {
    [key: string]: unknown,
}

type OptionsWithoutMethod = Omit<Options, 'method'>;

type HTTPMethod = (
    url: string,
    options?: OptionsWithoutMethod
) => Promise<unknown>;

function queryStringify(
    data: Record<string, string | number | boolean>
): string {
    if (typeof data !== 'object' || data === null) {
        throw new Error('Data must be object');
    }

    const keys = Object.keys(data);
    return keys.reduce((result, key, index) => {
        const value = data[key];
        const separator = index < keys.length - 1 ? '&' : '';
        return `${ result }${ encodeURIComponent(key) }=${ encodeURIComponent(
            value
        ) }${ separator }`;
    }, '?');
}

function isPlainObject(data: unknown): data is Record<string, string> {
    return typeof data === 'object' && data !== null && !(data instanceof FormData) && !(data instanceof URLSearchParams);
}

export default class HTTPTransport {
    private createMethod(method: METHODS): HTTPMethod {
        return (url, options = {}): Promise<unknown> => this.request(url, {...options, method});
    }

    public get = this.createMethod(METHODS.GET);
    public post = this.createMethod(METHODS.POST);
    public put = this.createMethod(METHODS.PUT);
    public delete = this.createMethod(METHODS.DELETE);

    private request<R = unknown>(url: string, options: Options): Promise<R> {
        const {headers = {}, method, data, timeout = 5000} = options;

        return new Promise((resolve, reject) => {
            if (!method) {
                reject(new Error('No method'));
                return;
            }

            const xhr = new XMLHttpRequest();
            const isGet = method === METHODS.GET;

            const requestUrl =
                isGet && data
                    ? `${ BASE_URL }${ url }${ queryStringify(data as Record<string, string | number | boolean>) }`
                    : `${ BASE_URL }${ url }`;
            xhr.open(method, requestUrl, true);

            xhr.withCredentials = true;

            Object.keys(headers).forEach((key) => {
                xhr.setRequestHeader(key, headers[key]);
            });

            xhr.onload = () => {
                resolve(xhr as R);
            };

            xhr.onabort = () => {
                reject(new Error('Request aborted'));
            };

            xhr.onerror = () => {
                reject(new Error('Request failed'));
            };

            xhr.timeout = timeout;
            xhr.ontimeout = () => {
                reject(new Error('Request timeout'));
            };

            if (isGet || !data) {
                xhr.send();
            } else if (data instanceof FormData || data instanceof URLSearchParams) {
                xhr.send(data);
            } else if (isPlainObject(data)) {
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.send(JSON.stringify(data));
            } else {
                xhr.send(data as unknown as XMLHttpRequestBodyInit);
            }
        });
    }
}
