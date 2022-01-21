MariaDB
------
C:\Program Files\MariaDB 10.6\bin

Populer la base:
--------------
    doc: e:https://www.mysqltutorial.org/mysql-update-data.aspx

    La table des formId:

        mysql -u root -p       ==> mot de passe: root
        show databases;
        source E:\nodeproject\marc_affiliation\uuidFormTable.sql
        use uuidformDB
        show tables;
        SHOW COLUMNS FROM uuidformtable;
        SHOW INDEX FROM uuidformtable FROM uuidformDB;

    La table historique:
        Idem avec
        source E:\nodeproject\marc_affiliation\uuidFormHistoryTable.sql

tools HeidiSQL

Livraison dans github
---------------------
cd E:\nodeproject\marc_affiliation>
git init
git commit -m "message"
git push -u origin main

Resoudre le pb de clé SSH
------------------------
https://docs.github.com/en/github/authenticating-to-github/testing-your-ssh-connection

Affilae:
--------

Recuperation du code sur rasberry
--------------------------------
git clone https://github.com/jplap/marc_affiliation
git pull

lancer le server node ( independant de la fenetre)
 attention derrier un proxy qui reroute vers http
 lancer
    nohup node -r esm server.js &

 sinon
    nohup node -r esm serverhttps.js &

test requete
-----------
    curl  POST http://192.168.0.37:8686/service/backend/form/synchronize?api_key=undefined

install MySQL MariaDB
---------------------
    https://raspberrytips.com/install-mariadb-raspberry-pi/

    Si le server node a des pb de connexion à la base :
        https://www.codegrepper.com/code-examples/sql/mariadb+ER_NOT_SUPPORTED_AUTH_MODE%3A+Client+does+not+support+authentication+protocol+requested+by+server%3B+consider+upgrading+MariaDB+client
    Si le client HeidiSQL Windows n'arrive pas a se connecter sur la base MariaDB de Linux
        https://www.tecmint.com/fix-error-1130-hy000-host-not-allowed-to-connect-mysql/
        Pour connaitre les hosts autorisés à ce connecter:
            sudo mysql -u root -p
            SELECT host FROM mysql.user WHERE user = "root";
                    +--------------+
                    | host         |
                    +--------------+
                    | 127.0.0.1    |
                    | 192.168.0.25 |
                    | localhost    |
                    +--------------+
        connaitre les noms de databasename
            MariaDB [(none)]> SHOW DATABASES;
            +--------------------+
            | Database           |
            +--------------------+
            | information_schema |
            | mysql              |
            | performance_schema |
            | uuidformDB         |
            +--------------------+

        Pour ajouter une autorisation de machine
            GRANT ALL ON uuidformDB to 'root'@'192.168.0.32' IDENTIFIED BY 'root';
            FLUSH PRIVILEGES;
            SELECT host FROM mysql.user WHERE user = "root";
                +--------------+
                | host         |
                +--------------+
                | 127.0.0.1    |
                | 192.168.0.25 |
                | 192.168.0.32 |
                | localhost    |
                +--------------+



relancer mql
-----------
    sudo service mysql restart

tester si Mariadb est demarré
-----------------------------
    sudo netstat -pant | grep 3306

Creer un service
----------------


Creer et Declarer le server comme un service
----------------------------------
    Creer service marc_affiliation.service le copier dans /etc/systemd/system

    https://simonprickett.medium.com/writing-a-systemd-service-in-node-js-on-raspberry-pi-be88d9bc2e8d
    sudo systemctl start marc_affiliation.service


Creer une image docker du backend
---------------------------------
    attention dans un premier temps ei la connection à la bas mariadb se fait debuips le container vers la base qui est sur le Pi
    build:
        docker build -t marc_affiliation_backend:dev .
    run:
        docker run -it --rm  -v ${PWD}:/app -v /app/node_modules -e CHOKIDAR_USEPOLLING=true -p 8686:8686 marc_affiliation_backend:dev

Appels AFFILAEA
--------------
La cle API Wordpress est representé e dans lefichier config.env sour la variable d'env:
    AFFILAE_USER='5f85bcee6c7218455e78823c'
son pwd est...
    AFFILAE_PWD='b67878ddecd4066b75f9f035ed80429d'

Bug 21/01/2022
===============
    Symptome:
     rien dans le nagigateur alors que le fetch retourne des data
    Cause:
        Le parsing json du retour des fonnes de Fetch foire
    Raison
      La bas e de données contient un json de la colonne affilae_data qui est composé d'un truc du style
           "refuse_reason":".\n"
       Le \n fou la merde et n'est pas parsable dans l'appli React
    By pass:
      Modification des donnees à la main dans la base
      Je ne sais pas qui value cette merde \n sur l'attribut refuse_reason

