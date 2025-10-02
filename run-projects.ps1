# Cambia a la ruta del proyecto 'gateway' y ejecuta el comando de Go
Start-Process powershell -ArgumentList "cd $(Resolve-Path gateway); go run cmd/main.go" -NoNewWindow

# Cambia a la ruta del proyecto 'user' y ejecuta el comando de Go
Start-Process powershell -ArgumentList "cd $(Resolve-Path user); go run cmd/api/main.go" -NoNewWindow

# Cambia a la ruta del proyecto 'assistance' y ejecuta el comando de Go
Start-Process powershell -ArgumentList "cd $(Resolve-Path assistance); go run cmd/api/main.go" -NoNewWindow

