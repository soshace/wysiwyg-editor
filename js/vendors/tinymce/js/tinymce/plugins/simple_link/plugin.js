tinymce.PluginManager.add('simple_link', function (editor) {
    var $textField = editor.settings.linkInput;

    editor.on('nodeChange', function (event) {
        var href = '',
            parents;

        if (!event.selectionChange) {
            return;
        }

        parents = event.parents;

        $.each(parents, function (index, element) {
            var tagName = element.tagName.toLowerCase();

            if (tagName === 'a') {
                href = element.href;
                return false;
            }
        });

        $textField.val(href);
    });

    $textField.on('keypress', function (event) {
        var value;

        if (event.which === 13) {
            value = event.target.value;
            editor.execCommand('mceInsertLink', false, {
                href: value,
                target: '_blank'
            });
        }
    });
});
