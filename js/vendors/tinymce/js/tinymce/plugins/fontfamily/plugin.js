tinymce.PluginManager.add('fontfamily', function (editor) {
    var $fontFamily = editor.settings.fontFamily,
        fontFormats = editor.settings.fontFormats,
        $fontWrapper = $('<div>'),
        $fontName = $('<div>'),
        $fontsList = $('<ul>');

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
        if (!event.selectionChange) {
            return;
        }

        $.each(fontFormats, function (index, value) {
            var isMatch = editor.formatter.match('fontname', {value: value});

            if (isMatch) {
                selectValue(value);
                return false;
            }
        });
    });

    fillFontsList(fontFormats);
    $fontName.html('Normal');
    $fontWrapper.append($fontName);
    $fontWrapper.append($fontsList);
    $fontFamily.append($fontWrapper);
    addListeners();
});