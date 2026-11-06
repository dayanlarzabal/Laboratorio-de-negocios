#!/usr/bin/env bash
# =============================================================================
#  Laboratorio de negocios — Camino a la Libertad
#  proyecto.sh  ·  arranque, verificación y empaquetado local
# =============================================================================
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

PORT="${PORT:-8080}"
HOST="${HOST:-127.0.0.1}"

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

serve_python() {
  info "Servidor local en http://${HOST}:${PORT}"
  info "Abre esa URL en el navegador (o instálala como app desde el menú del navegador)"
  echo ""
  if command -v python3 >/dev/null 2>&1; then
    exec python3 -m http.server "$PORT" --bind "$HOST"
  elif command -v python >/dev/null 2>&1; then
    exec python -m http.server "$PORT" --bind "$HOST"
  else
    fail "No hay Python disponible para servir archivos estáticos"
  fi
}

serve_npx() {
  if command -v npx >/dev/null 2>&1; then
    info "Sirviendo con npx serve en http://${HOST}:${PORT}"
    exec npx --yes serve -l "tcp://${HOST}:${PORT}" .
  fi
  serve_python
}

open_browser() {
  local url="http://${HOST}:${PORT}/"
  if command -v xdg-open >/dev/null 2>&1; then
    xdg-open "$url" >/dev/null 2>&1 || true
  elif command -v open >/dev/null 2>&1; then
    open "$url" >/dev/null 2>&1 || true
  fi
}

cmd_start() {
  banner
  check_files
  open_browser
  serve_npx
}

cmd_check() {
  banner
  check_files
  if command -v node >/dev/null 2>&1; then
    ok "Node $(node -v)"
  else
    warn "Node no instalado (opcional)"
  fi
  if command -v python3 >/dev/null 2>&1; then
    ok "Python $(python3 --version 2>&1 | awk '{print $2}')"
  fi
  ok "Listo para: ./proyecto.sh start"
}

cmd_zip() {
  banner
  check_files
  local out="laboratorio-negocios.zip"
  rm -f "$out"
  zip -q -r "$out" index.html app.js styles.css proyecto.sh manifest.webmanifest icons 2>/dev/null \
    || zip -q -r "$out" index.html app.js styles.css proyecto.sh
  ok "Paquete creado: $out"
  info "Comparte el ZIP o súbelo a cualquier hosting estático"
}

cmd_help() {
  banner
  cat <<EOF
Uso: ./proyecto.sh <comando>

Comandos:
  start     Arranca el servidor local (puerto ${PORT})
  check     Verifica que el proyecto esté completo
  zip       Empaqueta la app en laboratorio-negocios.zip
  help      Muestra esta ayuda

Variables:
  PORT=8080   Puerto del servidor
  HOST=127.0.0.1

Ejemplos:
  ./proyecto.sh start
  PORT=3000 ./proyecto.sh start
  ./proyecto.sh zip
EOF
}

main() {
  local cmd="${1:-start}"
  case "$cmd" in
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
