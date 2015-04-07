tinymce.PluginManager.add('fontfamily', function (editor) {
    var $fontFamily = editor.settings.fontFamily,
        fontFormats = editor.settings.fontFormats,
        fontFamilyDefault = editor.settings.fontFamilyDefault,
        $fontWrapper = $('<div>', {'class': 'js-dropdown-menu dropdown-menu'}),
        $fontName = $('<div>', {'class': 'dropdown-title'}),
        $fontsList = $('<ul>', {'class': 'dropdown-list hide'});

    function selectValue(value) {
        $fontName.html(value);
        $('.active', $fontsList).removeClass('active');

        $('li:contains(' + value + ')', $fontsList).addClass('active');
    }

    function addListeners() {
        $fontsList.on('click', 'li', function (event) {
            var $target = $(event.target),
                value = $target.html();

            editor.execCommand('FontName', false, value);
        });
    }

    function fillFontsList(items) {
        $.each(items, function (index, value) {
            var $listItem = $('<li>', {text: value});

            $listItem.css({'font-family': value});
            $fontsList.append($listItem);
        });
    }

    editor.on('nodeChange', function (event) {
        var isMatch = false;

        if (!event.selectionChange) {
            return;
        }

        $.each(fontFormats, function (index, value) {
            isMatch = editor.formatter.match('fontname', {value: value});

            if (isMatch) {
                selectValue(value);
                return false;
            }
        });

        if (isMatch) {
            return;
        }

        selectValue(fontFamilyDefault);
    });

    fillFontsList(fontFormats);
    $fontName.html(fontFamilyDefault);
    $fontWrapper.append($fontName);
    $fontWrapper.append($fontsList);
    $fontFamily.append($fontWrapper);
    addListeners();
});