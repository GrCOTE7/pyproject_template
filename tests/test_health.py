"""
Tests de santé (Health Checks) des 3 serveurs
Vérifie que FastAPI, Django et React répondent correctement
"""

import requests
import sys
import time
from typing import Dict, Tuple


class Colors:
    """Couleurs pour terminal Windows"""

    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    RESET = "\033[0m"
    BOLD = "\033[1m"


def check_service(name: str, url: str, timeout: int = 5) -> Tuple[bool, str]:
    """
    Vérifie qu'un service répond correctement

    Args:
        name: Nom du service
        url: URL à tester
        timeout: Timeout en secondes

    Returns:
        Tuple (success: bool, message: str)
    """
    try:
        start_time = time.time()
        response = requests.get(url, timeout=timeout, allow_redirects=True)
        elapsed = (time.time() - start_time) * 1000  # ms

        if response.status_code == 200:
            return (
                True,
                f"{Colors.GREEN}✅{Colors.RESET} {name}: OK ({response.status_code}) - {elapsed:.0f}ms",
            )
        else:
            return (
                False,
                f"{Colors.RED}❌{Colors.RESET} {name}: FAILED (HTTP {response.status_code})",
            )

    except requests.exceptions.ConnectionError:
        return (
            False,
            f"{Colors.RED}❌{Colors.RESET} {name}: CONNECTION REFUSED (service not running?)",
        )
    except requests.exceptions.Timeout:
        return False, f"{Colors.RED}❌{Colors.RESET} {name}: TIMEOUT (>{timeout}s)"
    except Exception as e:
        return False, f"{Colors.RED}❌{Colors.RESET} {name}: ERROR - {str(e)}"


def run_health_checks(verbose: bool = True) -> bool:
    """
    Exécute tous les health checks

    Returns:
        True si tous les services sont OK, False sinon
    """
    services = {
        "FastAPI": "http://localhost:8000/api/health",
        "Django": "http://localhost:8001/admin/login/",  # Page admin accessible sans auth
        "React": "http://localhost:5173",
    }

    if verbose:
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
        print(
            f"{Colors.BOLD}{Colors.BLUE}🏥 Health Checks - Pyproject Template{Colors.RESET}"
        )
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")

    results = {}
    all_ok = True

    for service_name, url in services.items():
        success, message = check_service(service_name, url)
        results[service_name] = success

        if verbose:
            print(message)

        if not success:
            all_ok = False

    if verbose:
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
        if all_ok:
            print(
                f"{Colors.GREEN}{Colors.BOLD}✅ ALL SERVICES OPERATIONAL ✅{Colors.RESET}"
            )
        else:
            print(
                f"{Colors.RED}{Colors.BOLD}❌ SOME SERVICES ARE DOWN ❌{Colors.RESET}"
            )
            print(
                f"\n{Colors.YELLOW}💡 Tip: Run './start.bat' to start all services{Colors.RESET}"
            )
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")

    return all_ok


def main():
    """Point d'entrée du script"""
    success = run_health_checks(verbose=True)
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
