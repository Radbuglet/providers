// Utils
type Constructor = new(...args: any[]) => object;
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;

// Internal providers
type IProvider = Constructor & {
    readonly type: symbol;
};
type IProvidesSingle<T extends IProvider> = {
    [_ in T["type"]]: InstanceType<T>
};
type IProvidesMultiple<T extends IProvider[]> = UnionToIntersection<{
    [K in keyof T]: T[K] extends IProvider ? IProvidesSingle<T[K]> : never
}[number]>;

// Friendly providers
type ProvidersBaseType = IProvider | IProvider[];
declare type IProvides<T extends ProvidersBaseType> = T extends IProvider ? IProvidesSingle<T> :
    T extends IProvider[] ? IProvidesMultiple<T> : never;
declare type $<T extends ProvidersBaseType> = IProvides<T>;
declare type P$<T extends ProvidersBaseType> = IProvides<T>;