import { APIENDPOINTS_TYPE, apiEndPoints } from '@/constants/apiEndPoint';
import { ApiMethods, apiMethods } from '@/constants/basicConstants';
import { message } from 'antd';
import { axiosInstance } from './axiosInstance';

interface ApiOptions {
    showSuccess?: boolean;
    successMessage?: string;
    showError?: boolean;
    headers?: object;
}

export async function ApiHitter(method: keyof ApiMethods, apiName: APIENDPOINTS_TYPE, bodyData: object, params: string | number, options: ApiOptions = {}) {
    const { showSuccess = false, successMessage, showError = true } = options;

    try {
        let url = `${apiEndPoints[apiName]}`;
        if (params && typeof params !== 'object') {
            url += `/${params}`;
        }

        const res = await axiosInstance({
            method: apiMethods[method],
            url: url,
            data: bodyData,
            headers: options?.headers
        });

        if (showSuccess && res.data?.success === true) {
            message.success(successMessage || res.data?.message || 'Success');
        }

        if (res.data?.success === false) {
            if (showError) message.error(res.data?.message || 'Something went wrong');
            throw new Error(res.data?.message || "API failed");
        }

        return res.data;

    } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err?.message || "Something went wrong";
        if (showError) message.error(errorMsg);
        throw err;
    }
}

