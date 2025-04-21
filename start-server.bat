@echo off
echo Instalando dependencias do backend...
cd server
npm install

echo.
echo Iniciando servidor backend em modo desenvolvimento...
npm run dev