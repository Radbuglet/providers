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

class Platypus implements IProvides<[MammalController, BirdController]> {
    public readonly [MammalController.type] = new Mammal();
    public readonly [BirdController.type] = new BirdController();
    // ...
}

class MammalFamily<T extends IProvides<MammalController>> {
    // ...
}
```

## Why providers?

Providers play a crucial role in making composition over inheritance viable.

Composition fixes a lot of the issues with inheritance,the most notable being [The diamond problem](https://en.wikipedia.org/wiki/Multiple_inheritance#The_diamond_problem). This problem is caused by two classes extending the behavior of a shared sub-class and overriding some of its virtual methods. When a third class extends both of them, it becomes unclear which implementation should be used. This could be solved by removing either virtual methods or multiple inheritance. Having shared virtual methods as a form of abstraction customization is also bad because the expectation that their customizations are made exclusively to their parent class and will always be present. Composition solves this by forcing extensions to be made on unique copies of the parent class (although shared customization is still possible by passing in interfaces from the parent class), thus allowing both behavior customization and multiple inheritance to be included simultaneously.

However, composition fails to import the biggest advantage of inheritance: the ability for classes which extend another class to be passed to a function which only expects the base type. Classically, this has been solved by creating an interface implemented by the extenders of the object which provides a getter for that object. While these are extremely flexible, they can become tedious to write when a majority of the interfaces are just simple getters and can also cause method/getter naming conflicts. This is where the `IProvider` interface comes in.

## Usage

`IProvider` is a TypeScript type alias that takes in the constructors of the classes an object provides and generates an interface populated with a unique field for every type. This, alongside its aliases `$` and `P$` are the only exports of the library. Because all these exports are just type aliases and interfaces, there is no actual runtime cost for using this library.

In order to ensure that every providing getter is unique, this library uses symbols. Thus, in order for a class to be providable, it must have a read-only static field named `type` that contains a unique symbol, like so:

```typescript
class MyClass {
	public static readonly type = Symbol();
    // ... implementation here ...
}
```

From there, a class providing `MyClass` just has to implement the `IProvider` interface for that class:

```typescript
class MyOtherClass implements IProvider<typeof MyClass> {  // typeof MyClass refers to the class type instead of the instance type.
    public readonly [MyClass.type] = new MyClass();  // The "[typeof MyClass.type]: MyClass" interface member can be implemented using a field or a getter.
}
```

To access the provided field, just access the member field like any other `Symbol` based field like so:

```typescript
const instance = new MyOtherClass();
const child_instance = instance[MyClass.type];
```

Because providing multiple classes is so common, `IProvider` can also take a tuple of the classes it provides like so:

```typescript
class MyOtherClass implements IProvider<[typeof MyClass, typeof MyClass2]> {  // This is equivalent to IProvider<typeof MyClass> & IProvider<typeof MyClass2>
    // ...
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