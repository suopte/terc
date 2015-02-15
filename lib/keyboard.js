var fs = require('fs');

var teTouchKeyboard = function () {
	this.fHtml = '';
	this.fCss = '';

	this.mInit();
};

teTouchKeyboard.prototype = {
	mKeyNameToClass: function (aKeyName) {
		var lCharMap = {
			'ö': 'oe',
			'ü': 'ue',
			'ó': 'oo',
			'ő': 'oee',
			'ú': 'uu',
			'é': 'ee',
			'á': 'aa',
			'ű': 'uee',
			'í': 'ii',
			' ': '_'
		};

		var lClass = aKeyName.toLocaleLowerCase().replace(/\s|ö|ü|ó|ő|ú|é|á|ű|í/g, function (aMatch) {
			return lCharMap[aMatch] || '';
		});

		return 'kb_' + lClass;
	},

	mInit: function () {
		var that = this;
		this.mLoadKeyboardMap('lib/keyboard_hu.json', function (aKeyboardMap) {
			that.mProcessKeyboardMap(aKeyboardMap);
		});
	},

	mLoadKeyboardMap: function (aSource, cbReady) {
		fs.readFile('./lib/keyboard_hu.json', { encoding: 'utf8' }, function (aError, aData) {
			var lKeyboardMap = JSON.parse(aData);

			if (typeof cbReady == 'function') {
				cbReady(lKeyboardMap);
			}
		});
	},

	mProcessKeyboardRows: function (aKeyboardMap) {
		var lGapWidth = aKeyboardMap.gap_width;
		var lRowIndex, lKeyIndex;
		var lRowCount, lKeyCount;
		var lRow, lKey;
		var lMaxGrossLength = 0;

		lRowCount = aKeyboardMap.key_row_list.length;

		for (lRowIndex = 0; lRowIndex < lRowCount; lRowIndex++) {
			lRow = aKeyboardMap.key_row_list[lRowIndex];
			lRow.fSumWidthNet = 0;
			lRow.fSumWidthGross = 0;

			lKeyCount = lRow.key_list.length;
			for (lKeyIndex = 0; lKeyIndex < lKeyCount; lKeyIndex++) {
				lKey = lRow.key_list[lKeyIndex];

				lRow.fSumWidthNet += lKey.width;
				lRow.fSumWidthGross += lKey.width + lGapWidth;
			}

			lRow.fSumWidthGross -= lGapWidth;

			lMaxGrossLength = (lRow.fSumWidthGross > lMaxGrossLength) ?
				lRow.fSumWidthGross :
				lMaxGrossLength;
		}

		aKeyboardMap.fUnit = 98.0 / lMaxGrossLength;

		for (lRowIndex = 0; lRowIndex < lRowCount; lRowIndex++) {
			lRow = aKeyboardMap.key_row_list[lRowIndex];
			lRow.gap_width = (lMaxGrossLength - lRow.fSumWidthNet) / (lRow.key_list.length - 1);

		}
	},

	mProcessKeyboardMap: function (aKeyboardMap) {
		this.mProcessKeyboardRows(aKeyboardMap);

		var lGapWidth = aKeyboardMap.gap_width;
		var lRowIndex, lKeyIndex;
		var lRowCount, lKeyCount;
		var lRow, lKey;
		var lKeyWidth, lKeyHeight;
		var lUnit = aKeyboardMap.fUnit;

		var lHtml = '';
		var lCss = '';

		lRowCount = aKeyboardMap.key_row_list.length;

		for (lRowIndex = 0; lRowIndex < lRowCount; lRowIndex++) {
			lRow = aKeyboardMap.key_row_list[lRowIndex];
			lGapWidth = lRow.gap_width * lUnit;

			lHtml += '<div class="kb_row">';

			lKeyCount = lRow.key_list.length;
			for (lKeyIndex = 0; lKeyIndex < lKeyCount; lKeyIndex++) {
				lKey = lRow.key_list[lKeyIndex];

				lKeyClass = this.mKeyNameToClass(lKey.name);

				lHtml += '<div class="kb_key ' + lKeyClass + '" data-key-code="' + lKey.value + '">';
				lHtml += lKey.label;
				lHtml += '</div>';

				lKeyWidth = lKey.width * lUnit;
				lKeyHeight = lKey.height * lUnit;

				lCss += '.' + lKeyClass + '{';
				lCss += 'width:' + lKeyWidth + 'vw;';
				lCss += 'height:' + lKeyHeight + 'vw;';
				lCss += (lKeyIndex < (lKeyCount - 1)) ? ('margin-right:' + lGapWidth + 'vw;') : '';
				lCss += '}';
				lCss += '\n';
			}

			lHtml += '<div class="kb_clear"></div>';
			lHtml += '</div>';
		}

		this.fHtml = lHtml;
		this.fCss = lCss;
	}
};

module.exports = teTouchKeyboard;
