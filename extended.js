class ElementSelector {
  constructor(elements, queries) {
    this.setEls(elements, queries);
  }
  // looping over elements
  mapElements(func = empty) {
    if (this.els.length === 0) return [];
    if (this.els.length === 1) return [func(this.el, 0, this.els)];
    else return [...this.els.map(func)];
  }
  forEachELement(func = empty) {
    if (this.els.length === 0) return this;
    if (this.els.length === 1) func(this.el, 0, this.els);
    else this.els.forEach(func);
    return this;
  }
  everyElement(func) {
    if (this.els.length === 0) return false;
    if (this.els.length === 1) return func(this.el, 0, this.els);
    else return this.els.every(func);
  }
  filterELements(func = empty) {
    if (this.els.length === 0) return [];
    return $(...this.els.filter(func));
  }
  forEach(func = empty) {
    if (this.els.length === 0) return this;
    if (this.els.length === 1) func($(this.el), 0, this.els);
    else this.els.forEach((e, i) => func($(e), i));
  }
  map(func = empty) {
    if (this.els.length === 0) return [];
    if (this.els.length === 1) [func($(this.el), 0, this.els)];
    else return this.els.map((e, i) => func($(e), i));
  }
  filter(func = empty) {
    if (this.els.length === 0) return [];
    return this.els.filter((e, i) => func($(e), i));
  }

  // getters
  get el() {
    return this.element;
  }
  get els() {
    return this.elementList;
  }
  get attri() {
    return this.element.attributes;
  }
  get styles() {
    return getComputedStyle(this.el);
  }
  get HTML() {
    return this.el.innerHTML;
  }
  get Text() {
    return this.el.innerText;
  }
  get classes() {
    return this.el.classList;
  }
  get length() {
    return this.els.length;
  }
  get isChecked() {
    return this.el.checked;
  }
  // setters
  set HTML(value) {
    this.el.innerHTML = value;
  }
  setEls(elements, queries) {
    if (!elements) return this;
    this.elementList = [...elements];
    this.element = this.elementList[0];
    if (queries) this.queries = queries;
    else if (elements.length !== 0) {
      this.queries = [];
      this.queries = this.forEachELement((e) => {
        let query = e.tagName.toLowerCase();
        if (e.id) query += `#${e.id}`;
        if (e.className) query += `.${e.className}`;
        if (!this.queries.includes(query)) {
          this.queries.push(query);
        }
      });
    }
    this.eventListenerList = [];
    return this;
  }
  select(...index) {
    if (!index || index.length === 0) return this;
    if (index.length === 1) return $(this.els[index[0]]);
    else return this.filterELements((e, i) => index.includes(i));
  }
  // classes
  addClass(...className) {
    return this.forEachELement((e) => e.classList.add(...className));
  }
  removeClass(...classToRemove) {
    return this.forEachELement((e) => e.classList.remove(...classToRemove));
  }
  // events
  on(type, func) {
    if (isString(type)) {
      this.eventListenerList.push({ type, func, elementList: this.els });
      return this.forEachELement((e) => e.addEventListener(type, func));
    } else
      return this.forEachELement((e) => {
        objectForEach(type, (x, y) => {
          this.eventListenerList.push({
            type: x,
            func: y,
            elementList: this.els,
          });
          e.addEventListener(x, y);
        });
      });
  }
  click(func = empty) {
    return this.on("click", func);
  }
  // props
  prop(propertyName, value) {
    return isValid(value)
      ? this.forEachELement((e) => (e[propertyName] = value))
      : this.mapElements((e) => e[propertyName]);
  }
  html(innerHTML) {
    return this.prop("innerHTML", innerHTML);
  }
  hide(boolean = true, prop = "block") {
    return this.forEachELement((e) => {
      e.style.display = boolean ? "none" : prop;
    });
  }
  disable(boolean) {
    return this.prop("disabled", boolean);
  }
  // document
  appendTo(el) {
    return this.forEachELement((e) => el.el.append(e));
  }
  child() {
    return $(...this.mapElements((e) => [...e.children]).flat());
  }
}
function $(...queries) {
  if (isString(queries[0]))
    return new ElementSelector(document.querySelectorAll(queries), queries);
  else return new ElementSelector(queries);
}
function $$(tagName, to) {
  return to
    ? new ElementSelector([document.createElement(tagName)]).appendTo(to)
    : new ElementSelector([document.createElement(tagName)]);
}
function empty() {}

// check for type
function is(type, e, constructor) {
  return typeof e === type || e instanceof constructor;
}
function isValid(e) {
  return e !== undefined && e !== null;
}

function isString(e) {
  return is("string", e, String);
}
function isFunc(e) {
  return is("function", e, Function);
}

function isObject(obj) {
  return obj === Object(obj);
}

function isBoolean(e) {
  return is("boolean", e, Boolean);
}

function objectForEach(obj, func) {
  if (obj.length === 0) return;
  let keys = Object.keys(obj);
  if (obj.length === 1) func(keys[0], obj[keys[0]], 0, obj);
  else keys.forEach((e, i) => func(e, obj[e], i, obj));
}

function mapObject(obj, func) {
  let arr = [];
  objectForEach(obj, (x, y, i, obj) => arr.push(func(x, y, i, obj)));
  return arr;
}

function on(type, func) {
  addEventListener(type, func);
}

class useStorage {
  constructor(storageObj) {
    this.storageObj = storageObj;
  }
  remove(key) {
    if (key) return;
    this.storageObj.removeItem(key);
  }
  clear() {
    this.storageObj.clear();
  }
  item(key, value) {
    if (!key) return;
    if (value) {
      this.storageObj.setItem(key, JSON.stringify(value));
      return value;
    } else {
      let temp = this.storageObj.getItem(key);
      if (temp) return JSON.parse(temp);
    }
  }
}

const ls = new useStorage(localStorage);

