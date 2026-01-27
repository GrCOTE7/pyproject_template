"""
Vérifie si les ports des services sont déjà utilisés
Utilisé par start.bat pour éviter de lancer plusieurs instances
"""

import socket
import sys


class Colors:
    """Couleurs pour terminal Windows"""

    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    RESET = "\033[0m"
    BOLD = "\033[1m"


def is_port_in_use(port: int) -> bool:
    """
    Vérifie si un port est déjà utilisé

    Args:
        port: Numéro de port à vérifier

    Returns:
        True si le port est utilisé, False sinon
    """
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        try:
            s.bind(("127.0.0.1", port))
            return False
        except OSError:
            return True


def check_all_ports(verbose: bool = True) -> dict:
    """
    Vérifie tous les ports des services

    Returns:
        Dict avec le statut de chaque port {port: is_used}
    """
    ports = {8000: "FastAPI", 8001: "Django", 5173: "React (Vite)"}

    results = {}
    any_in_use = False

    if verbose:
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}🔍 Vérification des ports{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")

    for port, service in ports.items():
        in_use = is_port_in_use(port)
        results[port] = in_use

        if verbose:
            if in_use:
                print(
                    f"{Colors.RED}❌ Port {port}{Colors.RESET} ({service}) : {Colors.RED}UTILISÉ{Colors.RESET}"
                )
                any_in_use = True
            else:
                print(
                    f"{Colors.GREEN}✅ Port {port}{Colors.RESET} ({service}) : {Colors.GREEN}DISPONIBLE{Colors.RESET}"
                )

    if verbose:
        print(f"\n{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}")
        if any_in_use:
            print(
                f"{Colors.YELLOW}⚠️  ATTENTION : Des services semblent déjà en cours d'exécution{Colors.RESET}"
            )
        else:
            print(f"{Colors.GREEN}✅ Tous les ports sont disponibles{Colors.RESET}")
        print(f"{Colors.BOLD}{Colors.BLUE}{'='*60}{Colors.RESET}\n")

    return results


def main():
    """Point d'entrée du script"""
    results = check_all_ports(verbose=True)

    # Code de sortie : 0 si tous disponibles, 1 si au moins un utilisé
    any_in_use = any(results.values())
    sys.exit(1 if any_in_use else 0)


if __name__ == "__main__":
    main()
