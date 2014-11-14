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
		day = 2;
		hr = 14;
		min = 0;
		sec = 0;
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

	var Period = function(title, venue, time, color) {
		this.title = title;
		this.venue = venue;
		this.time = time;
		this.color = color;
	}

	Period.prototype.getLength = function() {
		var periodStart = this.time.split("-")[0];
		var periodEnd = this.time.split("-")[1];

		var hrStart = parseInt(periodStart.split(":")[0]);
		var minStart = parseInt(periodStart.split(":")[1]);
		var hrEnd = parseInt(periodEnd.split(":")[0]);
		var minEnd = parseInt(periodEnd.split(":")[1]);

		return 60*(60*(hrEnd - hrStart) - minStart + minEnd);
	}

	var cs = new Period("CS 21B", "F-227", "8:30-10:20", "#BFBFBF");
	var en = new Period("EN 101", "SEC-A 205A", "9:30-10:20", "#2ECC71");
	var fil = new Period("FIL 12", "K-203", "13:30-14:20", "#F2784B");
	var intac = new Period("INTAC 2", "CTC-107", "14:30-15:20", "#22A7F0");
	var lit = new Period("LIT 14", "SEC-A 205A", "10:30-11:20", "#BF55EC");
	var ma = new Period("MA 20.2", "", "", "#22313F");
	var pe = new Period("PE 112", "COV COURTS", "14:00-14:50", "#F9BF3B");
	var breakPeriod = new Period("", "", "", "#C0392B");

	var secsLeft;
	function computeSecsLeft(periodTime) {
		var periodStart = periodTime.split("-")[0];
		var periodEnd = periodTime.split("-")[1];

		var hrEnd = parseInt(periodEnd.split(":")[0]);
		var minEnd = parseInt(periodEnd.split(":")[1]);

		secsLeft = 60*(60*(hrEnd - hr) - min + minEnd) - sec;
	}

	var secsElapsed;
	var deg;
	function convertToDeg(secsLeft, length) {
		secsElapsed = length - secsLeft;
		deg = secsElapsed / length * 360;
	}

	var currentPeriod;
	function updateDisplay(period) {
		currentPeriod = period;

		computeSecsLeft(period.time);
		convertToDeg(secsLeft, period.getLength());
		$('.period').html(period.title);
		window.setTimeout(function() {
			$('.clock-wipe-mask').css('border', '2px solid ' + period.color);
			$('.clock-wipe-mask, .circle-mask, body').css('background', period.color);
		},4);
	}

	function updatePeriod() {
		// Monday, Wednesday, Friday
		if (day == 1 || day == 3 || day == 5) {
			// 12:00-7:29AM
			if (hr < 7 || (hr == 7 && min < 30)) {
				breakPeriod.title = "PREP";
				breakPeriod.time = "0:00-7:30";
				updateDisplay(breakPeriod);
				$('.next-period').html("MA 20.2/SEC-A 210A");
			}
			// 7:30-8:19AM
			else if ((hr == 7 && min >= 30) || (hr == 8 && min < 20)) {
				ma.venue = "SEC-A 210A";
				ma.time = "7:30-8:20";
				updateDisplay(ma);
				$('.next-period').html("60MIN BREAK");
			}
			// 8:20-9:19AM
			else if ((hr == 8 && min >= 20) || (hr == 9 && min < 20)) {
				breakPeriod.title = "60MIN BREAK";
				breakPeriod.time = "8:20-9:20";
				updateDisplay(breakPeriod);
				$('.next-period').html("EN 101/SEC-A 205A");
			}
			// 9:20-9:29AM
			else if (hr == 9 && (min >= 20 && min < 30)) {
				breakPeriod.title = "10MIN BREAK";
				breakPeriod.time = "9:20-9:30";
				updateDisplay(breakPeriod);
				$('.next-period').html("EN 101/SEC-A 205A");
			}
			// 9:30-10:19AM
			else if ((hr == 9 && min >= 30) || (hr == 10 && min < 20)) {
				updateDisplay(en);
				$('.next-period').html("LIT 14/SEC-A 205A");
			}
			// 10:20-10:29AM
			else if (hr == 10 && (min >= 20 && min < 30)) {
				breakPeriod.title = "10MIN BREAK";
				breakPeriod.time = "10:20-10:30";
				updateDisplay(breakPeriod);
				$('.next-period').html("LIT 14/SEC-A 205A");
			}
			// 10:30-11:19AM
			else if ((hr == 10 && min >= 30) || (hr == 11 && min < 20)) {
				updateDisplay(lit);
				$('.next-period').html("120MIN BREAK");
			}
			// 11:20-1:19PM
			else if ((hr == 11 && min >= 20) || hr == 12 || (hr == 13 && min < 20)) {
				breakPeriod.title = "120MIN BREAK";
				breakPeriod.time = "11:20-13:20";
				updateDisplay(breakPeriod);
				$('.next-period').html("FIL 12/K-203");
			}
			// 1:20-1:29PM
			else if (hr == 13 && (min >= 20 && min < 30)) {
				breakPeriod.title = "10MIN BREAK";
				breakPeriod.time = "13:20-13:30";
				updateDisplay(breakPeriod);
				$('.next-period').html("FIL 12/K-203");
			}
			// 1:30-2:19PM
			else if ((hr == 13 && min >= 30) || (hr == 14 && min < 20)) {
				updateDisplay(fil);
				if (day == 5) {
					$('.next-period').html("INTAC 2/CTC-107");
				} else {
					window.setTimeout(function() {
						$('.container').height('424px');
						$('footer').hide();
					},4);
				}
			}
			// Friday, 2:20-2:29PM
			else if (day == 5 && hr == 14 && (min >= 20 && min < 30)) {
				breakPeriod.title = "10MIN BREAK";
				breakPeriod.time = "14:20-14:30";
				updateDisplay(breakPeriod);
				$('.next-period').html("INTAC 2/CTC-107");
			}
			// Friday, 2:30-3:19PM
			else if (day == 5 && ((hr == 14 && min >= 30) || (hr == 15 && min < 20))) {
				updateDisplay(intac);
				window.setTimeout(function() {
					$('.container').height('424px');
					$('footer').hide();
				},4);
			} else {
				$('.period').html("FIN");
				$('.container').height('424px');
				$('footer').hide();
				$('.circle-mask').css('border', '15px solid white');
				$('.clock-wipe-mask').css('border', '2px solid #FFAA30');
				$('.clock-wipe-mask, .circle-mask, body').css('background', '#FFAA30');
			}
		}

		// Tuesday, Thursday
		else if (day == 2 || day == 4) {
			// 12:00-8:29AM
			if (hr < 8 || (hr == 8 && min < 30)) {
				breakPeriod.title = "PREP";
				breakPeriod.time = "0:00-8:30";
				updateDisplay(breakPeriod);
				$('.next-period').html("CS 21B/F-227");
			}
			// 8:30-10:19AM
			else if ((hr == 8 && min >= 30) || hr == 9 || (hr == 10 && min < 20)) {
				updateDisplay(cs);
				$('.next-period').html("90MIN BREAK");
			}
			// 10:20-11:49AM
			else if ((hr == 10 && min >= 20) || (hr == 11 && min < 50)) {
				breakPeriod.title = "90MIN BREAK";
				breakPeriod.time = "10:20-11:50";
				updateDisplay(breakPeriod);
				$('.next-period').html("MA 20.2/SEC-A 202A");
			}
			// 11:50-11:59AM
			else if (hr == 11 && (min >= 50 && min <= 59)) {
				breakPeriod.title = "10MIN BREAK";
				breakPeriod.time = "11:50-12:00";
				updateDisplay(breakPeriod);
				$('.next-period').html("MA 20.2/SEC-A 202A");
			}
			// 12:00-1:19PM
			else if (hr == 12 || (hr == 13 && min < 20)) {
				ma.venue = "SEC-A 202A";
				ma.time = "12:00-13:20";
				updateDisplay(ma);
				$('.next-period').html("30MIN BREAK");
			}
			// 1:20-1:49PM
			else if (hr == 13 && (min >= 20 && min < 50)) {
				breakPeriod.title = "30MIN BREAK";
				breakPeriod.time = "13:20-13:50";
				updateDisplay(breakPeriod);
				$('.next-period').html("PE 112/COV COURTS");
			}
			// 1:50-1:59PM
			else if (hr == 13 && (min >= 50 && min <= 59)) {
				breakPeriod.title = "10MIN BREAK";
				breakPeriod.time = "13:50-14:00";
				updateDisplay(breakPeriod);
				$('.next-period').html("PE 112/COV COURTS");
			}
			// 2:00-2:49PM
			else if (hr == 14 && min < 50) {
				updateDisplay(pe);
				window.setTimeout(function() {
					$('.container').height('424px');
					$('footer').hide();
				},4);
			} else {
				$('.period').html("FIN");
				$('.container').height('424px');
				$('footer').hide();
				$('.circle-mask').css('border', '15px solid white');
				$('.clock-wipe-mask').css('border', '2px solid #FFAA30');
				$('.clock-wipe-mask, .circle-mask, body').css('background', '#FFAA30');
			}
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
	var periodTextTimeout;
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
					$('.period').html(currentPeriod.venue).css('opacity', '1');
				});
			} else {
				$('.period').css('opacity', '0').on('transitionend', function() {
					var periodStart = currentPeriod.time.split("-")[0];
					var periodEnd = currentPeriod.time.split("-")[1];

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

			clearTimeout(periodTextTimeout);
			periodTextTimeout = window.setTimeout(function() {
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