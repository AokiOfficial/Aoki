import { EmbedBuilder } from 'discord.js';

/**
 * Creates a pagination instance for multiple "pages" of content
 * 
 * Use classic collector to handle navigation  
 */
export default class Pagination {
  constructor(...arr) {
    /**
     * Array of EmbedBuilder to paginate
     * @type {EmbedBuilder[]}
     * @private
     */
    this._array = [...arr].flat();

    /**
     * The index of this paginate instance
     * @type {Number}
     * @private
     */
    this._index = 0;

    /**
     * Validate array content
     * @type {function}
     */
    this._validate();
  }

  /**
   * Add more EmbedBuilders to the array
   * @param {EmbedBuilder[]} EmbedBuilder An array or a single EmbedBuilder instance
   * @returns {EmbedBuilder[]} The array of the added EmbedBuilders
  */
  add(...i) {
    this._array.push(...i.flat());
    this._validate()
    return [...i.flat()];
  };

  /**
   * Delete elements from the array
   * @param {number} index the index of the element to remove
   * @returns {EmbedBuilder[]} The array of the deleted EmbedBuilder
  */
  delete(index) {
    if (typeof index !== 'number') return [];
    else {
      if (index === this.currentIndex) if (this.currentIndex > 0) this.previous();
      else if (this.currentIndex === this.tail) this.previous();
      return this._array.splice(index,1);
    };
  };

  /**
   * Moves the index up to view the next element from the array
   * This will also reset to 0 if the index exceeds array length
   * @returns {EmbedBuilder} The element from the array
  */
  next() {
    if (!this._array.length) return undefined;
    if (this._index === this.tail) this._index = -1;
    this._index++;
    return this._array[this._index];
  };

  /**
   * Moves the index down to view the previous element from the array
   * This will also reset to max index if the index < 0
   * @returns {EmbedBuilder} The element from the array
  */
  previous() {
    if (!this._array.length) return undefined;
    if (this._index === 0) this._index = this.tail + 1;
    this._index--;
    return this._array[this._index];
  };

  /**
   * The current embed using the current index
   * @type {EmbedBuilder}
   * @readonly
  */
  get currentPage() {
    return this._array[this._index];
  };

  /**
   * The first embed from the array
   * @type {EmbedBuilder}
   * @readonly
  */
  get firstPage() {
    return this._array[0];
  };

  /**
   * The last embed from the array
   * @type {EmbedBuilder}
   * @readonly
  */
  get lastPage() {
    return this._array[this.tail];
  };

  /**
   * The current index
   * @type {Number}
   * @readonly
  */
  get currentIndex() {
    return this._index;
  };

  /**
   * The number of embed in the array
   * @type {Number}
   * @readonly
  */
  get size() {
    return this._array.length;
  };

  /**
   * The last index, or null if no element.
   * @type {Number}
   * @readonly
  */
  get tail() {
    return this._array.length > 0 ? this._array.length - 1 : null;
  };

  /**
   * Checks if there is a non message embed present in the array
   * @returns {void}
  */
  _validate() {
    for (const el of this._array) {
      if (!(el instanceof EmbedBuilder)) {
        throw new Error('Passed argument is not an instance of EmbedBuilder.');
      };
    };
    return;
  };
};
