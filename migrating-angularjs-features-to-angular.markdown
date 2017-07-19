# Migrating AngularJS Features to Angular

## Introduction

If you have solid experience with [AngularJS 1.x](http://angularjs.org), you're well aware of the framework's features and intricacies. Many of us have plenty of AngularJS projects in development and [production](https://www.madewithangular.com). [Angular](https://angular.io) was [officially released in mid-September 2016](http://angularjs.blogspot.com/2016/09/angular2-final.html). Maybe you've dabbled with the [Angular Tour of Heroes tutorial](https://angular.io/docs/ts/latest/tutorial/), but if you haven't had the opportunity to build a real-world Angular app, let's face it: the prospect can be daunting.

The entire Angular framework has been rewritten into a brand new platform. [Change detection](http://blog.thoughtram.io/angular/2016/02/22/angular-2-change-detection-explained.html) [is better](https://auth0.com/blog/understanding-angular-2-change-detection/). New dependencies and understanding are required for development ([TypeScript](https://www.typescriptlang.org/), [RxJS](https://github.com/Reactive-Extensions/RxJS), [ES6](http://es6-features.org/), a new [style guide](https://angular.io/styleguide), etc.). Many of the old standbys are gone (no more `$scope`, no `$rootScope.broadcast`, [no `filter` or `orderBy` pipes](https://angular.io/docs/ts/latest/guide/pipes.html), etc.).

There aren't many shortcuts for an AngularJS developer looking to learn Angular quickly. You may have heard about the difficulties of [_upgrading_ an existing codebase from AngularJS 1.x to Angular](https://angular.io/docs/ts/latest/guide/upgrade.html). Many developers have better luck [_migrating_ to a clean Angular build](https://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-1/). This is a great way to learn a new platform, though it requires a certain climate with ample time, budget, and stability testing.

So how can we decrease the learning curve when transitioning from AngularJS to Angular?

## About This Guide

The purpose of this tutorial is to provide guidance for implementing common features of AngularJS in Angular. Some things have been removed or replaced. Some require a mental model shift. We'll cover the basics and hopefully you'll be able to get up and running more quickly with your own Angular apps.

### What We'll Cover

We'll address several features that many real-world Angular apps require:

* [Parent-to-child component communication](#passing-data-from-parent-to-child)
* [Child-to-parent component communication](#passing-data-from-child-to-parent)
* [Global communication](#global-communication-with-services)
* [Bonus: Services with multiple instances](#angular-2-services-with-multiple-instances)
* [Using native events and DOM properties](#using-native-events-and-dom-properties)
* [Router events](#router-events)
* [Calling an API](#calling-an-api)
* [Filtering by search query](#filtering-by-search-query)
* [Aside: Authenticate an Angular App and Node API with Auth0](#aside--authenticate-an-angular-app-and-node-api-with-auth0)

**Note:** The AngularJS code samples use AngularJS version 1.5.x.

### What We _Won't_ Cover

We _aren't_ going to go indepth explaining Angular project setup, Angular CLI, TypeScript, ES6, RxJS, functional reactive programming (FRP), or testing. 

However, this tutorial does assume a basic understanding of Angular prerequisites. This includes Angular project architecture, TypeScript, ES6, and RxJS. To familiarize yourself, check out some of these resources:

* [Angular CLI](https://cli.angular.io/)
* [TypeScript](https://www.typescriptlang.org/)
* [A Rundown of JavaScript 2015 Features](https://auth0.com/blog/a-rundown-of-es6-features/)
* [Understanding Reactive Programming and RxJS](https://auth0.com/blog/understanding-reactive-programming-and-rxjs/)
* [Functional Reactive Programming for Angular Developers - RxJs and Observables](http://blog.angular-university.io/functional-reactive-programming-for-angular-2-developers-rxjs-and-observables/)

For a full migration tutorial including all setup steps, check out [Migrating an AngularJS App to Angular - Part 1](https://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-1/), [Part 2](https://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-2/), and [Part 3](https://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-3/).

### Code Repository

Sample Angular code is available for each section in the [migrating-angular-features-to-angular2 GitHub repo](https://github.com/auth0-blog/migrating-angular-features-to-angular2).

## Dependencies

To use the code samples in your own project, you'll need to set up an Angular project. You can generate a boilerplate app using the [Angular CLI](https://cli.angular.io/). There are also various seed projects available, such as [AngularClass/angular2-webpack-starter](https://github.com/AngularClass/angular2-webpack-starter) and [mgechev/angular-seed](https://github.com/mgechev/angular-seed). 

Samples in this tutorial are simplified so that templates are included in the component TypeScript. In a real-world project, you would likely want to separate the TS, HTML, and CSS into their own files. 

The Angular CLI can set this up quickly and easily for you. To create your own starter project and take advantage of automatic component generation, check out the [Angular CLI GitHub README](https://github.com/angular/angular-cli). [The Ultimate Angular CLI Reference Guide](https://www.sitepoint.com/ultimate-angular-cli-reference/) is also a great resource.

## Passing Data from Parent to Child

_**Download Angular code samples:** [parent-to-child-component-communication](https://github.com/kmaida/migrating-angular-features-to-angular2/tree/master/parent-to-child-component-communication)_

One of the most basic features of any app is communication. [AngularJS leverages the concept of componetization](http://stackoverflow.com/questions/20286917/angularjs-understanding-design-pattern/20286918#20286918) but not nearly to the extent of Angular. In AngularJS, it's simple to allow hierarchical controllers and directives access to the `$scope` of other app components. In Angular, some component communication is very similar to AngularJS and some is different.

First let's examine _parent-to-child_ component communication.

> **Scenario:** In our parent component, we want to use a repeater to iterate over an array of objects and pass each object to a child component. The child should then display the data.

### Parent to Child Communication in AngularJS

In AngularJS, our approach probably involves setting up (or fetching) data in a parent controller and assigning the collection to a bindable member (ie., `parent.items`). We would use `ng-repeat` to loop over a child directive and pass the item to it as an attribute. The child directive's template would then display the data.

In AngularJS 1.5, our `child` directive might resemble the following:

```js
// AngularJS - child.directive.js

angular.module('ng1-app').directive('child', child);

function child() {
  return {
    restrict: 'EA',
    replace: true,
    template: '<div>{{child.data.name}}</div>',
    controller: childCtrl,
    controllerAs: 'child',
    bindToController: true,
    scope: {
      data: '<'
    }
  };
}
function childCtrl() {
  var child = this;
  console.log('Data for child:', child.data);
}
```

The markup containing the parent might look something like this:

```html
<!-- AngularJS - parent-to-child markup -->
<div ng-controller="ParentCtrl as parent">
  <child ng-repeat="item in parent.items" data="item"></child>
</div>
```

### Parent to Child Communication in Angular

The implementation for this is similar in Angular, but we need to use [input binding](https://angular.io/docs/ts/latest/cookbook/component-communication.html#!#parent-to-child) with the [@Input decorator](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#inputs-outputs).

In the parent component, we'll set up our `items` data and then use the [NgFor directive](https://angular.io/docs/ts/latest/api/common/index/NgFor-directive.html) to repeat the `child` component and pass items to it: 

```typescript
// Angular - parent.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <app-child *ngFor="let item of items" [data]="item"></app-child>
  `
})
export class ParentComponent {
  items = [
    { name: 'Allosaurus' },
    { name: 'Brachiosaurus' },
    { name: 'Dionychus' },
    { name: 'Elasmosaurus' },
    { name: 'Parasaurolophus' }
  ];
}
```

Our `items` property has a type annotation of `Object[]` signifying that it will be an array of objects.

The selector for this component is `app-parent` because we need custom elements to be hyphenated as per the [W3C spec for custom elements](http://w3c.github.io/webcomponents/spec/custom/#prod-potentialcustomelementname) and [Angular Style Guide](https://angular.io/docs/ts/latest/guide/style-guide.html#!#02-07). Not doing so will result in errors; this is to prevent conflicts when W3C implements new tags in the future.

The square brackets in `[data]` are one-way data binding punctuation. You can read more about [binding syntax in the Angular docs](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#binding-syntax).

Our `child` component might then look like this:

```typescript
// Angular - child.component.ts

import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `<div>{{data.name}}</div>`
})
export class ChildComponent implements OnInit {
  @Input() data: {[key: string]: any};
  
  ngOnInit() {
    console.log('Data for child:', this.data);
  }

}
```

We'll import the `Input` class from `@angular/core`. Then we'll give the `@Input()` decorator a name (`data`) and an object `{[key: string]: any}` type annotation.

The AngularJS and Angular examples are now functionally equivalent. At a glance, we can see how the lack of `$scope` makes the Angular example refreshingly simple.

## Passing Data from Child to Parent

_**Download Angular code samples:** [child-to-parent-component-communication](https://github.com/kmaida/migrating-angular-features-to-angular2/tree/master/child-to-parent-component-communication)_

We often need to pass data from a child to a parent. Consider this hypothetical scenario:

> **Scenario:** We have a property that adds or removes an element in a component. We have a button in a child component that must be able to toggle the parent's element.

### Child to Parent Communication in AngularJS

In AngularJS, there are several ways to tackle this scenario. We can [allow children to inherit the parent scope](https://github.com/angular/angular.js/wiki/Understanding-Scopes). We can [broadcast and emit events](https://toddmotto.com/all-about-angulars-emit-broadcast-on-publish-subscribing/). We can two-way data bind to a directive's [scope](https://docs.angularjs.org/guide/scope#scope-life-cycle). AngularJS's automagic two-way data binding was one of the most oft-demoed features when Angular first appeared in the JavaScript framework landscape. If you're experienced with AngularJS, you should be familiar with how the [digest cycle / dirty-checking](http://stackoverflow.com/questions/15112584/how-to-use-scope-watch-and-scope-apply-in-angularjs/15113029#15113029) works.

### Child to Parent Communication in Angular

In Angular, two-way data binding is no longer built in. Angular components are modular and encapsulated. After AngularJS's emphasis on two-way binding, its absence from Angular can seem challenging. The key is understanding component communication and the _greater control_ we have when binding doesn't happen automagically.

If we want a child component to notify a parent of changes, we can use the [EventEmitter API](https://angular.io/docs/ts/latest/api/core/index/EventEmitter-class.html) and [@Output decorator](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#inputs-outputs). The parent can then bind to the event outputted by the child to update its data.

**Note:** This method [should be used for component-to-component communication but _not_ service-to-component interactions](http://stackoverflow.com/questions/36076700/what-is-the-proper-use-of-an-eventemitter). We'll cover communication with services shortly.

Our parent might look like this:

```typescript
// Angular - parent.component.ts

import { Component } from '@angular/core';

@Component({
  selector: 'app-parent',
  template: `
    <div *ngIf="elementShow">Show this conditionally in parent template!</div>
    <app-child (elementToggled)="elementToggleHandler($event)"></app-child>
  `
})
export class ParentComponent {
  elementShow: boolean;

  elementToggleHandler(e: boolean) {
    this.elementShow = e;
  }
}
```

We have an element that is being conditionally stamped with the [NgIf directive](https://angular.io/docs/ts/latest/api/common/index/NgIf-directive.html) if the `elementShow` property is truthy. Then we have a child component with an `(elementToggled)` event listener. When this event is detected in the parent component, it executes a handler that updates the `elementShow` property with the value of the event parameter. But where does this `elementToggled` event come from?

**Note:** The parentheses in `(elementToggled)` are data binding punctuation for listening for events. You can read more about [binding syntax in the Angular docs](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#binding-syntax).

Our child component emits the `elementToggled` event that the parent is listening for. In this case, the child might look like this:

```typescript
// Angular - child.component.ts

import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-child',
  template: `
    <button (click)="toggleElement()">Toggle Parent from Child</button>
  `
})
export class ChildComponent {
  @Output() elementToggled = new EventEmitter();
  elementShow: boolean = false;

  toggleElement() {
    this.elementShow = !this.elementShow;
    this.elementToggled.emit(this.elementShow);
  }
}
```

We need to import the `Output` and `EventEmitter` APIs. In our template, we'll listen for a `(click)` event and execute a `toggleElement()` method when the user interacts with the button. We'll use the `@Output()` decorator to create a new event emitter. We also need a boolean `elementShow` property to track the state of the toggle.

Finally, we'll define the click event handler `toggleElement()`. This method should toggle the `elementShow` property and emit the `elementToggled` event with the current state of `elementShow`.

We can now toggle the parent from the child:

![Migrating AngularJS features to Angular: communication from child to parent component](https://cdn.auth0.com/blog/scotch-ng1-to-ng2/ng2-child-to-parent.gif)

**Note:** To see a practical, real-world use case, please check out [Migrating an AngularJS App to Angular - Part 1](https://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-1/). You can also read [Two-way Binding in Angular](blog.thoughtram.io/angular/2016/10/13/two-way-data-binding-in-angular-2.html) for more on this topic.

Hopefully you can see the benefits of this approach. What's happening is more transparent and less magical when things like `$scope` and `$watch` aren't in the picture.

## More Component Communication Techniques

These are not the only approaches to component communication. Please check out [Component Interaction in the Angular docs](https://angular.io/docs/ts/latest/cookbook/component-communication.html) for more information. 

In addition, parent components can be _injected_ into child components to provide access to their methods. This tightly couples the components, so loose coupling is advised. However, injection may be preferred in some cases. You can read more about this here: [Find a parent component by injection](https://angular.io/docs/ts/latest/cookbook/dependency-injection.html#!#find-parent).

## Global Communication with Services

_**Download Angular code samples:** [global-communication-with-service](https://github.com/kmaida/migrating-angular-features-to-angular2/tree/master/global-communication-with-service)_

Most apps that grow to a certain scale require some kind of global communication. Scope (and root scope) are gone in Angular, but we can still implement app-wide communication with services.

> **Scenario:** We have some data and associated methods for setting and getting it. We want to be able to display and manipulate that same data from anywhere in our app. We also want to react to data changes in script.

### Global Communication in AngularJS

With AngularJS, there are several options for managing app-wide data. We can use [service (and factory) singletons](https://docs.angularjs.org/guide/services) to get and set global data and provide methods. We can also use `$rootScope` to [store data](http://stackoverflow.com/a/16739309/2130141) and [emit and broadcast events](https://toddmotto.com/all-about-angulars-emit-broadcast-on-publish-subscribing/#rootscopeemitbroadcast).

### Global Communication with Services in Angular

One of the interesting things about Angular is that services can be singletons _or_ they can create multiple instances depending on how we provide them. For _globals_, let's assume that a singleton is exactly what we want.

Let's create a trusty standby, the good old counter example:

```typescript
// Angular - counter.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class CounterService {
  count = 0;
  count$ = new BehaviorSubject<number>(this.count);

  inc() {
    this.count++;
    this.updateCountSbj(this.count);
  }

  dec() {
    this.count--;
    this.updateCountSbj(this.count);
  }

  get getCount(): number {
    return this.count;
  }
  
  private updateCountSbj(value) {
    this.count$.next(value);
  }

}
```

The simple part: our service is `Injectable` and has methods to increment, decrement, and return an integer. There's nothing fancy there. 

However, we've also imported `BehaviorSubject`. We want to be able to _subscribe_ to `count` changes in our components. We need to be able to do this if we want to execute script logic in response to changes in global data. In AngularJS, we might do this by emitting an event or by `$watch()`ing in a directive/controller. In Angular, services should _not_ use `EventEmitter`, and `$scope.$watch` is gone. An [RxJS BehaviorSubject](http://reactivex.io/rxjs/class/es6/BehaviorSubject.js~BehaviorSubject.html) extends an observable and allows us to create subscriptions in our components.

**Note:** Subjects are both _observers_ and _observables_. You can [learn more about subjects here](http://reactivex.io/documentation/subject.html).

Now let's say we have two components, `Cmpt1Component` and `Cmpt2Component`. Each of these components should have buttons to increment, decrement, and display the counter. They can subscribe to the `count$` subject to execute logic. They both need access to a _single instance_ of `CounterService`.

To do this, we need to provide our counter service globally in our `app.module.ts`:

```typescript
// Angular - app.module.ts
...
import { CounterService } from './counter.service';

@NgModule({
  ...,
  providers: [CounterService],
  ...
})
export class AppModule { }
```

We import `CounterService` and then provide it in the `providers` array of our app's `@NgModule`. Now we can use it in any component belonging to this module and trust that they'll share the same instance.

For the sake of example, say both of our components are _essentially_ the same. They might look like this:

```typescript
// Angular - cmpt1.component.ts / cmpt2.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { CounterService } from './counter.service';

@Component({
  selector: 'app-[cmpt1/cmpt2]',
  template: `
    <div>
      <h2>Counter</h2>
      <button (click)="counter.dec()">-</button>
      {{counter.getCount}}
      <button (click)="counter.inc()">+</button>
    <div>
  `
})
export class [Cmpt1/Cmpt2]Component implements OnInit, OnDestroy {
  countSub: Subscription;
  
  constructor(private counter: CounterService) { }

  ngOnInit() {
    this.countSub = this.counter.count$.subscribe(
      value => {
        console.log('global counter value changed:', value);
      }
    );
  }

  ngOnDestroy() {
    this.countSub.unsubscribe();
  }
}
```

Because we provided the service in the app module, we only need to import it to use it in our components. We'll make it available in our `constructor()` function. Now we can use its methods in the component templates.

We can also create a `Subscription` to the `count$` subject to execute component-level logic. We then need to _unsubscribe_ when the component is destroyed to prevent memory leaks.

If we display both components, they'll look and behave like this:

![Migrating AngularJS features to Angular: counter service as a singleton](https://cdn.auth0.com/blog/scotch-ng1-to-ng2/ng2-counter-singleton.gif)

Incrementing or decrementing either component's counter will affect the other. We now have globally shared data!

## Angular: Services with Multiple Instances

_**Download Angular code samples:** [service-with-multiple-instances](https://github.com/kmaida/migrating-angular-features-to-angular2/tree/master/service-with-multiple-instances)_

We mentioned above that services can be provided in a way that creates _multiple_ instances. Doing this was a hassle in AngularJS and thankfully, Angular easily solves this with its use of classes.

> **Scenario:** We have a service that provides properties and methods for a counter. We want more than one counter in our app. Manipulating one counter should not affect the others. 

We'll use our Angular `CounterService` from the previous example. Instead of providing it in the app module `@NgModule`, we'll add it to each `@Component` in a `providers` array like this:

```typescript
// Angular - cmpt1.component.ts / cmpt2.component.ts
...
@Component({
  ...,
  providers: [CounterService]
})
...
```

The result is unique counter instances in `Cmpt1Component` and `Cmpt2Component`:

![Angular counter service with multiple instances](https://cdn.auth0.com/blog/scotch-ng1-to-ng2/ng2-counter-multiple-instances.gif)

To do this in AngularJS, we have to use [factories as APIs that return collections with getters and setters](http://stackoverflow.com/a/16626908/2130141). Doing so isn't simple or elegant. Angular solves this nicely!

## Using Native Events and DOM Properties

_**Download Angular code samples:** [using-native-events-and-dom-properties](https://github.com/kmaida/migrating-angular-features-to-angular2/tree/master/using-native-events-and-dom-properties)_

In Angular, it's easier to hook into native events and DOM properties. In AngularJS, doing this is often fraught with `$scope` hazards and the danger of bad practices. We'll use the `window.resize` event as an example. Consider this common scenario:

> **Scenario:** When a user resizes the browser, we want to dynamically set the minimum height of a DOM element.

### Window Resize Event in AngularJS

In AngularJS, we can bind directly to an [AngularJS $window](https://docs.angularjs.org/api/ng/service/$window) `resize` event in a directive or we can use a factory API such as [angular-resize](https://github.com/kmaida/angular-resize). We have to manage `$scope` and carefully clean up our listeners on `$destroy`. Then we either have to use JS to set the DOM property (`min-height` in this case) or we have to [add watchers](https://www.alexkras.com/11-tips-to-improve-angularjs-performance/#watchers) by binding in the template. None of this is ideal.

### Window Resize Event in Angular

We'll demonstrate using an event observable in Angular:

```typescript
// Angular - app.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Component({
  selector: 'app-root',
  template: `
    <div class="fullHeight" [style.min-height]="minHeight"></div>
  `,
  styles: [`
    .fullHeight { background: red; }
  `]
})
export class AppComponent implements OnInit {
  minHeight: string;
  private _initWinHeight: number = 0;

  ngOnInit() {
    Observable.fromEvent(window, 'resize')
      .debounceTime(200)
      .subscribe(event => this._resizeFn(event)
    );
    
    this._initWinHeight = window.innerHeight;
    this._resizeFn(null);
  }
  
  private _resizeFn(e) {
    let winHeight: number = e ? e.target.innerHeight : this._initWinHeight;
    this.minHeight = `${winHeight}px`;
  }

}
```

First we'll import dependencies. We're going to use the `OnInit` [lifecycle hook](https://angular.io/docs/ts/latest/guide/lifecycle-hooks.html) from `@angular/core` to manage the observable and implement initial height. Then we need `Observable` from the [RxJS library](https://github.com/Reactive-Extensions/RxJS) which is packaged with Angular.

**Important Note:** Angular binds to _DOM properties_, not HTML attributes. This may seem counter-intuitive because we declaratively add things like `[style.min-height]` or `[disabled]` to our markup, but these refer to properties, not attributes. Please read [Binding syntax: An overview](https://angular.io/docs/ts/latest/guide/template-syntax.html#!#binding-syntax) to learn more.

We can bind our `minHeight` member to the `[style.min-height]` DOM property on the `<div class="fullHeight">` element. (For the sake of example, we're assuming that a global CSS reset has removed default margins and padding on the `body`.) 

We're using an [RxJS observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html) to subscribe to the `window.resize` event and execute a debounced function that sets a `min-height`. The `window.resize` event doesn't fire on page load, so we then need to _trigger_ the handler in `ngOnInit()`.

**Note:** You've already seen native `(click)` event bindings in earlier examples. We could do the same with `(window.resize)`, but we're subscribing to an observable instead because we want to _debounce_ the handler.

## Router Events

_**Download Angular code samples:** [router-events](https://github.com/kmaida/migrating-angular-features-to-angular2/tree/master/router-events)_

Angular routing is thoroughly covered in the [Angular docs](https://angular.io/docs/ts/latest/guide/router.html) and the [Tour of Heroes tutorial](https://angular.io/docs/ts/latest/tutorial/toh-pt5.html). There are also real-world examples in [Migrating an AngularJS App to Angular - Part 2](https://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-2/) and [Part 3](https://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-3/). Therefore, we'll only cover _router events_ here.

> **Scenario:** Whenever a navigation change is initiated, we want to execute some functionality (for example, closing a navigation menu).

### Navigation Events in AngularJS

In AngularJS, we can listen for navigation events such as [$locationChangeStart](https://docs.angularjs.org/api/ng/service/$location#$locationChangeStart) or [$locationChangeSuccess](https://docs.angularjs.org/api/ng/service/$location#$locationChangeSuccess) like so: 

```js
// AngularJS - on location change

$scope.$on('$locationChangeStart', function(event, newUrl, oldUrl) {
  // do something every time a location change is initiated
});
```

### Navigation Events in Angular

We can do something similar in Angular, but now router events are observables. We need to subscribe to them:

```typescript
// Angular - app.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';

@Component({
  selector: 'app-root',
  template: ``
})
export class AppComponent implements OnInit {
  
  constructor(private router: Router) { }

  ngOnInit() {
    this.router.events
      .filter(event => event instanceof NavigationStart)
      .subscribe(event => {
        // do something every time a location change is initiated
      });
  }
}
```

We need to import `Router` and `NavigationStart` from `@angular/router`. Next we need to make `private router: Router` available in our `constructor()` function.

[Router.events](https://angular.io/api/router/Event) is an observable of route events. We'll filter for when the event is an instance of [`NavigationStart`](https://angular.io/api/router/NavigationStart). Then we can subscribe and execute our desired functionality. Other navigation events can be found in the [Angular router event documentation](https://angular.io/api/router/Event).

**Note:** To learn about a great use-case, check out [Dynamic page titles in Angular with router events](https://toddmotto.com/dynamic-page-titles-angular-2-router-events). 

## Calling an API

_**Download Angular code samples:** [calling-an-api](https://github.com/kmaida/migrating-angular-features-to-angular2/tree/master/calling-an-api)_

Many Angular applications utilize external APIs. Calling an API is not significantly different between AngularJS and Angular. AngularJS uses _promises_ whereas Angular uses _observables_.

> **Scenario:** We want to use the reddit API to display the titles and links of posts from the reddit front page.

You can check out the data we'll be using here: [https://www.reddit.com/.json](https://www.reddit.com/.json).

### Calling an API in AngularJS

Most AngularJS apps use a factory or service to make API calls. The controllers or directives then inject and use that service to fetch or send data. We react to successes or failures using promises.

### Calling an API in Angular

We'll do something very similar in Angular. First we'll create the API service:

```typescript
// Angular - api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/catch';

@Injectable()
export class ApiService {
  private baseUrl = 'https://www.reddit.com/';

  constructor(private http: HttpClient) { }

  getFrontPage$(): Observable<{[key: string]: any}[]> {
    return this.http
      .get(`${this.baseUrl}.json`)
      .map(this.handleSuccess)
      .catch(this.handleError);
  }

  private handleSuccess(res: HttpResponse<any>) {
    return res.data.children;
  }

  private handleError(err: HttpErrorResponse | any) {
    let errorMsg = err.message || 'Unable to retrieve data';
    return Observable.throw(errorMsg);
  }

}
```

This is pretty straightforward and isn't much different from our AngularJS implementation. Starting from the top: we import our dependencies. Services are _injectable_. We also need [HttpClient](https://angular.io/api/common/http/HttpClient), and [HttpResponse](https://angular.io/api/common/http/HttpResponse), and [HttpErrorResponse](https://angular.io/api/common/http/HttpErrorResponse) from `@angular/common/http`, [Observable](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html) from RxJS, and [map](http://blog.thoughtram.io/angular/2016/05/16/exploring-rx-operators-map.html) and [catch](https://www.bennadel.com/blog/3046-experimenting-with-the-catch-operator-and-stream-continuation-in-rxjs-and-angular-2.htm) operators.

**Note:** RxJS [observables are preferable over promises](https://angular-2-training-book.rangle.io/handout/observables/observables_vs_promises.html). Angular's `http.get` returns an observable but we _could_ convert it to a promise with `.toPromise()` if we had to (but we won't in this tutorial).

We set our private API `baseUrl` property and make `private http: HttpClient` available in the constructor. 

Then we define our `getFrontPage$()` function. The `$` at the end of the function name indicates that an observable is returned and we can subscribe to it.

Finally we manage successes and errors. The `map` operator processes the result from the observable. The `HttpClient` returns the response body as JSON by default. The [reddit API](https://www.reddit.com/dev/api/) returns a `data` property and inside that, we want the value of `children`, which is an array of the posts. We'll use the `catch` operator to handle failed API responses and generate an observable that terminates with an error.

The API service should be a singleton so we'll provide it in the app module:

```typescript
// Angular - app.module.ts
...
import { ApiService } from './api.service';

@NgModule({
  ...,
  providers: [ApiService],
  ...
})
export class AppModule { }
```

Now we can use the service in a component to display reddit post titles:

```typescript
// Angular - reddit.component.ts

import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-reddit',
  template: `
    <ul>
      <li *ngFor="let post of redditFP">
        <a href="http://reddit.com{{post.data.permalink}}">{{post.data.title}}</a>
      </li>
    </ul>
  `
})
export class RedditComponent implements OnInit {
  redditFP: {[key: string]: any}[];
  
  constructor(private redditApi: ApiService) { }

  ngOnInit() {
    this.getRedditFront();
  }
  getRedditFront() {
    this.redditApi
      .getFrontPage$()
      .subscribe(
        res => this.redditFP = res,
        err => console.log('An error occurred', err)
      );
  }
}
```

First we import our new `ApiService`. Then we’ll declare that the `redditFP` property should be an array of objects. We’ll add the `private redditApi: ApiService` to the constructor parameters.

The template should display an unordered list with the title of each post linked to its location on [reddit](http://www.reddit.com).

We can then write the `getRedditFront()` method to subscribe to the `redditApi.getFrontPage$()` observable and assign the response to the `redditFP` property. We’ll call the `getRedditFront()` method in our `ngOnInit()` lifecycle hook.

**Note:** We're using a third party API for this example. However, when we have tighter control over our own APIs, we can use TypeScript to set defined _models_ for the data we expect. To learn more about using models, please check the "Calling an API in Angular" section of [Migrating an AngularJS App to Angular - Part 2](https://auth0.com/blog/migrating-an-angular-1-app-to-angular-2-part-2/).

When this component is displayed, we should see a list of links to the current posts on reddit's front page.

## Filtering by Search Query

_**Download Angular code samples:** [filtering](https://github.com/kmaida/migrating-angular-features-to-angular2/tree/master/filtering)_

You may have heard about [Angular pipes](https://angular.io/guide/pipes). Pipes transform displayed values within a template. In AngularJS, we use the pipe character (`|`) to do similar things with [filters](https://docs.angularjs.org/api/ng/filter/filter). However, **filters are _gone_ in Angular**.

Let's address the following scenario:

> **Scenario:** We have an array of objects and want the user to be able to filter the array using a search query.

### Filtering in AngularJS

In AngularJS, we can give an input an `ng-model` and then use a `filter` on the repeater:

```js
<label for="search">Search:</label>
<input id="search" type="text" ng-model="query">

<div ng-repeat="item in array | filter:query">
  {{item.name}}
</div>
```

Simple, right? 

Well, yes and no. AngularJS apps can take a huge performance hit if care isn't taken when filtering. If you've ever filtered hundreds or thousands of items (or implemented faceted search), you're probably familiar with the pitfalls of AngularJS's built-in `filter`.

In such cases, you may have used a service to implement filtering or added your filtering logic right in your controller. We can regain some performance by exerting tighter control over how and when filtering is executed.

### Filtering in Angular

The Angular team recommends _against_ replicating AngularJS filter functionality with a custom [pipe](https://angular.io/guide/pipes) due to concerns over performance and minification. Instead, we'll create a _service_ that performs filtering.

**Note:** You can read more about why the filter pipe was removed in the ["No _FilterPipe_ or _OrderByPipe_" section of the Pipes docs](https://angular.io/guide/pipes#appendix-no-filterpipe-or-orderbypipe).

Let's create a `FilterService`. The first step is establishing some rules regarding implementation. Let's say we want to ensure the following:

* We expect to filter an array of _objects_.
* Search function should accept the array and a `query` predicate (filter criteria) and return an array with all objects that contain a match.
* Search should be case-insensitive.
* We'll only search string values for matches.

With these simple guidelines, our `FilterService` might look like this:

```typescript
// Angular - filter.service.ts

import { Injectable } from '@angular/core';

@Injectable()
export class FilterService {
  search(array: Object[], query: string) {
    let lQuery = query.toLowerCase();

    if (!query) {
      return array;
    } else if (array) {
      let filteredArray = array.filter(item => {
        for (let key in item) {
          if ((typeof item[key] === 'string') && (item[key].toLowerCase().indexOf(lQuery) !== -1)) {
            return true;
          }
        }
      });
      return filteredArray;
    }
  }

}
```

This is very straightforward and we have _direct control_ over how filtering works. If we want to include other value types in the future (such as numbers or dates), we'd modify `search()` or create new methods.

We typically would want a singleton `FilterService`, so we should provide it in our `app.module.ts` file:

```typescript
// Angular - app.module.ts
...
import { FilterService } from './filter.service';

@NgModule({
  ...,
  providers: [FilterService],
  ...
})
export class AppModule { }
```

We can then use it in our components like this:

```typescript
// Angular - list.component.ts

import { Component } from '@angular/core';
import { FilterService } from './filter.service';

@Component({
  selector: 'app-list',
  template: `
    <label for="search">Search:</label>
    <input id="search" type="text" [(ngModel)]="query" />
    <button (click)="search()" [disabled]="!query">Go</button>
    <button (click)="reset()" [disabled]="!query">Reset</button>

    <ul>
      <li *ngFor="let item of filteredArray">{{item.name}}</li>
    </ul>
  `
})
export class ListComponent {
  array = [
    { id: 1, name: 'Jon Snow' },
    { id: 2, name: 'Sansa Stark' },
    { id: 3, name: 'Arya Stark' },
    { id: 4, name: 'Bran Stark' },
    { id: 5, name: 'Petyr Baelish' },
    { id: 6, name: 'Danaerys Targaryen' },
    { id: 7, name: 'Jaime Lannister ' },
    { id: 8, name: 'Cersei Lannister' },
    { id: 9, name: 'Samwell Tarly' },
    { id: 10, name: 'Sandor Clegane' }
  ];
  filteredArray = this.array;
  query: string;
  
  constructor(private filter: FilterService) { }

  search() {
    this.filteredArray = this.filter.search(this.array, this.query);
  }

  reset() {
    this.query = '';
    this.filteredArray = this.array;
  }

}
```

We now have working filtering:

![Migrating AngularJS features to Angular: filtering by search query](https://cdn.auth0.com/blog/scotch-ng1-to-ng2/ng2-filtering.gif)

This example uses a button to trigger filtering. If we wanted to mimic AngularJS's native `filter`, we could run the search on `(keyup)` on the input and remove the "Go" button, like so:

```html
<input
  id="search"
  type="text"
  [(ngModel)]="query"
  (keyup)="search()" />
```

This is less performant, but may be a desirable user experience in some cases.

![Migrating AngularJS features to Angular: filtering by search query with keyup](https://cdn.auth0.com/blog/scotch-ng1-to-ng2/ng2-filtering-keyup.gif)

**Note:** You'd never want to use `(keyup)` if each search query involved expensive processing, huge amounts of data, or API calls. These situations cause problems with the built-in `filter` in AngularJS and we don't want to recreate them in Angular.

## Aside: Authenticate an Angular App and Node API with Auth0

We can protect our applications and APIs so that only authenticated users can access them. Let's explore how to do this with an Angular application and a Node API using [Auth0](https://auth0.com). You can clone this sample app and API from the [angular-auth0-aside repo on GitHub](https://github.com/auth0-blog/angular-auth0-aside).

![Auth0 hosted login screen](https://cdn2.auth0.com/blog/angular-aside/angular-aside-login.jpg)

### Features

The [sample Angular application and API](https://github.com/auth0-blog/angular-auth0-aside) has the following features:

* Angular application generated with [Angular CLI](https://github.com/angular/angular-cli) and served at [http://localhost:4200](http://localhost:4200)
* Authentication with [auth0.js](https://auth0.com/docs/libraries/auth0js/v8) using a hosted [Lock](https://auth0.com/lock) instance
* Node server protected API route `http://localhost:3001/api/dragons` returns JSON data for authenticated `GET` requests
* Angular app fetches data from API once user is authenticated with Auth0
* Profile page requires authentication for access using route guards
* Authentication service uses a subject to propagate authentication status events to the entire app
* User profile is fetched on authentication and stored in authentication service
* Access token, ID token, profile, and token expiration are stored in local storage and removed upon logout

### Sign Up for Auth0

You'll need an [Auth0](https://auth0.com) account to manage authentication. You can sign up for a [free account here](https://auth0.com/signup). Next, set up an Auth0 client app and API so Auth0 can interface with an Angular app and Node API.

### Set Up a Client App

1. Go to your [**Auth0 Dashboard**](https://manage.auth0.com/#/) and click the "[create a new client](https://manage.auth0.com/#/clients/create)" button.
2. Name your new app and select "Single Page Web Applications".
3. In the **Settings** for your new Auth0 client app, add `http://localhost:4200/callback` to the **Allowed Callback URLs** and `http://localhost:4200` to the **Allowed Origins (CORS)**.
4. Scroll down to the bottom of the **Settings** section and click "Show Advanced Settings". Choose the **OAuth** tab and set the **JsonWebToken Signature Algorithm** to `RS256`.
5. If you'd like, you can [set up some social connections](https://manage.auth0.com/#/connections/social). You can then enable them for your app in the **Client** options under the **Connections** tab. The example shown in the screenshot above utilizes username/password database, Facebook, Google, and Twitter. For production, make sure you set up your own social keys and do not leave social connections set to use Auth0 dev keys.

### Set Up an API

1. Go to [**APIs**](https://manage.auth0.com/#/apis) in your Auth0 dashboard and click on the "Create API" button. Enter a name for the API. Set the **Identifier** to your API endpoint URL. In this example, this is `http://localhost:3001/api/`. The **Signing Algorithm** should be `RS256`.
2. You can consult the Node.js example under the **Quick Start** tab in your new API's settings. We'll implement our Node API in this fashion, using [Express](https://expressjs.com/), [express-jwt](https://github.com/auth0/express-jwt), and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

We're now ready to implement Auth0 authentication on both our Angular client and Node backend API.

### Dependencies and Setup

The Angular app utilizes the [Angular CLI](https://github.com/angular/angular-cli). Make sure you have the CLI installed globally:

```bash
$ npm install -g @angular/cli
```

Once you've cloned [the project](https://github.com/auth0-blog/angular-auth0-aside), install the Node dependencies for both the Angular app and the Node server by running the following commands in the root of your project folder:

```bash
$ npm install
$ cd server
$ npm install
```

The Node API is located in the [`/server` folder](https://github.com/auth0-blog/angular-auth0-aside/tree/master/server) at the root of our sample application.

Open the [`server.js` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/server/server.js):

```js
// server/server.js
...
// @TODO: change [CLIENT_DOMAIN] to your Auth0 domain name.
// @TODO: change [AUTH0_API_AUDIENCE] to your Auth0 API audience.
var CLIENT_DOMAIN = '[CLIENT_DOMAIN]'; // e.g., youraccount.auth0.com
var AUTH0_AUDIENCE = '[AUTH0_API_AUDIENCE]'; // http://localhost:3001/api in this example

var jwtCheck = jwt({
    secret: jwks.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${CLIENT_DOMAIN}/.well-known/jwks.json`
    }),
    aud: AUTH0_AUDIENCE,
    issuer: `https://${CLIENT_DOMAIN}/`,
    algorithm: 'RS256'
});
...
//--- GET protected dragons route
app.get('/api/dragons', jwtCheck, function (req, res) {
  res.json(dragonsJson);
});
...
```

Change the `CLIENT_DOMAIN` variable to your Auth0 client domain. The `/api/dragons` route will be protected with [express-jwt](https://github.com/auth0/express-jwt) and [jwks-rsa](https://github.com/auth0/node-jwks-rsa).

> **Note:** To learn more about RS256 and JSON Web Key Set, read [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/).

Our API is now protected, so let's make sure that our Angular application can also interface with Auth0. To do this, we'll activate the [`src/app/auth/auth0-variables.ts.example` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth0-variables.ts.example) by deleting the `.example` from the file extension. Then open the file and change the `[CLIENT_ID]` and `[CLIENT_DOMAIN]` strings to your Auth0 information:

```js
// src/app/auth/auth0-variables.ts
...
export const AUTH_CONFIG: AuthConfig = {
  CLIENT_ID: '[CLIENT_ID]',
  CLIENT_DOMAIN: '[CLIENT_DOMAIN]',
  ...
```

Our app and API are now set up. They can be served by running `ng serve` from the root folder and `node server.js` from the `/server` folder.

With the Node API and Angular app running, let's take a look at how authentication is implemented.

### Authentication Service

Authentication logic on the front end is handled with an `AuthService` authentication service: [`src/app/auth/auth.service.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth.service.ts).

```js
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import * as auth0 from 'auth0-js';
import { AUTH_CONFIG } from './auth0-variables';
import { UserProfile } from './profile.model';

@Injectable()
export class AuthService {
  // Create Auth0 web auth instance
  // @TODO: Update AUTH_CONFIG and remove .example extension in src/app/auth/auth0-variables.ts.example
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.CLIENT_ID,
    domain: AUTH_CONFIG.CLIENT_DOMAIN,
    responseType: 'token id_token',
    redirectUri: AUTH_CONFIG.REDIRECT,
    audience: AUTH_CONFIG.AUDIENCE,
    scope: AUTH_CONFIG.SCOPE
  });
  userProfile: UserProfile;

  // Create a stream of logged in status to communicate throughout app
  loggedIn: boolean;
  loggedIn$ = new BehaviorSubject<boolean>(this.loggedIn);

  constructor(private router: Router) {
    // If authenticated, set local profile property and update login status subject
    if (this.authenticated) {
      this.userProfile = JSON.parse(localStorage.getItem('profile'));
      this.setLoggedIn(true);
    }
  }

  setLoggedIn(value: boolean) {
    // Update login status subject
    this.loggedIn$.next(value);
    this.loggedIn = value;
  }

  login() {
    // Auth0 authorize request
    this.auth0.authorize();
  }

  handleAuth() {
    // When Auth0 hash parsed, get profile
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        window.location.hash = '';
        this._getProfile(authResult);
        this.router.navigate(['/']);
      } else if (err) {
        this.router.navigate(['/']);
        console.error(`Error: ${err.error}`);
      }
    });
  }

  private _getProfile(authResult) {
    // Use access token to retrieve user's profile and set session
    this.auth0.client.userInfo(authResult.accessToken, (err, profile) => {
      this._setSession(authResult, profile);
    });
  }

  private _setSession(authResult, profile) {
    // Save session data and update login status subject
    localStorage.setItem('access_token', authResult.accessToken);
    localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('profile', JSON.stringify(profile));
    localStorage.setItem('expires_at', authResult.expiresAt);
    this.userProfile = profile;
    this.setLoggedIn(true);
  }

  logout() {
    // Remove tokens and profile and update login status subject
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('profile');
    localStorage.removeItem('expires_at');
    this.userProfile = undefined;
    this.setLoggedIn(false);
  }

  get authenticated(): boolean {
    // Check if current time is past access token's expiration
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    return Date.now() < expiresAt;
  }

}
```

This service uses the config variables from `auth0-variables.ts` to instantiate an `auth0.js` WebAuth instance.

An [RxJS `BehaviorSubject`](https://github.com/Reactive-Extensions/RxJS/blob/master/doc/api/subjects/behaviorsubject.md) is used to provide a stream of authentication status events that you can subscribe to anywhere in the app.

The `login()` method authorizes the authentication request with Auth0 using your config variables. An Auth0 hosted Lock instance will be shown to the user and they can then log in.

> **Note:** If it's the user's first visit to our app _and_ our callback is on `localhost`, they'll also be presented with a consent screen where they can grant access to our API. A first party client on a non-localhost domain would be highly trusted, so the consent dialog would not be presented in this case. You can modify this by editing your [Auth0 Dashboard API](https://manage.auth0.com/#/apis) **Settings**. Look for the "Allow Skipping User Consent" toggle.

We'll receive an `id_token`, `access_token`, and `expires_at` in the hash from Auth0 when returning to our app. The `handleAuth()` method uses Auth0's `parseHash()` method callback to get the user's profile (`_getProfile()`) and set the session (`_setSession()`) by saving the tokens, profile, and token expiration to local storage and updating the `loggedIn$` subject so that any subscribed components in the app are informed that the user is now authenticated.

> **Note:** The profile takes the shape of [`profile.model.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/profile.model.ts) from the [OpenID standard claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims).

The `handleAuth()` method can then be called in the [`app.component.ts` constructor](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app.component.ts) like so:

```js
// src/app/app.component.ts
import { AuthService } from './auth/auth.service';
...
  constructor(private auth: AuthService) {
    // Check for authentication and handle if hash present
    auth.handleAuth();
  }
...
```

Finally, we have a `logout()` method that clears data from local storage and updates the `loggedIn$` subject. We also have an `authenticated` accessor to return current authentication status.

Once [`AuthService` is provided in `app.module.ts`](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app.module.ts#L32), its methods and properties can be used anywhere in our app, such as the [home component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/home).

The [callback component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/callback) is where the app is redirected after authentication. This component simply shows a loading message until hash parsing is completed and the Angular app redirects back to the home page.

### Making Authenticated API Requests

In order to make authenticated HTTP requests, we need to add a `Authorization` header with the access token in our [`api.service.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/api.service.ts).

```js
// src/app/api.service.ts
...
  getDragons$(): Observable<any[]> {
    return this.http
      .get(`${this.baseUrl}dragons`, {
        headers: new HttpHeaders().set(
          'Authorization', `Bearer ${localStorage.getItem('access_token')}`
        )
      })
      .catch(this._handleError);
  }
...
```

### Final Touches: Route Guard and Profile Page

A [profile page component](https://github.com/auth0-blog/angular-auth0-aside/tree/master/src/app/profile) can show an authenticated user's profile information. However, we only want this component to be accessible if the user is logged in.

With an [authenticated API request and login/logout](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/home/home.component.ts) implemented, the final touch is to protect our profile route from unauthorized access. The [`auth.guard.ts` route guard](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/auth/auth.guard.ts) can check authentication and activate routes conditionally. The guard is implemented on specific routes of our choosing in the [`app-routing.module.ts` file](https://github.com/auth0-blog/angular-auth0-aside/blob/master/src/app/app-routing.module.ts) like so:

```js
// src/app/app-routing.module.ts
...
import { AuthGuard } from './auth/auth.guard';
...
      {
        path: 'profile',
        component: ProfileComponent,
        canActivate: [
          AuthGuard
        ]
      },
...
```

### More Resources

That's it! We have an authenticated Node API and Angular application with login, logout, profile information, and protected routes. To learn more, check out the following resources:

* [Why You Should Always Use Access Tokens to Secure an API](https://auth0.com/blog/why-should-use-accesstokens-to-secure-an-api/)
* [Navigating RS256 and JWKS](https://auth0.com/blog/navigating-rs256-and-jwks/)
* [Access Token](https://auth0.com/docs/tokens/access-token)
* [Verify Access Tokens](https://auth0.com/docs/api-auth/tutorials/verify-access-token)
* [Call APIs from Client-side Web Apps](https://auth0.com/docs/api-auth/grant/implicit)
* [How to implement the Implicit Grant](https://auth0.com/docs/api-auth/tutorials/implicit-grant)
* [Auth0.js v8 Documentation](https://auth0.com/docs/libraries/auth0js/v8)
* [OpenID Standard Claims](https://openid.net/specs/openid-connect-core-1_0.html#StandardClaims)

## Conclusion

We've now discussed several common features of AngularJS apps and how to implement them in Angular. This guide focused on features that:

* are needed the soonest when building an app,
* are used very frequently,
* differ significantly from AngularJS implementation, OR
* may not be documented as well as others.

Hopefully this guide has helped you feel more comfortable in the Angular space. For the whole picture, the [docs are an excellent source of information](https://angular.io/guide/). Now let's go build!