
(function () {

    /// Search
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


    var $listContainer = $('#sidenav');
    var $listAll = $('#sidenav .list>li');

    var topLevelList = $listAll.map(function (idx, dom) {
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

    function updateSearch() {
        var text = this.value.toLowerCase();
        topLevelList.each(function (idx, item) {

            var parentMatch = item.text.indexOf(text) >= 0;
            var parentDisplay = parentMatch;

            item.children.each(function (idx, subitem) {
                var display = !text || subitem.text.indexOf(text) >= 0;

                // Display if parent text match or self text match.
                subitem.dom.style.display = (parentMatch || display) ? 'block' : 'none';

                // Display parent if any of it's children displays.
                parentDisplay = parentDisplay || display;
            });

            item.dom.style.display = parentDisplay ? 'block' : 'none';
        });

        expandAll();
    }

    $('#sidenav .search').on('keyup', throttle(updateSearch, 200));


     /// Fold and unfold

     function collapseAll() {
        $listAll.addClass('clay-collapse')
     }
     function expandAll() {
        $listAll.removeClass('clay-collapse')
     }

     $('#collapse-all').click(collapseAll);
     $('#expand-all').click(expandAll);

    var file = location.pathname.split('/').pop().trim();
    $listAll.each(function (idx, dom) {
        var $dom = $(dom);
        // Only expand the current page.
        if ($dom.children('a').attr('href').trim() !== file) {
            $dom.addClass('clay-collapse');
        }
        else {
            $listContainer.scrollTop(
                Math.max($dom.offset().top - 200, 0)
            );
        }

        $dom.children('i').click(function () {
            $dom.toggleClass('clay-collapse');
        });
    });

})()