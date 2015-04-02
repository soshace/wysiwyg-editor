$(function () {
    tinymce.init({
        plugins: [
            "link", "myColor", "fontfamily", "fontsize", "simplecontrols"
        ],
        selector: ".js-editor",
        menubar: false,
        statusbar: false,
        skin: 'recorder',
        toolbar: "fontfamily fontsize | bold italic underline | forecolor | backcolor | link",
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

        customizeFontSizeDropDown();
    }

    function customizeFontSizeDropDown() {
        var $dropDown = $('#mceu_18'),
            $sizeItems = $('.mce-text', $dropDown);

        console.log($sizeItems);
    }

    function editorFocusHandler() {
        var $toolbar = $('.mce-toolbar-grp');

        $toolbar.show();
    }
});