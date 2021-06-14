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
