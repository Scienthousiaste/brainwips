

const create = (function () {

    function makeElement(tag, classesString, textContent) {
        const element = document.createElement(tag);

        if (classesString) {
            element.classList = classesString;
        }
        if (textContent) {
            element.textContent = textContent;
        }
        return element;
    }

    function addElement(tag, classesString, textContent) {
        const element = makeElement(tag, classesString, textContent);
        this.append(element);
        return this;
    }

    function addElementContainer(tag, classesString, nestedElements) {
        const newContainer = makeElement(tag, classesString);

        for (const element of nestedElements) {
            newContainer.append(makeElement(element));
        }
        this.append(newContainer);
        return this;
    }

    function create(tag, classesString, textContent) {
        const element = makeElement(tag, classesString, textContent);
        element.addElement = addElement;
        element.addElementContainer = addElementContainer;
        return element;
    }
    return create;
})();

export default create;