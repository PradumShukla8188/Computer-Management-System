import { APIENDPOINTS_TYPE, apiEndPoints } from '@/constants/apiEndPoint';
import { ApiMethods, apiMethods } from '@/constants/basicConstants';
import { message } from 'antd';
import { axiosInstance } from './axiosInstance';

interface ApiOptions {
    showSuccess?: boolean;
    successMessage?: string;
    showError?: boolean;
}

export async function ApiHitter(method: keyof ApiMethods, apiName: APIENDPOINTS_TYPE, bodyData: object, params: string | number, options: ApiOptions = {}) {
    const { showSuccess = false, successMessage, showError = true } = options;

    try {
        const res = await axiosInstance({
            method: apiMethods[method],
            url: params ? `${apiEndPoints[apiName]}/${params}` : `${apiEndPoints[apiName]}`,
            data: bodyData,
        });

        if (showSuccess) {
            message.success(successMessage || 'Success');
        }

        return res.data;
    } catch (err: any) {
        const errorMsg = err?.response?.data?.message || err?.response?.data?.error || err?.message || 'Something went wrong';

        if (showError) {
            message.error(errorMsg);
        }

        throw err; // needed for React Query
    }
}
