import { message } from 'antd';
import { toast as rtoast } from 'react-toastify';

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


const defaultToastSettings = {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "colored",
}

export const toastify = {
    success: (content: string, duration?: number) => {
        rtoast.success(content, { ...defaultToastSettings, autoClose: duration });
    },
    error: (content: string, duration?: number) => {
        rtoast.error(content, { ...defaultToastSettings, autoClose: duration });
    },
    warning: (content: string, duration?: number) => {
        rtoast.warning(content, { ...defaultToastSettings, autoClose: duration });
    },
    info: (content: string, duration?: number) => {
        rtoast.info(content, { ...defaultToastSettings, autoClose: duration });
    },
    loading: (content: string, duration?: number) => {
        rtoast.loading(content, { ...defaultToastSettings, autoClose: duration });
    },
};

