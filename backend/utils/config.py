from configparser import ConfigParser

PORT = ('default', 'port')
DS_PATH = ('default','dataset_path')
MODEL_PATH = ('default', 'model_path')
PREDICTION_PATH = ('default', 'prediction_path')
API_KEY = ('alpha_vantage', 'api_key')
HISTORY_POINTS = ('ui', 'history_points')


class Singleton(type):
    _instances = {}
    def __call__(self, *args, **kwargs):
        if self not in self._instances:
            self._instances[self] = super(Singleton, self).__call__(*args, **kwargs)
        return self._instances[self]


class Config(metaclass=Singleton):
    def __init__(self):
        config = ConfigParser()
        config.read('config.ini')
        self.__config = config

    def get_port(self):
        return self.__config.getint(*PORT)

    def get_ds_path(self):
        return self.__config.get(*DS_PATH)

    def get_api_key(self):
        return self.__config.get(*API_KEY)

    def get_model_path(self):
        return self.__config.get(*MODEL_PATH)

    def get_prediction_path(self):
        return self.__config.get(*PREDICTION_PATH)

    def get_history_points(self):
        return self.__config.getint(*HISTORY_POINTS)

    def get_values(self):
        res = {}
        for section in self.__config.sections():
            sec = {}
            for option in self.__config.options(section):
                sec[option] = self.__config.get(section, option)
            res[section] = sec
        return res

    def set_value(self, section, key, value):
        self.__config.set(section, key, value)

    def set_values(self, sections):
        for section, options in sections.items():
            for option, value in options.items():
                self.set_value(section, option, value)

    def write_values(self):
        with open('config.ini', 'w') as cf:
            self.__config.write(cf)