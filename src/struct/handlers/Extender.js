/**
 * Extender is a utility class for applying property extensions to a prototype.
 * 
 * The class is safe against overwrites, i.e. if you try to rewrite an 
 * already existing property, it will throw an error unless you explicitly
 * allow it with the boolean option.
 */
export default class Extender {
  /**
   * Create a new extender.
   * @param {Object} obj Object with properties: name, description, and target.
   */
  constructor(target) {
    this.target = target.prototype;
    this.prepareArray = [];
  };
  /**
   * Prepare to apply property extensions to the target prototype.
   *
   * This reads the definitions, checks each property name against already 
   * existing properties and then appends it to an internal array.
   * This array is then used by the apply method.
   * @param {Array} extensions An array of objects. Each object should have:
   * - `name`: The name of the new property.
   * - `definition`: The property descriptor.
   * @param {Boolean} overwrite Whether to allow overwriting existing properties.
   */
  prepare(extensions, overwrite = false) {
    if (!Array.isArray(extensions)) throw new Error('Extensions must be an array');
    if (!this.target) throw new Error('Target must be a prototype');
    extensions.forEach(({ name, definition }) => {
      // safety checkers
      if (!name || typeof name !== 'string') throw new Error('Name must be a string');
      if (name in this.target && !overwrite) throw new Error(`The property "${name}" already exists`);
      if (!definition || typeof definition !== 'object') throw new Error('Definition must be an object');
      // append to the list
      this.prepareArray.push({ name, definition });
    });
  };
  /**
   * Apply the prepared property extensions to the target prototype.
   */
  apply() {
    if (!this.prepareArray.length) throw new Error('No properties to apply');
    this.prepareArray.forEach(({ name, definition }) => {
      Object.defineProperty(this.target, name, definition);
    });
  };
}