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

	/*// Date Simulator
	day = 3;
	hr = 11;
	min = 0;
	sec = 57;

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
	},1000);*/

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

	var amc = new Period("AMC 124", "F-204", "12:30-13:20", "#C0C0C0");
	var cs = new Period("CS 110", "F-227", "", "#19B5FE")
	var fil = new Period("FIL 14", "B-206", "12:00-13:20", "#FF8C7C");
	var nstp = new Period("NSTP 1", "OSCI DEPT", "13:30-17:20", "#4EEC91");
	var pe = new Period ("PE 106", "TAB TEN AREA", "8:00-9:50", "#F9BF3B");
	var psLec = new Period("PS 21", "F-115", "13:30-14:20", "#47EBE0");
	var psLab = new Period("PS 21.1", "SEC-C105A", "14:30-18:20", "#47EBE0");
	var th = new Period("TH 121", "CTC-304", "15:30-16:20", "#BE90D4");
	var breakPd = new Period("", "", "", "#DFAD8C");

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
		// Mon/Wed/Fri before 4:20PM
		if ((day == 1 || day == 3 || day == 5) && (hr < 16 || (hr == 16 && min < 20))) {

			// Mon before 11:20AM
			if (day == 1 && (hr < 11 || (hr == 11 && min < 20))) {
				// 12:00-9:29AM
				if (hr < 9 || (hr == 9 && min < 30)) {
					breakPd.title = "PREP";
					breakPd.sched = "0:00-9:30";
					updateDisplay(breakPd);
					$('.next-period').html("CS 110/F-227");
				}

				// 9:30-11:19AM
				else if ((hr == 9 && min >= 30) || hr == 10 || (hr == 11 && min < 20)) {
					cs.sched = "9:30-11:20";
					updateDisplay(cs);
					$('.next-period').html("70MIN BREAK");
				}
			}

			// 12:00-11:19AM
			else if (hr < 11 || (hr == 11 && min < 20)) {
				// 12:00-10:29AM
				if (hr < 10 || (hr == 10 && min < 30)) {
					// Fri
					if (day == 5) {
						// 12:00-7:59AM
						if (hr < 8) {
							breakPd.title = "PREP";
							breakPd.sched = "0:00-8:00";
							updateDisplay(breakPd);
							$('.next-period').html("PE 106/TAB TEN AREA");
						}
		
						// 8:00-9:49AM
						else if (hr == 8 || (hr == 9 && min < 50)) {
							updateDisplay(pe);
							$('.next-period').html("40MIN BREAK");
						}

						// 9:50-10:29AM
						else if ((hr == 9 && min >= 50) || (hr == 10 && min < 30)) {
							breakPd.title = "40MIN BREAK";
							breakPd.sched = "9:50-10:30";
							updateDisplay(breakPd);
							$('.next-period').html("CS 110/F-227");
						}
					}

					// Wed
					else {
						// 12:00-10:29AM
						if (hr < 10 || (hr == 10 && min < 30)) {
							breakPd.title = "PREP";
							breakPd.sched = "0:00-10:30";
							updateDisplay(breakPd);
							$('.next-period').html("CS 110/F-227");
						}
					}
				}

				// 10:30-11:19AM
				else if ((hr == 10 && min >= 30) || (hr == 11 && min < 20)) {
					cs.sched = "10:30-11:20";
					updateDisplay(cs);
					$('.next-period').html("70MIN BREAK");
				}
			}

			// 11:20-12:29AM
			else if ((hr == 11 && min >= 20) || (hr == 12 && min < 30)) {
				breakPd.title = "70MIN BREAK";
				breakPd.sched = "11:20-12:30";
				updateDisplay(breakPd);
				$('.next-period').html("AMC 124/F-204");
			}

			// 12:30-1:19PM
			else if ((hr == 12 && min >= 30) || (hr == 13 && min < 20)) {
				updateDisplay(amc);
				$('.next-period').html("PS 21/F-115");
			}

			// 1:20-1:29PM
			else if (hr == 13 && (min >= 20 && min < 30)) {
				breakPd.title = "10MIN BREAK";
				breakPd.sched = "13:20-13:30";
				updateDisplay(breakPd);
				$('.next-period').html("PS 21/F-115");	
			}

			// 1:30-2:19PM
			else if ((hr == 13 && min >= 30) || (hr == 14 && min < 20)) {
				updateDisplay(psLec);
				$('.next-period').html("70MIN BREAK");
			}

			// 2:20-3:29PM
			else if ((hr == 14 && min >= 20) || (hr == 15 && min < 30)) {
				breakPd.title = "70MIN BREAK";
				breakPd.sched = "14:20-15:30";
				updateDisplay(breakPd);
				$('.next-period').html("TH 121/CTC 304");
			}

			// 3:30-4:19PM
			else if ((hr == 15 && min >= 30) || (hr == 16 && min < 20)) {
				updateDisplay(th);
				window.setTimeout(function() {
					$('.container').height('424px');
					$('footer').hide();
				},4);
			}
		}

		// Tues before 6:20PM, Thurs before 5:20PM
		else if ((day == 2 && (hr < 18 || (hr == 18 && min < 20))) ||
			(day == 4 && (hr < 17 || (hr == 17 && min < 20)))) {
			// 12:00-11:59AM
			if (hr < 12) {
				breakPd.title = "PREP";
				breakPd.sched = "0:00-12:00";
				updateDisplay(breakPd);
				$('.next-period').html("FIL 14/B-206");
			}

			// Tues
			else if (day == 2) {
				// 12:00-1:19PM
				if (hr == 12 || (hr == 13 && min < 20)) {
					updateDisplay(fil);
					$('.next-period').html("70MIN BREAK");
				}

				// 1:20-2:29PM
				else if ((hr == 13 && min >= 20) || (hr == 14 && min < 30)) {
					breakPd.title = "70MIN BREAK";
					breakPd.sched = "13:20-14:30";
					updateDisplay(breakPd);
					$('.next-period').html("PS 21.1/SEC-C105A");
				}

				// 2:30-6:19PM
				else if ((hr == 14 && min >= 30) || (hr > 14 || hr < 17) || (hr == 18 && min < 20)) {
					updateDisplay(psLab);
					window.setTimeout(function() {
						$('.container').height('424px');
						$('footer').hide();
					},4);
				}
			}

			// Thurs
			else {
				// 12:00-1:19PM
				if (hr == 12 || (hr == 13 && min < 20)) {
					updateDisplay(fil);
					$('.next-period').html("NSTP 1/OSCI DEPT");
				}

				// 1:20-1:29PM
				else if (hr == 13 && (min >= 20 && min < 30)) {
					breakPd.title = "10MIN BREAK";
					breakPd.sched = "13:20-13:30";
					updateDisplay(breakPd);
					$('.next-period').html("NSTP 1/OSCI DEPT");	
				}

				// 1:30-5:19PM
				else if ((hr == 13 && min >= 30) || (hr > 14 || hr < 16) || (hr == 17 && min < 20)) {
					updateDisplay(nstp);
					window.setTimeout(function() {
						$('.container').height('424px');
						$('footer').hide();
					},4);
				}
			}
		} else {
			$('.period').html("FIN");
			$('.container').height('424px');
			$('footer').hide();
			$('.circle-mask').css('border', '15px solid white');
			$('.clock-wipe-mask').css('border', '2px solid #FFAA30');
			$('.clock-wipe-mask, .circle-mask, body').css('background', '#FFB28B');
		}

		// Update graph
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
				if (currentPeriod == breakPd) {
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

					$('.period').html(hrStart + ":" + minStart + "&ndash;" + hrEnd + ":" + minEnd).css('opacity', '1');
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