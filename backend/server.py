import flask
import os
from flask import request, jsonify
from dataclasses import dataclass

from utils import Config, Dataset, Trends, compare_and_merge
from models import Model

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
    tr = Trends()

    # start server
    app = flask.Flask(__name__)

    # get all datasets
    @app.route('/datasets', methods=['GET'])
    def get_datasets():
        res = ResponseType(True, ds.get_all_datasets())
        return jsonify(res), 200

    # dataset
    @app.route('/dataset/<string:symbol>', methods=['GET', 'DELETE'])
    @app.route('/dataset', methods=['POST', 'PUT'])
    def dataset(symbol=None):
        try:
            if request.method == 'GET':
                dateRange = request.args.get('range')
                df = ds.load_dataset(symbol, dateRange)
                res = ResponseType(True, df)
                status = 200
            elif request.method == 'POST' or request.method == 'PUT':
                symbol = request.json['symbol']
                fstat = ds.save_dataset(symbol)
                tr.save_trends(symbol)
                compare_and_merge(
                    os.path.join(config.get_ds_path(), f'{symbol}.csv'),
                    os.path.join(config.get_trend_path(), f'{symbol}.csv')
                )
                res = ResponseType(True, fstat)
                status = 201
            elif request.method == 'DELETE':
                ds.delete_dataset(symbol)
                res = ResponseType(True, '')
                status = 200
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
    @app.route('/prediction/<string:uuid>', methods=['GET', 'DELETE'])
    @app.route('/prediction', methods=['POST'])
    def prediction(uuid=None):
        try:
            if request.method == 'GET':
                dateRange = request.args.get('range')
                res = ResponseType(True, mc.load_prediction(uuid, dateRange))
                status = 200
            elif request.method == 'POST':
                symbol = request.json['symbol']
                res = ResponseType(True, mc.fit_predict(symbol))
                status = 200
            elif request.method == 'DELETE':
                mc.delete_model(uuid)
                mc.delete_prediction(uuid)
                res = ResponseType(True, None)
                status = 200
        except Exception as e:
            res = ResponseType(False, None, str(e))
            status = 400

        return jsonify(res), status

    # settings
    @app.route('/settings', methods=['GET', 'POST'])
    def settings():
        try:
            if request.method == 'GET':
                res = ResponseType(True, config.get_values())
                status = 200
            elif request.method == 'POST':
                settings = request.json['settings']
                config.set_values(settings)
                config.write_values()
                res = ResponseType(True, None)
                status = 200
        except Exception as e:
            res = ResponseType(False, None, str(e))
            status = 400

        return jsonify(res), status

    app.run(port=config.get_port())

if __name__ == '__main__':
    main()