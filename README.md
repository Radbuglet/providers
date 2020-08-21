# TS-Providers

A TypeScript declaration module adding automatic provider interface generation.

```typescript
class MammalController {
    public static readonly type = Symbol();
    // ...
}

class BirdController {
    public static readonly type = Symbol();
    // ...
}

class Platypus implements IProvides<typeof MammalController>, IProvides<typeof BirdController> {
    public readonly [MammalController.type] = new Mammal();
    public readonly [BirdController.type] = new BirdController();
    // ...
}

class MammalFamily<T extends IProvides<typeof MammalController>> {
    // ...
}
```

## Installation

This module is made for TypeScript projects and requires a compile target that supports `symbols` (introduced in `ES6`). From there, you can install the module using `npm install ts-providers --save`. `ts-providers` is saved as a normal dependency because your emitted type declaration files will most likely include references to the helper types provided by this module.  Once installed, `IProvides` can be brought into scope like so:

```typescript
import {IProvides, $, P$} from "ts-providers";
```

## Why providers?

Providers play a crucial role in making composition over inheritance viable.

Composition fixes a lot of issues with inheritance, the most notable being [the diamond problem](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem). This problem is caused by two classes extending a common parent class and overriding some of its virtual methods. When a third class extends both of them, it becomes unclear which implementation should be used. This could be solved by removing either virtual methods or multiple inheritance from the inheritance model and most OOP languages have favored the later over the former. Having virtual methods as a form of abstraction customization is bad because the customizations of a child class onto its parent gets leaked and can be overridden or conflict with other users of the parent class when merged together. Composition solves this by forcing extensions to be made on unique copies of the parent class, thus allowing both behavior customization and multiple inheritance to be supported simultaneously.

However, composition fails to import the biggest advantage of inheritance: the ability for classes which extend another class to be passed to a function which only expects the base type. Classically, this has been solved by creating an interface implemented by the extenders of the object which provides a getter for that object. While these are extremely flexible, they can become tedious to write when a majority of the interfaces are just simple getters and can also cause method/getter naming conflicts. This is where the `IProvider` interface comes in.

## Usage

`IProvider` is a TypeScript type alias that takes in the constructors of the classes an object provides and generates an interface populated with a unique field for every type. This, alongside its aliases `$` and `P$` are the only exports of the library. Because all these exports are just type aliases and interfaces, there is no actual runtime cost for using this library.

In order to ensure that every providing getter is unique, this library uses symbols. Thus, in order for a class to be providable, it must have a read-only static field named `type` that contains a unique symbol.

```typescript
class MyClass {
	public static readonly type = Symbol();
    // ... implementation here ...
}
```

From there, a class providing `MyClass` just has to implement the `IProvider` interface for that class.

```typescript
class MyOtherClass implements IProvider<typeof MyClass> {  // typeof MyClass refers to the class type instead of the instance type.
    public readonly [MyClass.type] = new MyClass();  // The "[typeof MyClass.type]: MyClass" interface member can be implemented using a field or a getter.
}
```

If `MyClass` is generic, `IProvider` can accept a second parameter specifying the instance type.

```typescript
class MyOtherClass implements IProvider<typeof MyClass, MyClass<string>> {
    public readonly [MyClass.type] = new MyClass<string>();  // The same key is used for generic types.
}
```

Since the field under which the classes are contained is solely dependent on the constructor type of the class, and not its instance type, you can't provide multiple instances of any class, even if the provided classes use different generic parameters.

To access the provided field, just access the member field like any other `Symbol` based field like so:

```typescript
const instance = new MyOtherClass();
const child_instance = instance[MyClass.type];
```

If a class provides multiple types, you can combine the interfaces like any other TypeScript interface.

```typescript
// Accepting multiple interfaces
function takesThings(instance: IProvides<typeof TypeA> & IProvides<typeof TypeB>) {}

function takesThingsShortHand(instance: P$<typeof TypeA> & P$<typeof TypeB>) {}

// Providing multiple interfaces
class ProvidesThings implements IProvides<typeof TypeA>, IProvides<typeof TypeB, TypeB<...>> {
	public readonly [TypeA.type] = new TypeA();
    public readonly [TypeB.type] = new TypeB<...>();
}
```

## Meta

Author: [radbuglet](https://github.com/radbuglet)

Repository: [Here on GitHub](https://github.com/radbuglet/Providers)

License: [MIT](https://github.com/Radbuglet/Providers/blob/master/LICENSE)

Tests: none yet

Planned features:

- Decorator (when they become stable) to generate the type identifier declaration and make it so the class automatically provides itself.
- Add support for using any type of literal as the type to support older browsers who don't yet support symbols.
- Add documentation