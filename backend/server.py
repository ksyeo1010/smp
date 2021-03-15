import flask
import os
from flask import request, jsonify
from dataclasses import dataclass

from utils import Config, Dataset
from models import Model, ModelType

# set os environ
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

# response type
@dataclass
class ResponseType:
    success: bool
    data: object
    error: str = ''

# main
def main():
    # get configs
    config = Config()
    ds = Dataset()
    mc = Model()

    # start server
    app = flask.Flask(__name__)

    # get all datasets
    @app.route('/datasets', methods=['GET'])
    def get_datasets():
        res = ResponseType(True, ds.get_all_datasets())
        return jsonify(res), 200

    # dataset
    @app.route('/dataset/<string:symbol>', methods=['GET', 'POST'])
    def dataset(symbol):
        try:
            if request.method == 'GET':
                df = ds.load_dataset(symbol)
                res = ResponseType(True, df)
                status = 200
            elif request.method == 'POST':
                symbol = request.json['symbol']
                fstat = ds.save_dataset(symbol)
                res = ResponseType(True, fstat)
                status = 201
        except Exception as e:
            res = ResponseType(False, '', str(e))
            status = 400

        return jsonify(res), status

    # get all predictions
    @app.route('/predictions', methods=['GET'])
    def get_predictions():
        res = ResponseType(True, mc.get_predictions())
        return jsonify(res), 200

    # prediction
    @app.route('/prediction/<string:uuid>', methods=['GET'])
    @app.route('/prediction', methods=['POST'])
    def prediction(uuid=None):
        if request.method == 'GET':
            res = ResponseType(True, mc.load_prediction(uuid))
            status = 200
        elif request.method == 'POST':
            symbol = request.json['symbol']
            res = ResponseType(True, mc.fit_predict(symbol, ModelType.BASIC, ds))
            status = 200

        return jsonify(res), status

    app.run(port=config.get_port())

if __name__ == '__main__':
    main()