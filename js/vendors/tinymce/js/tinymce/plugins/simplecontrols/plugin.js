require([
    "tinymce/util/Tools"
], function (Tools) {
    var each = Tools.each;

    tinymce.PluginManager.add('simplecontrols', function (editor) {
        function toggleFormat(fmt) {
            if (fmt.control) {
                fmt = fmt.control.value();
            }

            if (fmt) {
                editor.execCommand('mceToggleFormat', false, fmt);
            }
        }

        each({
            bold: 'Bold',
            italic: 'Italic',
            underline: 'Underline',
            strikethrough: 'Strikethrough',
            subscript: 'Subscript',
            superscript: 'Superscript'
        }, function (text, name) {
            editor.addButton(name, {
                onPostRender: function () {
                    var self = this;

                    if (editor.formatter) {
                        editor.formatter.formatChanged(name, function (state) {
                            self.active(state);
                        });
                    } else {
                        editor.on('init', function () {
                            editor.formatter.formatChanged(name, function (state) {
                                self.active(state);
                            });
                        });
                    }
                },
                onclick: function () {
                    toggleFormat(name);
                }
            });
        });
    });
});