import flask
from flask import request, jsonify
from configparser import ConfigParser
from dataclasses import dataclass

import utils.dataset as ds

# response type
@dataclass
class ResponseType:
    success: bool
    data: object
    error: str = ''

if __name__ == '__main__':
    # get configs
    config = ConfigParser()
    config.read('config.ini')

    port = config.getint('default', 'port')
    ds_path = config.get('default','dataset_path')
    api_key = config.get('alpha_vantage', 'api_key')

    # start server
    app = flask.Flask(__name__)

    # get all datasets
    @app.route('/datasets', methods=['GET'])
    def get_datasets():
        res = ResponseType(True, ds.get_all_datasets(ds_path))
        return jsonify(res)

    # save dataset
    @app.route('/save_dataset', methods=['POST'])
    def save_dataset():
        symbol = request.json['symbol']
        try:
            file_name = ds.save_dataset(symbol)
            res = ResponseType(True, file_name)
            return jsonify(res), 201
        except Exception as e:
            res = ResponseType(False, '', str(e))
            return jsonify(res), 400


    app.run(port=port)