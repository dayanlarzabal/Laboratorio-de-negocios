#!/usr/bin/env bash
# =============================================================================
#  Laboratorio de negocios — Camino a la Libertad
#  proyecto.sh
#  - Sin argumentos (CI): genera APK Android con Cordova → artifacts/
#  - start / check / zip: uso local
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

PORT="${PORT:-8080}"
HOST="${HOST:-127.0.0.1}"
APP_ID="${APP_ID:-com.caminoalalibertad.laboratorionegocios}"
APP_NAME="${APP_NAME:-Laboratorio de negocios}"

RED='\033[0;31m'
GREEN='\033[0;32m'
GOLD='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info()  { echo -e "${CYAN}→${NC} $*"; }
ok()    { echo -e "${GREEN}✓${NC} $*"; }
warn()  { echo -e "${GOLD}!${NC} $*"; }
fail()  { echo -e "${RED}✗${NC} $*" >&2; exit 1; }

banner() {
  echo ""
  echo -e "${GOLD}╔══════════════════════════════════════════════════╗${NC}"
  echo -e "${GOLD}║${NC}   Laboratorio de negocios · Camino a la Libertad ${GOLD}║${NC}"
  echo -e "${GOLD}║${NC}   Simulador multiproducto  ·  CUP / USD          ${GOLD}║${NC}"
  echo -e "${GOLD}╚══════════════════════════════════════════════════╝${NC}"
  echo ""
}

check_files() {
  local required=(index.html app.js styles.css)
  for f in "${required[@]}"; do
    [[ -f "$ROOT/$f" ]] || fail "Falta el archivo: $f"
  done
  ok "Archivos del proyecto presentes"
}

# ─── Build APK (modo CI / por defecto) ───────────────────────────────────────
cmd_apk() {
  banner
  check_files

  info "Preparando build Android (Cordova)…"
  command -v node >/dev/null 2>&1 || fail "Node.js es obligatorio"
  command -v java >/dev/null 2>&1 || fail "Java es obligatorio"

  # Android SDK (GitHub Actions suele traerlo vía setup-android o ANDROID_HOME)
  if [[ -z "${ANDROID_HOME:-}${ANDROID_SDK_ROOT:-}" ]]; then
    if [[ -d "$HOME/Android/Sdk" ]]; then
      export ANDROID_HOME="$HOME/Android/Sdk"
    elif [[ -d /usr/local/lib/android/sdk ]]; then
      export ANDROID_HOME=/usr/local/lib/android/sdk
    fi
  fi
  export ANDROID_SDK_ROOT="${ANDROID_SDK_ROOT:-${ANDROID_HOME:-}}"
  if [[ -z "${ANDROID_SDK_ROOT}" ]]; then
    fail "No hay Android SDK. En CI usa android-actions/setup-android."
  fi
  ok "ANDROID_SDK_ROOT=$ANDROID_SDK_ROOT"

  local work="$ROOT/.cordova-build"
  rm -rf "$work"
  mkdir -p "$work"
  cd "$work"

  info "Instalando Cordova…"
  npm install -g cordova@12 >/dev/null

  info "Creando proyecto Cordova…"
  cordova create app "$APP_ID" "$APP_NAME"
  cd app

  # Contenido web
  rm -rf www/*
  cp "$ROOT/index.html" "$ROOT/app.js" "$ROOT/styles.css" www/
  if [[ -f "$ROOT/manifest.webmanifest" ]]; then
    cp "$ROOT/manifest.webmanifest" www/
  fi
  for f in icon.png icon-192.png icon-512.png icon-1024.png; do
    [[ -f "$ROOT/$f" ]] && cp "$ROOT/$f" www/
  done
  if [[ ! -f www/icon.png ]]; then
    fail "Falta icon.png en la raíz del proyecto"
  fi
  mkdir -p res/icon/android
  cp www/icon.png res/icon/icon.png
  # Densidades Android (el sistema escala el PNG maestro)
  for dens in ldpi mdpi hdpi xhdpi xxhdpi xxxhdpi; do
    cp www/icon.png "res/icon/android/${dens}.png"
  done
  ok "Ícono NEGOCIOS aplicado"

  # config.xml: app + iconos
  cat > config.xml <<EOF
<?xml version='1.0' encoding='utf-8'?>
<widget id="${APP_ID}" version="1.0.2" xmlns="http://www.w3.org/ns/widgets"
  xmlns:cdv="http://cordova.apache.org/ns/1.0">
  <name>${APP_NAME}</name>
  <description>Simula productos, gastos y ganancias en CUP y USD.</description>
  <author email="soporte@caminoalalibertad.app" href="https://github.com/dayanlarzabal/Laboratorio-de-negocios">Camino a la Libertad</author>
  <content src="index.html" />
  <access origin="*" />
  <allow-intent href="http://*/*" />
  <allow-intent href="https://*/*" />
  <preference name="Orientation" value="portrait" />
  <preference name="AndroidInsecureFileModeEnabled" value="true" />
  <preference name="SplashMaintainAspectRatio" value="true" />
  <preference name="AutoHideSplashScreen" value="true" />
  <preference name="StatusBarOverlaysWebView" value="false" />
  <preference name="android-minSdkVersion" value="24" />
  <preference name="android-targetSdkVersion" value="34" />
  <icon src="res/icon/icon.png" />
  <platform name="android">
    <icon density="ldpi" src="res/icon/android/ldpi.png" />
    <icon density="mdpi" src="res/icon/android/mdpi.png" />
    <icon density="hdpi" src="res/icon/android/hdpi.png" />
    <icon density="xhdpi" src="res/icon/android/xhdpi.png" />
    <icon density="xxhdpi" src="res/icon/android/xxhdpi.png" />
    <icon density="xxxhdpi" src="res/icon/android/xxxhdpi.png" />
    <preference name="AndroidWindowSplashScreenAnimatedIcon" value="www/icon.png" />
    <preference name="AndroidWindowSplashScreenBackground" value="#0c1f17" />
  </platform>
</widget>
EOF

  info "Añadiendo plataforma Android…"
  cordova platform add android@13

  info "Compilando APK (debug)…"
  cordova build android --debug

  local apk
  apk="$(find platforms/android -name '*.apk' | head -n1 || true)"
  [[ -n "$apk" && -f "$apk" ]] || fail "No se generó ningún APK"

  mkdir -p "$ROOT/artifacts"
  cp "$apk" "$ROOT/artifacts/laboratorio-negocios.apk"
  ok "APK listo: artifacts/laboratorio-negocios.apk"
  ls -la "$ROOT/artifacts/"
}

