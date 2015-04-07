tinymce.PluginManager.add('fontsize', function (editor) {
    var $fontSize = editor.settings.fontSize,
        fontSizes = editor.settings.fontSizes,
        fontSizeDefault = editor.settings.fontSizeDefault,
        $fontWrapper = $('<div>', {'class': 'js-dropdown-menu dropdown-menu'}),
        $fontSizeTitle = $('<div>', {'class': 'dropdown-title'}),
        $fontsList = $('<ul>', {'class': 'dropdown-list hide'});

    function selectValue(value) {
        $fontSizeTitle.html(value);
        $('.active', $fontsList).removeClass('active');

        $('li:contains(' + value + ')', $fontsList).addClass('active');
    }

    function addListeners() {
        $fontsList.on('click', 'li', function (event) {
            var $target = $(event.target),
                value = $target.html();

            editor.execCommand('FontSize', false, value + 'px');
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

        $.each(fontSizes, function (index, value) {
            isMatch = editor.formatter.match('fontsize', {value: value + 'px'});

            if (isMatch) {
                selectValue(value);
                return false;
            }
        });

        if (isMatch) {
            return;
        }

        selectValue(fontSizeDefault);
    });

    fillFontsList(fontSizes);
    $fontSizeTitle.html(fontSizeDefault);
    $fontWrapper.append($fontSizeTitle);
    $fontWrapper.append($fontsList);
    $fontSize.append($fontWrapper);
    addListeners();
});