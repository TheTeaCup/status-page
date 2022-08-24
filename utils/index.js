import Router from 'next/router';

export const isBrowser = typeof window !== `undefined`;

export const getCssVar = (name) => {
    if (typeof document !== 'undefined' || !name) {
        const property = isCssVar(name)
            ? name?.replace('var(', '').replace(')', '')
            : `--${name}`;
        if (!property) return '';
        return getComputedStyle(document.documentElement).getPropertyValue(
            property
        );
    }
    return '';
};

export const isCssVar = (property) => {
    return property && property?.indexOf('var(') === 0 ? true : false;
};

export const toCapitalize = (name) => {
    const [first, ...rest] = name;
    return `${first.toUpperCase()}${rest.join('')}`;
};

export const validateEmail = (value) => {
    return /^\w+([\\.-]?\w+)*@\w+([\\.-]?\w+)*(\.\w{2,3})+$/.test(value);
};

/**
 * This function allows validation if a string is a hexadecimal
 * value
 * @param str [string] hexadecimal value
 * @returns result [boolean]
 */
export const isHex = (str) => {
    const exp = /#[a-fA-F0-9]{3,6}/g;
    return exp.test(str);
};

export function removeFromLast(path, key) {
    const i = path.lastIndexOf(key);
    return i === -1 ? path : path.substring(0, i);
}

export function isFunction(fn) {
    return typeof fn === 'function';
}

export const isPathActive = (href, exact = false) => {
    if (!isBrowser) return false;
    if (exact) return Router.pathname === href;
    return Router.pathname.startsWith(href);
};

export const hexFromString = (
    str,
    defaultColor,
    returnLast = false
) => {
    const fullReg = /#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}$/g;
    const hexCodes = str.match(fullReg);
    if (hexCodes && hexCodes.length > 0) {
        return returnLast ? hexCodes[hexCodes.length - 1] : hexCodes;
    }
    return defaultColor;
};

function padZero(str, len) {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
}

export const invertHex = (hexProp, smooth = true) => {
    let hex = isCssVar(hexProp) ? getCssVar(hexProp) : hexProp;

    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        return hexProp;
    }
    let r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (smooth) {
        // http://stackoverflow.com/a/3943023/112731
        return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
    }
    // invert color components
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;
    // pad each with zeros and return
    return (
        '#' +
        padZero(r.toString(16)) +
        padZero(g.toString(16)) +
        padZero(b.toString(16))
    );
};

export const isProd = process.env.NODE_ENV === 'production';

export const validateJSON = (value) => {
    try {
        JSON.parse(value);
        return true;
    } catch (e) {
        return false;
    }
};