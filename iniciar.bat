@echo off
title DimensionaTI SC - Sistema Inteligente de Dimensionamento e Auditoria
echo =======================================================================
echo               DIMENSIONATI SC - GOV-SC / TCE-SC
echo   Sistema Inteligente de Dimensionamento e Auditoria Preventiva
echo                  (Conforme Lei Federal 14.133/2021)
echo =======================================================================
echo.
echo Iniciando servidor local na porta 3000...
echo.

start "" "http://localhost:3000"
node server.js

pause
