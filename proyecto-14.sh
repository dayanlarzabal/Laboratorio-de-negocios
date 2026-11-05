#!/usr/bin/env bash
# Compila la app local incluida en este repositorio como APK Android.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

command -v node >/dev/null || { echo 'ERROR: Node.js no está instalado.'; exit 1; }
command -v npm >/dev/null || { echo 'ERROR: npm no está instalado.'; exit 1; }

printf '\n==> Instalando dependencias del proyecto\n'
npm install --no-audit --no-fund

printf '\n==> Compilando interfaz local\n'
npm run build:android

test -f dist-android/index.html || { echo 'ERROR: no se generó dist-android/index.html'; exit 1; }

printf '\n==> Preparando proyecto Android\n'
if [[ ! -d android ]]; then
  npx cap add android
fi
npx cap sync android

printf '\n==> Compilando APK de prueba\n'
(
  cd android
  chmod +x gradlew
  ./gradlew --no-daemon assembleDebug
)

APK="$ROOT/android/app/build/outputs/apk/debug/app-debug.apk"
test -f "$APK" || { echo 'ERROR: Gradle terminó sin generar la APK esperada.'; exit 1; }
mkdir -p "$ROOT/artifacts"
cp "$APK" "$ROOT/artifacts/Laboratorio-de-negocios-debug.apk"
printf '\nAPK creada: artifacts/Laboratorio-de-negocios-debug.apk\n'
