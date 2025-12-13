#!/bin/bash
# Script para configurar Railway
# Este script se ejecuta automáticamente en Railway durante el deploy

set -e

echo "🚀 Iniciando configuración de Railway..."

# Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# Instalar dependencias del backend
echo "📦 Instalando dependencias del backend..."
cd .vscode && npm install && cd ..

# Inicializar base de datos (opcional - descomenta si quieres)
# echo "🗄️ Inicializando base de datos..."
# node init-db.js

echo "✅ Configuración completada!"
