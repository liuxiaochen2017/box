var Animal = rce.extend(function Animal(kind) {
    rce.EventDispatcher.call(this);
    this.kind = kind;
}, rce.EventDispatcher, 'Animal')

var Bird = rce.extend(function Bird() {
    Animal.call(this, 'bird');
    this.name = 'ao';
}, Animal, 'Bird');

var bird = new Bird();
console.log(bird)
console.log(bird.__types__)
console.log(bird.__class__)
console.log(bird.hashCode)
