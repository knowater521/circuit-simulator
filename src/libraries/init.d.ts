interface ObjectConstructor {
    /**
     * 输入对象是否含有可枚举元素
     *
     * @param {object} from
     * @returns {boolean}
     */
    isEmpty(from: object): boolean;
    /**
     * 深复制输入对象。
     * 输入对象不得含有循环调用，复制出的对象全部是内建对象格式
     *
     * @template T
     * @param {T} from
     * @returns {T}
     */
    clone<T>(from: T): T;
    /**
     * 将输入对象的所有可枚举属性全部隐藏
     *
     * @param {*} from
     * @returns {boolean}
     */
    hideAll(from: any): void;
    /**
     * 将输入对象以及下属所有对象全部冻结
     *
     * @param {*} from
     * @returns {boolean}
     */
    freezeAll(from: any): boolean;
    /**
     * 将输入对象以及下属所有对象全部封闭
     *
     * @param {*} from
     * @returns {boolean}
     */
    sealAll(from: any): boolean;
}

interface Object {
    /**
     * 当前对象实例与输入对象是否相等
     *
     * @param {*} obj
     * @returns {boolean}
     */
    isEqual(obj: any): boolean;
    /**
     * 原对象的 key 不变，生成新的对象
     *
     * @param {(value: any, key: string) => any} fn
     * @returns {object}
     */
    map(fn: (value: any, key: string) => any): object;
}

interface ArrayConstructor {
    /**
     * 复制数组
     *
     * @param {any[]} from
     * @returns {any[]}
     */
    clone<U>(from: U[]): U[];
}

interface Array<T> {
    /**
     * 当前数组与输入数组是否相等
     *
     * @param {any[]} arr
     * @returns {boolean}
     */
    isEqual(arr: any[]): boolean;
    /**
     * 根据下标取出当前数组元素
     *
     * @param {number} index
     * @returns {*}
     */
    get(index: number): any;
    /**
     * 从下标 0 开始，删除 predicate 第一个返回 true 的元素
     *
     * @param {(value: any, index: number) => boolean} predicate
     * @returns {boolean}
     */
    delete(predicate: (value: any, index: number) => boolean): boolean;
    /**
     * 用于 vue 的数组更新
     *
     * @param {number} index
     * @param {*} value
     */
    $set(index: number, value: any): void;
}

interface Number {
    /**
     * 按照有效数字的位数进行四舍五入。
     * 默认 6 位有效数字
     *
     * @param {number} [bits=6]
     * @returns {number}
     */
    toRound(bits?: number): number;
    /**
     * 求数字的数量级
     *
     * @returns {number}
     */
    rank(): number;
}
