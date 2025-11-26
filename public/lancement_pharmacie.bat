@echo off
cd /d D:\pharmacie

:restart
echo Lancement de l'application pharmacie...
npm start

echo L'application s'est arrêtée. Relance dans 5 secondes...
timeout /t 5 >nul
goto restart