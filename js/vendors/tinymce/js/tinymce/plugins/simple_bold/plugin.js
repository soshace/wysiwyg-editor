tinymce.PluginManager.add('simple_bold', function (editor) {
    var $boldField = editor.settings.fontBold;

    editor.on('nodeChange', function (event) {
        if (!event.selectionChange) {
            return;
        }

        if (editor.formatter.match('Bold')) {
            $boldField.addClass('active');
            return;
        }

        $boldField.removeClass('active');
    });

    $boldField.on('click', function () {
        editor.execCommand('Bold');
    });
});
