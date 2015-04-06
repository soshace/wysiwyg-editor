/*global tinymce:true */
/*eslint consistent-this:0 */

tinymce.PluginManager.add('my_color', function (editor) {
    var lastPanel, previousPanel, opacitySlider, lastColor = 'rgba(0,0,0,1)';
    var $colorInput = editor.settings.colorInput;

    /******font color toolbar***************/
    $colorInput.append($('<img>', {"id": 'colorPicker__bigA', "src": 'img/icons/FontColor-ICON.svg#svgView(viewBox(10, 5, 17, 25))'}));
    $colorInput.append($('<span>', {"id": 'colorPicker__FontColor', text: 'Font Color'}));
    var $colorPicker = $('<div>', {"class": 'colorPicker', "id": 'colorPicker'});
    $colorPicker.append($('<div>', {"class": 'colorPicker__color'}));
    $colorPicker.append($('<i>', {"id": 'colorPicker__buton', 'class': 'mce-caret'}));
    $colorInput.append($colorPicker);
    /******font color toolbar***************/

    /******font color panel***************/
    function mapColors() {
        /*$.getJSON("color.json", function (data) {
         console.log(data.mainblock[0]);
         var mainBlock = [], sideBlock = [], blackBlock = [];
         for (var i = 0; i < data.mainblock.length; i++) {
         mainBlock.push({
         text: 'rgb(' + data.mainblock[i] + ')',
         color: 'rgba(' + data.mainblock[i] + ',1)'
         });
         }
         for (var i = 0; i < data.sideblock.length; i++) {
         sideBlock.push({
         text: 'rgb(' + data.sideblock[i] + ')',
         color: 'rgba(' + data.sideblock[i] + ',1)'
         });
         }
         for (var i = 0; i < data.blackblock.length; i++) {
         blackBlock.push({
         text: 'rgb(' + data.blackblock[i] + ')',
         color: 'rgba(' + data.blackblock[i] + ',1)'
         });
         }
         drawAllAndAddListeners(sideBlock, mainBlock, blackBlock);
         console.log(blackBlock);
         });*/
        var data = {
                "mainblock": [
                    "101,0,5",
                    "102,50,12",
                    "101,101,22",
                    "101,153,34",
                    "106,201,42",
                    "107,253,49",
                    "45,0,0",
                    "1,48,1",
                    "15,98,16",
                    "26,150,31",
                    "38,202,42",
                    "46,253,48",
                    "100,2,49",
                    "101,50,51",
                    "102,100,51",
                    "102,153,57",
                    "105,201,61",
                    "109,253,69",
                    "0,0,48",
                    "1,49,50",
                    "14,99,51",
                    "29,152,57",
                    "39,202,42",
                    "46,253,69",
                    "100,12,99",
                    "101,52,101",
                    "100,101,100",
                    "103,152,104",
                    "104,201,105",
                    "108,253,109",
                    "0,11,97",
                    "5,51,99",
                    "13,102,101",
                    "29,152,101",
                    "38,202,61",
                    "46,252,110",
                    "98,26,149",
                    "100,55,151",
                    "101,102,150",
                    "103,151,151",
                    "106,202,154",
                    "108,253,156",
                    "2,22,149",
                    "7,54,149",
                    "18,103,151",
                    "30,153,153",
                    "40,201,152",
                    "47,253,156",
                    "100,34,198",
                    "102,58,201",
                    "100,104,200",
                    "102,154,201",
                    "103,204,202",
                    "108,254,205",
                    "9,34,200",
                    "13,57,202",
                    "22,102,202",
                    "32,154,204",
                    "40,203,200",
                    "47,253,205",
                    "101,43,249",
                    "102,62,250",
                    "101,107,250",
                    "104,155,252",
                    "107,205,252",
                    "111,255,254",
                    "17,43,251",
                    "18,62,251",
                    "26,106,250",
                    "34,154,252",
                    "43,206,253",
                    "48,255,254",
                    "250,18,34",
                    "252,53,36",
                    "252,101,40",
                    "252,152,44",
                    "253,202,48",
                    "253,253,59",
                    "150,6,19",
                    "151,50,19",
                    "150,101,26",
                    "151,151,36",
                    "152,200,45",
                    "156,253,49",
                    "251,21,56",
                    "251,53,58",
                    "253,102,58",
                    "253,151,63",
                    "253,203,66",
                    "255,251,74",
                    "152,6,51",
                    "151,52,53",
                    "151,101,53",
                    "153,152,58",
                    "154,201,62",
                    "155,253,69",
                    "249,25,101",
                    "251,52,103",
                    "253,101,102",
                    "252,153,106",
                    "252,203,111",
                    "255,253,115",
                    "148,16,97",
                    "150,52,102",
                    "151,100,103",
                    "153,152,103",
                    "152,203,107",
                    "156,253,111",
                    "251,33,154",
                    "252,57,154",
                    "253,102,154",
                    "253,155,156",
                    "253,203,155",
                    "255,254,158",
                    "150,27,150",
                    "152,56,151",
                    "151,101,151",
                    "153,153,153",
                    "154,202,155",
                    "156,253,156",
                    "252,39,200",
                    "252,60,201",
                    "251,104,203",
                    "253,155,204",
                    "253,204,206",
                    "255,254,205",
                    "150,36,201",
                    "152,58,199",
                    "150,104,202",
                    "152,154,202",
                    "153,203,203",
                    "156,252,204",
                    "252,45,251",
                    "253,65,252",
                    "250,106,249",
                    "252,156,253",
                    "253,204,252",
                    "255,255,255",
                    "152,43,250",
                    "152,63,250",
                    "153,107,251",
                    "153,156,252",
                    "155,205,252",
                    "157,255,254"
                ],
                "sideblock": [
                    "0,0,0",
                    "50,50,50",
                    "102,102,102",
                    "152,152,152",
                    "203,203,203",
                    "255,255,255",
                    "251,18,35",
                    "22,127,23",
                    "16,43,251",
                    "254,253,59",
                    "47,254,251",
                    "127,21,124"
                ],
                "blackblock": [
                    "10,10,10",
                    "24,24,24",
                    "94,94,94",
                    "107,107,107",
                    "133,133,133",
                    "148,148,148",
                    "174,174,174",
                    "187,187,187",
                    "213,213,213",
                    "228,228,228",
                    "241,241,241",
                    "255,255,255"
                ]
            },
            mainBlock = [],
            sideBlock = [],
            blackBlock = [];

        for (var i = 0; i < data.mainblock.length; i++) {
            mainBlock.push({
                text: 'rgb(' + data.mainblock[i] + ')',
                color: 'rgba(' + data.mainblock[i] + ',1)'
            });
        }
        for (var i = 0; i < data.sideblock.length; i++) {
            sideBlock.push({
                text: 'rgb(' + data.sideblock[i] + ')',
                color: 'rgba(' + data.sideblock[i] + ',1)'
            });
        }
        for (var i = 0; i < data.blackblock.length; i++) {
            blackBlock.push({
                text: 'rgb(' + data.blackblock[i] + ')',
                color: 'rgba(' + data.blackblock[i] + ',1)'
            });
        }
        drawAllAndAddListeners(sideBlock, mainBlock, blackBlock);
    }

    function renderColorPicker(sideBlock, mainBlock, blackBlock) {
        var cols = 12, rows = 12;
        var ctrl = this, color, html, last, x, y, i, id = ctrl._id, count = 0;

        function getColorCellHtml(color, title) {
            var isNoColor = color == 'transparent';

            return (
            '<td class="mce-grid-cell' + (isNoColor ? ' mce-colorbtn-trans' : '') + '">' +
            '<div id="' + 'my_color' + '-' + (count++) + '"' +
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
        html += '<div class="mce-grid-color-tables">';
        html += '<table class="mce-grid mce-grid-border mce-colorbutton-grid-left" role="list" cellspacing="0"><tbody>';

        for (x = 0; x < cols; x++) {
            html += '<tr>';
            if (x > sideBlock.length) {
                html += '<td></td>';
            } else {
                color = sideBlock[x];
                html += getColorCellHtml(color.color, color.text);
            }
            html += '</tr>';
        }

        html += '<table class="mce-grid mce-grid-border mce-colorbutton-grid" role="list" cellspacing="0"><tbody>';

        for (y = 0; y < rows; y++) {
            html += '<tr>';

            for (x = 0; x < cols; x++) {
                i = y * cols + x;

                if (i > mainBlock.length) {
                    html += '<td></td>';
                } else {
                    color = mainBlock[i];
                    html += getColorCellHtml(color.color, color.text);
                }
            }

            html += '</tr>';
        }

        html += '<table class="mce-grid mce-grid-border mce-colorbutton-grid-bottom" role="list" cellspacing="0"><tbody>';

        html += '<tr>';
        for (x = 0; x < cols; x++) {
            if (x > blackBlock.length) {
                html += '<td></td>';
            } else {
                color = blackBlock[x];
                html += getColorCellHtml(color.color, color.text);
            }
        }
        html += '</tr>';

        html += '</tbody></table>';

        html += '</div>';

        html += '<div class="opacitySlider"><span>Opacity</span><input type="text" min="0" max="100" id="opacitySliderText" value="100">'+
        '<input type="range" min="0" max="1" step="0.01" value="1" id="opacitySlider" list="opacitySliderDataList">'+
        '<datalist id=opacitySliderDataList> <option>0</option> <option>0.2</option> <option>0.4</option> <option>0.6</option> <option>0.8</option> <option>1</option> </datalist> </div>';

        return html;
    }

    function renderColorMenuPanel(sideBlock, mainBlock, blackBlock) {
        return '<div id="colorMenuPanel" class="colorMenuPanel" style="display: none">' + renderColorPicker(sideBlock, mainBlock, blackBlock) + '</div>';
    }

    function mceGridCellListener() {
        $('.mce-grid-cell').click(function (e) {
            var newColor = e.target.getAttribute('data-mce-color');
            applyFormat('forecolor', newColor);
        });
    }

    function colorMenuPanelListener() {
        var divColorMenuPanel = document.getElementById('colorMenuPanel');
        $('body').on('click', '#colorPicker' || '#colorPicker__buton', function () {
            if (divColorMenuPanel.style.display == 'none') {
                divColorMenuPanel.style.display = 'block';

                $('body').on('click', function (e) {
                    if (e.target.id != 'colorPicker' && e.target.id != 'opacitySliderText' && e.target.id != 'colorPicker__buton') {
                        divColorMenuPanel.style.display = 'none';
                    }
                });
            }
            else {
                divColorMenuPanel.style.display = 'none';
            }
        });
        editor.on("click", function () {
            if (divColorMenuPanel.style.display == 'block') {
                divColorMenuPanel.style.display = 'none';
            }
        })
    }

    function drawAllAndAddListeners(sideBlock, mainBlock, blackBlock) {
        $colorInput.append(renderColorMenuPanel(sideBlock, mainBlock, blackBlock));
        setTimeout(function () {
            mceGridCellListener();
            colorMenuPanelListener();
            createListBoxChangeHandler();
            opacitySliderListener();
            opacitySliderTextListener()
        }, 0);
    }

    /******font color panel***************/
    function applyFormat(format, value) {
        if (editor.selection.getContent({format: 'text'}).length > 0) {
            editor.undoManager.transact(function () {
                editor.focus();
                editor.formatter.apply(format, {value: value});
                editor.nodeChanged();
            });
        }
    }

    function allToRgba(rgb) {
        var rgba = rgb;
        if (rgb.indexOf("rgb") > -1) {
            if (rgb.indexOf("rgba") < 0)
                rgba = rgb.replace(')', ',' + "1)").replace('rgb', 'rgba');
        }
        else {
            rgba = 'rgba(0,0,0,1)';
        }
        return rgba;
    }

    function opacitySliderListener() {
        $('#opacitySlider').change(function (e) {
            var newColor;
            if (lastColor.indexOf("rgb") > -1) {
                if (lastColor.indexOf("rgba") > -1)
                    newColor = lastColor.replace(/[^,]+(?=\))/, e.target.value);
                else
                    newColor = lastColor.replace(')', ', ' + e.target.value).replace('rgb', 'rgba');
            }
            else {
                newColor = 'rgba(0,0,0,1)';
            }
            applyFormat('forecolor', newColor);
        });
    }

    function opacitySliderTextListener() {
        $('#opacitySliderText').change(function (e) {
            if (!e.target.value)
                return -1;
            if (e.target.value)
                if (e.target.value < 0 && e.target.value > 100)
                    return -2;

            var newColor;
            if (lastColor.indexOf("rgb") > -1) {
                if (lastColor.indexOf("rgba") > -1)
                    newColor = lastColor.replace(/[^,]+(?=\))/, (e.target.value / 100));
                else
                    newColor = lastColor.replace(')', ', ' + (e.target.value / 100)).replace('rgb', 'rgba');
            }
            else {
                newColor = 'rgba(0,0,0,1)';
            }
            applyFormat('forecolor', newColor);
        });
    }

    function createListBoxChangeHandler() {
        editor.on('nodeChange', function (e) {
            if (!e.selectionChange) {
                return;
            }
            var reachEnd = true;
            var parents = e.parents;
            /*Find and apply choosed text color*/
            $.each(parents, function (index, element) {
                if (typeof element.style !== 'undefined')
                    if (element.style.color) {
                        if (element.style.color.indexOf("rgb") > -1) {
                            lastColor = allToRgba(element.style.color);
                            applyChooseColor(lastColor);
                            reachEnd = false;
                            return false;
                        }
                    }

            })
            if (reachEnd)
                applyChooseColor('rgba(0,0,0,1)');
        });
    }

    function getRgbArray(rgb) {
        return rgb.substring(rgb.indexOf('(') + 1, rgb.lastIndexOf(')')).split(/,\s*/);
    }

    function applyChooseColor(value) {
        var $headerColor = $('.mce-colorbutton-grid-header-color'),
            $colorPicker__color = $('.colorPicker__color'),
            $allCells = $('.mce-grid-cell'),
            $opacitySlider = $('#opacitySlider'),
            $opacitySliderText = $('#opacitySliderText'),
            rgbValue, cellRgb;

        $headerColor.css('background-color', value);
        $colorPicker__color.css('background-color', value);
        rgbValue = getRgbArray(value);
        if (rgbValue.length > 2) {
            $opacitySlider.val(rgbValue[3]);
            $opacitySliderText.val(Math.floor(rgbValue[3] * 100));
        }
        for (var i = 0; i < $allCells.length; i++) {
            cellRgb = getRgbArray($allCells[i].getElementsByTagName('div')[0].getAttribute('data-mce-color'));
            if (cellRgb[0] == rgbValue[0] && cellRgb[1] == rgbValue[1] && cellRgb[2] == rgbValue[2]) {
                if (lastPanel && lastPanel != $allCells[i].getElementsByTagName('div')[0]) {
                    previousPanel = lastPanel;
                }
                lastPanel = $allCells[i].getElementsByTagName('div')[0];
                lastPanel.style['border'] = '3px solid #00f8f8';
                lastPanel.style['width'] = '14px';
                lastPanel.style['height'] = '14px';
                if (previousPanel) {
                    previousPanel.style['border'] = 'none';
                    previousPanel.style['width'] = '20px';
                    previousPanel.style['height'] = '20px';
                }
            }
        }
    }

    mapColors();//Initialize all
});
