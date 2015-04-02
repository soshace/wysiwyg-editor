/**
 * plugin.js
 *
 * Copyright, Moxiecode Systems AB
 * Released under LGPL License.
 *
 * License: http://www.tinymce.com/license
 * Contributing: http://www.tinymce.com/contributing
 */

/*global tinymce:true */
/*eslint consistent-this:0 */

tinymce.PluginManager.add('myColor', function(editor) {
	var cols, rows, lastColor=0, lastTable=0;

	rows = editor.settings.textcolor_rows || 12;
	cols = editor.settings.textcolor_cols || 12;

	function getCurrentColor(format) {
		var color;

		editor.dom.getParents(editor.selection.getStart(), function(elm) {
			var value;

			if ((value = elm.style[format == 'forecolor' ? 'color' : 'background-color'])) {
				color = value;
			}
		});

		return color;
	}

	function mapColors() {
		var i, colors = [], colorMap;

		colorMap = editor.settings.textcolor_map || [
            "000000", "000000",
            "323232", "323232",
            "666666", "666666",
            "989898", "989898",
            "cbcbcb", "cbcbcb",
            "ffffff", "ffffff",
            "fb1223", "fb1223",
            "167f17", "167f17",
            "102bfb", "102bfb",
            "fefd3b", "fefd3b",
            "2ffefb", "2ffefb",
            "7f157c", "7f157c",


			"650005", "650005",
			"66320c", "66320c",
			"656516", "656516",
			"659922", "659922",
			"6ac92a", "6ac92a",
			"6bfd31", "6bfd31",
			"2d0000", "2d0000",
            "013001", "013001",
            "0f6210", "0f6210",
            "1a961f", "1a961f",
            "26ca2a", "26ca2a",
            "2efd30", "2efd30",


            "640231", "640231",
            "653233", "653233",
            "666433", "666433",
            "669939", "669939",
            "69c93d", "69c93d",
            "6dfd45", "6dfd45",
            "000030", "000030",
            "013132", "013132",
            "0e6333", "0e6333",
            "1d9839", "1d9839",
            "27ca2a", "27ca2a",
            "2efd45", "2efd45",

            "640c63", "640c63",
            "653465", "653465",
            "646564", "646564",
            "679868", "679868",
            "68c969", "68c969",
            "6cfd6d", "6cfd6d",
            "000b61", "000b61",
            "053363", "053363",
            "0d6665", "0d6665",
            "1d9865", "1d9865",
            "26ca3d", "26ca3d",
            "2efc6e", "2efc6e",

            "621a95", "621a95",
            "643797", "643797",
            "656696", "656696",
            "679797", "679797",
            "6aca9a", "6aca9a",
            "6cfd9c", "6cfd9c",
            "021695", "021695",
            "073695", "073695",
            "126797", "126797",
            "1e9999", "1e9999",
            "28c998", "28c998",
            "2ffd9c", "2ffd9c",

            "6422c6", "6422c6",
            "663ac9", "663ac9",
            "6468c8", "6468c8",
            "669ac9", "669ac9",
            "67ccca", "67ccca",
            "6cfecd", "6cfecd",
            "0922c8", "0922c8",
            "0d39ca", "0d39ca",
            "1666ca", "1666ca",
            "209acc", "209acc",
            "28cbc8", "28cbc8",
            "2ffdcd", "2ffdcd",

            "652bf9", "652bf9",
            "663efa", "663efa",
            "656bfa", "656bfa",
            "689bfc", "689bfc",
            "6bcdfc", "6bcdfc",
            "6ffffe", "6ffffe",
            "112bfb", "112bfb",
            "123efb", "123efb",
            "1a6afa", "1a6afa",
            "229afc", "229afc",
            "2bcefd", "2bcefd",
            "30fffe", "30fffe",

            "fa1222", "fa1222",
            "fc3524", "fc3524",
            "fc6528", "fc6528",
            "fc982c", "fc982c",
            "fdca30", "fdca30",
            "fdfd3b", "fdfd3b",
            "960613", "960613",
            "973213", "973213",
            "96651a", "96651a",
            "979724", "979724",
            "98c82d", "98c82d",
            "9cfd31", "9cfd31",


            "fb1538", "fb1538",
            "fb353a", "fb353a",
            "fd663a", "fd663a",
            "fd973f", "fd973f",
            "fdcb42", "fdcb42",
            "fffb4a", "fffb4a",
            "980633", "980633",
            "973435", "973435",
            "976535", "976535",
            "99983a", "99983a",
            "9ac93e", "9ac93e",
            "9bfd45", "9bfd45",

            "f91965", "f91965",
            "fb3467", "fb3467",
            "fd6566", "fd6566",
            "fc996a", "fc996a",
            "fccb6f", "fccb6f",
            "fffd73", "fffd73",
            "941061", "941061",
            "963466", "963466",
            "976467", "976467",
            "999867", "999867",
            "98cb6b", "98cb6b",
            "9cfd6f", "9cfd6f",

            "fb219a", "fb219a",
            "fc399a", "fc399a",
            "fd669a", "fd669a",
            "fd9b9c", "fd9b9c",
            "fdcb9b", "fdcb9b",
            "fffd73", "fffd73",
            "961b96", "961b96",
            "983897", "983897",
            "976597", "976597",
            "999999", "999999",
            "9aca9b", "9aca9b",
            "9cfd9c", "9cfd9c",

            "fc27c8", "fc27c8",
            "fc3cc9", "fc3cc9",
            "fb68cb", "fb68cb",
            "fd9bcc", "fd9bcc",
            "fdccce", "fdccce",
            "fffecd", "fffecd",
            "9624c9", "9624c9",
            "983ac7", "983ac7",
            "9668ca", "9668ca",
            "989aca", "989aca",
            "99cbcb", "99cbcb",
            "9cfccc", "9cfccc",


            "fc2dfb", "fc2dfb",
            "fd41fc", "fd41fc",
            "fa6af9", "fa6af9",
            "fc9cfd", "fc9cfd",
            "fdccfc", "fdccfc",
            "ffffff", "ffffff",
            "982bfa", "982bfa",
            "983ffa", "983ffa",
            "996bfb", "996bfb",
            "999cfc", "999cfc",
            "9bcdfc", "9bcdfc",
            "9dfffe", "9dfffe",


            "0a0a0a", "0a0a0a",
            "181818", "181818",
            "5e5e5e", "5e5e5e",
            "6b6b6b", "6b6b6b",
            "858585", "858585",
            "949494", "949494",
            "aeaeae", "aeaeae",
            "bbbbbb", "bbbbbb",
            "d5d5d5", "d5d5d5",
            "e4e4e4", "e4e4e4",
            "f1f1f1", "f1f1f1",
			"ffffff", "ffffff"
		];

		for (i = 0; i < colorMap.length; i += 2) {
			colors.push({
				text: colorMap[i + 1],
				color: '#' + colorMap[i]
			});
		}

		return colors;
	}

	function renderColorPicker() {
		var ctrl = this, colors, color, html, last, x, y, i, id = ctrl._id, count = 0;

		function getColorCellHtml(color, title) {
			var isNoColor = color == 'transparent';

			return (
				'<td class="mce-grid-cell' + (isNoColor ? ' mce-colorbtn-trans' : '') + '">' +
					'<div id="' + id + '-' + (count++) + '"' +
						' data-mce-color="' + (color ? color : '') + '"' +
						' role="option"' +
						' tabIndex="-1"' +
						' style="' + (color ? 'background-color: ' + color : '') + '"' +
						' title="' + tinymce.translate(title) + '">' +
						(isNoColor ? '&#215;' : '') +
					'</div>' +
				'</td>'
			);
		}

        html = '<h1 class="mce-colorbutton-grid-header">Color Menu</h1>';
        html += '<div class="mce-colorbutton-grid-header-color"></div>';
        colors = mapColors();
        colors.push({
            text: tinymce.translate("No color"),
            color: "transparent"
        });
        html += '<table class="mce-grid mce-grid-border mce-colorbutton-grid-left" role="list" cellspacing="0"><tbody>';
        last = colors.length - 1;

        for (x = 0; x < cols; x++) {
            html += '<tr>';
            if (x > last) {
                html += '<td></td>';
            } else {
                color = colors[x];
                html += getColorCellHtml(color.color, color.text);
            }
            html += '</tr>';
        }

        html += '<table class="mce-grid mce-grid-border mce-colorbutton-grid" role="list" cellspacing="0"><tbody>';

        for (y = 1; y < rows+1; y++) {
            html += '<tr>';

            for (x = 0; x < cols; x++) {
                i = y * cols + x;

                if (i > last) {
                    html += '<td></td>';
                } else {
                    color = colors[i];
                    html += getColorCellHtml(color.color, color.text);
                }
            }

            html += '</tr>';
        }

        html += '<table class="mce-grid mce-grid-border mce-colorbutton-grid-bottom" role="list" cellspacing="0"><tbody>';

        html += '<tr>';
        for (x = 156; x < last; x++) {
            if (x > last) {
                html += '<td></td>';
            } else {
                color = colors[x];
                html += getColorCellHtml(color.color, color.text);
            }
        }
        html += '</tr>';

		if (editor.settings.color_picker_callback) {
			html += (
				'<tr>' +
					'<td colspan="' + cols + '" class="mce-custom-color-btn">' +
						'<div id="' + id + '-c" class="mce-widget mce-btn mce-btn-small mce-btn-flat" ' +
							'role="button" tabindex="-1" aria-labelledby="' + id + '-c" style="width: 100%">' +
							'<button type="button" role="presentation" tabindex="-1">' + tinymce.translate('Custom...') + '</button>' +
						'</div>' +
					'</td>' +
				'</tr>'
			);

			html += '<tr>';

			for (x = 0; x < cols; x++) {
				html += getColorCellHtml('', 'Custom color');
			}

			html += '</tr>';
		}

		html += '</tbody></table>';

		return html;
	}

	function applyFormat(format, value) {
		editor.undoManager.transact(function() {
			editor.focus();
			editor.formatter.apply(format, {value: value});
			editor.nodeChanged();
		});
	}

	function removeFormat(format) {
		editor.undoManager.transact(function() {
			editor.focus();
			editor.formatter.remove(format, {value: null}, null, true);
			editor.nodeChanged();
		});
	}

	function onPanelClick(e) {
		var buttonCtrl = this.parent(), value;

		function selectColor(value) {
			buttonCtrl.hidePanel();
			buttonCtrl.color(value);
			applyFormat(buttonCtrl.settings.format, value);
		}

		function resetColor() {
			buttonCtrl.hidePanel();
			buttonCtrl.resetColor();
			removeFormat(buttonCtrl.settings.format);
		}

		function setDivColor(div, value) {
			div.style.background = value;
			div.setAttribute('data-mce-color', value);
		}

		if (tinymce.DOM.getParent(e.target, '.mce-custom-color-btn')) {
			buttonCtrl.hidePanel();

			editor.settings.color_picker_callback.call(editor, function(value) {
				var tableElm = buttonCtrl.panel.getEl().getElementsByTagName('table')[0];
				var customColorCells, div, i;

				customColorCells = tinymce.map(tableElm.rows[tableElm.rows.length - 1].childNodes, function(elm) {
					return elm.firstChild;
				});

				for (i = 0; i < customColorCells.length; i++) {
					div = customColorCells[i];
					if (!div.getAttribute('data-mce-color')) {
						break;
					}
				}

				// TODO: Might need to be the left on RTL
				if (i == cols) {
					for (i = 0; i < cols - 1; i++) {
						setDivColor(customColorCells[i], customColorCells[i + 1].getAttribute('data-mce-color'));
					}
				}
				setDivColor(div, value);
				selectColor(value);
			}, getCurrentColor(buttonCtrl.settings.format));
		}

		value = e.target.getAttribute('data-mce-color');
        /*console.log($(e.target).parentsUntil(".mce-colorbutton-grid-header-color"));
        $(e.target).parentsUntil(".mce-colorbutton-grid").(".mce-colorbutton-grid-header-color").css('background-color', value);*/
		if (value) {
			if (this.lastId) {
				document.getElementById(this.lastId).setAttribute('aria-selected', false);
			}

			e.target.setAttribute('aria-selected', true);
			this.lastId = e.target.id;

			if (value == 'transparent') {
				resetColor();
			} else {
				selectColor(value);
			}
		} else if (value !== null) {
			buttonCtrl.hidePanel();
		}
	}

	function onButtonClick() {
		var self = this;

		if (self._color) {
			applyFormat(self.settings.format, self._color);
		} else {
			removeFormat(self.settings.format);
		}
	}

	editor.addButton('forecolor', {
		type: 'colorbutton',
		tooltip: 'Text color',
		format: 'forecolor',
		panel: {
			role: 'application',
			ariaRemember: true,
			html: renderColorPicker,
			onclick: onPanelClick
		},
		onclick: onButtonClick
	});

	editor.addButton('backcolor', {
		type: 'colorbutton',
		tooltip: 'Background color',
		format: 'hilitecolor',
		panel: {
			role: 'application',
			ariaRemember: true,
			html: renderColorPicker,
			onclick: onPanelClick
		},
		onclick: onButtonClick
	});
});
