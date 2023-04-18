import psycopg2

def connect():
    try:
        connection = psycopg2.connect(
           host="localhost",
           database="postgres",
           user="postgres",
           password="admin"
        )
        return connection
    except Exception as err:
        print("Error occurred in making connection …")
        

def print_version(connection):
    cursor = connect().cursor()
    cursor.execute('SELECT version()')
    db_version = cursor.fetchone()
    print(db_version)
    cursor.close()
    connection.close()

def create(connection):
    cursor = connection.cursor()
    query = """
    create table person(
        id int primary key,
        first_name varchar(100),
        last_name varchar(100),
        city varchar(100)
    );
    """
    try:
        cursor.execute(query)
        connection.commit()
        print("table created successfully!")
    except Exception as err:
        print(err)
    cursor.close()
    connection.close()

def insert(connection):
    cursor = connection.cursor()
    query = """
    INSERT INTO person (id, first_name, last_name, city) VALUES (%s, %s, %s, %s);
    """
    try:
        data = (1, 'James', 'Bond', 'NY')
        cursor.execute(query, data)
        connection.commit()
        print("Record inserted successfully!")
    except Exception as err:
        print(err)
    cursor.close()
    connection.close()

def read(connection):
    cursor = connection.cursor()
    try:
        cursor.execute("SELECT * FROM person LIMIT 500;")
        record = cursor.fetchone()
        print(f"Read successful, 1st row is : id = {record[0]}, name= {record[1]+' '+record[2]}, city= {record[3]}")
        connection.commit()
    except Exception as err:
        print(err)
    cursor.close()
    connection.close()

def update(connection):
    cursor = connection.cursor()
    query = """
    UPDATE person SET city=’%s’ WHERE id=%s;
    """
    try:
        cursor.execute(query, ("Sydney", 1))
        cursor.execute("SELECT * FROM person WHERE id=1;")
        record = cursor.fetchone()
        print(f"Update successful : id = {record[0]}, name= {record[1]+' '+record[2]}, city= {record[3]}")
        connection.commit()
    except Exception as err:
        print(err)
    cursor.close()
    connection.close()

def delete(connection):
    cursor = connection.cursor()
    query = """
    DELETE FROM person WHERE id=1;
    """
    try:
        cursor.execute(query)
        cursor.execute("select * from person;")
        record = cursor.fetchone()
        print(record)
        connection.commit()
    except Exception as err:
        print(err)
    cursor.close()
    connection.close()

if __name__ == ‘__main__’:
  delete(connect())