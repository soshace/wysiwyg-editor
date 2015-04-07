$(function () {
    var $linkInput = $('<input>', {type: 'text'}),
        $customStyle = $('<div>', {'class': 'editor__custom-style'}),
        $colorInput = $('<div>', {"class": 'colorInput'}),
        $fontFamily = $('<div>', {"class": 'editor__font-family'}),
        $fontSize = $('<div>', {"class": 'editor__font-size'}),
        $colorInputBg = $('<div>', {"class": 'colorInputBg'});

    tinymce.init({
        plugins: [
            "simple_link", "fontfamily", "fontsize", "simplecontrols", "custom_style", "my_color", "my_color_bg"
        ],
        selector: ".js-editor",
        menubar: false,
        statusbar: false,
        skin: 'recorder',
        linkInput: $linkInput,
        customStyle: $customStyle,
        colorInput: $colorInput,
        colorInputBg: $colorInputBg,
        fontFamily: $fontFamily,
        fontSize: $fontSize,
        fontFormats: [
            'Serif',
            'Arial',
            'Courier',
            'Courier New',
            'Comic Sans MS',
            'Helvetica',
            'Impact',
            'Lucida Grande',
            'Lucida Sans',
            'Tahoma',
            'Times',
            'Times New Roman',
            'Verdana'
        ],
        fontSizes: [
            '9',
            '10',
            '11',
            '12',
            '13',
            '14',
            '15',
            '16',
            '17',
            '18',
            '19',
            '20',
            '21',
            '22',
            '23',
            '24',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
            '32',
            '33',
            '34',
            '35',
            '36'
        ],
        editorStyles: {
            fontFamily: null,
            fontSize: null,
            bold: false,
            italic: false,
            underline: false,
            backgroundColor: null,
            color: null
        },
        defaultStyles: [
            {
                title: 'Header1',
                isDefault: true,
                values: {
                    fontFamily: 'Arial',
                    fontSize: '12px',
                    bold: true,
                    italic: true,
                    backgroundColor: 'rgba(255, 255, 255, 1)'
                }
            },
            {
                title: 'Header2',
                isDefault: true,
                values: {
                    fontFamily: 'Arial',
                    fontSize: '12px',
                    bold: true,
                    italic: true,
                    backgroundColor: 'rgba(108, 253, 109, 1)',
                    color: 'rgba(101, 52, 101, 1)'
                }
            },
            {
                title: 'Header3',
                isDefault: true,
                values: {
                    fontFamily: 'Arial',
                    fontSize: '36px',
                    bold: true,
                    color: 'rgba(100, 55, 151, 1)',
                    backgroundColor: 'rgba(108, 253, 109, 0.4)'
                }
            }
        ],
        toolbar: "fontfamily fontsize | bold italic underline",
        setup: tinyMceSetupHandler
    });


    function tinyMceSetupHandler(editor) {
        editor.on('load', setEditorView);
        editor.on('focus', editorFocusHandler);
    }

    function setEditorView() {
        var $toolbar = $('.mce-toolbar-grp'),
            $fontGroup = $('<div>', {class: 'font-group'}),
            $header = $('<div>', {class: 'mce-toolbar-header'});

        $fontGroup.append($fontFamily);
        $fontGroup.append($fontSize);
        $header.append($('<h1>', {text: 'Word Editor'}));
        $header.append($('<a>', {text: 'X', title: 'Close', href: '#'}));
        $toolbar.prepend($fontGroup);
        $toolbar.prepend($header);
        $toolbar.append($colorInput);
        $toolbar.append($colorInputBg);
        $toolbar.append($linkInput);
        $toolbar.append($customStyle);
    }

    function editorFocusHandler() {
        var $toolbar = $('.mce-toolbar-grp');

        $toolbar.show();
    }
});