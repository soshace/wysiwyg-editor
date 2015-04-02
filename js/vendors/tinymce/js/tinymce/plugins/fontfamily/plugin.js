require([
    "tinymce/util/Tools"
], function (Tools) {
    var each = Tools.each;

    tinymce.PluginManager.add('fontfamily', function (editor) {
        function createFormats(formats) {
            formats = formats.replace(/;$/, '').split(';');

            var i = formats.length;
            while (i--) {
                formats[i] = formats[i].split('=');
            }

            return formats;
        }

        function createListBoxChangeHandler(items, formatName) {
            return function () {
                var self = this;

                editor.on('nodeChange', function (e) {
                    var formatter = editor.formatter;
                    var value = null;

                    each(e.parents, function (node) {
                        each(items, function (item) {
                            if (formatName) {
                                if (formatter.matchNode(node, formatName, {value: item.value})) {
                                    value = item.value;
                                }
                            } else {
                                if (formatter.matchNode(node, item.value)) {
                                    value = item.value;
                                }
                            }

                            if (value) {
                                return false;
                            }
                        });

                        if (value) {
                            return false;
                        }
                    });

                    self.value(value);
                });
            };
        }

        // Add a button that opens a window
        editor.addButton('fontfamily', function () {
            var defaultFontsFormats =
                    'Serif=serif; Arial=Arial;Courier=Courier;Courier New=Courier New;' +
                    'Comic Sans MS=Comic Sans MS;Helvetica=Helvetica;Impact=Impact;Lucida Grande=Lucida Grande;' +
                    'Lucida Sans=Lucida Sans;Tahoma=Tahoma;Times=Times;Times New Roman=Times New Roman;Verdana=Verdana';

            var items = [], fonts = createFormats(editor.settings.font_formats || defaultFontsFormats);

            each(fonts, function (font) {
                items.push({
                    text: {raw: font[0]},
                    value: font[1],
                    textStyle: font[1].indexOf('dings') == -1 ? 'font-family:' + font[1] : ''
                });
            });

            return {
                type: 'listbox',
                text: 'Helvetica',
                values: items,
                fixedWidth: true,
                onPostRender: createListBoxChangeHandler(items, 'fontname'),
                onselect: function (e) {
                    if (e.control.settings.value) {
                        editor.execCommand('FontName', false, e.control.settings.value);
                    }
                }
            };
        });
    });
});