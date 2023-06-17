/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = () => this.width * this.height;

  return this;
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(Proto, json) {
  const object = JSON.parse(json);

  Object.setPrototypeOf(object, Proto);

  return object;
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class NEWcssSelectorBuilder {
  constructor() {
    this.selector = {};
    this.order = [];
  }

  check(value) {
    const check = ['element', 'id', 'class', 'attr', 'pseudoClass', 'pseudoElement'];
    const { length } = this.order;

    const prev = this.order[length - 1];
    const indexPrev = check.indexOf(prev);
    const indexCurrent = check.indexOf(value);

    if (indexPrev >= 0) {
      if (indexPrev > indexCurrent) {
        throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
      }
    }

    if (indexPrev < indexCurrent) this.order.push(value);
  }

  element(value) {
    this.check('element');

    if (!this.selector[1]) {
      this.selector[1] = value;
    } else {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    return this;
  }

  id(value) {
    this.check('id');

    if (!this.selector[2]) {
      this.selector[2] = `#${value}`;
    } else {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    return this;
  }

  class(value) {
    this.check('class');

    if (!this.selector[3]) {
      this.selector[3] = `.${value}`;
    } else {
      this.selector[3] += `.${value}`;
    }

    return this;
  }

  attr(value) {
    this.check('attr');

    if (!this.selector[4]) {
      this.selector[4] = `[${value}]`;
    } else {
      this.selector[4] += `[${value}]`;
    }

    return this;
  }

  pseudoClass(value) {
    this.check('pseudoClass');

    if (!this.selector[5]) {
      this.selector[5] = `:${value}`;
    } else {
      this.selector[5] += `:${value}`;
    }

    return this;
  }

  pseudoElement(value) {
    this.check('pseudoElement');

    if (!this.selector[6]) {
      this.selector[6] = `::${value}`;
    } else {
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }

    return this;
  }

  stringify() {
    let value = Object.values(this.selector);
    value = value.join('');

    return value;
  }
}

const cssSelectorBuilder = {
  combiner: [],

  element(value) {
    return new NEWcssSelectorBuilder().element(value);
  },

  id(value) {
    return new NEWcssSelectorBuilder().id(value);
  },

  class(value) {
    return new NEWcssSelectorBuilder().class(value);
  },

  attr(value) {
    return new NEWcssSelectorBuilder().attr(value);
  },

  pseudoClass(value) {
    return new NEWcssSelectorBuilder().pseudoClass(value);
  },

  pseudoElement(value) {
    return new NEWcssSelectorBuilder().pseudoElement(value);
  },


  combine(selector1, combinator, selector2) {
    const currentValue = [];
    if (selector1.selector) {
      const part1 = Object.values(selector1.selector).join('');
      currentValue.push(part1);
    }

    if (combinator) {
      currentValue.push(combinator);
    }

    if (selector2.selector) {
      const part2 = Object.values(selector2.selector).join('');
      currentValue.push(part2);
    }

    this.combiner.unshift(...currentValue);
    return this;
  },

  stringify() {
    const arrRes = this.combiner.join(' ');
    this.combiner = [];
    return arrRes;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
