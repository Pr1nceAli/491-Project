/**
 * @typedef {Object} AssetManagerOptions
 * @property {boolean} debugging - Prints all steps in the console.
 */

class AssetManager {
	constructor(options = { debugging: false }) {
		/**
		 * The number of assets that have been successfully downloaded.
		 * @type {number}
		 */
		successCount = 0

		/**
		 * The number of assets that have failed to download.
		 * @type {number}
		 */
		errorCount = 0

		/**
		 * The cache of assets that have been downloaded.
		 * @type {Object.<string, ImageElement>}
		 */
		cache = {}

		/**
		 * The download queue.
		 * @type {Array.<string>}
		 */
		downloadQueue = []

		/**
		 * Additional options for the asset manager.
		 * @type {AssetManagerOptions}
		 */
		this.options = options
	}

	/**
	 * Log a message to the console if debugging is enabled.
	 * @param {string} message - The message to log.
	 * @param {any} value - The debugging value to log.
	 */
	debug(message = '', value) {
		if (!this.debugging) return

		if (value === undefined) {
			console.log(message)
		} else {
			console.log(message, value)
		}
	}

	/**
	 * Queues an asset for download.
	 * @param {string} path The path to the asset.
	 */
	queueDownload(path) {
		this.downloadQueue.push(path)
		this.debug(`Queued ${path} for download`)
	}

	/**
	 * Downloads all assets in the download queue.
	 * @param {function} callback - The function to call when all assets have been downloaded.
	 */
	downloadAll(callback) {
		if (this.downloadQueue.length === 0) {
			return callback()
		}

		for (const downloadPath of this.downloadQueue) {
			const img = new Image()

			img.addEventListener('load', () => {
				this.debug(`Loaded ${downloadPath}`)
				this.successCount++
				if (this.isDone()) {
					callback()
				}
			})

			img.addEventListener('error', () => {
				this.debug(`Error loading ${downloadPath}`)
				this.errorCount++
				if (this.isDone()) {
					callback()
				}
			})

			img.src = downloadPath
			this.cache[downloadPath] = img
		}
	}

	/**
	 * Determines if all assets have been downloaded.
	 * @returns {boolean} True if all assets have been downloaded, false otherwise.
	 */
	isDone() {
		return this.downloadQueue.length === this.successCount + this.errorCount
	}

	/**
	 * Gets an asset from the cache.
	 * @param {string} path - The path to the asset.
	 * @returns {ImageElement | null} The asset or null if asset wasn't found.
	 */
	getAsset(path) {
		if (this.cache[path] === undefined) {
			this.debug(`Asset ${path} not found in cache`)
			return null
		}

		return this.cache[path]
	}
}