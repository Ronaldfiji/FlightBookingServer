@ECHO OFF
ECHO Bula Fiji, running node erver.....................
Title My dotnet app
ECHO ============================
::systeminfo | findstr /c:"Total Physical Memory"
::wmic cpu get name

cd C://Users//Ron//Desktop//Flight-IBE-App//Staging//AmadeusApiSrv

npm run server
