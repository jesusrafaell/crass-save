#!/bin/sh

# Esperar hasta que Redis esté listo
until nc -z redis-db 6379; do
  echo "Esperando que Redis esté disponible..."
  sleep 5
done

# Ejecutar la aplicación después de que Redis esté disponible
echo "Redis está disponible, iniciando la aplicación..."
exec "$@"