serve_python() {
  info "Servidor local en http://${HOST}:${PORT}"
  if command -v python3 >/dev/null 2>&1; then
    exec python3 -m http.server "$PORT" --bind "$HOST"
  elif command -v python >/dev/null 2>&1; then
    exec python -m http.server "$PORT" --bind "$HOST"
  else
    fail "No hay Python disponible"
  fi
}

cmd_start() {
  banner
  check_files
  serve_python
}

cmd_check() {
  banner
  check_files
  command -v node >/dev/null 2>&1 && ok "Node $(node -v)" || warn "Node no instalado"
  command -v java >/dev/null 2>&1 && ok "Java ok" || warn "Java no instalado"
  ok "Listo. CI: bash proyecto.sh   Local: bash proyecto.sh start"
}

cmd_zip() {
  banner
  check_files
  local out="laboratorio-negocios.zip"
  rm -f "$out"
  zip -q -r "$out" index.html app.js styles.css proyecto.sh manifest.webmanifest
  ok "Paquete: $out"
}

cmd_help() {
  banner
  cat <<EOF
Uso: bash proyecto.sh [comando]

Comandos:
  (sin args)  Compila el APK → artifacts/laboratorio-negocios.apk
  apk         Igual que sin argumentos
  start       Servidor web local (puerto ${PORT})
  check       Verifica archivos
  zip         Empaqueta la app web en laboratorio-negocios.zip
  help        Esta ayuda
EOF
}

main() {
  local cmd="${1:-apk}"
  case "$cmd" in
    apk|build)       cmd_apk ;;
    start|run|serve) cmd_start ;;
    check|verify)    cmd_check ;;
    zip|pack)        cmd_zip ;;
    help|-h|--help)  cmd_help ;;
    *)
      warn "Comando desconocido: $cmd"
      cmd_help
      exit 1
      ;;
  esac
}

main "$@"
