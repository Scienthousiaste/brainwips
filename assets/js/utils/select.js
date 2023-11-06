/*
    A personal reimplementation of a jQuery like little minilibrary, called select
*/

const select = (function () {

    function addClass(newClass) {
        for (let i = 0; i < this.length; i++) {
            this[i].className += ' ' + newClass;
        }
        return this;
    }

    function removeClass(classToRemove) {
        for (let i = 0; i < this.length; i++) {
            const oldClasses = this[i].className.split(' ');
            const newClasses = [];

            for (let j = 0; j < oldClasses.length; j++) {
                if (oldClasses[j] !== classToRemove) {
                    newClasses.push(oldClasses[j]);
                }
            }
            this[i].className = newClasses.join(' ');
        }
        return this;
    }

    function changeText(newContent) {
        for (let i = 0; i < this.length; i++) {
            this[i].textContent = newContent;
        }
        return this;
    }

    function hide() {
        for (let i = 0; i < this.length; i++) {
            this[i].style.display = 'none';
        }
        return this;
    }

    function show(str) {
        if (str) {
            for (let i = 0; i < this.length; i++) {
                this[i].style.display = str;
            }
        }
        else {
            for (let i = 0; i < this.length; i++) {
                this[i].style.display = 'block';
            }
        }
        return this;
    }

    function on(event, foo) {
        for (let i = 0; i < this.length; i++) {
            this[i].addEventListener(event, foo);
        }
        return this;
    }

    function html(newContent) {
        for (let i = 0; i < this.length; i++) {
            this[i].innerHTML = newContent;
        }
        return this;
    }

    function addText(newContent) {
        for (let i = 0; i < this.length; i++) {
            this[i].textContent += newContent;
        }
        return this;
    }

    function select(queryString) {
        const selectedElems = document.querySelectorAll(queryString);
        selectedElems.addClass = addClass;
        selectedElems.removeClass = removeClass;
        selectedElems.changeText = changeText;
        selectedElems.hide = hide;
        selectedElems.show = show;
        selectedElems.on = on;
        selectedElems.html = addText;
        selectedElems.addText = html;

        return (selectedElems);
    }
    return select;
})();

export default select;