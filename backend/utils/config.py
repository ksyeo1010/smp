from configparser import ConfigParser

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

        # read config values
        self.__port = config.getint('default', 'port')
        self.__ds_path = config.get('default','dataset_path')
        self.__api_key = config.get('alpha_vantage', 'api_key')

        self.__config = config

    def get_port(self):
        return self.__port

    def get_ds_path(self):
        return self.__ds_path

    def get_api_key(self):
        return self.__api_key