import pymysql


class UseDateBase:
    def __init__(self, config: dict):
        self.config = config

    def __enter__(self):
        try:
            self.con = pymysql.connect(**self.config)
            self.cursor = self.con.cursor()
            return self.cursor

        except pymysql.err.OperationalError as err:
            if err.args[0] == 2003:
                print("Неверный формат записи host\n")
            if err.args[0] == 1045:
                print("Неверный логин или пароль\n")
            if err.args[0] == 1049:
                print("Не найдена база данных\n")
            print(err.args[1])
            return err

        except TypeError as err:
            print("Конфиг не верен\n")
            return err

    def __exit__(self, exc_type, exc_val, exc_tb):

        if exc_val is None:
            self.con.commit()
            self.con.close()
            self.cursor.close()
        else:
            if exc_val.args[0] == 1146:
                print("Таблица не найдена")
            elif exc_val.args[0] == 1064:
                print("Неверный синтаксис запроса")
            elif exc_val.args[0] == 1054:
                print("Поле не найдено")

            elif exc_val.args[0] == "Cursor is none":
                print("Курсор не найден")


def make_query(config: dict, sql: str, params: list, description=False):
    with UseDateBase(config) as cursor:
        if cursor is None:
            raise ValueError('Cursor is none')
        else:
            cursor.execute(sql, params)
            result = []
            if description:
                result = [tuple([i[0] for i in cursor.description])]

            for row in cursor.fetchall():
                result.append(row)
            return result
