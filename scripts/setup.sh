#!/bin/bash

echo "🚀 Configurando API de Dashboard de Hábitos y Salud..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js no está instalado. Por favor instálalo primero."
    exit 1
fi

if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL no está instalado. Por favor instálalo primero."
    exit 1
fi

echo "📦 Instalando dependencias..."
npm install

if [ ! -f .env ]; then
    echo "📝 Creando archivo .env..."
    cp env.example .env
    echo "⚠️  Por favor edita el archivo .env con tus configuraciones"
    echo "   Especialmente: DB_PASSWORD y JWT_SECRET"
fi

mkdir -p logs

echo "✅ Configuración completada!"
echo ""
echo "📋 Próximos pasos:"
echo "1. Edita el archivo .env con tus configuraciones"
echo "2. Crea la base de datos: mysql -u root -p < database/init.sql"
echo "3. Ejecuta: npm run dev"
echo ""
echo "🌐 La API estará disponible en: http://localhost:3000"
