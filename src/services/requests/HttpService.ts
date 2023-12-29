import {injectable} from 'inversify';

@injectable()
export default class HttpService {
    /**
     * Sends a GET request to the specified URL.
     */
    public async get<TData = unknown>(url: string, init?: RequestInit) {
        const response = await fetch(url, init);

        return (await response.json()) as TData;
    }

    /**
     * Sends a POST request to the specified URL.
     */
    public async post<TBody = unknown, TData = unknown>(
        url: string,
        body: TBody,
        init?: RequestInit,
    ): Promise<TData> {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                // prettier-ignore
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache',
            },
            ...init,
        });

        return (await response.json()) as TData;
    }

    /**
     * Sends a PUT request to the specified URL.
     */
    public async put<TBody = unknown, TData = unknown>(
        url: string,
        body: TBody,
        init?: RequestInit,
    ) {
        return await this.post<TBody, TData>(url, body, {
            ...init,
            method: 'PUT',
        });
    }

    /**
     * Sends a PATCH request to the specified URL.
     */
    public async patch<TBody = unknown, TData = unknown>(
        url: string,
        body: TBody,
        init?: RequestInit,
    ) {
        return await this.post<TBody, TData>(url, body, {
            ...init,
            method: 'PATCH',
        });
    }

    /**
     * Sends a DELETE request to the specified URL.
     */
    public async delete<TBody = unknown, TData = unknown>(
        url: string,
        body: TBody,
        init?: RequestInit,
    ) {
        return await this.post<TBody, TData>(url, body, {
            ...init,
            method: 'DELETE',
        });
    }
}
