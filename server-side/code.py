import requests
from bs4 import BeautifulSoup


def get_captions_list(id):
    url = "https://www.youtube.com/api/timedtext?type=list&v=" + str(id)
    captions_list = []

    r = requests.get(url)
    soup = BeautifulSoup(r.content, "html.parser")

    responses = soup.findAll('track')

    for response in responses:
        caption_data = {}
        caption_data['name'] = response['name']
        caption_data['lang_code'] = response['lang_code']
        caption_data['lang_translated'] = response['lang_translated']
        captions_list.append(caption_data)

    return captions_list


@app.route('/get_options', methods=['GET', 'POST'])
def get_options():
    result = {}

    # argument
    video_id = request.args.get('video_id')

    captions_list = get_captions_list(video_id)

    result['video_id'] = video_id
    result['captions'] = captions_list

    return jsonify(result)


@app.route('/get_times', methods=['GET', 'POST'])
def get_times():

    # arguments
    video_id = request.args.get('video_id')
    keyword = request.args.get('keyword')
    name = request.args.get('name')
    lang_code = request.args.get('lang_code')


    keyword = keyword.lower()
    captions_url = 'https://video.google.com/timedtext?v=' + video_id + '&name=' + name + '&lang=' + lang_code
    results = []

    r = requests.get(captions_url)
    soup = BeautifulSoup(r.content, "html.parser")

    responses = soup.findAll('text')

    for response in responses:
        if keyword in response.decode_contents().lower():
            time = response['start']
            results.append(time)

    return jsonify(results)
