import { checkCircularStructure } from './clone';
import { supportsOnce, supportsPassive } from './env';

import {
    isFunc,
    isArray,
    isBaseType,
    isObject,
} from './assertion';

/**
 * 生成异步延迟函数
 * @param {number} [time=0]
 * @returns {Promise<void>}
 */
export function delay(time = 0) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 生成一个一次性的事件
 * @param {Element} el
 * @param {string} type
 * @returns {Promise<Event>}
 */
export function onceEvent<T extends Event>(el: Element, type: T['type']): Promise<T> {
    let option: boolean | {
        passive?: boolean;
        once?: boolean;
    };

    if (!supportsPassive && !supportsOnce) {
        option = false;
    }
    else {
        option = {};

        if (supportsPassive) {
            option.passive = true;
        }
        if (supportsOnce) {
            option.once = true;
        }
    }

    return new Promise((resolve) => {
        el.addEventListener(
            type,
            function once(event: Event) {
                resolve(event as T);
                if (!supportsOnce) {
                    el.removeEventListener(type, once);
                }
            },
            option,
        );
    });
}

/**
 * 生成随机字符串
 * @param {number} [len=16] 字符串长度
 * @returns {string}
 */
export function randomString(len = 16) {
    const start = 48, end = 126;
    const exclude = '\\/[]?{};,<>:|`';

    let codes = '';
    while (codes.length < len) {
        const code = String.fromCharCode(Math.random() * (end - start) + start);

        if (!exclude.includes(code)) {
            codes += code;
        }
    }

    return codes;
}

/**
 * Hyphenate a camelCase string.
 * @param {string} str
 */
export function hyphenate(str: string) {
    return str.replace(/\B([A-Z])/g, '-$1').toLowerCase();
}

/**
 * 检查 key 是否存在于 obj 对象中
 * @param obj 检查对象
 * @param key 检查的属性名称
 */
export function hasOwn(obj: object, key: string): boolean {
    return Object.prototype.hasOwnProperty.call(obj, key);
}

/**
 * 对象是否为空
 * @param obj 待检测对象
 */
export function isEmpty(obj: object) {
    return Object.keys(obj).length > 0;
}

/**
 * 比较两个值是否相等
 * @param from 被比较值
 * @param to 比较值
 */
export function isEqual(from: any, to: any, deepCheck = false): boolean {
    if (isBaseType(from)) {
        return from === to;
    }

    if (deepCheck && checkCircularStructure(from)) {
        throw new Error('(isEqual) Can not have circular structure.');
    }

    if (isFunc(from.isEqual)) {
        return Boolean(from.isEqual(to));
    }

    if (isArray(from)) {
        if (!isArray(to) || from.length !== to.length) {
            return false;
        }
        else {
            return from.every(
                (item, i) => isBaseType(item)
                    ? item === to[i]
                    : isEqual(item, to[i]),
            );
        }
    }
    else {
        if (
            !isObject(to) ||
            !Object.keys(from).every((key) => to.hasOwnProperty(key)) ||
            !Object.keys(to).every((key) => from.hasOwnProperty(key))
        ) {
            return false;
        }
        else {
            return Object.entries(from).every(
                ([key, value]) => isBaseType(value)
                    ? value === to[key]
                    : isEqual(value, to[key]),
            );
        }
    }
}

/**
 * 在对象中添加隐藏属性
 * @param from 待添加属性的对象
 * @param properties 添加的属性
 */
export function def(from: object, properties: object) {
    Object.entries(properties).forEach(
        ([key, value]) => Object.defineProperty(from, key, {
            configurable: true,
            writable: true,
            enumerable: false,
            value,
        }),
    );
}

/**
 * 代理对象的无效属性
 *  - 比如，`excludeObject({ a: 1, b: 2, c: 3 }, Infinity)`
 *  - 这样生成的对象，访问 a, b, c 属性和普通的对象没区别，但是访问 d, e, f 等属性则会得到`Infinity`
 * @param inside 内部包裹的对象
 * @param other 无效属性的值
 */
export function excludeObject<T extends object, U = undefined>(inside: T, other: U): Readonly<T & AnyObject<U>> {
    return new Proxy(inside, {
        get(target, key) {
            if (key in target) {
                return target[key];
            }
            else {
                return other;
            }
        },
    }) as any;
}

/**
 * 合并标记
 * @param args 需要合并的标记
 * @return {string}
 */
export function mergeMark(...args: string[]) {
    const map: AnyObject<boolean> = Object.create(null);

    // 标记所有的 tag
    args
        .join(' ')
        .split(' ')
        .filter(Boolean)
        .forEach((item) => map[item] = true);

    return Object.keys(map).join(' ');
}

/**
 * 从主标记中删除元素
 * @param mark 主要标记
 * @param args 待删除的标记合集
 * @return {string}
 */
export function deleteMark(mark: string, ...args: string[]) {
    return mark.split(' ').filter((id) => !args.includes(id)).join(' ');
}
