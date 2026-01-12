import { message } from 'antd';

export const toast = {
    success: (content: string, duration?: number) => {
        message.success(content, duration);
    },
    error: (content: string, duration?: number) => {
        message.error(content, duration);
    },
    warning: (content: string, duration?: number) => {
        message.warning(content, duration);
    },
    info: (content: string, duration?: number) => {
        message.info(content, duration);
    },
    loading: (content: string, duration?: number) => {
        message.loading(content, duration);
    },
};
