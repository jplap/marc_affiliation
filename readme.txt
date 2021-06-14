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
