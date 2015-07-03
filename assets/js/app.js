$(document).ready(function() {
	var currentDate = new Date();
	var day = currentDate.getDay();
	var hr = currentDate.getHours();
	var min = currentDate.getMinutes();
	var sec = currentDate.getSeconds();

	window.setInterval(function() {
		currentDate = new Date();
		day = currentDate.getDay();
		hr = currentDate.getHours();
		min = currentDate.getMinutes();
		sec = currentDate.getSeconds();

		var matrix = $('.clock-wipe-mask').css('-webkit-transform') || $('.clock-wipe-mask').css('transform');
		var split = matrix.split("(")[1];
		split = split.split(")")[0];
		
		var a = split.split(",")[0];
		var b = split.split(",")[1];
		var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

		if (Math.abs(angle) == 180) {
			$('.semi-circle1').css('opacity', '1');
			$('.semi-circle2').css('z-index', '1');
		}
	},1000);

	/*
		// Date Simulator
		day = 3;
		hr = 13;
		min = 19;
		sec = 50;
		window.setInterval(function() {
			if (sec < 59) {
				sec++;
			} else {
				sec = 0;
				if (min < 59) {
					min++;
				} else {
					min = 0;
					if (hr < 23) {
						hr++;
					} else {
						hr = 0;
						if (day < 6) {
							day++;
							$('.circle-mask').css('border', 'none');
							$('.container').height('561px');
							$('footer').show();
							updatePeriod();
						} else {
							day = 0;
						}
					}
				}
			}

			var matrix = $('.clock-wipe-mask').css('-webkit-transform') || $('.clock-wipe-mask').css('transform');
			var split = matrix.split("(")[1];
			split = split.split(")")[0];
			
			var a = split.split(",")[0];
			var b = split.split(",")[1];
			var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

			if (Math.abs(angle) == 180) {
				$('.semi-circle1').css('opacity', '1');
				$('.semi-circle2').css('z-index', '1');
			}
		},1000);
	*/

	var Period = function(title, room, sched, color) {
		this.title = title;
		this.room = room;
		this.sched = sched;
		this.color = color;
	}

	Period.prototype.getLength = function() {
		var periodStart = this.sched.split("-")[0];
		var periodEnd = this.sched.split("-")[1];

		var hrStart = parseInt(periodStart.split(":")[0]);
		var minStart = parseInt(periodStart.split(":")[1]);
		var hrEnd = parseInt(periodEnd.split(":")[0]);
		var minEnd = parseInt(periodEnd.split(":")[1]);

		return 60*(60*(hrEnd - hrStart) - minStart + minEnd);
	}

	var flc = new Period("FLC 1SP", "G-304", "9:00-10:20", "#F9BF3B");
	var psy = new Period("PSY 101", "B-106", "12:00-13:20", "#19B5FE");
	var breakPeriod = new Period("", "", "", "#C0392B");

	var secsLeft;
	function computeSecsLeft(periodSched) {
		var periodStart = periodSched.split("-")[0];
		var periodEnd = periodSched.split("-")[1];

		var hrEnd = parseInt(periodEnd.split(":")[0]);
		var minEnd = parseInt(periodEnd.split(":")[1]);

		secsLeft = 60*(60*(hrEnd - hr) - min + minEnd) - sec;
	}

	var secsElapsed;
	var deg;
	function convertToDegrees(secsLeft, length) {
		secsElapsed = length - secsLeft;
		deg = secsElapsed / length * 360;
	}

	var currentPeriod;
	function updateDisplay(period) {
		currentPeriod = period;

		computeSecsLeft(period.sched);
		convertToDegrees(secsLeft, period.getLength());
		$('.period').html(period.title);
		window.setTimeout(function() {
			$('.clock-wipe-mask').css('border', '2px solid ' + period.color);
			$('.clock-wipe-mask, .circle-mask, body').css('background', period.color);
		},4);
	}

	function updatePeriod() {
		// 12:00-8:59AM
		if (hr < 9) {
			breakPeriod.title = "PREP";
			breakPeriod.sched = "0:00-9:00";
			updateDisplay(breakPeriod);
			$('.next-period').html("FLC 1SP/G-304");
		}
		// 9:00-10:19AM
		else if (hr == 9 || (hr == 10 && min < 20)) {
			updateDisplay(flc);
			$('.next-period').html("90MIN BREAK");
		}
		// 10:20-11:49AM
		else if ((hr == 10 && min >= 20) || (hr == 11 && min < 50)) {
			breakPeriod.title = "90MIN BREAK";
			breakPeriod.sched = "10:20-11:50";
			updateDisplay(breakPeriod);
			$('.next-period').html("PSY 101/B-106");
		}
		// 11:50-11:59AM
		else if (hr == 11 && min >= 50) {
			breakPeriod.title = "10MIN BREAK";
			breakPeriod.sched = "11:50-12:00";
			updateDisplay(breakPeriod);
			$('.next-period').html("PSY 101/B-106");
		}
		// 12:00-13:19AM
		else if (hr == 12 || (hr == 13 && min < 20)) {
			updateDisplay(psy);
			window.setTimeout(function() {
				$('.container').height('424px');
				$('footer').hide();
			},4);
		}

		else {
			$('.period').html("FIN");
			$('.container').height('424px');
			$('footer').hide();
			$('.circle-mask').css('border', '15px solid white');
			$('.clock-wipe-mask').css('border', '2px solid #FFAA30');
			$('.clock-wipe-mask, .circle-mask, body').css('background', '#FFAA30');
		}

		$('.clock-wipe-mask').css({
			'-webkit-transform': 'rotate('+ deg + 'deg)',
			'transform': 'rotate('+ deg + 'deg)',
			'-webkit-animation': 'rotate ' + secsLeft + 's linear',
			'animation': 'rotate ' + secsLeft + 's linear',
		});
	}

	updatePeriod();
	if (secsElapsed >= secsLeft) {
		$('.semi-circle1').css('opacity', '1');
		$('.semi-circle2').css('z-index', '1');
	}

	$('.clock-wipe').on('webkitAnimationEnd animationend', '.clock-wipe-mask', function() {
		var clockWipeMask = $('.clock-wipe-mask').clone();
		$('.clock-wipe-mask').remove();
		clockWipeMask.insertAfter('.semi-circle2');
		
		$('.container').css('transition', 'height 1s');
		$('.clock-wipe-mask').css('transition', 'border 1s, background 1s');
		$('.circle-mask, body').css('transition', 'background 1s');

		$('.semi-circle1').css('opacity', '0');
		$('.semi-circle2').css('z-index', '0');
		updatePeriod();
	});

	var i = 0;
	var periodInfoTimeout;
	$('.circle-mask').click(function() {
		if ($('.period').html() != "FIN") {
			if (i < 2) {
				if (currentPeriod == breakPeriod) {
					i = 2;
				} else {
					i++;
				}
			} else {
				i = 0;
			}

			if (i == 0) {
				$('.period').css('opacity', '0').on('transitionend', function() {
					$('.period').html(currentPeriod.title).css('opacity', '1');
				});
			} else if (i == 1) {
				$('.period').css('opacity', '0').on('transitionend', function() {
					$('.period').html(currentPeriod.room).css('opacity', '1');
				});
			} else {
				$('.period').css('opacity', '0').on('transitionend', function() {
					var periodStart = currentPeriod.sched.split("-")[0];
					var periodEnd = currentPeriod.sched.split("-")[1];

					var hrStart = periodStart.split(":")[0];
					var minStart = periodStart.split(":")[1];
					var hrEnd = periodEnd.split(":")[0];
					var minEnd = periodEnd.split(":")[1];

					if (hrStart > 12) {
						hrStart -= 12;
					} else if (hrStart == 0) {
						hrStart = 12;
					}
					if (hrEnd > 12) {
						hrEnd -= 12;
					}

					$('.period').html(hrStart + ":" + minStart + "-" + hrEnd + ":" + minEnd).css('opacity', '1');
				});
			}

			clearTimeout(periodInfoTimeout);
			periodInfoTimeout = window.setTimeout(function() {
				if (i != 0) {
					i = 0;
					$('.period').css('opacity', '0').on('transitionend', function() {
						$('.period').html(currentPeriod.title).css('opacity', '1');
					});
				}
			},3000);
		}
	});
});