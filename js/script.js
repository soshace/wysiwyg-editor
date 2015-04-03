$(function () {
    var $linkInput = $('<input>', {type: 'text'});

    tinymce.init({
        plugins: [
            "simple_link", "my_color", "my_color_bg", "fontfamily", "fontsize", "simplecontrols"
        ],
        selector: ".js-editor",
        menubar: false,
        statusbar: false,
        skin: 'recorder',
        linkInput: $linkInput,
        toolbar: "fontfamily fontsize | bold italic underline | forecolor | backcolor | simpleLink",
        setup: tinyMceSetupHandler
    });


    function tinyMceSetupHandler(editor) {
        editor.on('load', setEditorView);
        editor.on('focus', editorFocusHandler);
    }

    function setEditorView() {
        var $toolbar = $('.mce-toolbar-grp'),
            $header = $('<div>', {class: 'mce-toolbar-header'});

        $header.append($('<h1>', {text: 'Word Editor'}));
        $header.append($('<a>', {text: 'X', title: 'Close', href: '#'}));
        $toolbar.prepend($header);
        $toolbar.append($linkInput);
    }

    function editorFocusHandler() {
        var $toolbar = $('.mce-toolbar-grp');

        $toolbar.show();
    }
});