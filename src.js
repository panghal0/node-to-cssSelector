(function(window, document, undefined) {

	/**
	 * Get the selectorList of the element
	 * @param  {HTMLElement} node    - [description]
	 * @return {String} - [description]
	 */
	function findSelector(node) {
		var selectorList = [],
			element = node,
			length = 0;

		while (element !== document) {
			// check at document  level
			if (checkForUniqueSelector(element, selectorList))
				break;

			// check at parent level
			checkForClass(element, selectorList, element.parentNode);

			// if no class based selector at parent level, check for tags
			if (selectorList.length === length) {
				checkForTag(element, selectorList, element.parentNode);
			}

			//check at child level for nth-child or nth-of-type
			if (selectorList.length === length) {
				checkChildForClass(element, selectorList);
			}
			if (selectorList.length === length) {
				checkChildForTag(element, selectorList);
			}

			element = element.parentNode;
			length = selectorList.length;
		}

		return selectorList.join(' ');
	}


	/**
	 * check for a unique selector for  the element and add it to the beginning of selector list
	 * @param  {HTMLElement} node    - [description]
	 * @param  {Array} selectorList    - [description]
	 * @return {String} - [description]
	 */
	function checkForUniqueSelector(element, selectorList) {
		// check if element is having some unique property on itself. like id, combination of classes, being the only tag,  etc.
		if (checkForId(element, selectorList))
			return true;

		if (checkForClass(element, selectorList, document))
			return true;

		if (checkForTag(element, selectorList, document))
			return true;

		return false;
	}

	/**
	 * [checkChildForClass description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array} selectorList    - [description]
	 * @return {Boolean} - [description]
	 */
	function checkChildForClass(element, selectorList) {
		if (!element.className) {
			return false;
		}
		return checkChild(element, selectorList, '.' + element.className.replace(/ /g, '.'));
	}

	/**
	 * [checkChildForTag description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array} selectorList    - [description]
	 * @return {Boolean} - [description]
	 */
	function checkChildForTag(element, selectorList) {
		return checkChild(element, selectorList, element.tagName.toLowerCase());
	}

	/**
	 * checking for id of the element which is supposed to be unique, unless the developer decides to fuck it up
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array} selectorList    - [description]
	 * @return {Boolean} - [description]
	 */
	function checkForId(element, selectorList) {
		if (element.id) {
			selectorList.unshift('#' + element.id);
			return true;
		}
		return false;
	}

	/**
	 * [checkForClass description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array} selectorList    - [description]
	 * @param  {HTMLElement} parent  - [description]
	 * @return {Boolean} - [description]
	 */
	function checkForClass(element, selectorList, parent) {
		var className = element.className;
		if (!className) {
			return false;
		}
		if (parent.getElementsByClassName(className).length === 1) {
			selectorList.unshift('.' + className.replace(/ /g, '.'));
			return true;
		}
		return false;
	}

	/**
	 * [checkForTag description]
	 * @param  {HTMLElement} element - [description]
	 * @param  {Array} selectorList    - [description]
	 * @param  {HTMLElement} parent  - [description]
	 * @return {Boolean} - [description]
	 */
	function checkForTag(element, selectorList, parent) {
		var tagName = element.tagName.toLowerCase();
		if (parent.getElementsByTagName(tagName).length === 1) {
			selectorList.unshift(tagName);
			return true;
		}
		return false;
	}

	/**
	 * [checkChild description]
	 * @param  {HTMLElement} element  - [description]
	 * @param  {Array} selectorList     - [description]
	 * @param  {String}      selector - [description]
	 * @return {Boolean} - [description]
	 */
	function checkChild(element, selectorList, selector) {
		var parent = element.parentNode,
			children = parent.children,
			i = 0,
			l;
		for (i = 0, l = children.length; i < l; i++) {
			if (children[i] === element) {
				selectorList.unshift('> ' + selector + ':nth-child(' + (i + 1) + ')');
				return true;
			}
		}
		return false;
	}


	return {
		/**
		 * exposing findSeelctor for public use
		 */
		findSelector: findSelector,

		/**
		 * function to console.log selector based on some options
		 * @param  {[type]} option [description]
		 * @return {[type]}        [description]
		 */
		printSelector: function(option) {
			if (option.onClick) {
				document.addEventListener('click', function(event) {
					var target = event.target || event.srcElement;
					if (console)
						console.log(findSelector(target));
				})
			}
		}
	}

})(window, document, undefined);
