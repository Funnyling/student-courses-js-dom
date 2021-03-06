/**
 * @author ntishkevich
 */
/**
 * noinspection JSDuplicatedDeclaration
 */

/**
 * 1.
 */
function theBridgeOfHoistingDoom() {
    function fellowship() {
        return "friends";
    }
    var sword = "sting";
    var dwarf = function() {
        return "axe";
    };
    var fall = "Fly you fools!";
    fellowship = function() {
        return "broken";
    };
    ring();
    return sword;
}

console.log(theBridgeOfHoistingDoom());

/**
 * 2.
 */
function getProp() {
    return this.prop;
}

window.prop = 'Я - window';
var obj = {prop: 'Я - obj', getProp: getProp };
obj.myMethod = function () {
    console.log(this);
};

getProp(); // ???

obj.getProp(); // ???

obj.myMethod(); // ???

var func = obj.myMethod;
func();

/**
 * 3.
 */
window.prop = 'Я - window';
var obj = {
    prop: 'Я - obj'
};
obj.myMethod = function () {
    function getProp() {
        console.log(this.prop);
    }
    getProp();
};
obj.myMethod(); // ???


window.prop = 'Я - window';
var obj = {
    prop: 'Я - obj'
};
obj.myMethod = function () {
    function getProp() {
        console.log(this.prop);
    }
    getProp.call(this);
};
obj.myMethod(); // ???



window.prop = 'Я - window';
var obj = {
    prop: 'Я - obj'
};
obj.myMethod = function () {
    var that = this;
    function getProp() {
        console.log(that.prop);
    }
    getProp();
};
obj.myMethod(); // ???

/**
 * 4.
 */
obj.myMethod = function () {
    setTimeout(function () {
        console.log(this); // ???
    }.bind(this), 100);
};
obj.myMethod();

/**
 * 5.
 */
obj.myMethod = function () {
    var that = this;
    setTimeout(function () {
        console.log(that); // ???
    }, 100);
};
obj.myMethod();

/**
 * 6.
 */
function Person(name, gender) {
    this.name = name;
    this.gender = gender;

    this.sayGreetings = function () {
        console.log(this.name + ' says "Hello!"');
    };

    this.greet = function (response) {
        this.sayGreetings(); // ???
        response();
    };
}

var steve = new Person('steve', 'M');
var peter = new Person('Peter', 'M');

peter.greet(steve.sayGreetings);

/**
 * 7.
 */
function Person(name, gender) {
    this.name = name;
    this.gender = gender;

    this.sayGreetings = function (greetingCb) {
        if (greetingCb && greetingCb instanceof Function) {
            greetingCb();
        }
    };

    this.greet = function (person) {
        var callBack = function () {
            console.log(person.name + ' greets ' + this.name); // ???
        };
        this.sayGreetings(callBack);
    };
}
var steve = new Person('Steve', 'M');
var peter = new Person('Peter', 'M');

peter.greet(steve);

/**
 * 8.
 */
function Person(name, gender) {
    this.name = name;
    this.gender = gender;

    this.sayGreetings = function () {
        console.log(this.name + ' says "Hello!"');
    };

    this.greet = function (person) {
        var self = this; // ??
        var callBack = function () {
            console.log(person.name + ' greets ' + self.name);
        };
        this.sayGreetings(callBack);
    };
}


/**
 *
 * 9. crazy stuff
 */
var obj = {};
obj.myMethod = function () {
    console.log(this);
    setTimeout(function () {
        console.log(this);
        setTimeout(function () {
            console.log(this);
            setTimeout(function () {
                console.log(this);
                setTimeout(function () {
                    console.log(this);
                }.bind(this), 100); // bind
            }.bind(this), 100); // bind
        }.bind(this), 100); // bind
    }.bind(this), 100); // bind
};
obj.myMethod();

(function () {
    function theBridgeOfHoistingDoom() {
        var sword = undefined;
        var dwarf = undefined;
        var fall = undefined;
        var ring = undefined;
        function fellowship() {
            return "friends";
        }
        sword = "sting";
        dwarf = function() {
            return "axe";
        }
        fall = "Fly you fools!";
        fellowship = function() {
            return "broken";
        }
        ring();
        return sword;
    }
})();

function mystery(phrase) {
    // LexicalEnvironment {phrase: 'Привет', secretFunction: function}

    function secretFunction(name) {
        // LexicalEnvironment {name: 'Мир'}
        // [[Scope]] -> LexicalEnvironment {phrase, secretFunction}
        return phrase + ', ' + name;
    }
    return secretFunction;
}

var hidden = mystery('Привет');
var result = hidden('Мир'); // Привет, Мир

function mystery(phrase) {
    // LexicalEnvironment {phrase, times, secretFunction}
    var times = 0;
    function secretFunction(name) {
        // LexicalEnvironment {name: 'World'}
        // [[Scope]] { phrase, times, secretFunction}
        ++times;
        return phrase + ', ' + name + '. Вызвана ' + times + ' раз/раза';
    }
    return secretFunction;
}

var hidden = mystery('Привет');
var result = hidden('Мир'); // Привет, Мир. Вызвана 1 раз/раза
result = hidden('Миша'); // Привет, Миша. Вызвана 2 раз/раза
result = hidden('Катя'); // Привет, Катя. Вызвана 3 раз/раза
result = hidden('Вася'); // Привет, Вася. Вызвана 4 раз/раза

