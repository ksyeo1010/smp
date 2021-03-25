import pandas as pd
from datetime import datetime, timedelta

DATE_FORMAT = "%Y-%m-%d"

def get_date_offset_year(years):
    dt = datetime.today()
    try:
        dt = dt.replace(year=dt.year-years)
    except ValueError:
        dt = dt.replace(year=dt.year-years, day=dt.day-1)
    return dt.strftime(DATE_FORMAT)

def get_date(date=None, offset=0):
    if date is None:
        return (datetime.today() + timedelta(days=offset)).strftime(DATE_FORMAT)
    return (date + timedelta(days=offset)).strftime(DATE_FORMAT)

def generate_timeframes(start_date, freq='8M'):
    end_date = datetime.now().strftime(DATE_FORMAT)
    date_range = pd.date_range(start=start_date, end=end_date, freq=freq)
    date_range = date_range.strftime(DATE_FORMAT).to_list()
    date_range.append(end_date)
    return date_range


def compare_and_merge(spath, tpath):
    stock = pd.read_csv(spath)
    trend = pd.read_csv(tpath)

    stock = stock[stock['date'].isin(trend['date'])]
    trend = trend[trend['date'].isin(stock['date'])]

    stock.set_index('date', inplace=True)
    trend.set_index('date', inplace=True)

    stock.to_csv(spath)
    trend.to_csv(tpath)