import { cookies } from 'next/headers';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

interface ServerApiOptions {
    method?: HttpMethod;
    body?: object;
    cache?: RequestCache;
}

export async function serverApi<T>(
    endpoint: string,
    options: ServerApiOptions = {}
): Promise<T> {
    const {
        method = 'GET',
        body,
        cache = 'no-store',
    } = options;

    const token = (await cookies()).get('token')?.value;

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}${endpoint}`, {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...(body && { body: JSON.stringify(body) }),
        cache,
    });

    if (!res.ok) {
        const text = await res.text();
        console.error('Server API Error:', text);
        throw new Error(`API failed: ${res.status}`);
    }

    const contentType = res.headers.get('content-type');

    if (!contentType?.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error('Invalid JSON response');
    }

    return res.json();
}
