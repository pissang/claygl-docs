
(function () {
    function throttle(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        if (!options) options = {};
        var later = function() {
            previous = options.leading === false ? 0 : Date.now();
            timeout = null;
            result = func.apply(context, args);
            if (!timeout) context = args = null;
        };
        return function() {
            var now = Date.now();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0 || remaining > wait) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
                if (!timeout) context = args = null;
            }
            else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };
    var topLevelList = $('#nav .list li').map(function (idx, dom) {
        return {
            dom: dom,
            text: $(dom).children('a')[0].innerHTML.toLowerCase(),

            children: $(dom).find('li.item').map(function (idx, dom) {
                return {
                    dom: dom,
                    text: $(dom).children('a')[0].innerHTML.toLowerCase()
                }
            })
        }
    });

    function update() {
        var text = this.value.toLowerCase();
        topLevelList.each(function (idx, item) {

            var parentDisplay = item.text.indexOf(text) >= 0;

            item.children.each(function (idx, subitem) {
                var display = !text || subitem.text.indexOf(text) >= 0;
                subitem.dom.style.display = display ? 'block' : 'none';

                parentDisplay = parentDisplay || display;
            });

            item.dom.style.display = parentDisplay ? 'block' : 'none';
        });
    }

    $('#nav .search').on('keyup', throttle(update, 200));
})()