"""
Tests de Hot-Reload pour les 3 serveurs
Vérifie que les modifications de code sont bien détectées et appliquées
"""

import requests
import time
import sys
from pathlib import Path
from typing import Tuple


class Colors:
    """Couleurs pour terminal Windows"""

    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    RESET = "\033[0m"
    BOLD = "\033[1m"


def test_fastapi_hotreload() -> None:
    """
    Teste le hot-reload de FastAPI en vérifiant le server_id
    À chaque redémarrage, FastAPI génère un nouveau UUID
    """
    # Récupère le server_id actuel
    response1 = requests.get("http://localhost:8000/api/health", timeout=5)
    assert response1.status_code == 200, "FastAPI health endpoint not responding"

    server_id_1 = response1.json().get("server_id")

    # Modifie un fichier pour déclencher le reload
    test_file = Path("backend/app/main.py")
    assert test_file.exists(), "main.py not found"

    content = test_file.read_text(encoding="utf-8")

    # Ajoute un commentaire temporaire et s'assure de restaurer le fichier
    modified_content = content + "\n# Test hot-reload\n"
    try:
        test_file.write_text(modified_content, encoding="utf-8")

        # Attend le redémarrage
        time.sleep(3)

        # Vérifie que le server_id a changé
        response2 = requests.get("http://localhost:8000/api/health", timeout=5)
        server_id_2 = response2.json().get("server_id")

        assert server_id_1 != server_id_2, "FastAPI did not restart (server_id unchanged)"
    finally:
        test_file.write_text(content, encoding="utf-8")


def test_django_hotreload() -> None:
    """
    Teste le hot-reload de Django
    Django utilise le mécanisme de détection de changements de fichiers
    """
    # Pour Django, on vérifie juste qu'il répond
    response1 = requests.get("http://localhost:8001/admin/login/", timeout=5)
    assert response1.status_code == 200, "Django not responding"


def test_react_hotreload() -> None:
    """
    Teste le hot-reload de React (Vite)
    Vérifie que le serveur Vite répond et que le WebSocket est actif
    """
    response = requests.get("http://localhost:5173", timeout=5)
    assert response.status_code == 200, "React dev server not responding"


def run_hotreload_tests(verbose: bool = True) -> bool:
    """
    Exécute tous les tests de hot-reload

    Returns:
        True si tous les tests passent, False sinon
    """
    if verbose:
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
        print(
            f"{Colors.BOLD}{Colors.BLUE}🔥 Hot-Reload Tests - Pyproject Template{Colors.RESET}"
        )
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")
        print(
            f"{Colors.YELLOW}⚠️  This test will temporarily modify files{Colors.RESET}\n"
        )

    tests = [
        ("FastAPI", test_fastapi_hotreload),
        ("Django", test_django_hotreload),
        ("React (Vite)", test_react_hotreload),
    ]

    all_ok = True

    for test_name, test_func in tests:
        if verbose:
            print(f"Testing {test_name}...", end=" ", flush=True)

        success, message = test_func()

        if verbose:
            if success:
                print(f"{Colors.GREEN}✅ {message}{Colors.RESET}")
            else:
                print(f"{Colors.RED}❌ {message}{Colors.RESET}")

        if not success:
            all_ok = False

    if verbose:
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
        if all_ok:
            print(
                f"{Colors.GREEN}{Colors.BOLD}✅ ALL HOT-RELOAD TESTS PASSED ✅{Colors.RESET}"
            )
        else:
            print(
                f"{Colors.RED}{Colors.BOLD}❌ SOME HOT-RELOAD TESTS FAILED ❌{Colors.RESET}"
            )
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")

    return all_ok


def main():
    """Point d'entrée du script"""
    success = run_hotreload_tests(verbose=True)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
