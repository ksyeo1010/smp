import pandas as pd
import os
import pathlib
from datetime import timedelta
from pytrends.request import TrendReq
from pandas.tseries.offsets import BDay

from utils import Config, generate_timeframes, get_date

class Trends:
    def __init__(self):
        self.__config = Config()
        pathlib.Path(self.__config.get_trend_path()).mkdir(parents=True, exist_ok=True)
        self.__pytrend = TrendReq(hl='en-US', tz='300')
        self.__num_values = 3


    def filter_topic(self, row):
        return row['topic_type'] == 'Topic' and row['topic_title'] != 'Stock' and row['topic_title'] != 'Share price'


    def save_trends(self, symbol):
        time_frames = generate_timeframes(self.__config.get_min_date())

        pytrend = self.__pytrend
        pytrend.build_payload([symbol])
        query_topics = pytrend.related_topics()

        related = query_topics.get(symbol).get('top')

        kw_actual = []
        kw_list = []
        for index, row in related.iterrows():
            if self.filter_topic(row):
                kw_actual.append(row['topic_title'])
                kw_list.append(row['topic_mid'])
            if len(kw_list) == self.__num_values:
                break

        trends = []
        for i in range(len(time_frames)-1):
            start = time_frames[i]
            end = time_frames[i+1]
            pytrend.build_payload(kw_list, cat=0, timeframe=f'{start} {end}')
            trends.append(pytrend.interest_over_time())

        trends = pd.concat(trends)

        start = get_date(trends.tail(1).index, offset=1)
        pytrend.build_payload(kw_list, cat=0, timeframe='now 7-d')
        daily = pytrend.interest_over_time()
        daily = daily.groupby(pd.Grouper(freq='D')).mean().round(0).astype(int)

        trends = pd.concat([trends, daily])
        trends = trends[~trends.index.duplicated(keep='first')]
        trends = trends.drop(columns=['isPartial'])
        trends = trends.replace(0, 1)
        trends.columns = kw_actual

        pytrend.build_payload(kw_list, cat=0, timeframe='all')
        monthly = pytrend.interest_over_time()
        monthly = monthly.drop(columns=['isPartial'])
        monthly.columns = kw_actual

        for i in range(len(monthly.index)-1):
            start, end = monthly.index[i], monthly.index[i+1]
            end = end - timedelta(seconds=1)
            trends[start:end] = trends[start:end].mul(monthly[start:end].values[0])

        trends = trends.dropna()

        fpath = os.path.join(self.__config.get_trend_path(), f'{symbol}.csv')
        trends.to_csv(fpath)



