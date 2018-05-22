(function($) {
    'use strict';

    function updateMasonry(event){
        var $section = $(event.target);
        if (typeof $.fn.masonry !== 'undefined') {
            $section.outerFind('.mbr-gallery').each(function() {
                var $msnr = $(this).find('.mbr-gallery-row').masonry({
                    itemSelector: '.mbr-gallery-item:not(.mbr-gallery-item__hided)',
                    percentPosition: true,
                    horizontalOrder: true
                });
                // reload masonry (need for adding new or re-sort items)
                $msnr.masonry('reloadItems');
                $msnr.on('filter', function() {
                    $msnr.masonry('reloadItems');
                    $msnr.masonry('layout');
                    // update parallax backgrounds
                    $(window).trigger('update.parallax');
                }.bind(this, $msnr));
                // layout Masonry after each image loads
                $msnr.imagesLoaded().progress(function() {
                    $msnr.masonry('layout');
                });
            });
        }
    };

    /* Masonry Grid */
    $(document).on('add.cards', function(event) {
        var $section = $(event.target),
            allItem = $section.find('.mbr-gallery-filter-all');
        var filterList = [];
        $section.on('click', '.mbr-gallery-filter li > .btn', function(e) {
          console.log(e);
            e.preventDefault();
            var $li = $(this).closest('li');

            $li.parent().find('a').removeClass('active');
            $(this).addClass('active');

            var $mas = $li.closest('section').find('.mbr-gallery-row');
            var filter = $(this).html().trim();

            $section.find('.mbr-gallery-item').each(function(i, el) {
                var $elem = $(this);
                var tagsAttr = $elem.attr('data-tags');
                var tags = tagsAttr.split(',');

                var tagsTrimmed = tags.map(function(el) {
                    return el.trim();
                });

                if ($.inArray(filter, tagsTrimmed) === -1 && !$li.hasClass('mbr-gallery-filter-all')) {
                    $elem.addClass('mbr-gallery-item__hided');

                    setTimeout(function() {
                        $elem.css('left', '300px');
                    }, 200);
                } else {
                    $elem.removeClass('mbr-gallery-item__hided');
                }
            });

            setTimeout(function() {
                $mas.closest('.mbr-gallery-row').trigger('filter');
            }, 50);
        });
    })
    $(document).on('add.cards changeParameter.cards changeButtonColor.cards', function(event) {
        var $section = $(event.target),
            allItem = $section.find('.mbr-gallery-filter-all');
        var filterList = [];

        $section.find('.mbr-gallery-item').each(function(el) {
            var tagsAttr = ($(this).attr('data-tags') || "").trim();
            var tagsList = tagsAttr.split(',');

            tagsList.map(function(el) {
                var tag = el.trim();

                if ($.inArray(tag, filterList) === -1 && tag.trim())
                    filterList.push(tag);
            });
        });

        if ($section.find('.mbr-gallery-filter').length > 0 && $(event.target).find('.mbr-gallery-filter').hasClass('gallery-filter-active') && !$(event.target).find('.mbr-gallery-filter').hasClass('mbr-shop-filter')) {
            var filterHtml = '';

            var classAttr = allItem.find('a').attr('class') || '';
            classAttr = classAttr.replace(/(^|\s)active(\s|$)/, ' ').trim();

            $section.find('.mbr-gallery-filter ul li:not(li:eq(0))').remove();

            filterList.map(function(el) {
                filterHtml += '<li><a class="' + classAttr + '" href>' + el + '</a></li>';
            });
            $section.find('.mbr-gallery-filter ul').append(filterHtml);

        } else {
            $section.find('.mbr-gallery-item__hided').removeClass('mbr-gallery-item__hided');
            $section.find('.mbr-gallery-row').trigger('filter');
        }

        updateMasonry(event);
    });

    $(document).on('change.cards', function(event) {
        updateMasonry(event);
    });

}(jQuery));
