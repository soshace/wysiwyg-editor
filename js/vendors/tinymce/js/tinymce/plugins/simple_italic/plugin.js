tinymce.PluginManager.add('simple_italic', function (editor) {
    var $italicField = editor.settings.fontItalic;

    editor.on('nodeChange', function (event) {
        if (!event.selectionChange) {
            return;
        }

        if (editor.formatter.match('italic')) {
            $italicField.addClass('active');
            return;
        }

        $italicField.removeClass('active');
    });

    $italicField.on('click', function () {
        editor.execCommand('Italic');
    });
});
