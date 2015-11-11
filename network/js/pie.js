var pie = new d3pie("pieChart", {
	"header": {
		"title": {
			"text": "Total collisions per packet",
			"fontSize": 24,
			"font": "helvetica"
		},
		"subtitle": {
			"color": "#ffa8a8",
			"fontSize": 8,
			"font": "times new roman"
		},
		"titleSubtitlePadding": 9
	},
	"footer": {
		"color": "#999999",
		"fontSize": 10,
		"font": "open sans",
		"location": "bottom-left"
	},
	"size": {
		"canvasWidth": 960,
		"pieOuterRadius": "100%"
	},
	"data": {
		"sortOrder": "value-desc",
		"content": [
			{
				"label": "JavaScript",
				"value": 264131,
				"color": "#23c12e"
			},
			{
				"label": "Ruby",
				"value": 218812,
				"color": "#e12512"
			}
		]
	},
	"labels": {
		"outer": {
			"pieDistance": 32
		},
		"inner": {
			"hideWhenLessThanPercentage": 3
		},
		"mainLabel": {
			"fontSize": 11
		},
		"percentage": {
			"color": "#ffffff",
			"decimalPlaces": 0
		},
		"value": {
			"color": "#adadad",
			"fontSize": 11
		},
		"lines": {
			"enabled": true
		},
		"truncation": {
			"enabled": true
		}
	},
	"effects": {
		"pullOutSegmentOnClick": {
			"effect": "linear",
			"speed": 400,
			"size": 8
		}
	},
	"misc": {
		"gradient": {
			"enabled": true,
			"percentage": 100
		}
	}
});