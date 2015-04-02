require([
    "tinymce/util/Tools"
], function (Tools) {
    var each = Tools.each;

    tinymce.PluginManager.add('fontsize', function (editor) {

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

        editor.addButton('fontsize', function () {
            var items = [],
                defaultFontsizeFormats = '9=9px 10=10px 11=11px 12=12px 13=13px 14=14px' +
                    ' 15=15px 16=16px 17=17px 18=18px 19=19px 20=20px 21=21px 22=22px 23=23px 24=24px 25=25px' +
                    ' 26=26px 27=27px 28=28px 29=29px 30=30px 31=31px 32=32px 33=33px 34=34px 35=35px 36=36px';

            var fontsize_formats = editor.settings.fontsize_formats || defaultFontsizeFormats;

            each(fontsize_formats.split(' '), function (item) {
                var text = item, value = item;
                // Allow text=value font sizes.
                var values = item.split('=');
                if (values.length > 1) {
                    text = values[0];
                    value = values[1];
                }
                items.push({text: text, value: value});
            });

            return {
                type: 'listbox',
                text: '14',
                values: items,
                fixedWidth: true,
                onPostRender: createListBoxChangeHandler(items, 'fontsize'),
                onclick: function (e) {
                    if (e.control.settings.value) {
                        editor.execCommand('FontSize', false, e.control.settings.value);
                    }
                }
            };
        });
    });
});