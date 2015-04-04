tinymce.PluginManager.add('custom_style', function (editor) {
    var defaultStyles = editor.settings.defaultStyles,
        $textField = editor.settings.customStyle,
        CustomStyle = function ($wrapper, styleName, styles, isDefault) {
            this.$wrapper = $wrapper;
            this.$el = null;
            this.styleName = null;
            this.isDefault = false;
            this.styles = {
                fontFamily: null,
                fontSize: null,
                bold: false,
                italic: false,
                underline: false,
                backgroundColor: null,
                color: null,
                opacity: null
            };

            this.setDefault(isDefault);
            this.setCurrentStyles(styles);
            this.setStyleName(styleName);
            this.createDomElement();
            this.addListeners();
        };

    CustomStyle.prototype.registrFormats = function () {
        editor.formatter.register({
            'custom_opacity': {
                inline: 'span', styles: {color: '%value'}
            }
        });
    };

    CustomStyle.prototype.setDefault = function (isDefault) {
        this.isDefault = !!isDefault;
    };

    CustomStyle.prototype.isCurrent = function (styles) {
        var isCurrentStyle = false,
            that = this;

        $.each(styles, function (styleName, value) {
            if (that.styles[styleName] === value) {
                isCurrentStyle = true;
            } else {
                isCurrentStyle = false;
                return false;
            }
        });

        return false;
    };

    CustomStyle.prototype.setCurrentStyles = function (styles) {
        var thisStyles = this.styles;

        $.each(thisStyles, function (styleName) {
            var newStyle = styles[styleName];

            if (newStyle) {
                thisStyles[styleName] = newStyle;
            }
        });
    };

    CustomStyle.prototype.createDomElement = function () {
        var $el,
            styleName = this.styleName,
            $wrapper = this.$wrapper;

        $el = this.$el = $('<li>', {text: styleName});
        this.applyStylesToTitle();
        $wrapper.append($el);
    };

    CustomStyle.prototype.applyStylesToTitle = function () {
        var css = {},
            styles = this.styles;

        $.each(styles, function (key, value) {
            if (value === null) {
                return;
            }

            if (value === false) {
                return;
            }

            if (key === 'fontFamily') {
                css['font-family'] = value;
                return;
            }

            if (key === 'fontSize') {
                css['font-size'] = value + 'px';
                return;
            }

            if (key === 'bold') {
                css['font-weight'] = 'bold';
                return;
            }

            if (key === 'italic') {
                css['font-style'] = 'italic';
                return;
            }

            if (key === 'underline') {
                css['text-decoration'] = 'underline';
                return;
            }

            if (key === 'backgroundColor') {
                css['background-color'] = value;
                return;
            }

            if (key === 'color') {
                css['color'] = value;
                return;
            }

            if (key === 'opacity') {
                css['opacity'] = value;
            }
        });

        this.$el.css(css);
    };

    CustomStyle.prototype.applyStylesToEditor = function () {
        var styles = this.styles;
        $.each(styles, function (key, value) {
            if (value === null) {
                return;
            }

            if (value === false) {
                return;
            }

            if (key === 'fontFamily') {
                editor.formatter.apply('fontname', {value: value});
                return;
            }

            if (key === 'fontSize') {
                editor.formatter.apply('fontsize', {value: value + 'px'});
                return;
            }

            if (key === 'bold') {
                editor.formatter.apply('bold');
                return;
            }

            if (key === 'italic') {
                editor.formatter.apply('italic');
                return;
            }

            if (key === 'underline') {
                editor.formatter.apply('underline');
                return;
            }

            if (key === 'backgroundColor') {
                editor.formatter.apply('hilitecolor', {value: value});
                return;
            }

            if (key === 'color') {
                editor.formatter.apply('forecolor', {value: value});
                return;
            }

            if (key === 'opacity') {
                editor.formatter.apply('custom_opacity', {value: value});
            }
        });
    };

    CustomStyle.prototype.setStyleName = function (styleName) {
        this.styleName = styleName || 'untitled';
    };

    CustomStyle.prototype.addListeners = function () {
        this.$el.on('click', this.styleClickHandler.bind(this));
    };

    CustomStyle.prototype.styleClickHandler = function () {
        this.applyStylesToEditor();
    };

    function setDropDownView($wrapper, defaultStyles) {
        $.each(defaultStyles, function (index, style) {
            var styleName = style.title,
                isDefault = style.isDefault,
                styleValues = style.values;

            new CustomStyle($wrapper, styleName, styleValues, isDefault);
        });
    }


    setDropDownView($textField, defaultStyles);
});