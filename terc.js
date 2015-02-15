var express = require("express"),
        app = express(),
        sys = require("sys"),
        fs = require('fs'),
        exec = require("child_process").exec,
        child,
        teKeyboard = require('./lib/keyboard.js');

var gKeyboard = new teKeyboard();

var mouse_speed = 2;

var WebSocketServer = require('ws').Server;
var wss = new WebSocketServer({port: 3001});
wss.on('connection', function(ws) {
    ws.on('message', function(message) {
	var lCommand = JSON.parse(message);

	var lCallback = function (error, stdout, stderr) {
		if (error) {
			console.log(error);
		}
	};

	if (lCommand.task == 'click') {
		exec('export DISPLAY=:0; xdotool click 1', lCallback);
	} else if (lCommand.task == 'mousemove') {
	    exec('export DISPLAY=:0; xdotool mousemove_relative -- ' + lCommand.delta_x + ' ' + lCommand.delta_y, lCallback);
	} else if (lCommand.task == 'mousedown') {
		exec('export DISPLAY=:0; xdotool mousedown 1', lCallback);
	} else if (lCommand.task == 'mouseup') {
		exec('export DISPLAY=:0; xdotool mouseup 1', lCallback);
	} else if (lCommand.task == 'keydown') {
		exec('export DISPLAY=:0; xdotool keydown ' + lCommand.key, lCallback);
    } else if (lCommand.task == 'keyup') {
        exec('export DISPLAY=:0; xdotool keyup ' + lCommand.key, lCallback);
	}
    });
});

app.all("/lrc", function(req, res) {
    var command = req.query.cmd;
    exec(command, function(err, stdout, stderr) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "X-Requested-With");
        res.send({res: stdout});
    });
});


app.get('/', function(req, res) {
    fs.readFile('./static/index.html', { encoding: 'utf8' }, function (err, data) {
        if (err) {
            console.error('Not found');
        } else {
            data = data.replace('{{keyboard}}', gKeyboard.fHtml);

            res.send(data);
        }
    });
});

app.get(/^\/(js|css)\/(.*)/, function(req, res) {
    var lExtension = req.url.split('.').pop();
    fs.readFile('./static' + req.url, { encoding: 'utf8' }, function (err, data) {
        if (err) {
            console.error('Not found');
        } else {
            if (lExtension == 'css') {
                data = data.replace('{{keyboard}}', gKeyboard.fCss);
            }
            res.type(lExtension);
            res.send(data);
        }
    });
});


/**
 * handles all requests
 */
app.get(/^\/(.*)/, function(req, res) {
    child = exec("rhythmbox-client --print-playing-format='%ta;%at;%tt;%te;%td;' && amixer sget Master && xbacklight -get", function(error, stdout, stderr) {
        res.header("Content-Type", "text/javascript");
        // error of some sort
        if (error !== null) {
            res.send("0");
        }
        else {
            // info actually requires us returning something useful
            if (req.params[0] == "info") {
                info = stdout.split(";");
                var volume = info[5].split("%]");
                volume = volume[0].split("[");
                volume = volume[1];

                var backlight = info[5].split("[on]");
                backlight = backlight[1].replace(/^\s+|\s+$/g, "");
                backlight = backlight.split(".");
                backlight = backlight[0];
                //console.log(backlight);
                res.send(req.query.callback + "({'artist':'" + escape(info[0]) + "', 'album':'" + escape(info[1]) + "', 'title': '" + escape(info[2]) + "', 'elapsed': '" + info[3] + "', 'duration':'" + info[4] + "', 'volume':'" + volume + "', 'backlight':'" + backlight + "'})");
            }
            else {
                res.send(req.query.callback + "()");
            }
        }
    });

});

app.listen(3000, function () {
    console.log('Listening on port 3000');
});
