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
        respose = ResponseType(True, ds.get_all_datasets(ds_path))
        return jsonify(respose)

    app.run(port=port)