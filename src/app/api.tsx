import { useRouter } from "next/router"
import { useUserStore } from "./user-store";

export function useApi() {
    const router = useRouter();
    const userStore = useUserStore();

    return {
        userStore,
        router,
        async get<T>(url: string): Promise<ApiResponse<T>> {
            const response = await fetch(url);
            const result: ApiResponse<T> = { success: response.status === 200, body: undefined, status: response.status }
            if (response.status == 401) {
                router.push('/login');
                return result
            }

            result.body = await response.json() as T;
            return result;
        },
        async post<T>(url: string, body: object): Promise<ApiResponse<T>> {
            const response = await fetch(url, { headers: { 'Content-Type': 'application/json' }, method: 'POST', body: body && JSON.stringify(body) });
            const result: ApiResponse<T> = { success: response.status === 200, body: undefined, status: response.status }
            if (response.status == 401) {
                router.push('/login');
                return result
            }
            result.body = +(response.headers.get('Content-Length') || 0) > 0 ? await response.json() as T : undefined;
            return result;
        },
        async ensureLogin() {
            const response = await this.get('/api/users/me');
            if (!response.success) await router.push('/login')
        }
    }
}

export interface ApiResponse<T = object> {
    success: boolean;
    status: number;
    body?: T
}

export interface ApiPagingResult<T = object> {
    values: T[];
    total: number;
    limit: number;
    page: number
}