tinymce.PluginManager.add('simple_underline', function (editor) {
    var $underlineField = editor.settings.fontUnderline;

    editor.on('nodeChange', function (event) {
        if (!event.selectionChange) {
            return;
        }

        if (editor.formatter.match('Underline')) {
            $underlineField.addClass('active');
            return;
        }

        $underlineField.removeClass('active');
    });

    $underlineField.on('click', function () {
        editor.execCommand('Underline');
    });
});
