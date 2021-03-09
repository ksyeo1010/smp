import flask
from flask import request, jsonify
from dataclasses import dataclass

from utils import Config, Dataset

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

    # start server
    app = flask.Flask(__name__)

    # get all datasets
    @app.route('/datasets', methods=['GET'])
    def get_datasets():
        res = ResponseType(True, ds.get_all_datasets())
        return jsonify(res)

    # save dataset
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


    app.run(port=config.get_port())

if __name__ == '__main__':
    main()