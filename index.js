const { createInstance } = require('@salling-group/auth');
const Traverser = require('@salling-group/pagination-traverser');
const pkg = require('./package');

/**
 * A query builder for querying stores.
 */
class StoresQuery {
  /**
   * Constructs a new query builder.
   * @param {StoresSDK} storesAPI A handle to Index.
   */
  constructor(storesAPI) {
    this.storesAPI = storesAPI;
    this.params = {};
  }

  /**
   * Sets a parameter for the request being built.
   *
   * @param {string} param The param name.
   * @param {*} value The value to set.
   */
  set(param, value) {
    this.params[param] = value;
  }

  /**
   * Returns only the given fields.
   *
   * @param  {string} fields The fields to return.
   * @returns {StoresQuery}
   */
  pick(...fields) {
    this.params.fields = fields.join(',');
    return this;
  }

  /**
   * Returns only stores of the given brand.
   *
   * @param {string} brand The brand to filter by.
   * @returns {StoresQuery}
   */
  ofBrand(brand) {
    this.set('brand', brand);
    return this;
  }

  /**
   * Returns only stores in the given city.
   *
   * @param {string} city The city to filter by.
   * @returns {StoresQuery}
   */
  inCity(city) {
    this.set('city', city);
    return this;
  }

  /**
   * Returns only stores in the given ZIP code.
   *
   * @param {string} zip The ZIP code to filter by.
   * @returns {StoresQuery}
   */
  inZIP(zip) {
    this.set('zip', zip);
    return this;
  }

  /**
   * Returns only stores near a given coordinate.
   *
   * @param {number|string} long The longitude of the coordinate.
   * @param {number|string} lat The latitude of the coordinate.
   * @param {number|string} radius The radius around the coordinate in kilometers.
   * @returns {StoresQuery}
   */
  nearCoordinate(long, lat, radius) {
    this.set('geo', `${long},${lat}`);
    this.set('radius', radius);
    return this;
  }

  /**
   * Returns only stores in the given country.
   * Countries are specified using ISO 3166-1 alpha-2,
   * DK for denmark, SE for Sweden etc.
   *
   * @param {string} country Country code to get stores for.
   * @returns {StoresQuery}
   */
  inCountry(country) {
    this.set('country', country);
    return this;
  }

  /**
   * Executes the query.
   *
   * @returns {Traverser} A traverser to use for iteration.
   */
  execute() {
    return this.storesAPI.query(this.params);
  }
}

const BASE_URL = '/v1/stores/';

/**
 * Wraps the Salling Group Stores API.
 */
class StoresSDK {
  /**
   * Initializes a new Stores API wrapper.
   * @param {Object} options A SallingGroupAPI instance.
   */
  constructor(options) {
    this.instance = createInstance({
      ...options,
      'baseName': `Stores SDK v${pkg.version}`,
    });
  }

  /**
   * Get a specific store.
   *
   * @param storeID The ID of the store.
   * @returns {Promise<Object|null>} Returns the store. If it cannot be found, then it returns null.
   */
  async get(storeID) {
    try {
      const result = await this.instance.get(`${BASE_URL}${storeID}`);
      return result.data;
    } catch (error) {
      if (error.statusCode === 404) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Query stores based on search parameters.
   *
   * @param {Object} params The search parameters.
   * @returns {Traverser} A traverser to use for iteration over the stores.
   */
  query(params = {}) {
    return new Traverser(this.instance, BASE_URL, { params });
  }

  /**
   * Gets all stores.
   *
   * @returns {Traverser} A traverser to use for iteration over the stores.
   */
  getAll() {
    return this.query();
  }

  /**
   * Begins a store query. This supports chain calling. Execute the query by running .execute().
   *
   * @returns {StoresQuery} The query to be built. Execute with .execute().
   */
  beginQuery() {
    return new StoresQuery(this);
  }
}

module.exports = StoresSDK;
