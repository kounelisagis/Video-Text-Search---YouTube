$(document).ready(function () {

	var video_id = null;
	var selected_language = null;
	var captions_list = null;


	function set_language_options(video_id) {
		$("#languages_menu").empty();

		$(".language-form").attr('style', 'display: none;');
		$(".times-form").attr('style', 'display: none;');
		$("#keyword").val("");


		$(".error-form").attr('style', 'display: none;');


		$.ajax({
			type: 'POST',
			url: 'get_options.php',
			dataType: 'json',
			data: {
				'video_id': video_id
			},
			success: function (msg) {

				if (msg.captions.length == 0) {
					$(".error-form").attr('style', '');
					$(".error-form").html('No subtitles available for this video');
				} else {
					captions_list = msg.captions;
					selected_language = 0;
					for (let i = 0; i < captions_list.length; i++) {
						let caption = captions_list[i];

						let lang_code = caption.lang_code;
						let lang_translated = caption.lang_translated;
						let name = caption.name;

						create_option(lang_translated, i);
					}

					$(".language-form").attr('style', '');
				}
			}
		});
	}

	function set_time_options(keyword, name, lang_code) {
		$("#times_menu").empty();
		$(".times-form").attr('style', 'display: none;');
		$("#video_corner").empty();


		$(".error-form").attr('style', 'display: none;');


		$.ajax({
			type: 'POST',
			url: 'get_times.php',
			dataType: 'json',
			data: {
				'video_id': video_id,
				'keyword': keyword,
				'name': name,
				'lang_code': lang_code
			},
			success: function (times) {

				if (times.length == 0) {
					$(".error-form").attr('style', '');
					$(".error-form").html('No keyword matches found');
				} else {
					for (let i = 0; i < times.length; i++) {
						var $btn = $('<button class="time_button" start_time=' + Math.floor(times[i]) + '>' + seconds_to_timestring(Math.floor(times[i])) + '</button>');
						$btn.appendTo($("#times_menu"));
					}

					$(".times-form").attr('style', '');

				}
			}
		});
	}


	$("#btnSubmit").click(function () {
		let url = $('#url').val();
		video_id = get_video_id(url);
		set_language_options(video_id);
	});

	function get_video_id(url) {

		let video_id = "";

		try {
			let url_arguments = url.split('?')[1].split('&');

			for (let i = 0; i < url_arguments.length; i++) {
				let argument = url_arguments[i];
				if (argument[0] == 'v' && argument[1] == '=')
					video_id = argument.split('=')[1];
			}
		} finally {
			return video_id;
		}
	}

	function create_option(lang_translated, id) {
		if (id == 0)
			var $btn = $('<button class="option active" type="button" id=' + id + '>' + lang_translated + '</button>');
		else
			var $btn = $('<button class="option" type="button" id=' + id + '>' + lang_translated + '</button>');

		$btn.appendTo($("#languages_menu"));
	}

	$(document).on('click', '.option', function () {
		$("#" + selected_language).attr('class', 'option');
		selected_language = $(this).attr("id");
		$("#" + selected_language).attr('class', 'option active');
	});

	$(document).on('click', '#search_keyword', function () {
		let caption = captions_list[selected_language];
		set_time_options($("#keyword").val(), caption.name, caption.lang_code);
	});

	function seconds_to_timestring(secs) {
		var hours = Math.floor(secs / 3600);
		var minutes = Math.floor((secs - (hours * 3600)) / 60);
		var seconds = secs - (hours * 3600) - (minutes * 60);

		if (hours < 10) {
			hours = "0" + hours;
		}
		if (minutes < 10) {
			minutes = "0" + minutes;
		}
		if (seconds < 10) {
			seconds = "0" + seconds;
		}
		return hours + ':' + minutes + ':' + seconds;
	}

	$(document).on('click', '.time_button', function () {
		$("#video_corner").empty();

		let start_time = $(this).attr("start_time");
		let html_code = get_video_embed_code(start_time, captions_list[selected_language].lang_code);
		var $html = $(html_code);
		$html.appendTo($("#video_corner"));
	});

	function get_video_embed_code(start_time, language) {
		let width = $(window).width() / 2;
		let height = (1080 / 1920) * width; // => 16:9

		return '<iframe width="' + width + '" height="' + height + '" src="https://www.youtube.com/embed/' + video_id + '?start=' + start_time + '&cc_load_policy=1&cc_lang_pref=' + language + '" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>';
	}

});