from alpha_vantage.timeseries import TimeSeries
from dotenv import load_dotenv
import os

def save_dataset(symbol):
    load_dotenv()

    api_key = os.getenv('AV_API_KEY')

    ts = TimeSeries(key=api_key, output_format='pandas')
    data, meta_data = ts.get_daily(symbol, outputsize='full')

    file_name = os.path.join('data',f'{symbol}_daily.csv')

    data.to_csv(file_name)