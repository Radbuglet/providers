/**
 * Represents a class constructor/type that contains a type static field for use
 * in the provision interface.
 */
type IProvider = (new(...args: any[]) => object) & { readonly type: symbol; };

/**
 * Generates an interface for a class which provides a class of type "InstanceType<TClass>"". If "TReal" is provided,
 * this type will be used instead of the InstanceType<TClass>. "TReal" is used when the provided class has some generic type information
 * that cannot be inferred by "InstanceType".
 */
export type IProvides<TClass extends IProvider, TReal extends InstanceType<TClass> = never> = {
    [_ in TClass["type"]]: TReal extends never ? InstanceType<TClass> : TReal
};

/**
 * @alias IProvides
 */
export type P$<TClass extends IProvider, TReal extends InstanceType<TClass> = never> = IProvides<TClass, TReal>;

/**
 * @alias IProvides
 */
export type $<TClass extends IProvider, TReal extends InstanceType<TClass> = never> = IProvides<TClass, TReal>;